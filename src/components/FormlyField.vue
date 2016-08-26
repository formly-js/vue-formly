<template>
  <component :is="type" :form.sync="form" :key="key"></component>
</template>

<script>
 const Vue = require('vue');
 import Util, {getTypes, setError} from '../util';
 export default {
     props: ['form', 'key'],
     computed: {
         type:function(){
             return 'formly_'+this.form[this.key].type;
         }
     },
     methods: {
         validate:function(){
             let field = this.form[this.key];

             //first check if we need to create a field
             if ( !this.form.$errors[this.key] ) this.$set('form.$errors.'+this.key, {});

             //check for required fields. This whole setting,unsetting thing seems kind of wrong though..
             //there might be a more 'vue-ey' way to do this...
             if ( field.required ){
                 if ( !this.form.$errors[this.key].required ) this.$set('form.$errors.'+this.key+'.required', true);
                 setError(this.form, this.key, 'required', !field.value) ;
             }

             //if we've got nothing left then return
             if ( !field.validators ) return;

             Object.keys(field.validators).forEach((validKey) => {
                 if ( !this.form.$errors[this.key][validKey] ) this.$set('form.$errors.'+this.key+'.'+validKey, false);
                 if ( !field.required && !field.value ) return;

                 let validator = field.validators[validKey];

                 let valid = typeof validator == 'function' ? !validator(field) : !eval(validator);
                 setError(this.form, this.key, validKey, valid);
                 
             });
         }
     },
     components: getTypes(),
     created(){
         this.validate();
         this.$watch('form.'+this.key+'.value', (val) =>{
             let valid = this.validate();
         });
     }
  }
</script>
