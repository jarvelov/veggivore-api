const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');
const Schema = mongoose.Schema;

module.exports = (models, config) => {
  const Companies = new Schema({
    uri: {
      required: true,
      type: String
    },
    title: {
      required: true,
      type: String
    },
    description: {
      type: String
    },
    contact: {
      type: [Schema.Types.ObjectId],
      ref: 'ContactDetails'
    },
    images: {
      type: [Schema.Types.ObjectId],
      ref: 'Images'
    },
    products: {
      autopopulate: true,
      type: [Schema.Types.ObjectId],
      ref: 'Pages'
    },
    stores: {
      autopopulate: true,
      type: [Schema.Types.ObjectId],
      ref: 'Pages'
    },
    restaurants: {
      autopopulate: true,
      type: [Schema.Types.ObjectId],
      ref: 'Pages'
    },
    employees: {
      autopopulate: true,
      type: [Schema.Types.ObjectId],
      ref: 'Users'
    }
  }, {
    timestamps: true
  });

  Companies.plugin(autopopulate);

  Companies.set('toJSON', {
    virtuals: true
  });

  return mongoose.model('Companies', Companies);
};
