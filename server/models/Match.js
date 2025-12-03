const mongoose = require('mongoose');

const roundScoreSchema = new mongoose.Schema({
  playerId: {
    type: String,
    required: true,
  },
  bid: {
    type: Number,
    default: 0,
  },
  tricks: {
    type: Number,
    default: 0,
  },
  points: {
    type: Number,
    default: 0,
  },
}, { _id: false });

const roundSchema = new mongoose.Schema({
  roundNumber: {
    type: Number,
    required: true,
  },
  scores: [roundScoreSchema],
}, { _id: false });

const matchPlayerSchema = new mongoose.Schema({
  playerId: {
    type: String,
    required: true,
  },
  playerName: {
    type: String,
    required: true,
  },
  seat: {
    type: Number,
    required: true,
  },
  totalPoints: {
    type: Number,
    default: 0,
  },
  rank: {
    type: Number,
    default: 0,
  },
  ratingBefore: {
    type: Number,
    default: 1000,
  },
  ratingAfter: {
    type: Number,
    default: 1000,
  },
  ratingChange: {
    type: Number,
    default: 0,
  },
}, { _id: false });

const matchSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  players: [matchPlayerSchema],
  rounds: [roundSchema],
  completed: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Match', matchSchema);
