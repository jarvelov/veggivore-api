var restify = require('restify'),
fs = require('fs');

var server = restify.createServer({
  certificate: fs.readFileSync('path/to/server/certificate'),
  key: fs.readFileSync('path/to/server/key'),
  name: 'MyApp',
});

server.listen(8080);
