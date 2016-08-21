<template>
  <component :is="schema.type" :model="model"></component>
</template>

<script>
 export default {
     props: ['schema', 'model']
 }
</script>
