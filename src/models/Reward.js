// models/Reward.js
const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  customerId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  balance: {
    type: Number,
    default: 0,
    min: 0
  }
});

module.exports = mongoose.model('Reward', rewardSchema);
