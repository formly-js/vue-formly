<template>
  <fieldset>
      <formly-field v-for="field in form | formlyFields" :form.sync="form" :key="field" ></formly-field>
  </fieldset>
</template>

<script>
 export default {
     props: ['form'],
     created(){
         //make sure that the 'value' is always set
         Object.keys(this.form).forEach((key) => {
             if ( typeof this.form[key].value == 'undefined' ) this.$set('form.'+key+'.value', '');
         });
         
         //set our validation options
         this.$set('form.$errors', {});
         this.$set('form.$valid', false);
     }
 }
</script>
