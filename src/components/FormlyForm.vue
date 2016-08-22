<template>
  <fieldset>
      <formly-field v-for="field in fields" :field="field" :model.sync="model[field.key]" ></formly-field>
  </fieldset>
</template>

<script>
 export default{
     props: ['fields', 'model']
 }
</script>
