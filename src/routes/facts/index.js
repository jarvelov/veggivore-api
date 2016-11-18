const passport = require('passport-restify');
const slug = require('slug');
const _ = require('lodash');

module.exports = (server, models, config) => {
  server.post({
    'path': '/facts',
    'validation': {
      'resources': {
        'title': {
          'isRequired': true
        },
        'content': {
          'isRequired': true
        },
        'sources': {
          'isRequired': true,
          'isArray': true // TODO: This validator doesn't exist, create it
        },
        'categories': {
          'isRequired': true,
          'isArray': true // TODO: This validator doesn't exist, create it
        },
        'tags': {
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
    const params = _.merge({}, req.params, {
      user: req.user,
      uri: slug(req.params.title, {lower: true})
    });

    return new Promise((resolve, reject) => {
      // Array to hold all the database operations that need to be performed (promises)
      const operations = [];

      // First set up the general Page object first
      const Page = new models.Pages({
        uri: params.uri,
        user: params.user.id
      });

      operations.push(Page);

      resolve(operations);
    })
    .then(operations => {
      // Then create the Revision object
      const Revision = models.Revisions.Facts({
        title: params.title,
        content: params.content,
        categories: params.categories,
        tags: params.tags,
        page: operations[0].id,
        user: params.user.id
      });

      // Set the Page object's current revision to the Revision object
      operations[0].revision = {
        current: Revision.id
      };
      // Lastly set up the sources
      Revision.sources = params.sources.map(item => {
        return new models.Embedded.Sources({
          uri: item.uri,
          label: item.label,
          user: params.user.id,
          page: operations[0].id,
          revision: Revision.id
        });
      });

      operations.push(Revision);
    })
    .then(operations => {
      // Now configure a Contributors object
      const Contributor = new models.Contributors({
        user: params.user.id,
        page: operations[0].id,
        revision: operations[1].id,
        anonymous: params.anonymous
      });

      operations.push(Contributor);

      // Then set the Contributors object to the Page object so they both refer to each other
      operations[0].contributors = [Contributor.id];

      return operations;
    })
    .then(operations => {
      operations = operations.map(o => (o.save()));
      return Promise.all(operations);
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

  server.put({
    'path': '/facts/:id',
    'validation': {
      'resources': {
        'id': {
          'isRequired': true
        },
        'title': {
          'isRequired': true
        },
        'content': {
          'isRequired': true
        },
        'sources': {
          'isRequired': true,
          'isArray': true // TODO: This validator doesn't exist, create it
        },
        'categories': {
          'isRequired': true,
          'isArray': true // TODO: This validator doesn't exist, create it
        },
        'tags': {
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
    const params = _.merge({
      tags: []
    }, req.params, {user: req.user});

    const operations = {};

    return models.Pages.findOne({
      _id: req.params.id
    })
    .then(page => {
      // Array to hold all the database operations that need to be performed (promises)
      operations.page = page;
    })
    .then(() => {
      // First create the Revision object for the update
      let revision = models.Revisions.Facts({
        title: params.title,
        content: params.content,
        page: operations.page.id,
        user: params.user.id,
        categories: params.categories,
        tags: params.tags
      });

      // Then set up the revision's sources
      revision.sources = params.sources.map(item => {
        return new models.Embedded.Sources({
          uri: item.uri,
          label: item.label,
          user: params.user.id,
          page: operations.page.id,
          revision: revision.id
        });
      });

      // Add the revision's object to be inserted
      operations.revision = revision;
    })
    .then(() => {
      // Now check if user has contributed to this page before, else create a Contributors object
      return models.Contributors.findOne({
        user: params.user.id,
        page: operations.page.id
      })
      .then(contributor => {
        if (contributor) {
          return contributor; // User's contributors object already exists
        } else {
          // Create a new contributors object for this user and page
          let contributor = new models.Contributors({
            user: params.user.id,
            page: operations.page.id,
            revision: operations.revision.id,
            anonymous: params.anonymous
          });

          // Add the Contributor object to be inserted
          operations.contributor = contributor;

          return contributor;
        }
      })
      .then(contributor => {
        // Then add the Contributors object ID to the Page object's contributors array, if it's not already there
        if (operations.page.contributors.indexOf(contributor.id) === -1) {
          operations.page.contributors.push(contributor.id);
        }
      });
    })
    .then(() => {
      let inserts = Object.keys(operations).map(k => (operations[k].save()));
      return Promise.all(inserts);
    })
    .then(() => {
      return operations.page;
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

  server.get({
    'path': '/facts',
    'validation': {
      'queries': {
        'title': {
          'isRequired': false
        },
        'uri': {
          'isRequired': false
        },
        'categories': {
          'isRequired': false,
          'isArray': true // TODO: This validator doesn't exist, create it
        },
        'tags': {
          'isRequired': false,
          'isArray': true // TODO: This validator doesn't exist, create it
        }
      }
    }
  }, passport.authenticate('jwt'), (req, res, next) => {
    const params = _.merge({}, req.params);
    const query = {};

    const filters = Object.keys(params).map(key => {
      let obj = {};
      if (params.hasOwnProperty(key) && typeof params[key] !== 'undefined' && params[key] !== null) {
        obj[key] = params[key];
      }
      return obj;
    })
    .filter(query => (query));

    if (filters.length > 0) {
      query.$and = filters;
    }

    return models.Pages.find(query)
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
