import Components from './components';


let Formly = {};

Formly.install = function(Vue, options){

    if ( Formly.installed ){
        return;
    }

    Components(Vue);

    Vue.$formly = {
        
        fields: {},

        /**
         * Allow additional templates to be added
         * @param {String} id
         * @param {Object} options
         */
        addType(id, options){
            //our base component
            let base = {
                props: ['model', 'schema']
            };
            
            //merge 
            Object.assign(options, base);
            Vue.$formly.fields[id] = Vue.extend(options);
        }
    };
    
};

//auto install
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(Formly);
}
export default Formly;
