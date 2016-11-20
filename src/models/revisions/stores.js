const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autopopulate = require('mongoose-autopopulate');
require('mongoose-schema-extend'); // Just requiring it sets up the schema extension plugin
const _ = require('lodash');

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
      type: models.Embedded.ContactDetails
    },
    location: {
      required: true,
      autopopulate: true,
      type: models.Embedded.Locations
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

  RevisionsStore.statics.createRevision = (params) => {
    // Grab a copy of a default revision object
    let defaultRevision = models.Revisions.Default.createRevision(params);
    // Add or modify the attributes for this revision type
    return _.extend(defaultRevision, {
      company: params.company,
      contact: {
        phones: params.phones,
        websites: params.websites
      },
      location: {
        city: params.city,
        openhours: params.openhours,
        coordinates: params.coordinates,
        address: params.address,
        zipcode: params.zipcode
      }
    });
  };

  RevisionsStore.plugin(autopopulate);

  RevisionsStore.set('toJSON', {
    versionKey: false,
    virtuals: true
  });

  return mongoose.model('RevisionsStore', RevisionsStore);
};
