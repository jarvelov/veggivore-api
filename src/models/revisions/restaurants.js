const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autopopulate = require('mongoose-autopopulate');
require('mongoose-schema-extend'); // Just requiring it sets up the schema extension plugin

module.exports = (models, config) => {
  const RevisionsRestaurants = models.Revisions.Default.schema.extend({
    type: {
      required: true,
      type: String,
      default: 'restaurant',
      enum: ['restaurant']
    },
    contact: {
      required: true,
      autopopulate: true,
      type: models.Embedded.ContactDetails.schema
    },
    location: {
      required: true,
      autopopulate: true,
      type: models.Embedded.Locations.schema
    },
    availability: {
      required: true,
      type: String,
      enum: ['full', 'menu', 'ask']
    },
    company: {
      autopopulate: true,
      type: Schema.Types.ObjectId,
      ref: 'Companies'
    }
  }, {
    timestamps: true
  });

  RevisionsRestaurants.plugin(autopopulate);

  RevisionsRestaurants.set('toJSON', {
    virtuals: true
  });

  return mongoose.model('RevisionsRestaurants', RevisionsRestaurants);
};
