// routes/matches.js
const express = require('express');
const router = express.Router();
const Players = require('../models/Players');
const Match = require('../models/Match');

router.get('/', async (req, res) => {
  try {
    const match = await Match.findOne({ status: 'running' }).populate('team1').populate('team2');
    const totalMatchesPlayed = await Players.aggregate([{
      $group: {
        _id: null,
        total: {
          $sum: '$matchesPlayed'
        }
      }
    }]);
    const totalPlayers = await Players.countDocuments();
    const allPlayersHavePlayed = totalMatchesPlayed[0].total >= totalPlayers;
    res.render('matches/index', { match: match, loggedin: req.session.loggedin, allPlayersHavePlayed: allPlayersHavePlayed });
  } catch (err) {
    console.error(err);
    res.send("An error occurred while retrieving the match.");
  }
});

router.post('/start', async (req, res) => {
  if (!req.session.loggedin) {
    res.redirect('/login');
    return;
  }

  // Match starten
  try {
    // Get the minimum matchesPlayed value across all players
    const minMatchesPlayed = await Players.find().sort({ matchesPlayed: 1 }).limit(1).then(players => players[0].matchesPlayed);

    // Get all players who have played the minimum number of matches
    const playersWithMinMatches = await Players.find({ matchesPlayed: minMatchesPlayed });

    // Randomly shuffle the players
    const shuffledPlayers = playersWithMinMatches.sort(() => 0.5 - Math.random());

    // Select the first 6 players for the match
    let selectedPlayers = shuffledPlayers.slice(0, 6);

    // If not enough players were selected, select random players to fill the teams
    if (selectedPlayers.length < 6) {
      const additionalPlayersNeeded = 6 - selectedPlayers.length;
      const remainingPlayers = await Players.find({ _id: { $nin: selectedPlayers.map(player => player._id) } });
      const additionalPlayers = remainingPlayers.sort(() => 0.5 - Math.random()).slice(0, additionalPlayersNeeded);
      selectedPlayers = selectedPlayers.concat(additionalPlayers);
    }

    const team1 = selectedPlayers.slice(0, 3);
    const team2 = selectedPlayers.slice(3, 6);

    const newMatch = new Match({
      team1: team1.map(player => player._id),
      team2: team2.map(player => player._id),
    });

    await newMatch.save();

    res.redirect('/matches');
  } catch (err) {
    console.error(err);
    res.redirect('/matches');
  }
});

router.post('/winner', async (req, res) => {
  if (!req.session.loggedin) {
    res.redirect('/login');
    return;
  }

  // Gewinner eintragen
  try {
    const match = await Match.findOne({ status: 'running' }).populate('team1').populate('team2');
    if (!match) {
      res.redirect('/matches');
      return;
    }

    const winningTeam = match[req.body.winner];
    const losingTeam = match[req.body.winner === 'team1' ? 'team2' : 'team1'];

    winningTeam.forEach(async (player) => {
      player.matchesWon++;
      player.matchesPlayed++;
      player.buchholzScore++;
      await player.save();
    });

    losingTeam.forEach(async (player) => {
      player.matchesLost++;
      player.matchesPlayed++;
      player.buchholzScore--;
      await player.save();
    });

    match.status = 'finished';
    await match.save();

    res.redirect('/matches');
  } catch (err) {
    console.error(err);
    res.redirect('/matches');
  }
});

router.post('/reset', async (req, res) => {
  if (!req.session.loggedin) {
    res.redirect('/login');
    return;
  }

  try {
    await Players.updateMany({}, { matchesWon: 0, matchesLost: 0, buchholzScore: 0, matchesPlayed: 0 });
    res.redirect('/matches');
  } catch (err) {
    console.error(err);
    res.redirect('/matches');
  }
});

module.exports = router;
