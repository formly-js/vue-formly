<template>
  <component :is="type" :form.sync="form" :field="field" :model="model" :to="field.templateOptions"></component>
</template>

<script>
 const Vue = require('vue');
 import Util, {getTypes, setError, parseValidationString} from '../util';
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
         let validatorMessage = false;

         if ( typeof validator === 'object' ){
           if ( !( 'message' in validator ) ){
             console.error( "Looks like you've set a validator object without setting a message. If you don't need to explicity set the message just define the validator as either an expression or a function. Refer to the docs for more info");
           } else {
             validatorMessage = validator.message;
             validator = validator.expression;
           }
         }
         
         let label = ( 'templateOptions' in this.field ) && ( 'label' in this.field.templateOptions ) ? this.field.templateOptions.label : '';
         validatorMessage = parseValidationString( validKey, validatorMessage, label, model[ this.field.key ] );

         let valid = false;
         if ( typeof validator === 'function' ){
           //valid = !validator(field, model);
           // setup for async validation
           validator(field, model, (asyncValid = false, asyncValidatorMessage = validatorMessage) => {
             // whenever validation is done via a function we will assume it's asynchronous and will require next() to be called
             // this way it doesn't matter if it's async or not, next() should always be called
             console.log(this.form);
             setError(this.form, this.field.key, validKey, !asyncValid, asyncValidatorMessage);
           });
         } else {
           let res = new Function('model', 'field', 'return '+validator+';' );
           valid = !res.call({}, model, field);
           setError(this.form, this.field.key, validKey, valid, validatorMessage);
         }
         
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
