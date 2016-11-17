const passport = require('passport-restify');

module.exports = (server, models, config) => {
  // Initialize passport
  server.use(passport.initialize());

  // Local authentication
  passport.use('local', require('./local')(server, models, config));
  passport.use('jwt', require('./jwt')(server, models, config));

  // Middleware to figure out if user is authenticated or not

  passport.serializeUser((user, cb) => {
    cb(null, user);
  });

  passport.deserializeUser((userId, cb) => {
    // TODO: Do something here? Invalidate token?
  });

  /* TODO: This might be useful sometime?
  const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
  };
  */
};
