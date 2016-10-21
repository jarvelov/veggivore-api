const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');
const Schema = mongoose.Schema;

module.exports = (schemas, config) => {
  const Pages = new Schema({
    url: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Users',
      autopopulate: true
    }
  }, {
    timestamps: true
  });

  return mongoose.model('Pages', Pages);
};