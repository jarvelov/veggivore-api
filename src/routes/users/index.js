const restify = require('restify');
const passport = require('passport-restify');

module.exports = (server, models, config) => {
  server.del({
    'path': '/users/:id'
  }, passport.authenticate('jwt'), (req, res, next) => {
    return models.Users
      .remove({
        id: req.params.id
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
    'path': '/users',
    'validation': {
      'queries': {
        'name': {
          'first': {
            'isRequired': false
          },
          'last': {
            'isRequired': false
          }
        },
        'email': {
          'isRequired': false,
          'isEmail': true
        },
        'createdAt': {
          'isRequired': false,
          isDate: true
        },
        'updatedAt': {
          'isRequired': false,
          isDate: true
        }
      }
    }
  }, passport.authenticate('jwt'), (req, res, next) => {
    console.log(req.params);
    return models.Users
      .find({
        id: req.params.id
      })
      .then(result => {
        if (!result) {
          throw new restify.NotFoundError('No users where found');
        }
        return result;
      })
      .then(users => {
        res.json({
          success: true,
          data: users
        });
      })
      .catch(err => {
        return next(err);
      });
  });

  server.get({
    'path': '/users/:id',
    'validation': {
      'resources': {
        'id': {
          'isRequired': true
        }
      }
    }
  }, (req, res, next) => {
    return models.Users
      .findOne({
        id: req.params.id
      })
      .then(result => {
        if (!result) {
          throw new restify.NotFoundError('No user was found');
        }
        return result;
      })
      .then(user => {
        res.json({
          success: true,
          data: user
        });
      })
      .catch(err => {
        return next(err);
      });
  });

  server.put({
    'path': '/users/:id',
    'validation': {
      'resources': {
        'id': {
          'isRequired': true
        },
        'name': {
          'first': {
            'isRequired': false
          },
          'last': {
            'isRequired': false
          }
        },
        'password': {
          'isRequired': false
        },
        'email': {
          'isRequired': false,
          'isEmail': true
        },
        'profile': {
          'description': {
            'isRequired': false
          },
          'image': {
            'isRequired': false
          },
          'website': {
            'isRequired': false
          }
        }
      }
    }
  }, passport.authenticate('jwt'), (req, res, next) => {
    return models.Users
      .update({
        'params': {}
      }, {
        id: req.params.id
      })
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

  server.post({
    'path': '/users',
    'validation': {
      'resources': {
        'name': {
          'first': {
            'isRequired': true
          },
          'last': {
            'isRequired': true
          }
        },
        'password': {
          'isRequired': true
        },
        'email': {
          'isRequired': true,
          'isEmail': true
        },
        'profile': {
          'description': {
            'isRequired': false
          },
          'image': {
            'isRequired': false
          },
          'website': {
            'isRequired': false
          }
        }
      }
    }
  }, (req, res, next) => { // No authentication required
    const User = new models.Users({
      name: {
        first: req.params.name.first,
        last: req.params.name.last
      },
      email: req.params.email,
      password: req.params.password
    });

    return User.save()
      .then(result => {
        // We don't want to expose the password, remove it before sending
        result = result.toObject();
        delete result.password;
        return result;
      })
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
