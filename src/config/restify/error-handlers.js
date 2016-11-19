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

module.exports = (server) => {
  server.on('NotFound', function (req, res, err, next) {
    return res.send(err.statusCode, {
      success: false,
      error: err.body
    });
  });
};
