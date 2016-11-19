/**
 * Restify error handlers
 * @function
 *
 * @file: /config/restify/error-handlers.js
 * @name: error-handlers.js
 * @module restify
 * @namespace config
 * @param {object} server Restify server object
 */

const restify = require('restify');

module.exports = (server) => {
  function errorHandler (req, res, err, next) {
    return res.send(err.statusCode, {
      success: false,
      error: err.body
    });
  }

  // Catch all error handler
  Object.keys(restify.errors).forEach(errorName => {
    let key = errorName.substr(0, errorName.indexOf('Error'));
    server.on(key, errorHandler);
  });
};
