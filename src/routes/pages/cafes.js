const restify = require('restify');
const passport = require('passport-restify');

module.exports = (server, models, config) => {

  server.post({
    'path': '/pages/cafes',
    'validation': {
      'resources': {
        'title': {
          'isRequired': true
        },
        'content': {
          'isRequired': true
        },
        'vegan': {
          'isRequired': true
        },
        'author': {
          'isRequired': true
        },
        'sources': {
          'isRequired': false,
          'isArray': true //TODO: This validator doesn't exist, create it
        },
        'tags': {
          'isRequired': false
        },
        'images': {
          'isRequired': false,
          'isArray': true //TODO: This validator doesn't exist, create it
        },
        'contact.phone': {
          'isRequired': false
        },
        'contact.website': {
          'isRequired': false
        },
        'contact.openhours.monday': {
          'isRequired': false
        },
        'contact.openhours.tuesday': {
          'isRequired': false
        },
        'contact.openhours.wednesday': {
          'isRequired': false
        },
        'contact.openhours.thursday': {
          'isRequired': false
        },
        'contact.openhours.friday': {
          'isRequired': false
        },
        'contact.openhours.saturday': {
          'isRequired': false
        },
        'contact.openhours.sunday': {
          'isRequired': false
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