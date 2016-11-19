const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');
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

  Coordinates.plugin(autopopulate);

  Coordinates.set('toJSON', {
    versionKey: false,
    virtuals: true
  });

  return mongoose.model('Coordinates', Coordinates);
};
