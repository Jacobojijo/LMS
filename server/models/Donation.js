const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  donorName: {
    type: String,
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  donorEmail: {
    type: String,
    required: [true, 'Please provide an email'],
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  donorPhone: {
    type: String,
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Please provide donation amount'],
    min: [1, 'Amount must be at least 1']
  },
  currency: {
    type: String,
    enum: ['KES', 'USD', 'GHS', 'NGN', 'ZAR'],
    default: 'KES'
  },
  paymentMethod: {
    type: String,
    enum: ['mpesa', 'card'],
    required: [true, 'Please specify payment method']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  transactionId: {
    type: String
  },
  transactionRef: {
    type: String,
    unique: true,
    sparse: true
  },
  paystackReference: {
    type: String
  },
  message: {
    type: String,
    maxlength: [500, 'Message cannot be more than 500 characters']
  },
  isAnonymous: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

DonationSchema.index({ transactionRef: 1 });
DonationSchema.index({ paystackReference: 1 });
DonationSchema.index({ paymentStatus: 1 });
DonationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Donation', DonationSchema);
