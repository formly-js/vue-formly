export default {
  render(h){
    let children = [];
    if ( !this.customLayout ){
      const self = this;
      children = this.fields.map( function(field){
	return h('formly-field', {
	  key: `formly_${field.key}`,
	  ref: field.key,
	  props: {
	    model: self.model,
	    form: self.form,
	    field: field
	  }
	});
      });
    }
    if ( 'default' in this.$scopedSlots ) children.push( this.$scopedSlots.default({ keys: this.keys }) );
    return h(this.tag ? this.tag : 'fieldset', children);
  },
  methods: {
    validate(){
      return new Promise((resolve, reject) => {
	let target = this.fields.length;
	let count = 0;
	this.fields.forEach( field => {
	  if ( !(field.key in this.form) ) {
	    count++;
	    if( target == count ) resolve();
	    return;
	  }
	  this.$set( this.form[ field.key ], '$dirty', true );
	  let validate;
	  if ( field.key in this.$refs ){
	    validate = this.$refs[ field.key ].validate;
	  } else {
	    this.$children.some( child => {
	      if ( ! ( 'field' in child ) ) return false;
	      if ( child.field.key === field.key ){
		validate = child.validate;
		return true;
	      }
	    });
	  }

	  if ( typeof validate !== 'function' ){
	    count++;
	    if( target == count ) resolve();
	    return;
	  }

	  validate()
	    .then(()=>{
	      count++;
	      if( target == count ) resolve();
	    })
	    .catch((e)=>{
	      reject(e);
	    });
	});
      });
    }
  },
  props: ['form', 'model', 'fields', 'customLayout','tag'],
  computed:{
    keys(){
      let keys = {};
      this.fields.forEach( field => {
	keys[field.key] = field;
      });
      return keys;
    }
  },
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
