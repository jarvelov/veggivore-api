const mongoose = require('mongoose');
require('mongoose-schema-extend'); // Just requiring it sets up the schema extension plugin

module.exports = (models, config) => {
  const RevisionsFacts = models.Revisions.Default.schema.extend({
    type: {
      required: true,
      type: String,
      default: 'facts',
      enum: ['facts']
    },
    sources: {
      required: true,
      type: [models.Embedded.Sources]
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
