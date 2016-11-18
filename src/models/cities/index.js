const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = (models, config) => {
  const Cities = new Schema({
    name: {
      required: true,
      type: String
    },
    slug: {
      required: true,
      unique: true,
      index: true,
      type: String
    },
    location: {
      type: [models.Embedded.Coordinates.schema]
    }
  }, {
    timestamps: true
  });

  Cities.set('toJSON', {
    versionKey: false,
    virtuals: true
  });

  return mongoose.model('Cities', Cities);
};
