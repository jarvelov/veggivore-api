const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autopopulate = require('mongoose-autopopulate');

module.exports = (models, config) => {
  const Likes = new Schema({
    user: {
      required: true,
      autopopulate: true,
      type: Schema.Types.ObjectId,
      ref: 'Users'
    },
    page: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: 'Pages'
    }
  }, {
    timestamps: true
  });

  Likes.plugin(autopopulate);

  Likes.set('toJSON', {
    virtuals: true
  });

  return mongoose.model('Likes', Likes);
};
