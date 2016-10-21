import config from './config/config';

// Restify HTTP server and mongodb
const restify = require('restify');
const mongoose = require('mongoose');

// Mongoose config
mongoose.Promise = Promise;
mongoose.connect('mongodb://' + config.mongodb.host + '/' + config.mongodb.database);

// Mongoose models
const models = require('./models')();

// Restify config
const server = restify.createServer({
  name: config.restify.name,
  formatters: {
      'application/json': function(req, res, body, cb) {
          return cb(null, JSON.stringify(body, null, '\t'));
      }
  }
});

const routes = require('./routes')(server, config);

server.use(restify.acceptParser(server.acceptable));
server.use(restify.bodyParser({
  mapParams: true,
  mapFiles: false,
}));
server.use(restify.gzipResponse());
server.use(restify.queryParser());

// Start restify server
server.listen(config.restify.host.port, () => {
    console.log('server listening at %s', server.url);
});