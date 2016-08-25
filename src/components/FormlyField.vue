<template>
  <component :is="type" :form.sync="form" :key="key"></component>
</template>

<script>
 const Vue = require('vue');
 import Util, {getTypes} from '../util';
 export default {
     props: ['form', 'key'],
     computed: {
         type:function(){
             return 'formly_'+this.form[this.key].type;
         }
     },
     components: getTypes()
  }
</script>
