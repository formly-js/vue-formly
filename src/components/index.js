import FormlyForm from './FormlyForm.vue';

export default function(Vue){
    Vue.component('formly-form', FormlyForm);
    Vue.component('formly-field', (resolve) => {
        /**
         * FormlyField must be loaded asyncronously so that any fields added in 
         * via Formly.addType are available
         */
        require(['./FormlyField.vue'], resolve);
    });
}
