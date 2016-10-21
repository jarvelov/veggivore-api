const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');
const brypt = require('bcrypt-as-promised');
const Schema = mongoose.Schema;

module.exports = (schemas, config) => {
  const Users = new Schema({
    name: {
      first: {
        type: String,
        required: true
      },
      last: {
        type: String,
        required: true
      }
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    profile: {
      description: {
        type: String
      },
      image: {
        type: Schema.Types.ObjectId,
        ref: 'Images'
      },
      website: {
        type: String
      }
    }
  }, {
    timestamps: true
  });

  Users.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // hash the password with a salt factor of 10
    return bcrypt.hash(user.password, 10)
      .then(hash => {
        user.password = hash;
        next();
      });
  });

  Users.methods.updatePassword = function(password, cb) {
    bcrypt.compare(this.password, password)
    .then(isMatch => {
      cb(isMatch);
    });
  };

  return mongoose.model('Users', Users);
};