const mongoose = require('mongoose');
require('mongoose-schema-extend'); // Just requiring it sets up the schema extension plugin

module.exports = (models, config) => {
  const RevisionsFacts = models.Revisions.Default.schema.extend({
    sources: {
      required: true
    }
  }, {
    timestamps: true
  });

  RevisionsFacts.set('toJSON', {
    virtuals: true
  });

  return mongoose.model('RevisionsFacts', RevisionsFacts);
};