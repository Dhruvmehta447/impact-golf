const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'Subscriber' }, // Can be 'Public', 'Subscriber', or 'Admin'
  isSubscribed: { type: Boolean, default: false },
  selectedCharityId: { type: String, default: null }, // We will link this to a charity later
  charityPercentage: { type: Number, default: 10 } // Minimum is 10% based on the requirements
}, { timestamps: true }); // This automatically adds 'createdAt' and 'updatedAt' dates

module.exports = mongoose.model('User', userSchema);