/**
 * Restify parameter validators
 *
 * @file: /config/restify/validators.js
 * @name: validators.js
 * @module restify
 * @namespace config
 * @returns Object with custom  restify-validation validators
 */

module.exports = {
  isArray: function (param) { // We receive the name of the parameter here
    let value = this.req.params[param]; // Get the value of the param from the request's parameters

    // We won't validate an undefined field, return early
    if (typeof values === 'undefined') {
      return;
    }

    if (Array.isArray(value)) {
      return false; // false indicates that there were no errors (I guess?), backwards logic imo, but hey, it works!
    } else {
      throw new Error('Invalid type: Expected array but received: ' + value.constructor.name);
    }
  },
  isObjectArray: function (param) {
    let values = this.req.params[param];
    let props = this.validationRules.isObjectArray;

    // We won't validate an undefined field, return early
    if (typeof values === 'undefined') {
      return;
    }

    if (Array.isArray(values)) {
      // Check if the array is empty
      if (props.constructor.name === 'Object' && (!props.hasOwnProperty('allowEmpty') || props.allowEmpty === false) && values.length === 0) {
        throw new Error('Invalid data: Array can not be empty');
      }

      values.forEach((value, i) => {
        // Check if this item is an Object
        if (!value.constructor.name === 'Object') {
          throw new Error('Invalid type: Expected Object for item at index' + i + ' but received: ' + value.constructor.name + ' in array ');
        }

        // If the user has specified keys, check if they exist
        if (props.hasOwnProperty('keys') && props.keys.length > 0) {
          let valueKeys = Object.keys(value); // Get the current array item's keys and loop over them

          // Only allow keys in data which the user has specified
          valueKeys.forEach(key => {
            if (props.keys.indexOf(key) === -1) {
              throw new Error('Invalid property ' + key + ' in item at index ' + i + ' in array');
            }
          });

          props.keys.forEach(key => {
            if (valueKeys.indexOf(key) === -1) {
              throw new Error('Invalid data: Expected property ' + key + ' was not found in item at index ' + i + ' in array');
            }
          });
        }
      });
    } else {
      return new Error('Invalid type: Expected array but received: ' + values.constructor.name);
    }
  },
  isObjectIdArray: function (param) {
    let values = this.req.params[param];
    let regexBSON = new RegExp(/^[a-f\d]{24}$/i);

    // We won't validate an undefined field, return early
    if (typeof values === 'undefined') {
      return;
    }

    if (Array.isArray(values)) {
      values.forEach((value, i) => {
        if (regexBSON.test(value) !== true) {
          throw new Error('Invalid type: Expected ObjectID but received ' + value.constructor.name + ' for index ' + i + ' in array');
        }
      });
    } else {
      throw new Error('Invalid type: Expected array but received: ' + values.constructor.name);
    }
  }
};
