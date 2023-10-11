// Constants for Validator Types
const VALIDATOR_TYPE_REQUIRE = 'REQUIRE';
const VALIDATOR_TYPE_MINLENGTH = 'MINLENGTH';
const VALIDATOR_TYPE_MAXLENGTH = 'MAXLENGTH';
const VALIDATOR_TYPE_MIN = 'MIN';
const VALIDATOR_TYPE_MAX = 'MAX';
const VALIDATOR_TYPE_EMAIL = 'EMAIL';
const VALIDATOR_TYPE_FILE = 'FILE';

// Validator Functions

// Returns a validator object with type 'VALIDATOR_TYPE_REQUIRE'
export const VALIDATOR_REQUIRE = () => ({ type: VALIDATOR_TYPE_REQUIRE });

// Returns a validator object with type 'VALIDATOR_TYPE_FILE'
export const VALIDATOR_FILE = () => ({ type: VALIDATOR_TYPE_FILE });

// Returns a validator object with type 'VALIDATOR_TYPE_MINLENGTH' and a minimum length value 'val'
export const VALIDATOR_MINLENGTH = val => ({
  type: VALIDATOR_TYPE_MINLENGTH,
  val: val
});

// Returns a validator object with type 'VALIDATOR_TYPE_MAXLENGTH' and a maximum length value 'val'
export const VALIDATOR_MAXLENGTH = val => ({
  type: VALIDATOR_TYPE_MAXLENGTH,
  val: val
});

// Returns a validator object with type 'VALIDATOR_TYPE_MIN' and a minimum value 'val'
export const VALIDATOR_MIN = val => ({ type: VALIDATOR_TYPE_MIN, val: val });

// Returns a validator object with type 'VALIDATOR_TYPE_MAX' and a maximum value 'val'
export const VALIDATOR_MAX = val => ({ type: VALIDATOR_TYPE_MAX, val: val });

// Returns a validator object with type 'VALIDATOR_TYPE_EMAIL'
export const VALIDATOR_EMAIL = () => ({ type: VALIDATOR_TYPE_EMAIL });

// validate Function

// This function validates a given 'value' based on an array of 'validators'.
export const validate = (value, validators) => {
  let isValid = true;

  // Iterate through the 'validators' array
  for (const validator of validators) {
    // Check the type of the validator
    if (validator.type === VALIDATOR_TYPE_REQUIRE) {
      // Check if the 'value' is not empty
      isValid = isValid && value.trim().length > 0;
    }
    if (validator.type === VALIDATOR_TYPE_MINLENGTH) {
      // Check if the 'value' has a minimum length of 'validator.val'
      isValid = isValid && value.trim().length >= validator.val;
    }
    if (validator.type === VALIDATOR_TYPE_MAXLENGTH) {
      // Check if the 'value' does not exceed a maximum length of 'validator.val'
      isValid = isValid && value.trim().length <= validator.val;
    }
    if (validator.type === VALIDATOR_TYPE_MIN) {
      // Check if the 'value' is greater than or equal to 'validator.val'
      isValid = isValid && +value >= validator.val;
    }
    if (validator.type === VALIDATOR_TYPE_MAX) {
      // Check if the 'value' is less than or equal to 'validator.val'
      isValid = isValid && +value <= validator.val;
    }
    if (validator.type === VALIDATOR_TYPE_EMAIL) {
      // Check if the 'value' is in a valid email format
      isValid = isValid && /^\S+@\S+\.\S+$/.test(value);
    }
  }

  // Return 'isValid', which is 'true' if all validators pass and 'false' if any validator fails.
  return isValid;
};
