// server.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const User = require('./models/User');
const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'testerino123',
  resave: false,
  saveUninitialized: false,
}));

// Middleware to pass session data to views
app.use(function(req, res, next) {
  res.locals.loggedin = req.session.loggedin;
  res.locals.username = req.session.username;
  next();
});

app.post('/logout', function(req, res) {
  req.session.destroy();
  // Redirect to the previous page
  res.redirect(req.headers.referer || '/login');
});

const matchesRouter = require('./routes/matches');
const playersRouter = require('./routes/players');
const rankingsRouter = require('./routes/rankings');
const loginRouter = require('./routes/login');

app.use('/matches', matchesRouter);
app.use('/players', playersRouter);
app.use('/rankings', rankingsRouter);
app.use('/login', loginRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000...');
});

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://flunkyball:ZOuLNFLYrwbIpc74@cluster0.js7s7iz.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB...', err));

// Fallback-Handler
app.use(function(req, res) {
  res.redirect('/matches');
});