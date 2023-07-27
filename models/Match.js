// models/Match.js
const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
  team1: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  }],
  team2: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Match = mongoose.model('Match', MatchSchema);

module.exports = Match;
