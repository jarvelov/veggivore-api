const restify = require('restify');

module.exports = (server, models, config) => {

  server.post({
    'path': '/pages/products',
    'validation': {
      'resources': {
        'title': {
          'isRequired': true
        },
        'content': {
          'isRequired': true
        },
        'categories': {
          'isRequired': true
        },
        'company': {
          'isRequired': false
        },
        'tags': {
          'isRequired': false
        },
        'sources': {
          'isRequired': false,
          'isArray': true //TODO: This validator doesn't exist, create it
        },
        'images': {
          'isRequired': false,
          'isArray': true //TODO: This validator doesn't exist, create it
        },
        'anonymous': {
          'isRequired': false
        }
      }
    }
  }, (req, res, next) => {
    const revisionOptions = {
      content: req.params.content,
      categories: req.params.categories,
      user: req.user._id
    };

    const Revision = new models.Revisions.Product(revisionOptions);
    /*

    const pageOptions = {
      uri: req.params.title.toLowerCase(),
      author: req.user._id,
      contributors: [req.user._id],
      revision: {
        current: revision._id
      }
    };

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

          */
  });
};