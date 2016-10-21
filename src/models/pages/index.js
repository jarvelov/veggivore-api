const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');
const Schema = mongoose.Schema;

module.exports = (models, config) => {
  const Pages = new Schema({
    uri: {
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
      current: {
        type: Schema.Types.ObjectId,
        ref: 'Revisions',
        autopopulate: true
      },
      history: {
        type: [Schema.Types.ObjectId],
        ref: 'Revisions'
      }
    },
    contributors: {
      type: [models.Embedded.Contributor.schema]
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