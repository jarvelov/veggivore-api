/**
 * Sample configuration
 *
 * @file /config/config.sample.js
 * @name config.sample.js
 * @namespace config
 */

const config = {
  name: 'Restify API',
  version: '0.0.1',
  restify: {
    host: {
      port: 8080
    },
    authentication: {
      secret: 'supersecretstring'
    }
  },
  mongodb: {
    database: 'database_name',
    host: 'localhost'
  }
};
module.exports = config;
