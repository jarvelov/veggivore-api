const restify = require('restify');
const passport = require('passport-restify');

module.exports = (server, models, config) => {

  server.post({
    'path': '/pages/facts',
    'validation': {
      'resources': {
        'title': {
          'isRequired': true
        },
        'content': {
          'isRequired': true
        },
        'sources': {
          'isRequired': false,
          'isArray': true //TODO: This validator doesn't exist, create it
        },
        'categories': {
          'isRequired': true
        },
        'tags': {
          'isRequired': false
        },
        'images': {
          'isRequired': false,
          'isArray': true //TODO: This validator doesn't exist, create it
        },
        'anonymous': {
          'isRequired': false
        }
      }
    }
  }, passport.authenticate('jwt'), (req, res, next) => {
    const Page = new models.Pages(req.params);
    return Page.save()
      .then(result => {
        res.json({
          success: true,
          data: result
        });
      })
      .catch(err => {
        console.log(err);
        return next(err);
      });
  });
};