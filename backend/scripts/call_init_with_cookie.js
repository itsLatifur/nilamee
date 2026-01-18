const AUCTION_ID = '696984b6d086cdea657fa4bd';
const url = `http://localhost:5000/api/v1/payment/auction/init/${AUCTION_ID}`;
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NjhjNjlkOTgzZTQyYjljMWQ3YWYxZSIsImlhdCI6MTc2ODcxNjU2NSwiZXhwIjoxNzY4ODAyOTY1fQ.2t3l1d0weRQrY-7AM6qNHcFnSe8-_K5A0rNtti4raqc';

(async () => {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${token}`,
      },
      body: JSON.stringify({}),
    });
    const json = await res.json().catch(() => null);
    const text = await res.text().catch(() => null);
    console.log('Status:', res.status);
    console.log('JSON:', json);
    console.log('Text:', text);
  } catch (err) {
    console.error('Request failed:', err);
  }
})();
