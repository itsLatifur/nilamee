const clients = new Map(); // userId -> Set of res objects

export const addClient = (userId, res) => {
  if (!clients.has(userId)) clients.set(userId, new Set());
  clients.get(userId).add(res);
};

export const removeClient = (userId, res) => {
  if (!clients.has(userId)) return;
  const set = clients.get(userId);
  set.delete(res);
  if (set.size === 0) clients.delete(userId);
};

export const sendToUser = (userId, payload) => {
  try {
    const set = clients.get(userId?.toString());
    if (!set) return;
    const data = `data: ${JSON.stringify(payload)}\n\n`;
    for (const res of Array.from(set)) {
      try {
        res.write(data);
      } catch (err) {
        // ignore write errors; the connection cleanup will remove closed streams
        try {
          res.end();
        } catch (e) {}
        removeClient(userId, res);
      }
    }
  } catch (err) {
    console.error("SSE sendToUser error", err);
  }
};

// Optional broadcast
export const sendToUsers = (userIds, payload) => {
  (userIds || []).forEach((id) => sendToUser(id, payload));
};

// Periodic heartbeat to keep connections alive will be handled by consumers if needed

export default {
  addClient,
  removeClient,
  sendToUser,
  sendToUsers,
};
