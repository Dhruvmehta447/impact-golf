const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  // Every score MUST belong to a specific user
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // The score must be between 1 and 45 (Stableford format)
  scoreValue: { type: Number, required: true, min: 1, max: 45 },
  
  // The exact date the game was played
  datePlayed: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Score', scoreSchema);