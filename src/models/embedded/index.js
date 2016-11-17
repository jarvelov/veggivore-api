module.exports = (models, config) => {
  models.Embedded = {};
  models.Embedded.ContactInformation = require('./contact-information')(models, config);
  models.Embedded.Locations = require('./locations')(models, config);
  models.Embedded.Sources = require('./sources')(models, config);

  return models.Embedded;
};
