const restify = require('restify');
const passport = require('passport-restify');

module.exports = (server, models, config) => {

  // Require the general page routes
  require('./general')(server, models, config);

  // Require the specific page routes

  require('./cafes')(server, models, config);
  require('./facts')(server, models, config);
  require('./products')(server, models, config);
  require('./recipes')(server, models, config);
  require('./restaurants')(server, models, config);
  require('./companies')(server, models, config);
};