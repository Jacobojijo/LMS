const express = require('express');
const {
  initiatePayment,
  pesapalIPN,
  pesapalCallback,
  verifyDonation,
  verifyByReference,
} = require('../controllers/donationController');

const router = express.Router();

// Initiate payment (works for both M-Pesa and Card, KES and USD)
router.post('/initiate', initiatePayment);

// Pesapal IPN webhook
router.post('/ipn', pesapalIPN);

// Pesapal callback (redirect after payment)
router.get('/callback', pesapalCallback);

// Verification routes
router.get('/verify/:id', verifyDonation);
router.get('/verify-by-ref/:reference', verifyByReference);

module.exports = router;
