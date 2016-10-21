import config from './config/config';
const models = require('./models')(config);


// Restify HTTP server and mongodb
const restify = require('restify');
const restifyValidation = require('node-restify-validation');
const mongoose = require('mongoose');

// Mongoose config
mongoose.Promise = Promise;
mongoose.connect('mongodb://' + config.mongodb.host + '/' + config.mongodb.database);

// Mongoose models

// Restify config
const server = restify.createServer({
  name: config.restify.name,
  version: config.restify.version,
  formatters: {
      'application/json': function(req, res, body, cb) {
          //console.log(body);
          return cb(null, JSON.stringify(body, null, '\t'));
      }
  }
});

server.pre(restify.pre.sanitizePath());
server.use(restify.queryParser());
server.use(restify.acceptParser(server.acceptable));
server.use(restify.bodyParser({
  mapParams: true,
  mapFiles: false,
}));
server.use(restify.gzipResponse());

server.use(restifyValidation.validationPlugin( {
    // Shows errors as an array
    errorsAsArray: false,
    // Not exclude incoming variables not specified in validator rules
    forbidUndefinedVariables: false,
    errorHandler: restify.errors.InvalidArgumentError
}));

// Set up the routes
const routes = require('./routes')(server, models, config);

// Start restify server
server.listen(config.restify.host.port, () => {
    console.log('server listening at %s', server.url);
});