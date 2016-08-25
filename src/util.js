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
