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
  },
  // Add field to store the ID of the last match the player has played
  lastMatch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
    default: null
  }
});


const Players = mongoose.model('Player', PlayerSchema);

module.exports = Players;
