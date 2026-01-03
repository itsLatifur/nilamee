import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../../../../config/env";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const UserManagement = () => {
  const { user: currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  // Modal states
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState(""); // ban, suspend, delete, permanentDelete
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionReason, setActionReason] = useState("");
  const [suspendDays, setSuspendDays] = useState(7);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(API_ENDPOINTS.ADMIN.USERS, {
        params: {
          search,
          role: roleFilter,
          status: statusFilter,
          page: currentPage,
          limit: 10,
        },
        withCredentials: true,
      });
      setUsers(data.users);
      setTotalPages(data.totalPages);
      setTotalUsers(data.totalUsers);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter, statusFilter, currentPage]);

  const handleAction = (user, action) => {
    setSelectedUser(user);
    setActionType(action);
    setShowActionModal(true);
    setActionReason("");
    setSuspendDays(7);
  };

  const executeAction = async () => {
    if (!actionReason.trim() && actionType !== "restore") {
      toast.error("Please provide a reason");
      return;
    }

    setLoading(true);
    try {
      let endpoint, method, body;

      switch (actionType) {
        case "ban":
          endpoint = API_ENDPOINTS.ADMIN.BAN_USER(selectedUser._id);
          method = "put";
          body = { reason: actionReason };
          break;
        case "suspend":
          endpoint = API_ENDPOINTS.ADMIN.SUSPEND_USER(selectedUser._id);
          method = "put";
          body = { reason: actionReason, days: suspendDays };
          break;
        case "delete":
          endpoint = API_ENDPOINTS.ADMIN.DELETE_USER(selectedUser._id);
          method = "delete";
          body = { reason: actionReason };
          break;
        case "restore":
          endpoint = API_ENDPOINTS.ADMIN.RESTORE_USER(selectedUser._id);
          method = "put";
          body = {};
          break;
        case "removeAdmin":
          endpoint = API_ENDPOINTS.ADMIN.REMOVE_ADMIN(selectedUser._id);
          method = "delete";
          body = {};
          break;
        case "permanentDelete":
          endpoint = API_ENDPOINTS.ADMIN.PERMANENT_DELETE_USER(
            selectedUser._id
          );
          method = "delete";
          body = {};
          break;
        default:
          return;
      }

      await axios({
        method,
        url: endpoint,
        data: body,
        withCredentials: true,
      });

      toast.success(`User ${actionType}ed successfully`);
      setShowActionModal(false);
      fetchUsers();
    } catch (error) {
      toast.error(
        error.response?.data?.message || `Failed to ${actionType} user`
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: "bg-green-500",
      banned: "bg-red-500",
      suspended: "bg-yellow-500",
      deleted: "bg-gray-500",
    };
    return (
      <span
        className={`px-2 py-1 rounded text-white text-xs ${badges[status]}`}
      >
        {status}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const badges = {
      "Super Admin": "bg-purple-600",
      Admin: "bg-blue-600",
      Auctioneer: "bg-indigo-600",
      Bidder: "bg-teal-600",
    };
    return (
      <span className={`px-2 py-1 rounded text-white text-xs ${badges[role]}`}>
        {role}
      </span>
    );
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-wrap gap-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by username or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2 border rounded-lg"
        />

        {/* Role Filter */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Roles</option>
          <option value="Super Admin">Super Admin</option>
          <option value="Admin">Admin</option>
          <option value="Auctioneer">Auctioneer</option>
          <option value="Bidder">Bidder</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="banned">Banned</option>
          <option value="suspended">Suspended</option>
          <option value="deleted">Deleted</option>
        </select>
      </div>

      {/* User Table */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Username</th>
                  <th className="border p-2 text-left">Email</th>
                  <th className="border p-2 text-left">Role</th>
                  <th className="border p-2 text-left">Status</th>
                  <th className="border p-2 text-left">Created</th>
                  <th className="border p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="border p-2">{user.userName}</td>
                    <td className="border p-2">{user.email}</td>
                    <td className="border p-2">{getRoleBadge(user.role)}</td>
                    <td className="border p-2">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="border p-2">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="border p-2">
                      <div className="flex flex-wrap gap-1">
                        {user.status === "active" && (
                          <>
                            <button
                              onClick={() => handleAction(user, "ban")}
                              className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                              disabled={user.role === "Super Admin"}
                            >
                              Ban
                            </button>
                            <button
                              onClick={() => handleAction(user, "suspend")}
                              className="px-2 py-1 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600"
                              disabled={user.role === "Super Admin"}
                            >
                              Suspend
                            </button>
                            <button
                              onClick={() => handleAction(user, "delete")}
                              className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
                              disabled={user.role === "Super Admin"}
                            >
                              Delete
                            </button>
                            {user.role === "Admin" && (
                              <button
                                onClick={() =>
                                  handleAction(user, "removeAdmin")
                                }
                                className="px-2 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600"
                              >
                                Remove Admin
                              </button>
                            )}
                          </>
                        )}
                        {(user.status === "banned" ||
                          user.status === "suspended" ||
                          user.status === "deleted") && (
                          <>
                            <button
                              onClick={() => handleAction(user, "restore")}
                              className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                            >
                              Restore
                            </button>
                            {currentUser.role === "Super Admin" &&
                              user.status === "deleted" && (
                                <button
                                  onClick={() =>
                                    handleAction(user, "permanentDelete")
                                  }
                                  className="px-2 py-1 bg-black text-white rounded text-xs hover:bg-gray-800"
                                  title="Permanently delete from database"
                                >
                                  Permanent Delete
                                </button>
                              )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Total Users: {totalUsers} | Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Action Modal */}
      {showActionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 capitalize">
              {actionType} User
            </h3>
            <p className="mb-4">
              User: <strong>{selectedUser?.userName}</strong>
            </p>

            {actionType !== "restore" &&
              actionType !== "removeAdmin" &&
              actionType !== "permanentDelete" && (
                <>
                  {actionType === "suspend" && (
                    <div className="mb-4">
                      <label className="block mb-2">
                        Suspend Duration (days)
                      </label>
                      <input
                        type="number"
                        value={suspendDays}
                        onChange={(e) => setSuspendDays(e.target.value)}
                        min="1"
                        max="365"
                        className="w-full px-4 py-2 border rounded"
                      />
                    </div>
                  )}
                  <div className="mb-4">
                    <label className="block mb-2">Reason</label>
                    <textarea
                      value={actionReason}
                      onChange={(e) => setActionReason(e.target.value)}
                      className="w-full px-4 py-2 border rounded"
                      rows="3"
                      placeholder={`Enter reason for ${actionType}...`}
                    />
                  </div>
                </>
              )}

            {actionType === "restore" && (
              <p className="mb-4 text-gray-600">
                This will restore the user's account to active status.
              </p>
            )}

            {actionType === "permanentDelete" && (
              <div className="mb-4 p-4 bg-red-50 border border-red-300 rounded">
                <p className="text-red-700 font-semibold mb-2">
                  ⚠️ Warning: Permanent Deletion
                </p>
                <p className="text-red-600 text-sm">
                  This action will permanently delete the user from the
                  database. This cannot be undone. All user data will be lost
                  forever.
                </p>
              </div>
            )}

            {actionType === "removeAdmin" && (
              <p className="mb-4 text-gray-600">
                This will revoke admin privileges and soft-delete the account.
              </p>
            )}

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowActionModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={executeAction}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
