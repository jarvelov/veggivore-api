const Schema = require('mongoose').Schema;
const autopopulate = require('mongoose-autopopulate');

module.exports = (models, config) => {
  const Pages = new Schema({
    url: {
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
        autopopulate: false,
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
      type: [models.Embedded.Contributors]
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
    },
    published: {
      type: Boolean,
      default: false
    },
    removed: {
      type: Boolean,
      default: false
    }
  }, {
    timestamps: true
  });

  Pages.set('toJSON', {
    versionKey: false,
    virtuals: true
  });

  Pages.plugin(autopopulate);

  return Pages;
};
