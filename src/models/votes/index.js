const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autopopulate = require('mongoose-autopopulate');

module.exports = (models, config) => {
  const Votes = new Schema({
    user: {
      required: true,
      type: Schema.Types.ObjectId,
      autopopulate: true,
      ref: 'Users'
    },
    page: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: 'Pages'
    },
    vote: {
      required: true,
      type: Number,
      min: 0,
      max: 5
    }
  }, {
    timestamps: true
  });

  Votes.plugin(autopopulate);

  Votes.set('toJSON', {
    versionKey: false,
    virtuals: true
  });

  return mongoose.model('Votes', Votes);
};
