const restify = require('restify');

module.exports = (server, models, config) => {

  server.post({
    'path': '/pages/companies',
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
          'isArray': true //TODO: This validator doesn't exist, create it
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
  }, (req, res, next) => {
    console.log(req.params);
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