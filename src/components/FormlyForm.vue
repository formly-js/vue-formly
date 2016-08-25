<template>
  <fieldset>
      <formly-field v-for="field in form.fields" :form.sync="form" :key="$key" ></formly-field>
  </fieldset>
</template>

<script>
 export default {
     props: ['form'],
     created(){
         //set our validation options
         this.$set('form.$errors', {});
         this.$set('form.$valid', false);

         //make sure that the 'value' is always set
         Object.keys(this.form.fields).forEach((key) => {
             if ( typeof this.form.fields[key].value == 'undefined' ) this.$set('form.fields.'+key+'.value', '');
         });
     }
 }
</script>
