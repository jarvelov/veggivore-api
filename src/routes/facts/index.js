/**
 * @name Routes/Facts
 * @file /routes/facts/index.js
 * @module routes/facts
 */

const restify = require('restify');
const passport = require('passport-restify');
const slug = require('slug');
const _ = require('lodash');

module.exports = (server, models, config) => {
  server.post({
    path: '/facts',
    validation: {
      resources: {
        title: {
          isRequired: true
        },
        content: {
          isRequired: true
        },
        sources: {
          isRequired: true,
          isArray: true
        },
        categories: {
          isRequired: true,
          isObjectIdArray: true
        },
        tags: {
          isRequired: false,
          isObjectIdArray: true
        },
        images: {
          isRequired: false,
          isObjectIdArray: true
        },
        anonymous: {
          isRequired: false
        }
      }
    }
  }, passport.authenticate('jwt'), (req, res, next) => {
    const params = _.merge({}, req.params, {
      user: req.user,
      url: slug(req.params.title, {lower: true})
    });

    // Object to hold all the database operations that need to be performed (promises)
    const operations = {};

    return new Promise((resolve, reject) => {
      // First set up the general page object first
      let page = new models.Pages({
        url: params.url,
        user: params.user.id
      });

      operations.page = page;

      resolve();
    })
    .then(() => {
      // Then create the revision object
      let revision = models.Revisions.Facts({
        title: params.title,
        content: params.content,
        categories: params.categories,
        tags: params.tags,
        page: operations.page.id,
        user: params.user.id
      });

      // Set the page object's current revision to the revision object
      operations.page.revision = {
        current: revision.id,
        history: [revision.id]
      };
      // Lastly set up the sources
      revision.sources = params.sources.map(item => {
        return {
          url: item.url,
          label: item.label
        };
      });

      operations.revision = revision;
    })
    .then(() => {
      // Now configure a Contributors object
      let contributor = new models.Contributors({
        user: params.user.id,
        page: operations.page.id,
        revision: operations.revision.id,
        anonymous: params.anonymous
      });

      operations.contributor = contributor;

      // Then set the Contributors object to the page object so they both refer to each other
      operations.page.contributors = [contributor.id];
    })
    .then(() => {
      let inserts = Object.keys(operations).map(k => (operations[k].save()));
      return Promise.all(inserts)
      .catch(err => {
        if (err.code === 11000) {
          throw new restify.errors.BadRequestError('Title must be unique');
        } else {
          throw new restify.errors.InternalServerError('Unknown error');
        }
      });
    })
    .then(result => {
      res.json({
        success: true,
        data: result
      });
    })
    .catch(err => {
      return next(err);
    });
  });

  /**
   * Update page
   * @function
   *
   * @name update
   * @memberof: Routes/Facts/PUT
   * @version 1:
   * @param {String} title The title of the page
   * @param {String} content The page's content
   * @param {Object[]} sources Source links used in the page
   * @param {String} sources[].url - The url of the source link
   * @param {String} sources[].label - The label of the source
   * @param {String[]} categories Array of {@link Models#Categories} ID's
   * @param {String[]} tags Array of {@link Models#Tags} ID's
   * @param {String[]} images Array of {@link Models#Images} ID's
   * @param {Boolean} anonymous Whether the user should be visible
   * @returns {JSON}
   */
  server.put({
    name: 'update',
    path: '/facts/:id',
    validation: {
      resources: {
        id: {
          isRequired: true
        },
        title: {
          isRequired: true
        },
        content: {
          isRequired: true
        },
        sources: {
          isRequired: true,
          isArray: true // TODO: Write a validator for sources
        },
        categories: {
          isRequired: true,
          isObjectIdArray: true
        },
        tags: {
          isRequired: false,
          isObjectIdArray: true
        },
        images: {
          isRequired: false,
          isObjectIdArray: true
        },
        anonymous: {
          isRequired: false,
          isBoolean: true
        }
      }
    }
  }, passport.authenticate('jwt'), (req, res, next) => {
    const params = _.merge({
      tags: []
    }, req.params, {user: req.user});

    // Array to hold all the database insertions that need to be performed (should be promises)
    const operations = {};

    return models.Pages.findOne({
      _id: req.params.id
    })
    .then(page => {
      // Check if query returned our page object
      if (page) {
        operations.page = page;
      } else {
        // Else notify the user that we didn't find what we were looking for
        throw new restify.errors.NotFoundError('Page with ID ' + req.params.id + ' was not found');
      }
    })
    .then(() => {
      // First create the revision object for the update
      let revision = models.Revisions.Facts({
        title: params.title,
        content: params.content,
        page: operations.page.id,
        user: params.user.id,
        categories: params.categories,
        tags: params.tags
      });

      // Then set up the revision's sources
      revision.sources = params.sources.map((item, i) => {
        let source = {
          url: item.url,
          label: item.label
        };

        return source;
      });

      // Set the new revision object to be the page's current one
      operations.page.revision.current = revision.id;
      // Push it to the history as well
      operations.page.revision.history.push(revision.id);

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
        // Then add the Contributors object ID to the page object's contributors array, if it's not already there
        if (operations.page.contributors.indexOf(contributor.id) === -1) {
          operations.page.contributors.push(contributor.id);
        }
      });
    })
    .then(() => {
      // Save all operations to insert them to the database
      let inserts = Object.keys(operations).map(k => (operations[k].save()));
      return Promise.all(inserts);
    })
    .then(result => {
      res.json({
        success: true
      });
    })
    .catch(err => {
      return next(err);
    });
  });

  server.get({
    path: '/facts',
    validation: {
      queries: {
        title: {
          isRequired: false
        },
        url: {
          isRequired: false,
          isUrl: true
        },
        categories: {
          isRequired: false,
          isObjectIdArray: true
        },
        tags: {
          isRequired: false,
          isObjectIdArray: true
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
      return next(err);
    });
  });
};
