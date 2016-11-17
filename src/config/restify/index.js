const restify = require('restify');
const restifyValidation = require('node-restify-validation');

module.exports = (models, config) => {
  const server = restify.createServer({
    name: config.restify.name,
    version: config.restify.version,
    formatters: {
      'application/json': (req, res, body, cb) => {
        try {
          return cb(null, JSON.stringify(body, null, '\t'));
        } catch (err) {
          console.error(body);
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

  // Restify parameter validation
  server.use(restifyValidation.validationPlugin({
    // Shows errors as an array
    errorsAsArray: false,
    // Exclude variables not specified in validator rules
    forbidUndefinedVariables: true,
    errorHandler: restify.errors.InvalidArgumentError
  }));

  // Set up authentication
  require('../passport')(server, models, config);

  return server;
};
