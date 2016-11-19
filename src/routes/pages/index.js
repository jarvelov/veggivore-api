const restify = require('restify');
const passport = require('passport-restify');

module.exports = (server, models, config) => {
  // Delete a page

  server.del({
    path: '/pages/:url',
    validation: {
      id: {
        isRequired: true
      }
    }
  }, passport.authenticate('jwt'), (req, res, next) => {
    return models.Pages
      .remove({
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

  // Get all pages
  server.get({
    path: '/pages'
  }, (req, res, next) => { // No authentication required
    return models.Pages
      .find({})
      .then(result => {
        if (!result) {
          throw new restify.NotFoundError('No pages were found in the database!');
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

  // Get a page
  server.get({
    path: '/pages/:url',
    validation: {
      resources: {
        url: {
          isRequired: true
        }
      }
    }
  }, (req, res, next) => { // No authentication required
    return models.Pages
      .findOne({
        url: req.params.url
      })
      .then(result => {
        if (!result) {
          throw new restify.NotFoundError('Page with url ' + req.params.url + ' was not found');
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
    path: '/pages/:url',
    validation: {
      resources: {
        url: {
          isRequired: true
        }
      }
    }
  }, passport.authenticate('jwt'), (req, res, next) => {
    return models.Pages
      .update({
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
};
