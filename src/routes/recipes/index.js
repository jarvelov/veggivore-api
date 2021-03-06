const passport = require('passport-restify');

module.exports = (server, models, config) => {
  server.post({
    'path': '/recipes',
    'validation': {
      'resources': {
        'title': {
          'isRequired': true
        },
        'ingredients': {
          'isRequired': true
        },
        'content': {
          'isRequired': true
        },
        'categories': {
          'isRequired': true
        },
        'tags': {
          'isRequired': false
        },
        'sources': {
          'isRequired': false,
          'isArray': true // TODO: This validator doesn't exist, create it
        },
        'images': {
          'isRequired': false,
          'isArray': true // TODO: This validator doesn't exist, create it
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
