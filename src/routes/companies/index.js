const passport = require('passport-restify');

module.exports = (server, models, config) => {
  server.post({
    'path': '/companies',
    'validation': {
      'resources': {
        'title': {
          'isRequired': true
        },
        'description': {
          'isRequired': false
        },
        'phone': {
          'isRequired': false
        },
        'website': {
          'isRequired': false
        },
        'images': {
          'isRequired': false,
          'isArray': true // TODO: This validator doesn't exist, create it
        },
        'products': {
          'isRequired': false,
          'isArray': true
        },
        'stores': {
          'isRequired': false,
          'isArray': true
        },
        'restaurants': {
          'isRequired': false,
          'isArray': true
        },
        'employees': {
          'isRequired': false,
          'isArray': true
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
