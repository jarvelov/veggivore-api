const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autopopulate = require('mongoose-autopopulate');

module.exports = (models, config) => {
  const Events = new Schema({
    user: {
      required: true,
      autopopulate: true,
      type: Schema.Types.ObjectId,
      ref: 'Users'
    }
  }, {
    timestamps: true
  });

  Events.plugin(autopopulate);

  Events.set('toJSON', {
    versionKey: false,
    virtuals: true
  });

  return mongoose.model('Events', Events);
};
