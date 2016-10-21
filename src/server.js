'use strict';

// Load configuration
import config from './config/config';

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
const routes = require('./routes')(server, models, config);

// Start restify server
server.listen(config.restify.host.port, () => {
    console.log('server listening at %s', server.url);
});