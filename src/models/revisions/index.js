module.exports = (models, config) => {
  models.Revisions = {};

  models.Revisions.Base = require('./base')(models, config);
  models.Revisions.Restaurant = require('./restaurant')(models, config);
  models.Revisions.Product = require('./product')(models, config);

  return models.Revisions;
};
