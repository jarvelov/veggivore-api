const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = (models, config) => {
  const ContactDetails = new Schema({
    phones: {
      type: [{
        type: String,
        enum: ['mobile', 'landline']
      }, {
        number: {
          type: String
        }
      }]
    },
    websites: {
      type: [String]
    }
  });

  ContactDetails.set('toJSON', {
    versionKey: false,
    virtuals: true
  });

  return ContactDetails;
};
