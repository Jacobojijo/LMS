/**
 * Generate verification email templates
 * @param {string} firstName - User's first name 
 * @param {string} verificationCode - Email verification code
 * @returns {Object} Object containing text and HTML versions of the email
 */
exports.getVerificationEmailTemplates = (firstName, verificationCode) => {
  const message = `Hello ${firstName},
    
    Thank you for registering with Sigana African Heritage Language School.
    
    You have received confirmation code from Sigana African Heritage Language School: ${verificationCode}
    
    Please enter this code in our website to complete your registration.
    
    This code will expire in 24 hours.
    
    Regards,
    Sigana African Heritage Language School Team`;

  const htmlMessage = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f2e8dc; border-top: 4px solid #854836; border-radius: 6px;">
      <h2 style="color: #124E56; font-family: Georgia, serif;">Welcome to Sigana African Heritage Language School</h2>
      <p>Hello ${firstName},</p>
      <p>Thank you for registering with Sigana African Heritage Language School.</p>
      <p>You have received confirmation code from Sigana African Heritage Language School:</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; font-size: 24px; letter-spacing: 5px; text-align: center; margin: 20px 0;">
        <strong>${verificationCode}</strong>
      </div>
      <p>Please enter this code in our website to complete your registration.</p>
      <p><em>This code will expire in 24 hours.</em></p>
      <p>Regards,<br>Sigana African Heritage Language School Team</p>
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
    
    Your email has been verified successfully. Welcome to Sigana African Heritage Language School!
    
    You can now log in to your account and explore our courses.
    
    Regards,
    Sigana African Heritage Language School Team`;

  const htmlMessage = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f2e8dc; border-top: 4px solid #854836; border-radius: 6px;">
      <h2 style="color: #124E56; font-family: Georgia, serif;">Welcome to Sigana African Heritage Language School</h2>
      <p>Hello ${firstName},</p>
      <p>Your email has been verified successfully. Welcome to Sigana African Heritage Language School!</p>
      <p>You can now log in to your account and explore our courses.</p>
      <p>Regards,<br>Sigana African Heritage Language School Team</p>
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
    
    You have requested a new verification code from Sigana African Heritage Language School.
    
    Your new confirmation code is: ${verificationCode}
    
    Please enter this code in our website to complete your registration.
    
    This code will expire in 24 hours.
    
    Regards,
    Sigana African Heritage Language School Team`;

  const htmlMessage = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f2e8dc; border-top: 4px solid #854836; border-radius: 6px;">
      <h2 style="color: #124E56; font-family: Georgia, serif;">Sigana African Heritage Language School - New Verification Code</h2>
      <p>Hello ${firstName},</p>
      <p>You have requested a new verification code from Sigana African Heritage Language School.</p>
      <p>Your new confirmation code is:</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; font-size: 24px; letter-spacing: 5px; text-align: center; margin: 20px 0;">
        <strong>${verificationCode}</strong>
      </div>
      <p>Please enter this code in our website to complete your registration.</p>
      <p><em>This code will expire in 24 hours.</em></p>
      <p>Regards,<br>Sigana African Heritage Language School Team</p>
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
    Sigana African Heritage Language School Team`;

  const htmlMessage = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f2e8dc; border-top: 4px solid #854836; border-radius: 6px;">
      <h2 style="color: #124E56; font-family: Georgia, serif;">Reset Your Password</h2>
      <p>Hello ${firstName},</p>
      <p>You are receiving this email because you (or someone else) has requested to reset your password.</p>
      <p>Your password reset code is:</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; font-size: 24px; letter-spacing: 5px; text-align: center; margin: 20px 0;">
        <strong>${resetCode}</strong>
      </div>
      <p>Please enter this code along with your new password on our website.</p>
      <p><em>This code will expire in 10 minutes.</em></p>
      <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      <p>Regards,<br>Sigana African Heritage Language School Team</p>
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
    Sigana African Heritage Language School Team`;

  const htmlMessage = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f2e8dc; border-top: 4px solid #854836; border-radius: 6px;">
      <h2 style="color: #124E56; font-family: Georgia, serif;">Password Changed</h2>
      <p>Hello ${firstName},</p>
      <p>Your password has been successfully changed.</p>
      <p><strong>If you did not make this change, please contact our support team immediately.</strong></p>
      <p>Regards,<br>Sigana African Heritage Language School Team</p>
    </div>`;

  return { message, html: htmlMessage };
};

/**
 * Escape HTML so visitor-supplied text cannot inject markup into the email
 * @param {string} value - Raw text
 * @returns {string} Escaped text
 */
const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/**
 * Generate the notification email sent to the school when a visitor uses the contact form
 * @param {Object} contact - Contact form submission
 * @param {string} contact.name - Visitor's full name
 * @param {string} contact.email - Visitor's email address
 * @param {string} contact.message - Visitor's message
 * @returns {Object} Object containing text and HTML versions of the email
 */
exports.getContactFormEmailTemplates = ({ name, email, message: body }) => {
  const receivedAt = new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' });

  const message = `New contact form message from the website.

    Name: ${name}
    Email: ${email}
    Received: ${receivedAt} (EAT)

    Message:
    ${body}

    Reply directly to this email to respond to ${name}.`;

  const htmlMessage = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f2e8dc; border-top: 4px solid #854836; border-radius: 6px;">
      <h2 style="color: #124E56; font-family: Georgia, serif;">New Contact Form Message</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="padding: 6px 0; color: #666;">Name</td>
          <td style="padding: 6px 0;"><strong>${escapeHtml(name)}</strong></td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #666;">Email</td>
          <td style="padding: 6px 0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #666;">Received</td>
          <td style="padding: 6px 0;">${escapeHtml(receivedAt)} (EAT)</td>
        </tr>
      </table>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; white-space: pre-wrap;">${escapeHtml(body)}</div>
      <p style="margin-top: 20px; color: #666; font-size: 13px;">Reply directly to this email to respond to ${escapeHtml(name)}.</p>
    </div>`;

  return { message, html: htmlMessage };
};

/**
 * Generate the acknowledgement email sent back to the visitor
 * @param {string} name - Visitor's full name
 * @param {string} body - The message the visitor submitted
 * @returns {Object} Object containing text and HTML versions of the email
 */
exports.getContactAcknowledgementEmailTemplates = (name, body) => {
  const message = `Hello ${name},

    Thank you for reaching out to Sigana African Heritage Language School. We have received your message and will get back to you shortly.

    For your records, here is what you sent us:

    ${body}

    Regards,
    Sigana African Heritage Language School Team`;

  const htmlMessage = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f2e8dc; border-top: 4px solid #854836; border-radius: 6px;">
      <h2 style="color: #124E56; font-family: Georgia, serif;">We received your message</h2>
      <p>Hello ${escapeHtml(name)},</p>
      <p>Thank you for reaching out to Sigana African Heritage Language School. We have received your message and will get back to you shortly.</p>
      <p>For your records, here is what you sent us:</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; white-space: pre-wrap;">${escapeHtml(body)}</div>
      <p>Regards,<br>Sigana African Heritage Language School Team</p>
    </div>`;

  return { message, html: htmlMessage };
};
