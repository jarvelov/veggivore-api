const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');
const Schema = mongoose.Schema;

module.exports = (models, config) => {
  const Pages = new Schema({
    uri: {
      required: true,
      index: true,
      unique: true,
      type: String
    },
    user: {
      required: true,
      autopopulate: true,
      type: Schema.Types.ObjectId,
      ref: 'Users'
    },
    revision: {
      current: {
        required: true,
        autopopulate: true,
        type: Schema.Types.ObjectId,
        ref: 'Revisions'
      },
      history: {
        type: [Schema.Types.ObjectId],
        ref: 'Revisions'
      }
    },
    contributors: {
      required: true,
      type: [Schema.Types.ObjectId],
      ref: 'Contributors'
    },
    likes: {
      type: [Schema.Types.ObjectId],
      ref: 'Likes'
    },
    votes: {
      type: [Schema.Types.ObjectId],
      ref: 'Votes'
    },
    rank: {
      type: Number,
      min: 0,
      max: 5
    }
  }, {
    timestamps: true
  });

  Pages.set('toJSON', {
    versionKey: false,
    virtuals: true
  });

  Pages.plugin(autopopulate);

  return mongoose.model('Pages', Pages);
};
