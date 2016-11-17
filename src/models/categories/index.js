const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = (models, config) => {
  const Categories = new Schema({
    name: {
      required: true,
      type: String
    },
    slug: {
      required: true,
      type: String
    }
  }, {
    timestamps: true
  });

  Categories.set('toJSON', {
    virtuals: true
  });

  return mongoose.model('Categories', Categories);
};
