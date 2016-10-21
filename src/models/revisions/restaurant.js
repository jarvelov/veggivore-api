const mongoose = require('mongoose');
const extend = require('mongoose-schema-extend');
const Schema = mongoose.Schema;

module.exports = (models, config) => {
  const RevisionsRestaurant = models.Revisions.Base.schema.extend({
    type: {
      type: String,
      default: 'restaurant'
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Companies'
    },
    vegan: {
      type: String,
      enum: ['full', 'menu', 'ask'],
      required: true
    }
  }, {
    timestamps: true
  });

  return mongoose.model('RevisionsRestaurant', RevisionsRestaurant);
};