const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  matchesPlayed: {
    type: Number,
    default: 0
  },
  matchesWon: {
    type: Number,
    default: 0
  },
  matchesLost: {
    type: Number,
    default: 0
  },
  // Set initial Buchholz score to 0
  buchholzScore: {
    type: Number,
    default: 0
  }
});

const Players = mongoose.model('Player', PlayerSchema);

module.exports = Players;
