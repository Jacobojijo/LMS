const axios = require('axios');

const PESAPAL_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://pay.pesapal.com/v3'
  : 'https://cybqa.pesapal.com/pesapalv3';

let cachedToken = null;
let tokenExpiry = null;

const getAccessToken = async () => {
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const response = await axios.post(
    `${PESAPAL_BASE_URL}/api/Auth/RequestToken`,
    {
      consumer_key: process.env.PESAPAL_CONSUMER_KEY,
      consumer_secret: process.env.PESAPAL_CONSUMER_SECRET,
    },
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );

  cachedToken = response.data.token;
  tokenExpiry = Date.now() + (response.data.expiryDate ? new Date(response.data.expiryDate).getTime() - Date.now() - 60000 : 3600000);

  return cachedToken;
};

const getHeaders = async () => {
  const token = await getAccessToken();
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

const registerIPN = async (ipnUrl) => {
  const headers = await getHeaders();

  const response = await axios.post(
    `${PESAPAL_BASE_URL}/api/URLSetup/RegisterIPN`,
    {
      url: ipnUrl,
      ipn_notification_type: 'POST',
    },
    { headers }
  );

  return response.data;
};

const submitOrderRequest = async ({
  id,
  currency,
  amount,
  description,
  callbackUrl,
  notificationId,
  billingAddress,
}) => {
  const headers = await getHeaders();

  const payload = {
    id,
    currency,
    amount,
    description,
    callback_url: callbackUrl,
    notification_id: notificationId,
    billing_address: billingAddress,
  };

  const response = await axios.post(
    `${PESAPAL_BASE_URL}/api/Transactions/SubmitOrderRequest`,
    payload,
    { headers }
  );

  return response.data;
};

const getTransactionStatus = async (orderTrackingId) => {
  const headers = await getHeaders();

  const response = await axios.get(
    `${PESAPAL_BASE_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
    { headers }
  );

  return response.data;
};

module.exports = {
  getAccessToken,
  registerIPN,
  submitOrderRequest,
  getTransactionStatus,
};
