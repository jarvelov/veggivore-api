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
    },
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
    },
    revision: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: 'Revisions'
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
