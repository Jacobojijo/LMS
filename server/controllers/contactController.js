const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncMiddleware');
const sendEmail = require('../utils/sendEmail');
const {
  getContactFormEmailTemplates,
  getContactAcknowledgementEmailTemplates,
} = require('../utils/emailTemplates');

// Where contact form submissions are delivered
const CONTACT_INBOX = process.env.CONTACT_EMAIL || 'heritagelanguageschool@gmail.com';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// @desc    Send a contact form message to the school inbox
// @route   POST /api/contact
// @access  Public
exports.sendContactMessage = asyncHandler(async (req, res, next) => {
  const name = (req.body.name || '').trim();
  const email = (req.body.email || '').trim();
  const message = (req.body.message || '').trim();

  if (!name || !email || !message) {
    return next(new ErrorResponse('Please provide your name, email and message', 400));
  }

  if (!EMAIL_REGEX.test(email)) {
    return next(new ErrorResponse('Please provide a valid email address', 400));
  }

  if (name.length > 100) {
    return next(new ErrorResponse('Name must be 100 characters or less', 400));
  }

  if (message.length < 10) {
    return next(new ErrorResponse('Please write a message of at least 10 characters', 400));
  }

  if (message.length > 5000) {
    return next(new ErrorResponse('Message must be 5000 characters or less', 400));
  }

  const { message: text, html } = getContactFormEmailTemplates({ name, email, message });

  try {
    await sendEmail({
      email: CONTACT_INBOX,
      subject: `New contact message from ${name}`,
      message: text,
      html,
      replyTo: `${name} <${email}>`,
    });
  } catch (err) {
    console.error('Contact form email failed:', err.message);
    return next(
      new ErrorResponse(
        'We could not send your message right now. Please email us directly at ' + CONTACT_INBOX,
        500
      )
    );
  }

  // Acknowledge the visitor, but never fail the request if this second email bounces
  try {
    const ack = getContactAcknowledgementEmailTemplates(name, message);
    await sendEmail({
      email,
      subject: 'We received your message - Sigana African Heritage Language School',
      message: ack.message,
      html: ack.html,
      replyTo: CONTACT_INBOX,
    });
  } catch (err) {
    console.error('Contact form acknowledgement email failed:', err.message);
  }

  res.status(200).json({
    success: true,
    data: { message: 'Your message has been sent. We will get back to you shortly.' },
  });
});
