const mongoose = require('mongoose');

const charitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // 'unique' stops you from adding the same charity twice!
  
  // We remove 'required: true' and give it a default fallback so the quick-add form works
  description: { type: String, default: 'An official ImpactGolf partner charity.' }, 
  
  // Adding a default placeholder image
  imageUrl: { type: String, default: 'https://via.placeholder.com/150?text=Charity' }, 
  
  totalRaised: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Charity', charitySchema);