const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = (models, config) => {
  const EmbeddedContributor = new Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Users'
    },
    revision: {
      type: Schema.Types.ObjectId,
      ref: 'Revisions'
    }
  }, {
    timestamps: true
  });

  return mongoose.model('EmbeddedContributor', EmbeddedContributor);
};