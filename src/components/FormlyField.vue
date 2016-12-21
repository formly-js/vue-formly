<template>
  <component :is="type" :form.sync="form" :field="field" :model="model" :to="field.templateOptions"></component>
</template>

<script>
 const Vue = require('vue');
 import Util, {getTypes, setError} from '../util';
 export default {
   props: ['form', 'model', 'field', 'to'],
   computed: {
     type:function(){
       return 'formly_'+this.field.type;
     }
   },
   methods: {
     validate:function(){

       //first check if we need to create a field
       if ( !this.form.$errors[this.field.key] ) this.$set(this.form.$errors, this.field.key, {});
       if ( !this.field.templateOptions ) this.$set(this.field, 'templateOptions', {});

       //check for required fields. This whole setting,unsetting thing seems kind of wrong though..
       //there might be a more 'vue-ey' way to do this...
       if ( this.field.required ){
         if ( !this.form.$errors[this.field.key].required ) this.$set(this.form.$errors[ this.field.key ], 'required', true);
         setError(this.form, this.field.key, 'required', !this.model[ this.field.key ]) ;
       }

       //if we've got nothing left then return
       if ( !this.field.validators ) return;

       //set these for the validators so we don't have to use 'this' in them
       let model = this.model;
       let field = this.field;
       
       Object.keys(this.field.validators).forEach((validKey) => {
         if ( !this.form.$errors[this.field.key][validKey] ) this.$set(this.form.$errors[ this.field.key ], validKey, false);
         if ( !this.field.required && !this.model[ this.field.key ] ) return;

         let validator = this.field.validators[validKey];

         let valid = typeof validator == 'function' ? !validator(field, model) : !eval(validator);
         setError(this.form, this.field.key, validKey, valid);
         
       });
     }
   },
   components: getTypes(),
   created(){
     this.validate();
     this.$watch('model.'+this.field.key, (val) =>{
       let valid = this.validate();
     });
   },
   mounted(){
     if ( !this.field.wrapper ) return;
     
     //create a temporary element
     let wrapper = document.createElement('DIV');
     //populate it with the wrapper string
     wrapper.innerHTML = this.field.wrapper;
     //get the parent
     let parent = this.$el.parentNode;
     //insert the wrapper before this element
     parent.insertBefore(wrapper, this.$el);
     //append the element to the new wrapper
     wrapper.firstChild.appendChild( this.$el );
     //move the new wrapper back to where it should be
     parent.insertBefore(wrapper.firstChild, wrapper);
     //remove the temporary element
     parent.removeChild(wrapper);
   }
 }
</script>
