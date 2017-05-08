<template>
  <fieldset>
    <formly-field :ref="field.key" v-for="field in fields" :form.sync="form" :model.sync="model" :field="field"></formly-field>
    <slot></slot>
  </fieldset>
</template>

<script>
export default {
  methods: {
    validate(){
      return new Promise((resolve, reject) => {
	let target = this.fields.length;
	let count = 0;
	this.fields.forEach( field => {
	  this.$set( this.form[ field.key ], '$dirty', true );
	  console.log(this.$refs[ field.key ][0]);
	  //this.$refs[ field.key ][0].validate();
	});
	resolve();
      });
    }
  },
  props: ['form', 'model', 'fields'],
  created(){

    //make sure that the 'value' is always set
    this.fields.forEach( field => {
      if ( typeof this.model[ field.key ] == 'undefined' ) this.$set(this.model, field.key, '');
    });

    
    //set our validation options
    this.$set(this.form, '$errors', {});
    this.$set(this.form, '$valid', true);

    this.$watch('form.$errors', function(val){
      let valid = true;
      Object.keys(this.form.$errors).forEach((key)=>{
        let errField = this.form.$errors[key];
        Object.keys(errField).forEach((errKey) => {
          if ( errField[errKey] ) valid = false;
        })
      });
      this.form.$valid = valid;
    }, {
      deep: true
    });
    
  }
}
</script>
