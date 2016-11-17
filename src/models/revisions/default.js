const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autopopulate = require('mongoose-autopopulate');

module.exports = (models, config) => {
  const Revisions = new Schema({
    title: {
      required: true,
      type: String
    },
    content: {
      required: true,
      type: String
    },
    sources: {
      autopopulate: true,
      type: [Schema.Types.ObjectId],
      ref: 'Sources'
    },
    user: {
      required: true,
      autopopulate: true,
      type: Schema.Types.ObjectId,
      ref: 'Users'
    },
    contributors: {
      required: true,
      autopopulate: true,
      type: [Schema.Types.ObjectId],
      ref: 'Contributors'
    },
    images: {
      autopopulate: true,
      type: [Schema.Types.ObjectId],
      ref: 'Images'
    },
    categories: {
      type: [Schema.Types.ObjectId],
      autopopulate: true,
      ref: 'Categories'
    },
    tags: {
      autopopulate: true,
      type: [Schema.Types.ObjectId],
      ref: 'Tags'
    },
    anonymous: {
      type: Boolean,
      default: false
    }
  }, {
    timestamps: true
  });

  Revisions.set('toJSON', {
    virtuals: true
  });

  Revisions.plugin(autopopulate);

  return mongoose.model('Revisions', Revisions);
};
