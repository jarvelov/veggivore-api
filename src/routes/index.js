module.exports = (server, models, config) => {
  server.get('/', (req, res, next) => { // No authentication required
    res.json({
      DELETE: server.router.routes.DELETE,
      GET: server.router.routes.GET,
      POST: server.router.routes.POST,
      PUT: server.router.routes.PUT
    });
  });

  // TODO: Just do a bulk require here
  require('./users')(server, models, config);
  require('./pages')(server, models, config);

  // Require the specific page routes
  require('./cafes')(server, models, config);
  require('./facts')(server, models, config);
  require('./products')(server, models, config);
  require('./recipes')(server, models, config);
  require('./restaurants')(server, models, config);
  require('./companies')(server, models, config);
};
