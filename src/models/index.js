module.exports = (config) => {
  const models = {};

  // First get the reusable embedded models
  models.Embedded = require('./embedded')(models, config);

  // Then the normal ones
  models.Companies = require('./companies')(models, config);
  models.Pages = require('./pages')(models, config);
  models.Revisions = require('./revisions')(models, config);
  models.Users = require('./users')(models, config);

  return models;
};