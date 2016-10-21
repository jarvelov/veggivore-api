const restify = require('restify');
const passport = require('passport-restify');

module.exports = (server, models, config) => {

  // Delete a page

  server.del({
    path: '/pages/:uri',
    validation: {
      id: {
        isRequired: true
      }
    }
  }, passport.authenticate('jwt'), (req, res, next) => {
    return models.Pages.remove({
        uri: req.params.uri
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

  // Get a page

  server.get({
    path: '/pages/:uri',
    validation: {
      uri: {
        isRequired: true
      }
    }
  }, (req, res, next) => { //No authentication required
    return models.Pages.findOne({
        uri: req.params.uri
      })
      .then(result => {
        if (!result) {
          throw new restify.NotFoundError('Page with URI ' + req.params.uri + ' was not found');
        }
        return result;
      })
      .then(page => {
        res.json({
          success: true,
          data: page
        });
      })
      .catch(err => {
        return next(err);
      });
  });

  // Update a page

  server.put({
    path: '/pages/:uri',
    validation: {
      resources: {
        uri: {
          isRequired: true
        }
      }
    }
  }, passport.authenticate('jwt'), (req, res, next) => {
    return models.Pages.update({
        params: {}
      }, {
        uri: req.params.uri
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

  // Require the specific pages

  require('./cafes')(server, models, config);
  require('./facts')(server, models, config);
  require('./products')(server, models, config);
  require('./recipes')(server, models, config);
  require('./restaurants')(server, models, config);
  require('./companies')(server, models, config);
};