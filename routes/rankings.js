// routes/rankings.js

const express = require('express');
const router = express.Router();
const Players = require('../models/Players');

router.get('/', async (req, res) => {
  try {
    const players = await Players.find();
    res.render('rankings/index', { players: players, loggedin: req.session.loggedin });
  } catch (err) {
    console.error(err);
    res.send("An error occurred while retrieving rankings.");
  }
});

module.exports = router;
