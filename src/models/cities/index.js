const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = (models, config) => {
  const Cities = new Schema({
    name: {
      type: String
    }
  }, {
    timestamps: true
  });

  Cities.set('toJSON', {
    virtuals: true
  });

  return mongoose.model('Cities', Cities);
};
