module.exports = (models, config) => {
  models.Embedded = {};
  models.Embedded.ContactDetails = require('./contact-details')(models, config);
  models.Embedded.Contributors = require('./contributors')(models, config);
  models.Embedded.Locations = require('./locations')(models, config);
  models.Embedded.Sources = require('./sources')(models, config);

  return models.Embedded;
};
