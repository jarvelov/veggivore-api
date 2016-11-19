const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = (models, config) => {
  const Sources = new Schema({
    url: {
      required: true,
      type: String
    },
    label: {
      required: true,
      type: String
    }
  }, {
    timestamps: true
  });

  return Sources;
};
