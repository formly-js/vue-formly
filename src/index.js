import Components from './components/index';


let Formly = {
    /**
     * Allow additional templates to be added
     * @param {String} id
     * @param {Object} options
     */
    addType(id, options){
        Vue.$formlyFields[id] = options;
    },
    
    install(Vue, options){

        if ( Formly.installed ){
            return;
        }

        Components(Vue);

        Vue.$formlyFields = {};
        
    }
};

//auto install
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(Formly);
}
export default Formly;
