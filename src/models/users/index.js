const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');
const bcrypt = require('bcrypt-as-promised');
const Schema = mongoose.Schema;

module.exports = (models, config) => {
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
      required: true,
      select: false
    },
    email: {
      type: String,
      required: true,
      index: true,
      unique: true
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

  Users.set('toJSON', {
    virtuals: true
  });

  Users.pre('save', function(next) {
    let user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // hash the password with a salt factor of 10
    return bcrypt.hash(user.password, 10)
      .then(hash => {
        user.password = hash; //override the user's clear text password
        next();
      });
  });

  Users.methods.comparePassword = function(password) {
    let user = this;

    return bcrypt.compare(password, user.password);
  };

  Users.methods.updatePassword = function(password) {
    let user = this;

    return user.comparePassword(password)
    .then(isMatch => {
      if(!isMatch) {
        return bcrypt.hash(password, 10)
        .then(hash => {
          user.password = hash;
          return user.save();
        });
      }
    });
  };

  return mongoose.model('Users', Users);
};