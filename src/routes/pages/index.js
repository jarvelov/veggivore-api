const restify = require('restify');

module.exports = (server, models, config) => {

  server.del({
    path: '/pages/:url'
  }, (req, res, next) => {
    return models.Pages.remove({
        url: req.params.url
      })
      .then(result => {
        res.json({
          success: true
        });
      })
      .catch(err => {
        console.log(err);
        return next(err);
      });
  });

  server.get({
    path: '/pages/:url'
  }, (req, res, next) => {
    return models.Pages.findOne({
        url: req.params.url
      })
      .then(result => {
        if (!result) {
          throw new restify.NotFoundError('Page with URL ' + req.params.url + ' was not found');
        }
        return result;
      })
      .then(page => {
        res.json({
          url: page
        });
      })
      .catch(err => {
        return next(err);
      });
  });

  server.put({
    path: '/pages/:url'
  }, (req, res, next) => {
    return models.Pages.update({
        params: {}
      }, {
        url: req.params.url
      })
      .then(result => {
        res.json({
          success: true
        });
      })
      .catch(err => {
        console.log(err);
        return next(err);
      });
  });

  server.post({
    path: '/pages'
  }, (req, res, next) => {
    return models.Pages.insert({
        url: req.params.url
      })
      .then(result => {
        res.json({
          success: true
        });
      })
      .catch(err => {
        console.log(err);
        return next(err);
      });
  });
};