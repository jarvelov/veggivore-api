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
    return new Promise((resolve, reject) => {
      const props = _.extend({}, req.params);
      props.uri = slug(props.title, {
        lower: true
      });

      // Array to hold all the database operations that need to be performed (promises)
      const operations = [];

      // First create the Revision object
      const Revision = new models.Revisions.Facts({
        title: props.title,
        content: props.content,
        user: req.user.id
      });
      operations.push(Revision);

      // Then the general Page object
      const Page = new models.Pages({
        uri: props.uri,
        user: req.user.id,
        revision: {
          current: Revision.id
        }
      });
      operations.push(Page);

      // Update Revision object so we have attributes referring to each other both ways between Page and Revision
      Revision.page = Page.id;

      // Now configure a Contributors object
      const Contributors = new models.Contributors({
        user: req.user.id,
        page: Page.id,
        revision: Revision.id
      });
      operations.push(Contributors);

      // Then set the Contributors object to the Page object so they both refer to each other
      Page.contributors = [Contributors.id];

      // Then set up the sources, if there are any
      if (props.sources && props.sources.length > 0) {
        try {
          Revision.sources = props.sources.map(item => {
            return new models.Embedded.Sources({
              uri: item.uri,
              label: item.label,
              user: req.user.id,
              page: Page.id,
              revision: Revision.id
            });
          });
        } catch (err) {
          throw new Error(err);
        }
      }

      resolve(operations);
    })
    .then(operations => {
      operations = operations.map(o => (o.save()));
      console.log('hello');
      return Promise
        .all(operations)
        .then(result => {
          // Okay, so we've saved all the things we need, do we need to do anything else here?
          console.log(result);
        });
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
    const props = _.extend({}, req.params);
    const query = {};

    const filters = Object.keys(props).map(key => {
      let obj = {};
      if (props.hasOwnProperty(key) && typeof props[key] !== 'undefined' && props[key] !== null) {
        obj[key] = props[key];
      }
      return obj;
    })
    .filter(query => (query));

    if (filters.length > 0) {
      query.$and = filters;
    }

    return models.Pages.findOne(query)
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
