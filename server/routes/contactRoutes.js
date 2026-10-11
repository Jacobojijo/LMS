const express = require('express');
const rateLimit = require('express-rate-limit');
const { sendContactMessage } = require('../controllers/contactController');

const router = express.Router();

// Tighter limit than the global one, to keep the inbox free of form spam
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: {
    success: false,
    error: 'Too many messages sent from this device. Please try again later.',
  },
});

router.post('/', contactLimiter, sendContactMessage);

module.exports = router;
