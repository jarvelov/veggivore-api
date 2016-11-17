'use strict';

// Load configuration
const config = require('./config/config');

// Mongoose
const mongoose = require('mongoose');

// Mongoose config
mongoose.Promise = Promise;
mongoose.connect('mongodb://' + config.mongodb.host + '/' + config.mongodb.database);

// Mongoose models
const models = require('./models')(config);

// Restify server
const server = require('./config/restify')(models, config);

// Set up the routes for restify server
require('./routes')(server, models, config);

// Start server
server.listen(config.restify.host.port, (err) => {
  if (err) {
    console.log(err);
    return;
  }

  let uri = 'http://localhost:' + config.restify.host.port;
  console.log('Listening at ' + uri + '\n');
});
