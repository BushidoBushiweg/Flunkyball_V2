// routes/players.js

const express = require('express');
const router = express.Router();
const Players = require('../models/Players');

router.get('/', async (req, res) => {
  try {
    const players = await Players.find();
    res.render('players/index', { players: players, loggedin: req.session.loggedin });
  } catch (err) {
    console.error(err);
    res.send("An error occurred while retrieving players.");
  }
});

router.post('/new', async (req, res) => {
  try {
    const newPlayer = new Players(req.body);
    await newPlayer.save();
    res.redirect('/players');
  } catch (err) {
    console.error(err);
    res.redirect('/players');
  }
});

router.post('/delete/:id', async (req, res) => {
  try {
    if (!req.session.loggedin) {
      res.redirect('/login');
      return;
    }
    await Players.findByIdAndRemove(req.params.id);
    res.redirect('/players');
  } catch (err) {
    console.error(err);
    res.redirect('/players');
  }
});

module.exports = router;
