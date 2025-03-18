/**
 * Generate verification email templates
 * @param {string} firstName - User's first name 
 * @param {string} verificationCode - Email verification code
 * @returns {Object} Object containing text and HTML versions of the email
 */
exports.getVerificationEmailTemplates = (firstName, verificationCode) => {
  const message = `Hello ${firstName},
    
    Thank you for registering with Heritage Language School.
    
    You have received confirmation code from Heritage Language School: ${verificationCode}
    
    Please enter this code in our website to complete your registration.
    
    This code will expire in 24 hours.
    
    Regards,
    Heritage Language School Team`;

  const htmlMessage = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #4a4a4a;">Welcome to Heritage Language School</h2>
      <p>Hello ${firstName},</p>
      <p>Thank you for registering with Heritage Language School.</p>
      <p>You have received confirmation code from Heritage Language School:</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; font-size: 24px; letter-spacing: 5px; text-align: center; margin: 20px 0;">
        <strong>${verificationCode}</strong>
      </div>
      <p>Please enter this code in our website to complete your registration.</p>
      <p><em>This code will expire in 24 hours.</em></p>
      <p>Regards,<br>Heritage Language School Team</p>
    </div>`;

  return { message, html: htmlMessage };
};

/**
 * Generate welcome email templates after verification
 * @param {string} firstName - User's first name
 * @returns {Object} Object containing text and HTML versions of the email
 */
exports.getWelcomeEmailTemplates = (firstName) => {
  const message = `Hello ${firstName},
    
    Your email has been verified successfully. Welcome to Heritage Language School!
    
    You can now log in to your account and explore our courses.
    
    Regards,
    Heritage Language School Team`;

  const htmlMessage = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #4a4a4a;">Welcome to Heritage Language School</h2>
      <p>Hello ${firstName},</p>
      <p>Your email has been verified successfully. Welcome to Heritage Language School!</p>
      <p>You can now log in to your account and explore our courses.</p>
      <p>Regards,<br>Heritage Language School Team</p>
    </div>`;

  return { message, html: htmlMessage };
};

/**
 * Generate resend verification email templates
 * @param {string} firstName - User's first name
 * @param {string} verificationCode - Email verification code
 * @returns {Object} Object containing text and HTML versions of the email
 */
exports.getResendVerificationEmailTemplates = (firstName, verificationCode) => {
  const message = `Hello ${firstName},
    
    You have requested a new verification code from Heritage Language School.
    
    Your new confirmation code is: ${verificationCode}
    
    Please enter this code in our website to complete your registration.
    
    This code will expire in 24 hours.
    
    Regards,
    Heritage Language School Team`;

  const htmlMessage = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #4a4a4a;">Heritage Language School - New Verification Code</h2>
      <p>Hello ${firstName},</p>
      <p>You have requested a new verification code from Heritage Language School.</p>
      <p>Your new confirmation code is:</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; font-size: 24px; letter-spacing: 5px; text-align: center; margin: 20px 0;">
        <strong>${verificationCode}</strong>
      </div>
      <p>Please enter this code in our website to complete your registration.</p>
      <p><em>This code will expire in 24 hours.</em></p>
      <p>Regards,<br>Heritage Language School Team</p>
    </div>`;

  return { message, html: htmlMessage };
};

/**
 * Generate forgot password code email templates
 * @param {string} firstName - User's first name
 * @param {string} resetCode - Password reset code
 * @returns {Object} Object containing text and HTML versions of the email
 */
exports.getForgotPasswordCodeEmailTemplates = (firstName, resetCode) => {
  const message = `Hello ${firstName},

    You are receiving this email because you (or someone else) has requested to reset your password.
    
    Your password reset code is: ${resetCode}
    
    Please enter this code along with your new password on our website.
    
    This code will expire in 10 minutes.
    
    If you did not request this, please ignore this email and your password will remain unchanged.
    
    Regards,
    Heritage Language School Team`;

  const htmlMessage = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #4a4a4a;">Reset Your Password</h2>
      <p>Hello ${firstName},</p>
      <p>You are receiving this email because you (or someone else) has requested to reset your password.</p>
      <p>Your password reset code is:</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; font-size: 24px; letter-spacing: 5px; text-align: center; margin: 20px 0;">
        <strong>${resetCode}</strong>
      </div>
      <p>Please enter this code along with your new password on our website.</p>
      <p><em>This code will expire in 10 minutes.</em></p>
      <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      <p>Regards,<br>Heritage Language School Team</p>
    </div>`;

  return { message, html: htmlMessage };
};

/**
 * Generate password changed notification email templates
 * @param {string} firstName - User's first name
 * @returns {Object} Object containing text and HTML versions of the email
 */
exports.getPasswordChangedEmailTemplates = (firstName) => {
  const message = `Hello ${firstName},
    
    Your password has been successfully changed.
    
    If you did not make this change, please contact our support team immediately.
    
    Regards,
    Heritage Language School Team`;

  const htmlMessage = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #4a4a4a;">Password Changed</h2>
      <p>Hello ${firstName},</p>
      <p>Your password has been successfully changed.</p>
      <p><strong>If you did not make this change, please contact our support team immediately.</strong></p>
      <p>Regards,<br>Heritage Language School Team</p>
    </div>`;

  return { message, html: htmlMessage };
};
