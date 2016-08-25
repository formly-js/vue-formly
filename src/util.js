const exports = {
    formlyFields: {}
};
export default exports;

/**
 * Allow additional templates to be added
 * @param {String} id
 * @param {Object} options
 */
export function addType(id, options){
    exports.formlyFields['formly_'+id] = options;
}

export function getTypes(){
    return exports.formlyFields;
}
