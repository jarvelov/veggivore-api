module.exports = (models, config) => {
  models.Revisions = {};

  models.Revisions.Default = require('./default')(models, config);

  models.Revisions.Facts = require('./facts')(models, config);
  models.Revisions.Recipes = require('./recipes')(models, config);
  models.Revisions.Restaurants = require('./restaurants')(models, config);
  models.Revisions.Products = require('./products')(models, config);
  models.Revisions.Stores = require('./stores')(models, config);

  return models.Revisions;
};
