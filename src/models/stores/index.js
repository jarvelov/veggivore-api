const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');
const Schema = mongoose.Schema;

module.exports = (models, config) => {
  const Stores = new Schema({
    title: {
      required: true,
      type: String
    },
    description: {
      type: String
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
    contact: {
      autopopulate: true,
      type: [models.Embedded.ContactDetails]
    },
    locations: {
      autopopulate: true,
      type: [Schema.Types.ObjectId],
      ref: 'Locations'
    }
  }, {
    timestamps: true
  });

  Stores.plugin(autopopulate);

  Stores.set('toJSON', {
    versionKey: false,
    virtuals: true
  });

  return mongoose.model('Stores', Stores);
};
