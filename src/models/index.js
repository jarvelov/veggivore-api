module.exports = (models, config) => {
  const schemas = {
    Pages: {}
  };

  schemas.Pages = require('./pages')(schemas, models, config);
  schemas.Users = require('./users')(schemas, models, config);

  return schemas;
};