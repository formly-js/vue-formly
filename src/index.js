import Components from './components/index';
import Filters from './filters/index';
import Util,{getTypes, addType} from './util';


let Formly = {
    getTypes,
    addType,
    install(Vue, options){

        if ( Formly.installed ){
            return;
        }
        
        //install our components
        Components(Vue);
        Filters(Vue);
    }
};

//auto install
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(Formly);
    //expose formly functions if auto installed
    window.Vue.$formly = {getTypes, addType};
}
export default Formly;
