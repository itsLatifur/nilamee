import dotenv from 'dotenv';
import SSLCommerzPayment from 'sslcommerz-lts';

dotenv.config({ path: './backend/config/config.env' });

async function run() {
  const store_id = process.env.SSLCOMMERZ_STORE_ID;
  const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
  const is_live = process.env.SSLCOMMERZ_IS_LIVE === 'true';

  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

  const data = {
    total_amount: 1,
    currency: 'BDT',
    tran_id: `TEST_${Date.now()}`,
    success_url: `${process.env.BACKEND_URL}/api/v1/payment/auction/success`,
    fail_url: `${process.env.BACKEND_URL}/api/v1/payment/auction/fail`,
    cancel_url: `${process.env.BACKEND_URL}/api/v1/payment/auction/cancel`,
    ipn_url: `${process.env.BACKEND_URL}/api/v1/payment/auction/ipn`,
    product_name: 'Test Item',
    product_category: 'Test',
    product_profile: 'physical-goods',
    cus_name: 'Test User',
    cus_email: 'test@example.com',
    cus_add1: 'Dhaka',
    cus_city: 'Dhaka',
    cus_country: 'Bangladesh',
    cus_phone: '01700000000',
    shipping_method: 'NO',
  };

  try {
    console.log('Calling SSLCommerz init...');
    const resp = await sslcz.init(data);
    console.log('SSLCommerz init response:', resp);
  } catch (err) {
    console.error('SSLCommerz init error:', err);
  }
}

run();
