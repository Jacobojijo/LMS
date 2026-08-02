const crypto = require('crypto');
const Donation = require('../models/Donation');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncMiddleware');
const { initializeTransaction, chargeMpesa, verifyTransaction } = require('../utils/paystack');

const generateReference = () => {
  return `HLS-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
};

// @desc    Initiate M-Pesa payment via Paystack
// @route   POST /api/donations/mpesa/initiate
// @access  Public
exports.initiateMpesaPayment = asyncHandler(async (req, res, next) => {
  const { donorName, donorEmail, donorPhone, amount, message, isAnonymous } = req.body;

  if (!donorEmail || !donorPhone || !amount) {
    return next(new ErrorResponse('Please provide email, phone number and amount', 400));
  }

  if (amount < 10) {
    return next(new ErrorResponse('Amount must be at least 10 KES', 400));
  }

  const reference = generateReference();

  const donation = await Donation.create({
    donorName: isAnonymous ? undefined : donorName,
    donorEmail,
    donorPhone,
    amount,
    currency: 'KES',
    paymentMethod: 'mpesa',
    paymentStatus: 'pending',
    message,
    isAnonymous: isAnonymous || false,
    transactionRef: reference,
  });

  try {
    const response = await chargeMpesa({
      email: donorEmail,
      amount,
      phoneNumber: donorPhone,
      reference,
    });

    if (response.status && response.data.status === 'send_otp') {
      donation.paystackReference = response.data.reference;
      await donation.save();

      res.status(200).json({
        success: true,
        message: 'Please check your phone to complete the payment',
        data: {
          donationId: donation._id,
          reference,
          displayText: response.data.display_text,
        },
      });
    } else if (response.status && response.data.status === 'pending') {
      donation.paystackReference = response.data.reference;
      await donation.save();

      res.status(200).json({
        success: true,
        message: response.data.display_text || 'Please check your phone to complete the payment',
        data: {
          donationId: donation._id,
          reference,
        },
      });
    } else {
      donation.paymentStatus = 'failed';
      await donation.save();
      return next(new ErrorResponse(response.message || 'Failed to initiate M-Pesa payment', 500));
    }
  } catch (error) {
    donation.paymentStatus = 'failed';
    await donation.save();
    console.error('Paystack M-Pesa error:', error.response?.data || error.message);
    return next(new ErrorResponse(
      error.response?.data?.message || 'Failed to initiate M-Pesa payment',
      500
    ));
  }
});

// @desc    Initiate card payment via Paystack
// @route   POST /api/donations/card/initiate
// @access  Public
exports.initiateCardPayment = asyncHandler(async (req, res, next) => {
  const { donorName, donorEmail, amount, currency, message, isAnonymous } = req.body;

  if (!donorEmail || !amount) {
    return next(new ErrorResponse('Please provide email and amount', 400));
  }

  const minAmount = currency === 'USD' ? 1 : 10;
  if (amount < minAmount) {
    return next(new ErrorResponse(`Amount must be at least ${minAmount} ${currency || 'KES'}`, 400));
  }

  const reference = generateReference();
  const frontendUrl = process.env.FRONTEND_URL || 'https://heritagelanguageschool.com';

  const donation = await Donation.create({
    donorName: isAnonymous ? undefined : donorName,
    donorEmail,
    amount,
    currency: currency || 'KES',
    paymentMethod: 'card',
    paymentStatus: 'pending',
    message,
    isAnonymous: isAnonymous || false,
    transactionRef: reference,
  });

  try {
    const response = await initializeTransaction({
      email: donorEmail,
      amount,
      currency: currency || 'KES',
      reference,
      callbackUrl: `${frontendUrl}/donate/verify?reference=${reference}`,
      metadata: {
        donationId: donation._id.toString(),
        donorName: isAnonymous ? 'Anonymous' : donorName,
        custom_fields: [
          {
            display_name: 'Donation ID',
            variable_name: 'donation_id',
            value: donation._id.toString(),
          },
        ],
      },
    });

    if (response.status) {
      donation.paystackReference = response.data.reference;
      await donation.save();

      res.status(200).json({
        success: true,
        data: {
          donationId: donation._id,
          authorizationUrl: response.data.authorization_url,
          accessCode: response.data.access_code,
          reference: response.data.reference,
        },
      });
    } else {
      donation.paymentStatus = 'failed';
      await donation.save();
      return next(new ErrorResponse(response.message || 'Failed to initiate payment', 500));
    }
  } catch (error) {
    donation.paymentStatus = 'failed';
    await donation.save();
    console.error('Paystack card payment error:', error.response?.data || error.message);
    return next(new ErrorResponse(
      error.response?.data?.message || 'Failed to initiate payment',
      500
    ));
  }
});

// @desc    Paystack webhook handler
// @route   POST /api/donations/webhook
// @access  Public (Paystack servers)
exports.paystackWebhook = asyncHandler(async (req, res, next) => {
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (hash !== req.headers['x-paystack-signature']) {
    console.error('Invalid webhook signature');
    return res.status(401).send('Unauthorized');
  }

  const event = req.body;

  if (event.event === 'charge.success') {
    const { reference, status, id } = event.data;

    const donation = await Donation.findOne({
      $or: [
        { transactionRef: reference },
        { paystackReference: reference },
      ],
    });

    if (donation && donation.paymentStatus !== 'completed') {
      if (status === 'success') {
        donation.paymentStatus = 'completed';
        donation.transactionId = String(id);
        await donation.save();
      }
    }
  }

  res.status(200).send('OK');
});

// @desc    Verify donation status
// @route   GET /api/donations/verify/:id
// @access  Public
exports.verifyDonation = asyncHandler(async (req, res, next) => {
  const donation = await Donation.findById(req.params.id);

  if (!donation) {
    return next(new ErrorResponse('Donation not found', 404));
  }

  if (donation.paymentStatus === 'pending' && donation.transactionRef) {
    try {
      const verification = await verifyTransaction(donation.transactionRef);

      if (verification.status && verification.data.status === 'success') {
        donation.paymentStatus = 'completed';
        donation.transactionId = String(verification.data.id);
        await donation.save();
      } else if (verification.data.status === 'failed') {
        donation.paymentStatus = 'failed';
        await donation.save();
      }
    } catch (error) {
      console.log('Could not verify transaction:', error.message);
    }
  }

  res.status(200).json({
    success: true,
    data: {
      id: donation._id,
      status: donation.paymentStatus,
      amount: donation.amount,
      currency: donation.currency,
      paymentMethod: donation.paymentMethod,
      transactionId: donation.transactionId,
    },
  });
});

// @desc    Verify payment by reference (for redirect callback)
// @route   GET /api/donations/verify-by-ref/:reference
// @access  Public
exports.verifyByReference = asyncHandler(async (req, res, next) => {
  const { reference } = req.params;

  const donation = await Donation.findOne({
    $or: [
      { transactionRef: reference },
      { paystackReference: reference },
    ],
  });

  if (!donation) {
    return next(new ErrorResponse('Donation not found', 404));
  }

  if (donation.paymentStatus === 'pending') {
    try {
      const verification = await verifyTransaction(reference);

      if (verification.status && verification.data.status === 'success') {
        donation.paymentStatus = 'completed';
        donation.transactionId = String(verification.data.id);
        await donation.save();
      } else if (verification.data.status === 'failed') {
        donation.paymentStatus = 'failed';
        await donation.save();
      }
    } catch (error) {
      console.log('Could not verify transaction:', error.message);
    }
  }

  res.status(200).json({
    success: true,
    data: {
      id: donation._id,
      status: donation.paymentStatus,
      amount: donation.amount,
      currency: donation.currency,
      paymentMethod: donation.paymentMethod,
      transactionId: donation.transactionId,
    },
  });
});
