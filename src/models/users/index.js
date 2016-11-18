const mongoose = require('mongoose');
const bcrypt = require('bcrypt-as-promised');
const Schema = mongoose.Schema;

module.exports = (models, config) => {
  const Users = new Schema({
    name: {
      first: {
        required: true,
        type: String
      },
      last: {
        required: true,
        type: String
      }
    },
    password: {
      required: true,
      select: false,
      type: String
    },
    email: {
      required: true,
      unique: true,
      index: true,
      select: false,
      type: String
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
    },
    pages: {
      type: [Schema.Types.ObjectId],
      ref: 'Pages'
    },
    votes: {
      type: [Schema.Types.ObjectId],
      ref: 'Votes'
    },
    likes: {
      type: [Schema.Types.ObjectId],
      ref: 'Likes'
    },
    companies: {
      type: [Schema.Types.ObjectId],
      ref: 'Companies'
    }
  }, {
    timestamps: true
  });

  Users.pre('save', function (next) {
    let user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // hash the password with a salt factor of 10
    return bcrypt.hash(user.password, 10)
      .then(hash => {
        user.password = hash; // override the user's clear text password
        next();
      });
  });

  Users.methods.comparePassword = function (password) {
    let user = this;

    return bcrypt.compare(password, user.password);
  };

  Users.methods.updatePassword = function (password) {
    let user = this;

    return user.comparePassword(password)
      .then(isMatch => {
        if (!isMatch) {
          return bcrypt.hash(password, 10)
            .then(hash => {
              user.password = hash;
              return user.save();
            });
        }
      });
  };

  Users.set('toJSON', {
    virtuals: true
  });

  return mongoose.model('Users', Users);
};
