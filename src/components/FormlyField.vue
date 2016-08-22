<template>
  <component :is="field.type" :model="model"></component>
</template>

<script>
 export default {
     props: ['field', 'model']
 }
</script>
