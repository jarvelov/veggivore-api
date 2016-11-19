const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autopopulate = require('mongoose-autopopulate');

module.exports = (models, config) => {
  const Sources = new Schema({
    uri: {
      required: true,
      type: String
    },
    label: {
      required: true,
      type: String
    }
  }, {
    timestamps: true
  });

  Sources.plugin(autopopulate);

  Sources.set('toJSON', {
    versionKey: false,
    virtuals: true
  });

  return mongoose.model('Sources', Sources);
};
