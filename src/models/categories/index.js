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
      unique: true,
      index: true,
      type: String
    },
    type: {
      required: true,
      type: String,
      enum: ['facts', 'products', 'recipes', 'restaurants', 'stores']
    }
  }, {
    timestamps: true
  });

  Categories.set('toJSON', {
    versionKey: false,
    virtuals: true
  });

  return mongoose.model('Categories', Categories);
};
