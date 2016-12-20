<template>
  <fieldset>
    <formly-field v-for="field in fields" :form.sync="form" :model.sync="model" :field="field"></formly-field>
    <slot></slot>
  </fieldset>
</template>

<script>
 export default {
   props: ['form', 'model', 'fields'],
   created(){

     //make sure that the 'value' is always set
     this.fields.forEach( field => {
       if ( typeof this.model[ field.key ] == 'undefined' ) this.$set(this.model, field.key, '');
     });

     
     //set our validation options
     this.$set(this.form, '$errors', {});
     this.$set(this.form, '$valid', true);

     this.$watch('form.$errors', function(val){
       let valid = true;
       Object.keys(this.form.$errors).forEach((key)=>{
         let errField = this.form.$errors[key];
         Object.keys(errField).forEach((errKey) => {
           if ( errField[errKey] ) valid = false;
         })
       });
       this.form.$valid = valid;
     }, {
       deep: true
     });
     
   }
 }
</script>
