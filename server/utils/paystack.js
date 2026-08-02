const axios = require('axios');

const PAYSTACK_BASE_URL = 'https://api.paystack.co';

const getHeaders = () => ({
  Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
  'Content-Type': 'application/json',
});

const initializeTransaction = async ({
  email,
  amount,
  currency,
  reference,
  callbackUrl,
  metadata,
}) => {
  const payload = {
    email,
    amount: Math.round(amount * 100),
    currency: currency || 'KES',
    reference,
    callback_url: callbackUrl,
    metadata,
  };

  const response = await axios.post(
    `${PAYSTACK_BASE_URL}/transaction/initialize`,
    payload,
    { headers: getHeaders() }
  );

  return response.data;
};

const chargeMpesa = async ({
  email,
  amount,
  phoneNumber,
  reference,
}) => {
  let formattedPhone = phoneNumber.replace(/\s+/g, '').replace(/-/g, '');
  if (formattedPhone.startsWith('0')) {
    formattedPhone = '254' + formattedPhone.slice(1);
  } else if (formattedPhone.startsWith('+')) {
    formattedPhone = formattedPhone.slice(1);
  }

  const payload = {
    email,
    amount: Math.round(amount * 100),
    currency: 'KES',
    reference,
    mobile_money: {
      phone: formattedPhone,
      provider: 'mpesa',
    },
  };

  const response = await axios.post(
    `${PAYSTACK_BASE_URL}/charge`,
    payload,
    { headers: getHeaders() }
  );

  return response.data;
};

const verifyTransaction = async (reference) => {
  const response = await axios.get(
    `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
    { headers: getHeaders() }
  );

  return response.data;
};

module.exports = {
  initializeTransaction,
  chargeMpesa,
  verifyTransaction,
};
