module.exports = (server, models, config) => {
  server.get('/pages/:url', (req, res, next) => {
    res.json({
      url: req.params.url
    });
  });
};