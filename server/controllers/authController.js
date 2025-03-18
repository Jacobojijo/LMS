const crypto = require('crypto');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const sendTokenResponse = require('../utils/sendTokenResponse');
const sendEmail = require('../utils/sendEmail');
const emailTemplates = require('../utils/emailTemplates');
const asyncHandler = require('../middleware/asyncMiddleware');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, phoneNumber, password, passwordConfirmation, role } = req.body;

  // Check if passwords match
  if (password !== passwordConfirmation) {
    return next(new ErrorResponse('Passwords do not match', 400));
  }

  // Check if email already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return next(new ErrorResponse('Email already registered', 400));
  }

  // Create user (without saving to DB yet)
  const user = new User({
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    role: role || 'student' // Default to student if role not specified
  });

  // Generate verification code
  const verificationCode = user.getEmailVerificationToken();

  // Save user to DB with verification token
  await user.save();

  // Get email templates for verification
  const { message, html } = emailTemplates.getVerificationEmailTemplates(firstName, verificationCode);

  try {
    await sendEmail({
      email: user.email,
      subject: 'Heritage Language School - Email Verification',
      message,
      html
    });

    res.status(201).json({
      success: true,
      message: 'User registered. Please check your email for the verification code.'
    });
  } catch (err) {
    console.error('Email could not be sent', err);

    // If email fails, remove the user and return error
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

// @desc    Verify email with code
// @route   POST /api/auth/verifyemail
// @access  Public
exports.verifyEmail = asyncHandler(async (req, res, next) => {
  const { email, verificationCode } = req.body;

  if (!email || !verificationCode) {
    return next(new ErrorResponse('Please provide email and verification code', 400));
  }

  // Hash the verification code to compare with the one in DB
  const emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationCode)
    .digest('hex');

  // Find user with the matching verification token and unexpired token
  const user = await User.findOne({
    email,
    emailVerificationToken,
    emailVerificationExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse('Invalid or expired verification code', 400));
  }

  // Update user verification status
  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpire = undefined;
  await user.save();

  // Get welcome email templates
  const { message, html } = emailTemplates.getWelcomeEmailTemplates(user.firstName);

  // Send welcome email
  try {
    await sendEmail({
      email: user.email,
      subject: 'Welcome to Heritage Language School',
      message,
      html
    });
  } catch (err) {
    console.error('Welcome email could not be sent', err);
    // We don't want to block the verification process if the welcome email fails
  }

  // Send token response to log the user in
  sendTokenResponse(user, 200, res);
});

// @desc    Resend verification email
// @route   POST /api/auth/resendverification
// @access  Public
exports.resendVerification = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ErrorResponse('Please provide an email address', 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  if (user.isEmailVerified) {
    return next(new ErrorResponse('Email already verified', 400));
  }

  // Generate new verification code
  const verificationCode = user.getEmailVerificationToken();
  await user.save();

  // Get resend verification email templates
  const { message, html } = emailTemplates.getResendVerificationEmailTemplates(user.firstName, verificationCode);

  try {
    await sendEmail({
      email: user.email,
      subject: 'Heritage Language School - New Verification Code',
      message,
      html
    });

    res.status(200).json({
      success: true,
      message: 'New verification code sent to your email'
    });
  } catch (err) {
    console.error('Email could not be sent', err);
    
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if user has verified their email
  if (!user.isEmailVerified) {
    return next(new ErrorResponse('Please verify your email before logging in', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Update last login time
  user.lastLogin = Date.now();
  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 200, res);
});

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  // Check if new passwords match
  if (req.body.newPassword !== req.body.passwordConfirmation) {
    return next(new ErrorResponse('New passwords do not match', 400));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404));
  }

  // Get reset code
  const resetCode = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Get forgot password email templates
  const { message, html } = emailTemplates.getForgotPasswordCodeEmailTemplates(user.firstName, resetCode);

  try {
    await sendEmail({
      email: user.email,
      subject: 'Heritage Language School - Password Reset Code',
      message,
      html
    });

    res.status(200).json({
      success: true,
      message: 'Password reset code sent to your email'
    });
  } catch (err) {
    console.error('Email could not be sent', err);
    
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

// @desc    Verify reset code and reset password
// @route   POST /api/auth/resetpassword
// @access  Public
exports.verifyResetCode = asyncHandler(async (req, res, next) => {
  const { email, resetCode, password, passwordConfirmation } = req.body;

  if (!email || !resetCode || !password || !passwordConfirmation) {
    return next(new ErrorResponse('Please provide all required fields', 400));
  }

  // Check if passwords match
  if (password !== passwordConfirmation) {
    return next(new ErrorResponse('Passwords do not match', 400));
  }

  // Hash the reset code to compare with the one in DB
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetCode)
    .digest('hex');

  // Find user with the matching reset token and unexpired token
  const user = await User.findOne({
    email,
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse('Invalid or expired reset code', 400));
  }

  // Set new password
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  // Get password changed email templates
  const { message, html } = emailTemplates.getPasswordChangedEmailTemplates(user.firstName);

  // Send notification email
  try {
    await sendEmail({
      email: user.email,
      subject: 'Heritage Language School - Password Changed',
      message,
      html
    });
  } catch (err) {
    console.error('Password change notification email could not be sent', err);
    // We don't want to block the password reset if the notification email fails
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Google OAuth success handler
// @route   GET /api/auth/google/success
// @access  Private
exports.googleSuccess = asyncHandler(async (req, res, next) => {
  sendTokenResponse(req.user, 200, res);
});
