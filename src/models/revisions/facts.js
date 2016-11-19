const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-schema-extend'); // Just requiring it sets up the schema extension plugin

module.exports = (models, config) => {
  const RevisionsFacts = models.Revisions.Default.schema.extend({
    sources: {
      sources: {
        required: true,
        autopopulate: true,
        type: [Schema.Types.ObjectId],
        ref: 'Sources'
      }
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
