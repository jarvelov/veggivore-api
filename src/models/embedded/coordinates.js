const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = (models, config) => {
  const Coordinates = new Schema({
    coordinates: {
      type: [Number],
      index: '2dsphere'
    }
  }, {
    timestamps: true
  });

  return Coordinates;
};
