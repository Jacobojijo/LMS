const express = require('express');
const passport = require('passport');
const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  verifyResetCode,
  updateDetails,
  updatePassword,
  googleSuccess,
  verifyEmail,
  resendVerification
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/verifyemail', verifyEmail);
router.post('/resendverification', resendVerification);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword', verifyResetCode);

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  googleSuccess
);

module.exports = router;