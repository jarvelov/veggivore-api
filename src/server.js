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

// Only fire up a server with webpack in watch mode when in development
if (process.env.NODE_ENV !== 'production') {
  const Webpack = require('webpack');
  const webpackConfig = require('../webpack.dev.config.js');

  // First we fire up Webpack and pass in the configuration
  const compiler = Webpack(webpackConfig);

  const devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true,
      chunks: false
    }
  });

  // serve webpack bundle output
  server.use(devMiddleware);
}

// Start server
module.exports = server.listen(config.restify.host.port, function (err) {
  if (err) {
    console.log(err);
    return;
  }

  let uri = 'http://localhost:' + config.restify.host.port;
  console.log('Listening at ' + uri + '\n');
});
