<template>
  <component :is="field.type" :model="model"></component>
</template>

<script>
 import Vue from 'vue';
 export default {
     props: ['field', 'model'],
     components: Vue.$formlyFields
 }
</script>
