// Dependencies
const restify = require('restify');
const config = require('./config/config');
const mongoose = require('mongoose');

// Start server
const server = restify.createServer({
  name: 'MyApp'
});

server.listen(8080, function () {
    console.log('servers listening at %s', server.url);
});