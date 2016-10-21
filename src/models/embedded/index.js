module.exports = (models, config) => {
  models.Embedded = {};
  models.Embedded.Contact = require('./contact')(models, config);
  models.Embedded.Contributor = require('./contributor')(models, config);

  return models.Embedded;
};