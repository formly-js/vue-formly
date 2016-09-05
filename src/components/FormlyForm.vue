<template>
  <fieldset>
    <template v-if="!customLayout">
      <formly-field v-for="field in form | formlyFields" :form.sync="form" :key="field" ></formly-field>
    </template>
    <slot></slot>
  </fieldset>
</template>

<script>
 export default {
     props: ['form', 'customLayout'],
     created(){
         //make sure that the 'value' is always set
         Object.keys(this.form).forEach((key) => {
             if ( typeof this.form[key].value == 'undefined' ) this.$set('form.'+key+'.value', '');
         });
         
         //set our validation options
         this.$set('form.$errors', {});
         this.$set('form.$valid', true);

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
