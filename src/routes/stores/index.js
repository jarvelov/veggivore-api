/**
 * @namespace Routes/Stores
 * @file /routes/stores/index.js
 * @module /routes/stores
 */

const passport = require('passport-restify');
const _ = require('lodash');

module.exports = (server, models, config) => {
  /**
   * Create store page
   * @function
   *
   * @version 1
   * @method POST
   * @param {String} title The title of the page
   * @param {String} content The page's content
   * @param {ObjectId[]} categories Array of {@link Models#Categories} ID's
   * @param {ObjectId} city The ObjectId of the store's [city]{@link Models#cities}
   * @param {String} address The address of the store
   * @param {Number[]} coordinates Geocoordinates of the store's location
   * @param {Number} coordinates[].0 Longitude geocoordinate
   * @param {Number} coordinates[].1 Latitude geocoordinate
   * @param {String[]} [sources] Array of source links (urls) used in the page
   * @param {String[]} [phones] Array of phone numbers
   * @param {String[]} [websites] Array of urls
   * @param {Object[]} [openhours] Object with each property being an Array of days with time intervals. The first item in the array will be interpreted as the opening time, and the following as the closing time. This continues until the array is traversed.
   * @param {String[]|Boolean} [openhours[].monday] Example: <code>["08:00","12:00"]</code>
   * @param {String[]|Boolean} [openhours[].tuesday] ^
   * @param {String[]|Boolean} [openhours[].wednesday] ^
   * @param {String[]|Boolean} [openhours[].thursday] ^
   * @param {String[]|Boolean} [openhours[].friday] ^
   * @param {String[]|Boolean} [openhours[].saturday] ^
   * @param {String[]|Boolean} [openhours[].sunday] ^
   * @param {String} [zipcode] zip (postal) code of the store
   * @param {ObjectId} [company] ObjectId for a [company]{@link Models#Company}
   * @param {ObjectId[]} [products] ObjectId Array of {@link Models#Products}
   * @param {Object[]} [tags] ObjectId Array of {@link Models#Tags}
   * @param {ObjectId[]} [images] ObjectId Array of {@link Models#Images}
   * @param {Boolean} [anonymous=true] Whether the user should be shown as the author or among the contributors
   * @example
   * <caption>Create a store page</caption>
   * <pre>
   * POST /stores
   * {
   *   title: {
   *    "Kakbutiken i Gävle",
   *   },
   *   content: {
   *    "Det finns flera kakor i Kakbutiken i Gävle, både mjuka och hårda",
   *   },
   *   openhours: {
   *     monday: ["08:00","14:00","16:00','22:00']
   *   }
   * }
   * </pre>
   * @returns {JSON}
   * <caption>On success</caption>
   * <pre>
   * {
   *   "success": true,
   *   "data": {...} // The new page's document
   * }
   * </pre>
   * <caption>On failure</caption>
   * <pre>
   * {
   *   "success": false,
   *   "error": [...]
   * }
   * </pre>
   */
  server.post({
    path: '/stores',
    name: 'createStore',
    validation: {
      content: {
        title: {
          isRequired: true
        },
        content: {
          isRequired: true
        },
        categories: {
          isRequired: true,
          isObjectIdArray: true
        },
        city: {
          isRequired: true,
          isObjectId: true
        },
        address: {
          isRequired: true
        },
        coordinates: {
          isRequired: true,
          isArray: true // TODO Write an isCoordinates validator
        },
        sources: {
          isRequired: false,
          isObjectArray: {
            keys: ['url', 'label']
          }
        },
        phones: {
          isRequired: false,
          isArray: true
        },
        websites: {
          isRequired: false,
          isArray: true
        },
        openhours: {
          isRequired: false,
          isObjectArray: {
            keys: [
              'monday',
              'tuesday',
              'wednesday',
              'thursday',
              'friday',
              'saturday',
              'sunday'
            ]
          }
        },
        zipcode: {
          isRequired: false,
          isNumber: true
        },
        company: {
          isRequired: false,
          isObjectId: true
        },
        products: {
          isRequired: false,
          isObjectId: true
        },
        tags: {
          isRequired: false,
          isObjectIdArray: true
        },
        images: {
          isRequired: false,
          isObjectIdArray: true
        },
        anonymous: {
          isRequired: false
        }
      }
    }
  }, passport.authenticate('jwt'), (req, res, next) => {
    const params = _.merge({}, req.params, {
      user: req.user
    });

    return models.Pages.createPage(params, 'stores')
    .then(result => {
      res.json({
        success: true,
        data: result
      });
    })
    .catch(err => {
      return next(err);
    });
  });

  /**
   * Update store page
   * @function
   *
   * @version 1
   * @method PUT
   * @param {ObjectId} id ObjectId for the [page][@link Models#Pages] to update
   * @param {String} [title] The title of the page
   * @param {String} [content] The page's content
   * @param {String[]} [sources] Array of source links (urls) used in the page
   * @param {String[]} [categories] Array of {@link Models#Categories} ID's
   * @param {String} [city] The ObjectId of the store's [city]{@link Models#cities}
   * @param {String} [address] The address of the store
   * @param {String[]} [coordinates] Geocoordinates of the store's location
   * @param {String} [coordinates[].0] Longitude geocoordinate
   * @param {String} [coordinates[].1] Latitude geocoordinate
   * @param {String[]} [phones] Array of phone numbers
   * @param {String[]} [websites] Array of urls
   * @param {Object[]} [openhours] Object with each property being an Array of days with time intervals. The first item in the array will be interpreted as the opening time, and the following as the closing time. This continues until the array is traversed.
   * @param {String[]|Boolean} [openhours[].monday] Example: <code>["08:00","12:00"]</code>
   * @param {String[]|Boolean} [openhours[].tuesday] ^
   * @param {String[]|Boolean} [openhours[].wednesday] ^
   * @param {String[]|Boolean} [openhours[].thursday] ^
   * @param {String[]|Boolean} [openhours[].friday] ^
   * @param {String[]|Boolean} [openhours[].saturday] ^
   * @param {String[]|Boolean} [openhours[].sunday] ^
   * @param {String} [zipcode] zip code of the store
   * @param {String} [company] ObjectId for a [company]{@link Models#Company}
   * @param {String[]} [products] ObjectId Array of {@link Models#Products}
   * @param {String[]} [tags] ObjectId Array of {@link Models#Tags}
   * @param {String[]} [images] ObjectId Array of {@link Models#Images}
   * @param {Boolean} anonymous Whether the user should be shown among the contributors
   * @example
   * <caption>Update a store's open hours on mondays.</caption>
   * In this example the store is open between 08:00 - 14:00.
   * Then it is closed until between 16:00 and 22:00
   *
   * PUT /stores/583086502d662e69a6e976e1
   * {
   *   openhours: {
   *     monday: ["08:00","14:00","16:00','22:00']
   *   ]
   * }
   * @returns {JSON}
   * <caption>On success</caption>
   * <pre>
   * {
   *   "success": true,
   *   "data": {...} // Updated page document
   * }
   * </pre>
   * <caption>On failure</caption>
   * <pre>
   * {
   *   "success": false,
   *   "error": [...]
   * }
   * </pre>
   */
  server.put({
    name: 'updateStore',
    path: '/stores/:id',
    validation: {
      resources: {
        id: {
          isRequired: true
        }
      },
      content: {
        title: {
          isRequired: false
        },
        content: {
          isRequired: false
        },
        sources: {
          isRequired: false,
          isArray: true
        },
        categories: {
          isRequired: false,
          isObjectIdArray: true
        },
        city: {
          isRequired: false,
          isObjectId: true
        },
        address: {
          isRequired: false
        },
        coordinates: {
          isRequired: false,
          isArray: true // TODO Write an isCoordinates validator
        },
        phones: {
          isRequired: false,
          isArray: true
        },
        websites: {
          isRequired: false,
          isArray: true
        },
        openhours: {
          isRequired: false,
          isObjectArray: {
            keys: [
              'monday',
              'tuesday',
              'wednesday',
              'thursday',
              'friday',
              'saturday',
              'sunday'
            ]
          }
        },
        zipcode: {
          isRequired: false,
          isNumber: true
        },
        company: {
          isRequired: false,
          isObjectId: true
        },
        products: {
          isRequired: false,
          isObjectId: true
        },
        tags: {
          isRequired: false,
          isObjectIdArray: true
        },
        images: {
          isRequired: false,
          isObjectIdArray: true
        },
        anonymous: {
          isRequired: false
        }
      }
    }
  }, passport.authenticate('jwt'), (req, res, next) => {
    const params = _.merge({}, req.params, {
      user: req.user
    });

    return models.Pages.updatePage(params, 'stores')
    .then(result => {
      res.json({
        success: true
      });
    })
    .catch(err => {
      return next(err);
    });
  });
};
