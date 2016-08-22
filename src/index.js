import Components from './components/index';
import Util,{getTypes, addType} from './util';


let Formly = {
    
    install(Vue, options){

        if ( Formly.installed ){
            return;
        }
        
        //install our components
        Components(Vue);
        
    }
};

//auto install
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(Formly);
    //expose formly functions if auto installed
    window.Vue.$formly = {getTypes, addType};
}
export default Formly;
