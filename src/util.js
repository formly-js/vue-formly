const exports = {
    formlyFields: {}
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
 * Allows a field to add errors to the form
 * @param {Object} form
 * @param {String} key
 * @param {String} err
 */
export function addError(form, key, err){
    if ( !form.$errors[key] ) form.$errors[key] = {};
    form.$errors[key][err] = true;
}

/**
 * Allows a field to remove an error from the form
 * @param {Object} form
 * @param {String} key
 * @param {String} err
 */
export function removeError(form, key, err){
    delete form.$errors[key][err];
    if (Object.keys(form.$errors[key]).length == 0 ) delete form.$errors[key];
}
