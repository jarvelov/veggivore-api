const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autopopulate = require('mongoose-autopopulate');
require('mongoose-schema-extend'); // Just requiring it sets up the schema extension plugin

module.exports = (models, config) => {
  const RevisionsRecipes = models.Revisions.Default.schema.extend({
    type: {
      required: true,
      type: String,
      default: 'recipe',
      enum: ['recipe']
    },
    company: {
      autopopulate: true,
      type: Schema.Types.ObjectId,
      ref: 'Companies'
    },
    products: {
      autopopulate: true,
      type: [Schema.Types.ObjectId],
      ref: 'Products'
    }
  }, {
    collection: 'revisions',
    timestamps: true
  });

  RevisionsRecipes.plugin(autopopulate);

  RevisionsRecipes.set('toJSON', {
    versionKey: false,
    virtuals: true
  });

  return mongoose.model('RevisionsRecipes', RevisionsRecipes);
};
