/**
 * Configures the restify server instance
 *
 * @file /config/restify/index.js
 * @name index.js
 * @namespace config
 * @module restify
 */
const restify = require('restify');
const restifyValidation = require('node-restify-validation');
const restifyCustomValidators = require('./validators');
const _ = require('lodash');

module.exports = (models, config) => {
  console.log(config.restify);
  const server = restify.createServer({
    name: config.restify.name,
    version: config.restify.version,
    formatters: {
      'application/json': (req, res, body, next) => {
        try {
          return next(null, JSON.stringify(body, null, '\t'));
        } catch (err) {
          console.error(body); // TODO: Write error and body to error log
          let error = new restify.errors.InternalServerError('Something went wrong on our end, hopefully it won\'t happen again');
          return next(error);
        }
      }
    }
  });

  // Handle extra slashes in URL
  server.pre(restify.pre.sanitizePath());

  server.use(restify.acceptParser(server.acceptable));

  // Map POST/PUT params to req.params
  server.use(restify.bodyParser({
    mapParams: true,
    mapFiles: false
  }));

  // MAP URL params to req.params
  server.use(restify.queryParser());

  // Compress response
  server.use(restify.gzipResponse());

  // Register custom validators
  _.extend(restifyValidation.validation._validators, restifyCustomValidators);

  // Restify parameter validation
  server.use(restifyValidation.validationPlugin({
    // Return errors as an array
    errorsAsArray: true,
    // Exclude variables not specified in validator rules
    forbidUndefinedVariables: true,
    handleError: function (res, errors, next) {
      res.json({
        success: false,
        error: errors
      });
      return next(false);
    }
  }));

  // Set up error handlers
  require('./error-handlers')(server);

  // Set up authentication
  require('../passport')(server, models, config);

  return server;
};
