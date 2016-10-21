const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');
const Schema = mongoose.Schema;

module.exports = (models, config) => {
  const Companies = new Schema({
    title: {
      type: String
    },
    description: {
      type: String
    },
    website: {
      type: String
    },
    phone: {
      type: String
    },
    images: {
      type: [Schema.Types.ObjectId],
      ref: 'Images'
    },
    products: {
      type: [Schema.Types.ObjectId],
      ref: 'Pages',
      autopopulate: true
    },
    stores: {
      type: [Schema.Types.ObjectId],
      ref: 'Pages',
      autopopulate: true
    },
    restaurants: {
      type: [Schema.Types.ObjectId],
      ref: 'Pages',
      autopopulate: true
    },
    employees: {
      type: [Schema.Types.ObjectId],
      ref: 'Users',
      autopopulate: true
    }
  }, {
    timestamps: true
  });

  return mongoose.model('Companies', Companies);
};