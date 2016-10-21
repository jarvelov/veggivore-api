const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = (models, config) => {
  const Revisions = new Schema({
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    sources: {
      type: [String],
      required: true
    },
    images: {
      type: [Schema.Types.ObjectId],
      ref: 'Images',
    },
    categories: {
      type: [Schema.Types.ObjectId],
      ref: 'Categories',
    },
    tags: {
      type: [Schema.Types.ObjectId],
      ref: 'Tags'
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true
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

  return mongoose.model('Revisions', Revisions);
};