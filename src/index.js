import Components from './components/index';
import Filters from './filters/index';
import Util,{getTypes, addType, addValidationMessage, set} from './util';
import Directives from './directives/index';


let Formly = {
  getTypes,
  addType,
  addValidationMessage,
  install(Vue, options){
    
    //install our components
    Directives(Vue);
    Components(Vue);
    Filters(Vue);

    Vue.$formly = {getTypes, addType, addValidationMessage};
    Vue.prototype.$formlySet = set
  }
};

//auto install
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Formly);
  //expose formly functions if auto installed
  window.Vue.$formly = {getTypes, addType, addValidationMessage};
}
export default Formly;
