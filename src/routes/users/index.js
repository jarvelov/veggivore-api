module.exports = (server, models, config) => {
  server.del({
    path: '/users/:id'
  }, (req, res, next) => {
    return models.Users.remove({
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
    path: '/users/:id'
  }, (req, res, next) => {
    return models.Users.findOne({
        id: req.params.id
      })
      .then(result => {
        if (!result) {
          throw new restify.NotFoundError('User ' + req.params.id + ' was not found');
        }
        return result;
      })
      .then(user => {
        res.json({
          user: user
        });
      })
      .catch(err => {
        return next(err);
      });
  });

  server.put({
    path: '/users/:id'
  }, (req, res, next) => {
    return models.Users.update({
        params: {}
      }, {
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

  server.post({
    path: '/users',
    validation: {
      resources: {
        name: {
          first: {
            isRequired: true
          },
          last: {
            isRequired: true
          }
        },
        password: {
          isRequired: true
        },
        email: {
          isRequired: true,
          isEmail: true
        },
        profile: {
          description: {
            isRequired: false
          },
          image: {
            isRequired: false
          },
          website: {
            isRequired: false
          }
        }
      }
    }
  }, (req, res, next) => {
    const User = new models.Users({
      name: {
        first: req.params.name.first,
        last: req.params.name.last
      },
      email: req.params.email,
      password: req.params.password
    });

    User.save()
      .then(result => {
        result = result.toObject();
        delete result.password;
        return result;
      })
      .then(user => {
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