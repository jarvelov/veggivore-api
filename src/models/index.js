module.exports = (config) => {
  const schemas = {
    Pages: {}
  };

  schemas.Pages = require('./pages')(schemas, config);
  //schemas.Users = require('./users')(schemas, config);

  return schemas;
};