const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autopopulate = require('mongoose-autopopulate');

module.exports = (models, config) => {
  const Contributors = new Schema({
    user: {
      required: true,
      autopopulate: true,
      type: Schema.Types.ObjectId,
      ref: 'Users'
    },
    anonymous: {
      required: true,
      type: Boolean,
      default: false
    }
  }, {
    timestamps: true
  });

  Contributors.plugin(autopopulate);

  Contributors.set('toJSON', {
    versionKey: false,
    virtuals: true
  });

  return Contributors;
};
