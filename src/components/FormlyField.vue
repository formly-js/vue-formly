<template>
  <component :is="field.type" :model.sync="model" :field="field"></component>
</template>

<script>
 const Vue = require('vue');
 import Util, {getTypes} from '../util';
 export default {
     props: ['field', 'model'],
     components: getTypes()
  }
</script>
