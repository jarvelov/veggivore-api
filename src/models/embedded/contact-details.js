const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = (models, config) => {
  const ContactDetails = new Schema({
    phone: {
      type: [String]
    },
    website: {
      type: [String]
    },
    openhours: {
      monday: {
        type: [String]
      },
      tuesday: {
        type: [String]
      },
      wednesday: {
        type: [String]
      },
      thursday: {
        type: [String]
      },
      friday: {
        type: [String]
      },
      saturday: {
        type: [String]
      },
      sunday: {
        type: [String]
      }
    }
  });

  return ContactDetails;
};
