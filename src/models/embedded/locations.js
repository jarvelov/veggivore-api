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
    location: {
      type: [models.Embedded.Coordinates.schema]
    }
  });

  Locations.plugin(autopopulate);

  Locations.set('toJSON', {
    versionKey: false,
    virtuals: true
  });

  return mongoose.model('Locations', Locations);
};
