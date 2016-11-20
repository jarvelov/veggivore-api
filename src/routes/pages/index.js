/**
 * @namespace Routes/Pages
 * @file /routes/pages/index.js
 * @module /routes/pages
 */

const restify = require('restify');
const passport = require('passport-restify');
const _ = require('lodash');

module.exports = (server, models, config) => {
  /**
   * Get pages
   *
   * Use the resources parameters to filter the result.
   * Multiple parameters are joined with <code>$and</code> clauses
   * @function
   *
   * @version 1
   * @method POST
   * @param {ObjectId[]} [id] ObjectId's Array of [pages]{@link Models#Pages}
   * @param {String} [title] Page title
   * @param {String} [url] Page url
   * @param {String} [content] Page content. Will be queried case insensitively and globally with <code>RegExp('content', 'ig')</code>
   * @param {ObjectId[]} [categories] Page categories
   * @param {ObjectId[]} [tags] Page tags
   * @return {JSON}
   * <caption>On success</caption>
   * <pre>
   * {
   *   "success": true,
   *   "data": [...]
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
    name: 'getPages',
    path: '/pages',
    validation: {
      queries: {
        title: {
          isRequired: false
        },
        url: {
          isRequired: false
        },
        content: {
          isRequired: false
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

    return models.Pages.search(params)
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
   * Delete page.
   *
   * @version 1
   * @method DELETE
   * @param {ObjectId} [id] ObjectId of [page]{@link Models#Pages}
   * @return {JSON}
   * <caption>On success</caption>
   * <pre>
   * {
   *   "success": true
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
  server.del({
    name: 'deletePage',
    path: '/pages/:id',
    resources: {
      id: {
        isRequired: true,
        isObjectId: true
      }
    }
  }, passport.authenticate('jwt'), (req, res, next) => {
    return models.Pages.find({
      _id: req.params.id
    })
    .then(page => {
      if (page) {
        page.removed = true;
        return page.save();
      } else {
        throw new restify.errors.NotFoundError('Page with ID ' + req.params.id + ' was not found');
      }
    })
    .then(result => {
      return res.json({
        success: true,
        data: result
      });
    })
    .catch(err => {
      return next(err);
    });
  });

  // Get a page
  server.get({
    name: 'getPage',
    path: '/pages/:url',
    validation: {
      resources: {
        url: {
          isRequired: true
        }
      }
    }
  }, (req, res, next) => { // No authentication required
    return models.Pages
      .findOne({
        url: req.params.url,
        published: true,
        removed: false
      })
      .then(result => {
        if (!result) {
          throw new restify.NotFoundError('Page with url ' + req.params.url + ' was not found');
        }
        return result;
      })
      .then(page => {
        res.json({
          success: true,
          data: page
        });
      })
      .catch(err => {
        return next(err);
      });
  });
};
