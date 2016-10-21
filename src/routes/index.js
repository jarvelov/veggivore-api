module.exports = (server, models, config) => {
  server.get('/', (req, res, next) => {
    res.json({
      DELETE: server.router.routes.DELETE,
      GET: server.router.routes.GET,
      POST: server.router.routes.POST,
      PUT: server.router.routes.PUT
    });
  });

  //TODO: Just do a bulk require here
  require('./pages')(server, models, config);
};