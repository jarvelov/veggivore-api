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
    page: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: 'Pages'
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
    images: {
      autopopulate: true,
      type: [Schema.Types.ObjectId],
      ref: 'Images'
    },
    categories: {
      autopopulate: true,
      type: [Schema.Types.ObjectId],
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
    versionKey: false,
    virtuals: true
  });

  Revisions.plugin(autopopulate);

  return mongoose.model('Revisions', Revisions);
};
