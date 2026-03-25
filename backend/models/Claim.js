const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  proofImage: { type: String, required: true }, // We will store the image as a text string!
  status: { type: String, default: 'Pending' }, // Pending, Approved, or Rejected
  paymentStatus: { type: String, default: 'Pending' } // Pending or Paid
}, { timestamps: true });

module.exports = mongoose.model('Claim', claimSchema);