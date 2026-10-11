const crypto = require('crypto');
const Donation = require('../models/Donation');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncMiddleware');
const { submitOrderRequest, getTransactionStatus, registerIPN } = require('../utils/pesapal');

const generateReference = () => {
  return `HLS-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
};

// @desc    Initiate payment via Pesapal (supports M-Pesa, Cards, USD)
// @route   POST /api/donations/initiate
// @access  Public
exports.initiatePayment = asyncHandler(async (req, res, next) => {
  const { donorName, donorEmail, donorPhone, amount, currency, message, isAnonymous, paymentMethod } = req.body;

  // Use default email if not provided (required by Pesapal)
  const email = donorEmail || 'donor@heritage-languageschool.com';

  if (!amount) {
    return next(new ErrorResponse('Please provide donation amount', 400));
  }

  const minAmount = currency === 'USD' ? 1 : 10;
  if (amount < minAmount) {
    return next(new ErrorResponse(`Amount must be at least ${minAmount} ${currency || 'KES'}`, 400));
  }

  const reference = generateReference();
  const frontendUrl = process.env.FRONTEND_URL || 'https://www.heritage-languageschool.com';
  const backendUrl = process.env.BACKEND_URL || 'https://lms-ci8t.onrender.com';

  const donation = await Donation.create({
    donorName: isAnonymous ? undefined : donorName,
    donorEmail: email,
    donorPhone,
    amount,
    currency: currency || 'KES',
    paymentMethod: paymentMethod || 'card',
    paymentStatus: 'pending',
    message,
    isAnonymous: isAnonymous || false,
    transactionRef: reference,
  });

  try {
    // Register IPN URL if not already registered (Pesapal requirement)
    let notificationId = process.env.PESAPAL_IPN_ID;

    if (!notificationId) {
      const ipnResponse = await registerIPN(`${backendUrl}/api/donations/ipn`);
      notificationId = ipnResponse.ipn_id;
      console.log('Registered IPN ID:', notificationId);
    }

    const orderResponse = await submitOrderRequest({
      id: reference,
      currency: currency || 'KES',
      amount: parseFloat(amount),
      description: 'Donation to Sigana African Heritage Language School',
      callbackUrl: `${frontendUrl}/donate/verify?reference=${reference}`,
      notificationId,
      billingAddress: {
        email_address: email,
        phone_number: donorPhone || '',
        first_name: isAnonymous ? 'Anonymous' : (donorName?.split(' ')[0] || 'Donor'),
        last_name: isAnonymous ? 'Donor' : (donorName?.split(' ').slice(1).join(' ') || ''),
      },
    });

    if (orderResponse.order_tracking_id) {
      donation.orderTrackingId = orderResponse.order_tracking_id;
      donation.merchantReference = orderResponse.merchant_reference;
      await donation.save();

      res.status(200).json({
        success: true,
        data: {
          donationId: donation._id,
          redirectUrl: orderResponse.redirect_url,
          orderTrackingId: orderResponse.order_tracking_id,
          reference,
        },
      });
    } else {
      donation.paymentStatus = 'failed';
      await donation.save();
      return next(new ErrorResponse(orderResponse.error?.message || 'Failed to initiate payment', 500));
    }
  } catch (error) {
    donation.paymentStatus = 'failed';
    await donation.save();
    console.error('Pesapal payment error:', error.response?.data || error.message);
    return next(new ErrorResponse(
      error.response?.data?.error?.message || 'Failed to initiate payment',
      500
    ));
  }
});

// @desc    Pesapal IPN (Instant Payment Notification) handler
// @route   POST /api/donations/ipn
// @access  Public (Pesapal servers)
exports.pesapalIPN = asyncHandler(async (req, res, next) => {
  const { OrderTrackingId, OrderMerchantReference, OrderNotificationType } = req.body;

  console.log('Pesapal IPN received:', req.body);

  if (OrderNotificationType === 'IPNCHANGE' && OrderTrackingId) {
    try {
      const statusResponse = await getTransactionStatus(OrderTrackingId);

      const donation = await Donation.findOne({
        $or: [
          { orderTrackingId: OrderTrackingId },
          { transactionRef: OrderMerchantReference },
        ],
      });

      if (donation) {
        const paymentStatus = statusResponse.payment_status_description;

        if (paymentStatus === 'Completed') {
          donation.paymentStatus = 'completed';
          donation.transactionId = statusResponse.confirmation_code;
          donation.paymentMethodUsed = statusResponse.payment_method;
        } else if (paymentStatus === 'Failed') {
          donation.paymentStatus = 'failed';
        }

        await donation.save();
      }
    } catch (error) {
      console.error('IPN processing error:', error.message);
    }
  }

  res.status(200).json({
    orderNotificationType: OrderNotificationType,
    orderTrackingId: OrderTrackingId,
    orderMerchantReference: OrderMerchantReference,
    status: 200,
  });
});

// @desc    Pesapal callback handler (GET - redirect from Pesapal)
// @route   GET /api/donations/callback
// @access  Public
exports.pesapalCallback = asyncHandler(async (req, res, next) => {
  const { OrderTrackingId, OrderMerchantReference } = req.query;

  const frontendUrl = process.env.FRONTEND_URL || 'https://www.heritage-languageschool.com';

  if (OrderTrackingId) {
    try {
      const statusResponse = await getTransactionStatus(OrderTrackingId);

      const donation = await Donation.findOne({
        $or: [
          { orderTrackingId: OrderTrackingId },
          { transactionRef: OrderMerchantReference },
        ],
      });

      if (donation) {
        const paymentStatus = statusResponse.payment_status_description;

        if (paymentStatus === 'Completed') {
          donation.paymentStatus = 'completed';
          donation.transactionId = statusResponse.confirmation_code;
          donation.paymentMethodUsed = statusResponse.payment_method;
          await donation.save();
          return res.redirect(`${frontendUrl}/donate/success?id=${donation._id}`);
        } else if (paymentStatus === 'Failed') {
          donation.paymentStatus = 'failed';
          await donation.save();
          return res.redirect(`${frontendUrl}/donate/failed`);
        }
      }
    } catch (error) {
      console.error('Callback processing error:', error.message);
    }
  }

  res.redirect(`${frontendUrl}/donate/verify?reference=${OrderMerchantReference}`);
});

// @desc    Verify donation status
// @route   GET /api/donations/verify/:id
// @access  Public
exports.verifyDonation = asyncHandler(async (req, res, next) => {
  const donation = await Donation.findById(req.params.id);

  if (!donation) {
    return next(new ErrorResponse('Donation not found', 404));
  }

  if (donation.paymentStatus === 'pending' && donation.orderTrackingId) {
    try {
      const statusResponse = await getTransactionStatus(donation.orderTrackingId);
      const paymentStatus = statusResponse.payment_status_description;

      if (paymentStatus === 'Completed') {
        donation.paymentStatus = 'completed';
        donation.transactionId = statusResponse.confirmation_code;
        donation.paymentMethodUsed = statusResponse.payment_method;
        await donation.save();
      } else if (paymentStatus === 'Failed') {
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
      paymentMethod: donation.paymentMethodUsed || donation.paymentMethod,
      transactionId: donation.transactionId,
    },
  });
});

// @desc    Verify payment by reference (for redirect callback)
// @route   GET /api/donations/verify-by-ref/:reference
// @access  Public
exports.verifyByReference = asyncHandler(async (req, res, next) => {
  const { reference } = req.params;

  const donation = await Donation.findOne({ transactionRef: reference });

  if (!donation) {
    return next(new ErrorResponse('Donation not found', 404));
  }

  if (donation.paymentStatus === 'pending' && donation.orderTrackingId) {
    try {
      const statusResponse = await getTransactionStatus(donation.orderTrackingId);
      const paymentStatus = statusResponse.payment_status_description;

      if (paymentStatus === 'Completed') {
        donation.paymentStatus = 'completed';
        donation.transactionId = statusResponse.confirmation_code;
        donation.paymentMethodUsed = statusResponse.payment_method;
        await donation.save();
      } else if (paymentStatus === 'Failed') {
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
      paymentMethod: donation.paymentMethodUsed || donation.paymentMethod,
      transactionId: donation.transactionId,
    },
  });
});
