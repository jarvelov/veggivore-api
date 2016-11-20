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

  Users.methods.pages = function (params) {
    let user = this;
    const query = {};
    const match = {};

    if (!params.created && !params.contributed) {
      return []; // You didn't want any pages anyway so why bother waste resources
    }

    if (params.created === true && params.contributed === true) {
      match.user = user.id;

      query.contributors = {
        $elemMatch: {
          user: user.id
        }
      };
    } else if (params.created === true && params.contributed === false) {
      match.user = {
        $ne: user.id
      };
    } else if (params.created === false && params.contributed === true) {
      match.user = {
        $ne: user.id
      };

      query.contributors = {
        $elemMatch: {
          user: user.id
        }
      };
    }

    return models.Pages.find(query)
    .populate({
      path: 'revision.current',
      match: match
    })
    .then(pages => {
      // Filter out results which haven't populated properly (aka didn't match query + match)
      return pages.filter(page => (page.revision.current));
    });
  };

  Users.statics.search = function (params) {
    let user = this;

    const query = {};
    let filters = Object.keys(params).map(param => {
      let obj = {};
      switch (param) {
        case 'createdAt':
        case 'updatedAt':
          obj['updatedAt'] = params[param];
          break;
        case 'name':
          let keys = ['first', 'last'];

          keys.forEach(key => {
            if (key in params[param]) {
              obj['name.' + key] = {
                $regex: new RegExp(params[param][key], 'gi')
              };
            }
          });
          break;
        default:
          obj[param] = params[param];
          break;
      }
      return obj;
    })
    .filter(filter => (filter));

    if (filters.length > 0) {
      query.$and = filters;
    }

    return user.find(query);
  };

  Users.set('toJSON', {
    versionKey: false,
    virtuals: true
  });

  return mongoose.model('Users', Users);
};
