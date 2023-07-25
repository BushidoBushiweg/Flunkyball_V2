// models/Player.js

const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  // Add other player properties here
});

const Player = mongoose.model('Player', PlayerSchema);

module.exports = Player;