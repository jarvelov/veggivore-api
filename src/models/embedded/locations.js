const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autopopulate = require('mongoose-autopopulate');

module.exports = (models, config) => {
  const Locations = new Schema({
    city: {
      autopopulate: true,
      type: Schema.Types.ObjectId,
      ref: 'Cities'
    },
    address: {
      type: String
    },
    zipcode: {
      type: Number
    },
    coordinates: {
      latitude: {
        type: Number
      },
      longitude: {
        type: Number
      }
    }
  });

  Locations.plugin(autopopulate);

  Locations.set('toJSON', {
    virtuals: true
  });

  return mongoose.model('Locations', Locations);
};
