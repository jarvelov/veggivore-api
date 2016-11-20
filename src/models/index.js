module.exports = (config) => {
  const models = {};

  // First get the reusable embeddable models
  models.Embedded = require('./embedded')(models, config);

  // Then the normal ones
  models.Categories = require('./categories')(models, config);
  models.Cities = require('./cities')(models, config);
  models.Companies = require('./companies')(models, config);
  models.Images = require('./images')(models, config);
  models.Likes = require('./likes')(models, config);
  models.Pages = require('./pages')(models, config);
  models.Revisions = require('./revisions')(models, config);
  models.Stores = require('./stores')(models, config);
  models.Tags = require('./tags')(models, config);
  models.Users = require('./users')(models, config);
  models.Votes = require('./votes')(models, config);

  return models;
};
