const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
  // Hier definieren Sie die Felder für Ihr Schema
  name: String,
  // Weitere Felder nach Bedarf hinzufügen...
});

const Players = mongoose.model('Player', PlayerSchema);

module.exports = Players;