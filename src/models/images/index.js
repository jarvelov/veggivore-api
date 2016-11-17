const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');
const Schema = mongoose.Schema;

module.exports = (models, config) => {
  const Images = new Schema({
    uri: {
      required: true,
      type: String
    },
    user: {
      required: true,
      autopopulate: true,
      type: [Schema.Types.ObjectId],
      ref: 'Users'
    },
    title: {
      type: String
    },
    description: {
      type: String
    },
    contributors: {
      type: [Schema.Types.ObjectId],
      ref: 'Contributors'
    }
  }, {
    timestamps: true
  });

  Images.plugin(autopopulate);

  Images.set('toJSON', {
    virtuals: true
  });

  return mongoose.model('Images', Images);
};
