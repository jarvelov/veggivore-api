const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
      type: [models.Embedded.Coordinates]
    }
  });

  return Locations;
};
