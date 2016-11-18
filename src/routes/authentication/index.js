const passport = require('passport-restify');

module.exports = (server, models, config) => {
  server.post('/login', passport.authenticate('local'), (req, res, next) => {
    res.json({
      success: true,
      data: req.user.token
    });
  });

  server.get('/logout', passport.authenticate('local'), (req, res, next) => {
    req.logout();
    res.json({
      success: true
    });
  });

  server.on('NotAuthorizedError', (req, res, err, next) => {
    res.json(403, {
      success: false,
      error: err
    });
  });
};
