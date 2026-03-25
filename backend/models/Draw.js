const mongoose = require('mongoose');

const drawSchema = new mongoose.Schema({
  dateRun: { type: Date, default: Date.now },
  winningNumbers: [{ type: Number, required: true }],
  totalPrizePool: { type: Number, required: true },
  payouts: {
    match5: { 
      percentage: { type: Number, default: 40 }, 
      amount: { type: Number, default: 0 }, 
      winners: { type: Number, default: 0 } 
    },
    match4: { 
      percentage: { type: Number, default: 35 }, 
      amount: { type: Number, default: 0 }, 
      winners: { type: Number, default: 0 } 
    },
    match3: { 
      percentage: { type: Number, default: 25 }, 
      amount: { type: Number, default: 0 }, 
      winners: { type: Number, default: 0 } 
    }
  },
  status: { type: String, default: 'Published' } 
}, { timestamps: true });

module.exports = mongoose.model('Draw', drawSchema);