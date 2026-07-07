const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/User');

module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());

  // Use the local strategy built by passport-local-mongoose
  passport.use(new LocalStrategy(User.authenticate()));

  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
};
