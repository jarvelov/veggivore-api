const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

module.exports = (server, models, config) => {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.secretOrKey = config.restify.authentication.secret;

  return new JwtStrategy(opts, function(jwt_payload, done) {
    return models.Users.findOne({
      _id: jwt_payload.userId
    })
    .then(user => {
      if(user) {
        done(null, user);
      }
    });
  });
};