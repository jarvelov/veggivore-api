const _ = require('lodash');
const slug = require('slug');
const restify = require('restify');

const mongooseErrorHandler = (err) => {
  // Duplicate key found or mongoose validation error
  if (err.code === 11000 || (err.name === 'ValidationError')) {
    throw new restify.errors.BadRequestError(err.message);
  } else {
    throw new restify.errors.InternalServerError(err.message);
  }
};

module.exports = (models, config) => {
  const module = {};

  module.search = function (params) {
    const query = Object.keys(params).reduce((query, key) => {
      if (params.hasOwnProperty(key) && typeof params[key] !== 'undefined' && params[key] !== null) {
        switch (key) {
          case 'id':
          case 'categories':
          case 'tags':
            query[key] = {
              $in: params[key]
            };
            break;
          case 'content':
            query[key] = {
              $regex: new RegExp(params[key], 'ig')
            };
            break;
          default:
            query[key] = params[key];
        }
      }
      return query;
    }, {});

    return this.find({
      $and: [{
        published: {
          $eq: true
        }
      }, {
        removed: {
          $eq: false
        }
      }]
    })
    .populate({
      path: 'revision.current',
      match: query
    })
    .then(result => {
      return result.filter(page => (page.revision.current !== null));
    });
  };

  module.createPage = function (params, modelName) {
    // The model determines Which type of page we are creating
    const model = _.capitalize(modelName);
    // Object to hold all the database operations that need to be performed (promises)
    const operations = {};

    // First grab a general page object
    operations.page = new models.Pages({
      url: slug(params.title, { lower: true }),
      user: params.user.id,
      contributors: [{
        user: params.user.id,
        anonymous: params.anonymous
      }]
    });

    params.page = operations.page;

    // Then create the revision object
    operations.revision = models.Revisions[model].createRevision(params);

    // Set the page object's current revision to the revision object
    operations.page.revision = {
      current: operations.revision.id,
      history: [operations.revision.id]
    };

    // Now save everyhing to the database
    let inserts = Object.keys(operations).map(k => (operations[k].save()));

    return Promise.all(inserts)
    .catch(mongooseErrorHandler);
  };

  module.updatePage = function (params, modelName) {
    // The model determines Which type of page we are creating
    const model = _.capitalize(modelName);
    // Array to hold all the database insertions that need to be performed (should be promises)
    const operations = {};

    return models.Pages.findOne({
      _id: params.id
    })
    .then(page => {
      // Check if query returned our page object
      if (!page) {
        // Notify the user that we didn't find what we were looking for
        throw new restify.errors.NotFoundError('Page with ID ' + params.id + ' was not found');
      } else {
        operations.page = page;
        params.page = page;

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
      // Create the revision object by merging the current revision with the new revision data
      let revision = _.extend(operations.page.revision.current, models.Revisions[model].createRevision(params));

      // Then turn it into the mongoose model
      // And add the revision's object to be inserted
      operations.revision = new models.Revisions[model](revision);

      // Set the new revision object to be the page's current one
      operations.page.revision.current = operations.revision.id;
      // Push it to the history as well
      operations.page.revision.history.push(operations.revision.id);
    })
    .then(() => {
      // Save all operations to insert them to the database
      let inserts = Object.keys(operations).map(k => (operations[k].save()));
      return Promise.all(inserts)
      .catch(mongooseErrorHandler);
    });
  };

  return module;
};
