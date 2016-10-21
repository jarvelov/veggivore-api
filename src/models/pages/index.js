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
    },
    revision: {
      type: Schema.Types.ObjectId,
      ref: 'Revisions'
    },
    meta: {
      likes: {
        type: [Schema.Types.ObjectId],
        ref: 'Likes'
      },
      votes: {
        type: [Schema.Types.ObjectId],
        ref: 'Votes'
      },
      rating: {
        type: Number
      }
    }
  }, {
    timestamps: true
  });

  Pages.set('toJSON', {
    virtuals: true
  });

  return mongoose.model('Pages', Pages);
};