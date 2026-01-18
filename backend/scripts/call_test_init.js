const AUCTION_ID = '696984b6d086cdea657fa4bd';
const url = `http://localhost:5000/api/v1/payment/auction/test-init/${AUCTION_ID}`;

(async () => {
  try {
    const res = await global.fetch(url, { method: 'POST' });
    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Body:', text);
  } catch (err) {
    console.error('Request failed:', err);
  }
})();
