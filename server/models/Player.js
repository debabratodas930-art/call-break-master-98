const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  matchesPlayed: {
    type: Number,
    default: 0,
  },
  rank1Count: {
    type: Number,
    default: 0,
  },
  rank2Count: {
    type: Number,
    default: 0,
  },
  rank3Count: {
    type: Number,
    default: 0,
  },
  rank4Count: {
    type: Number,
    default: 0,
  },
  highestScore: {
    type: Number,
    default: 0,
  },
  totalPoints: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 1000,
  },
});

module.exports = mongoose.model('Player', playerSchema);
