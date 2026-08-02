const express = require('express');
const {
  initiateMpesaPayment,
  initiateCardPayment,
  paystackWebhook,
  verifyDonation,
  verifyByReference,
} = require('../controllers/donationController');

const router = express.Router();

// M-Pesa payment
router.post('/mpesa/initiate', initiateMpesaPayment);

// Card payment
router.post('/card/initiate', initiateCardPayment);

// Paystack webhook
router.post('/webhook', paystackWebhook);

// Verification routes
router.get('/verify/:id', verifyDonation);
router.get('/verify-by-ref/:reference', verifyByReference);

module.exports = router;
