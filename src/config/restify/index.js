const restify = require('restify');
const restifyValidation = require('node-restify-validation');

module.exports = (models, config) => {
  const server = restify.createServer({
    name: config.restify.name,
    version: config.restify.version,
    formatters: {
      'application/json': function(req, res, body, cb) {
        try {
          return cb(null, JSON.stringify(body, null, '\t'));
        } catch (err) {
          console.error(body);
        }
      }
    }
  });

  server.pre(restify.pre.sanitizePath());

  server.use(restify.acceptParser(server.acceptable));

  server.use(restify.bodyParser({
    mapParams: true,
    mapFiles: false,
  }));
  server.use(restify.queryParser());

  server.use(restify.gzipResponse());

  server.use(restifyValidation.validationPlugin({
    // Shows errors as an array
    errorsAsArray: false,
    // Not exclude incoming variables not specified in validator rules
    forbidUndefinedVariables: false,
    errorHandler: restify.errors.InvalidArgumentError
  }));

  // Set up authentication
  require('../passport')(server, models, config);

  return server;
};