const mongoose = require('mongoose');

module.exports = (models, config) => {
  const Pages = require('./schema')(models, config);
  Pages.statics = require('./statics')(models, config);

  return mongoose.model('Pages', Pages);
};
