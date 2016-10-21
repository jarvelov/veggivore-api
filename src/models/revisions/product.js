const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');
const Schema = mongoose.Schema;

module.exports = (models, config) => {
  const RevisionsProduct = models.Revisions.Base.schema.extend({
    type: {
      type: String,
      default: 'product'
    },
    availability: {
      type: [Schema.Types.ObjectId],
      ref: 'Pages'
    },
    company: {
      type: [Schema.Types.ObjectId],
      ref: 'Companies'
    }
  }, {
    timestamps: true
  });

  return mongoose.model('RevisionsProduct', RevisionsProduct);
};