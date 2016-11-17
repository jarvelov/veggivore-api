const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autopopulate = require('mongoose-autopopulate');

module.exports = (models, config) => {
  const Sources = new Schema({
    user: {
      autopopulate: true,
      type: Schema.Types.ObjectId,
      ref: 'Users'
    },
    page: {
      type: Schema.Types.ObjectId,
      ref: 'Pages'
    },
    revision: {
      type: Schema.Types.ObjectId,
      ref: 'Revisions'
    }
  }, {
    timestamps: true
  });

  Sources.plugin(autopopulate);

  Sources.set('toJSON', {
    virtuals: true
  });

  return mongoose.model('Sources', Sources);
};
