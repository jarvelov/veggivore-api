const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autopopulate = require('mongoose-autopopulate');

module.exports = (models, config) => {
  const RevisionsProducts = models.Revisions.Default.schema.extend({
    type: {
      required: true,
      type: String,
      default: 'product',
      enum: ['product']
    },
    stores: {
      autopopulate: true,
      type: [Schema.Types.ObjectId],
      ref: 'Pages'
    },
    company: {
      autopopulate: true,
      type: [Schema.Types.ObjectId],
      ref: 'Companies'
    }
  }, {
    collection: 'revisions',
    timestamps: true
  });

  RevisionsProducts.plugin(autopopulate);

  RevisionsProducts.set('toJSON', {
    versionKey: false,
    virtuals: true
  });

  return mongoose.model('RevisionsProducts', RevisionsProducts);
};
