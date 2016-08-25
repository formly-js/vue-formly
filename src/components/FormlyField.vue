<template>
  <component :is="form[key].type" :form.sync="form" :key="key"></component>
</template>

<script>
 const Vue = require('vue');
 import Util, {getTypes} from '../util';
 export default {
     props: ['form', 'key'],
     components: getTypes()
  }
</script>
