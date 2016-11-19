const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

module.exports = (server, models, config) => {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: config.restify.authentication.secret
  };

  return new JwtStrategy(opts, (payload, cb) => {
    return models.Users
    .findOne({
      _id: payload.userId
    })
    .then(user => {
      if (user) {
        cb(null, user);
      } else {
        let err = new Error('User not found');
        cb(err);
      }
    });
  });
};
