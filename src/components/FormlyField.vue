<template>
  <component :is="type" :form.sync="form" :key="key"></component>
</template>

<script>
 const Vue = require('vue');
 import Util, {getTypes, addError, removeError} from '../util';
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

             //just return straight away if nothing is there
             if ( !field.required && !field.value ) return;

             if ( field.required ){
                 if ( !field.value ){
                     addError(this.form, this.key, 'required');                     
                 } else {
                     removeError(this.form, this.key, 'required');
                 }
             }
         }
     },
     components: getTypes(),
     created(){
         this.validate();
         this.$watch('form.'+this.key+'.value', (val) =>{
             this.validate();
         });
     }
  }
</script>
