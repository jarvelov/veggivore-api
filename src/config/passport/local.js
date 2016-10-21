const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');

module.exports = (server, models, config) => {
  return new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false
  }, (email, password, cb) => {
    return models.Users.findOne({
      email: email
    })
    .select('+password')
    .then(user => {
      return user.comparePassword(password, user.password)
      .then(isMatch => {
        cb(null, {
          user: user.id,
          token: jwt.sign({
            userId: user.id
          }, config.restify.authentication.secret)
        });
      })
      .catch(err => {
        cb(err);
      });
    });
  });
};