// Dependencies
import { restify } from 'restify';

// Start server
const server = restify.createServer({
  name: 'MyApp'
});

server.listen(8080);
