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
      enum: ['fact', 'product', 'recipe', 'restaurant', 'store']
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
