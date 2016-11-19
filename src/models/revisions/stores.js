const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autopopulate = require('mongoose-autopopulate');
require('mongoose-schema-extend'); // Just requiring it sets up the schema extension plugin

module.exports = (models, config) => {
  const RevisionsStore = models.Revisions.Default.schema.extend({
    type: {
      required: true,
      type: String,
      default: 'store',
      enum: ['store']
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

  RevisionsStore.plugin(autopopulate);

  RevisionsStore.set('toJSON', {
    versionKey: false,
    virtuals: true
  });

  return mongoose.model('RevisionsStore', RevisionsStore);
};
