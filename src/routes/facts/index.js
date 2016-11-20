/**
 * @namespace Routes/Facts
 * @file /routes/facts/index.js
 * @module /routes/facts
 */

const restify = require('restify');
const passport = require('passport-restify');
const slug = require('slug');
const _ = require('lodash');
const url = require('url');

module.exports = (server, models, config) => {
  /**
   * Create fact page
   * @function
   *
   * @name create
   * @version 1
   * @method POST
   * @param {String} title The title of the page
   * @param {String} content The page's content
   * @param {ObjectId[]} categories ObjectId Array of {@link Models#Categories}
   * @param {String[]} [sources] Array of source links (urls) used in the page
   * @param {ObjectId[]} [products] ObjectId Array of {@link Models#Products}
   * @param {Object[]} [tags] ObjectId Array of {@link Models#Tags}
   * @param {ObjectId[]} [images] ObjectId Array of {@link Models#Images}
   * @param {Boolean} [anonymous=false] Whether the user should be shown as the author or among the contributors
   * @example
   * <caption>Create a fact page</caption>
   * <pre>
   * POST /facts
   * {
   *   title: {
   *     "D-vitamin",
   *   },
   *   content: {
   *     "Livsmedelsverket uppmanar alla i Sverige att äta D-vitamintillskott. Bioaktiviteten är något lägre för vitamin D2 än för vitamin D3.",
   *   },
   *   sources: ["http://www.livsmedelsverket.se/livsmedel-och-innehall/naringsamne/vitaminer-och-antioxidanter/vitamin-d/"],
   *   openhours: {
   *     monday: ["08:00","14:00","16:00','22:00']
   *   }
   * }
   * </pre>
   * @returns {JSON}
   * <caption>On success</caption>
   * <pre>
   * {
   *   "success": true,
   *   "data": "5830dce08470d31bee32d177" // The new page's ObjectId
   * }
   * </pre>
   * <caption>On failure</caption>
   * <pre>
   * {
   *   "success": false,
   *   "error": [...]
   * }
   * </pre>
   */
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
        sources: { // TODO: Write a isStringArray validator
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
      operations.page = new models.Pages({
        url: params.url,
        user: params.user.id,
        contributors: [{
          user: params.user.id,
          anonymous: params.anonymous
        }]
      });

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
      revision.sources = params.sources.map(source => {
        let hostname = url.parse(source).hostname;
        return {
          url: source,
          label: hostname
        };
      });

      operations.revision = revision;
    })
    .then(() => {
      let inserts = Object.keys(operations).map(k => (operations[k].save()));
      return Promise.all(inserts)
      .catch(err => {
        console.log(err);
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
        data: operations.page.id
      });
    })
    .catch(err => {
      console.log(err);
      return next(err);
    });
  });

  /**
   * Update page
   * @function
   *
   * @name update
   * @memberof: Routes/Facts/PUT
   * @method: PUT
   * @version 1:
   * @param {String} [title] The title of the page
   * @param {String} [content] The page's content
   * @param {String[]} [sources] Array of source links (urls) used in the page
   * @param {String[]} [categories] Array of {@link Models#Categories} ID's
   * @param {String[]} [tags] Array of {@link Models#Tags} ID's
   * @param {String[]} [images] Array of {@link Models#Images} ID's
   * @param {Boolean} [anonymous=false] Whether the user should be shown among contributors
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
          isObjectArray: {
            keys: ['url', 'label']
          }
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
      if (!page) {
        // Else notify the user that we didn't find what we were looking for
        throw new restify.errors.NotFoundError('Page with ID ' + req.params.id + ' was not found');
      } else {
        operations.page = page;

        // Check if user has contributed to this page before
        let contributed = operations.page.contributors.reduce((contributed, contributor) => {
          return contributed || contributor.id === params.user.id;
        }, false);

        // If not add user to contributors
        if (!contributed) {
          operations.page.contributors.push({
            user: params.user.id,
            anonymous: params.anonymous
          });
        }
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
        tags: params.tags,
        sources: params.sources.map(source => {
          let hostname = url.parse(source).hostname;
          return {
            url: source,
            label: hostname
          };
        })
      });

      // Set the new revision object to be the page's current one
      operations.page.revision.current = revision.id;
      // Push it to the history as well
      operations.page.revision.history.push(revision.id);
      // Add the revision's object to be inserted
      operations.revision = revision;
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
};
