const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
  res.render('login/index');
});

router.post('/', async function(req, res) {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username: username });

    if (!user) {
      res.redirect('/login');
    } else {
      bcrypt.compare(password, user.password, function(err, result) {
        if(result) {
          req.session.loggedin = true;
          req.session.username = username;
          res.redirect('/matches'); // Änderung hier
        } else {
          res.send('Incorrect Password!');
        } 
      });
    }
  } catch (error) {
    console.error(error);
    res.redirect('/login');
  }
});

module.exports = router;
