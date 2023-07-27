// routes/matches.js
const express = require('express');
const router = express.Router();
const Players = require('../models/Players');
const Match = require('../models/Match');

router.get('/', async (req, res) => {
  try {
    // Holen Sie das neueste Match aus der Datenbank
    const match = await Match.findOne().sort({ createdAt: -1 }).populate('team1 team2');

    // Überprüfen Sie, ob es ein Match gibt
    if (match) {
      res.render('matches/index', { team1: match.team1, team2: match.team2, loggedin: req.session.loggedin });
    } else {
      // Ansonsten rendern Sie die Seite ohne Teams
      res.render('matches/index', { team1: null, team2: null, loggedin: req.session.loggedin });
    }
  } catch (err) {
    console.error(err);
    res.send("An error occurred while retrieving matches.");
  }
});

router.post('/start', async (req, res) => {
  if (!req.session.loggedin) {
    res.redirect('/login');
    return;
  }

  try {
    // Holen Sie sich alle Spieler, sortiert nach ihrer Buchholz-Punktzahl
    const players = await Players.find().sort({ buchholzScore: -1 });

    // Überprüfen, ob es genügend Spieler für ein Match gibt
    if (players.length < 6) {
      res.send("Es gibt nicht genug Spieler für ein Match.");
      return;
    }

    // Teilen Sie die obersten 6 Spieler in zwei Teams auf
    const team1 = players.slice(0, 3);
    const team2 = players.slice(3, 6);

    // Erstellen Sie ein neues Match in der Datenbank
    const match = new Match({ team1: team1.map(p => p._id), team2: team2.map(p => p._id) });
    await match.save();

    // Rendern Sie die Seite mit den Teams
    res.render('matches/index', { team1: team1, team2: team2, loggedin: true });

  } catch (err) {
    console.error(err);
    res.send("Ein Fehler ist aufgetreten beim Starten eines Matches.");
  }
});

module.exports = router;
