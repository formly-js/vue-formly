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
 * Allows deep nesting or not, depending on compatability
 * Should first check for the deeply nested field. If it doesn't exist then we treat the key as target[key]
 * If it does exist, then we set it
 * @param {Object} target
 * @param {String} key
 * @param {Mixed} val
 */
export function set(target, key, val){
  if ( hasNestedProperty( target, key ) ){
    const parts = key.split('.');
    const finalKey = parts.pop();
    const newTarget = parts.reduce( (acc, cur) => acc[cur], target);
    this.$set(newTarget, finalKey, val);
  } else {
    this.$set(target, key, val);
  }
}

/**
 * Checks to see whether an object has a deeply nested path
 * @param {Object} target
 * @param {String} propertyPath
 * @returns {Boolean}
 */
function hasNestedProperty(obj, propertyPath){
  if(!propertyPath)
    return false;

  const properties = propertyPath.split('.');

  for (var i = 0; i < properties.length; i++) {
    var prop = properties[i];

    if(!obj || !obj.hasOwnProperty(prop)){
      return false;
    } else {
      obj = obj[prop];
    }
  }

  return true;
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
