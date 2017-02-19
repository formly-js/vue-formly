const exports = {
  formlyFields: {},
  validationMessages: {}
};
export default exports;

/**
 * Allow additional templates to be added
 * When they're created they should be prefixed so they don't conflict with native components
 * eg. addType('input', {}) will be available as <formly_input></formly_input>
 * @param {String} id
 * @param {Object} options
 */
export function addType(id, options){
  exports.formlyFields['formly_'+id] = options;
}

export function getTypes(){
  return exports.formlyFields;
}

/**
 * Allows a field to add/remove errors to the form
 * @param {Object} form
 * @param {String} key
 * @param {String} err
 * @param {Bool} isError
 */
export function setError(form, key, err, isError, message = false){
  if ( !form.$errors[key] ) form.$errors[key] = {};
  form.$errors[key][err] = isError ? message || isError : false;
}

/**
 * Adds a validation string to Vue Formly to be used later on by validations
 * @param {string} key
 * @param {string} message
 */
export function addValidationMessage(key, message){
  exports.validationMessages[ key ] = message;
}

/**
 * Given a message key or message it parses in the label and the value
 * @param {string/bool} key
 * @param {string} message
 * @param {string} label
 * @param {string} value
 */
export function parseValidationString(key, message, label, value){

  // if a key has been passed and there's no validation message and no message has been passed then return
  if ( key && !(key in exports.validationMessages ) && !message ) return false;
  
  // first check if a validation message with this key exists
  if ( key in exports.validationMessages ){
    message = exports.validationMessages[key];
  }

  let output = message.replace(/\%l/g, label).replace(/\%v/g, value);
  return output;
}
