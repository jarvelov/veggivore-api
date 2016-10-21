// Dependencies
const restify = require('restify');
const config = require('./config/config');
const mongoose = require('mongoose');

// Start server
const server = restify.createServer({
  name: config.name
});

server.listen(config.host.port, function () {
    console.log('servers listening at %s', server.url);
});