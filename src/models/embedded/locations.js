const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = (models, config) => {
  const Locations = new Schema({
    city: {
      required: true,
      autopopulate: true,
      type: Schema.Types.ObjectId,
      ref: 'Cities'
    },
    address: {
      required: true,
      type: String
    },
    geocode: {
      required: true,
      type: [Number],
      index: '2dsphere'
    },
    zipcode: {
      type: Number
    },
    openhours: {
      monday: {
        type: [String]
      },
      tuesday: {
        type: [String]
      },
      wednesday: {
        type: [String]
      },
      thursday: {
        type: [String]
      },
      friday: {
        type: [String]
      },
      saturday: {
        type: [String]
      },
      sunday: {
        type: [String]
      }
    }
  });

  Locations.set('toJSON', {
    versionKey: false,
    virtuals: true
  });

  return Locations;
};
