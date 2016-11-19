const mongoose = require('mongoose');
require('mongoose-schema-extend'); // Just requiring it sets up the schema extension plugin

module.exports = (models, config) => {
  const RevisionsFacts = models.Revisions.Default.schema.extend({
    sources: {
      required: true,
      type: [models.Embedded.Sources.schema]
    }
  }, {
    collection: 'revisions',
    timestamps: true
  });

  RevisionsFacts.set('toJSON', {
    versionKey: false,
    virtuals: true
  });

  return mongoose.model('RevisionsFacts', RevisionsFacts);
};
