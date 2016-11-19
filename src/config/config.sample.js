/**
 * Sample configuration
 * Copy or rename this file to config.js and change the properties to suit your environment
 *
 * @file /config/config.sample.js
 * @name config.sample.js
 * @namespace config
 */

const config = {
  restify: {
    name: 'Restify API',
    version: '0.0.1',
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
