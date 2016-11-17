const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = (models, config) => {
  const Tags = new Schema({
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

  Tags.set('toJSON', {
    virtuals: true
  });

  return mongoose.model('Tags', Tags);
};
