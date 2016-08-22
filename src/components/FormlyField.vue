<template>
  <component :is="field.type" :model="model"></component>
</template>

<script>
 import VueFormly from '../index';
 export default {
     props: ['field', 'model'],
     components: VueFormly.getTypes()
 }
</script>
