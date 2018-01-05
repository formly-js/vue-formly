import Util, {getTypes, setError, parseValidationString } from '../util';
export default {
  render(h){
    if ( !this.display ) return;
    return h(this.type, {
      props: {
	form: this.form,
	field: this.field,
	model: this.model,
	to: this.templateOptions
      }
    });
  },
  props: ['form', 'model', 'field', 'to'],
  computed: {
    templateOptions: function(){
      return this.field.templateOptions || {};
    },
    type:function(){
      return 'formly_'+this.field.type;
    },
    display: function(){
      // always show if there is no conditional display
      let displayType = typeof this.field.display;
      if ( displayType !== 'function' && displayType !== 'string' ) return true;

      if ( displayType === 'function' ){
	return this.field.display( this.field, this.model );       
      } else {
	let result = new Function('field', 'model',  'return '+this.field.display+';' );
	return result.call({}, this.field, this.model);
      }
    }
  },
  methods: {
    validate:function(){
      return new Promise((resolve, reject)=>{
	//first check if we need to create a field
	if ( !this.form.$errors[this.field.key] ) this.$set(this.form.$errors, this.field.key, {});
	if ( !this.field.templateOptions ) this.$set(this.field, 'templateOptions', {});

	let label = ( 'templateOptions' in this.field ) && ( 'label' in this.field.templateOptions ) ? this.field.templateOptions.label : '';
	
	//check for required fields. This whole setting,unsetting thing seems kind of wrong though..
	//there might be a more 'vue-ey' way to do this...
	if ( this.field.required ){
          if ( !this.form.$errors[this.field.key].required ) this.$set(this.form.$errors[ this.field.key ], 'required', true);
	  let requiredError = parseValidationString( 'required', false, label, this.model[ this.field.key ] );
	  let requiredType = typeof this.model[ this.field.key ] === 'string' ? !this.model[ this.field.key ] : this.model[ this.field.key] !== null && this.model[this.field.key] !== undefined && this.model[ this.field.key ].length === 0;
	  let required = this.display ? requiredType : false;
          setError(this.form, this.field.key, 'required', required, requiredError) ;
	}
	
	//if we've got nothing left then return
	if ( !this.field.validators ) return resolve();

	//set these for the validators so we don't have to use 'this' in them
	let model = this.model;
	let field = this.field;
	
	Object.keys(this.field.validators).forEach((validKey) => {
          if ( !this.form.$errors[this.field.key][validKey] ) this.$set(this.form.$errors[ this.field.key ], validKey, false);
          if ( this.field.required === false && !this.model[ this.field.key ] ) {
	    setError(this.form, this.field.key, validKey, false );
	    return resolve();
	  }

          let validator = this.field.validators[validKey];
          let validatorMessage = false;

          if ( typeof validator === 'object' ){
            if ( !( 'message' in validator ) ){
              console.error( "Looks like you've set a validator object without setting a message. If you don't need to explicity set the message just define the validator as either an expression or a function. Refer to the docs for more info");
            } else {
              validatorMessage = validator.message;
              validator = validator.expression;
            }
          }
          
          validatorMessage = parseValidationString( validKey, validatorMessage, label, model[ this.field.key ] );

          let valid = false;
          if ( typeof validator === 'function' ){
	    //set the asynchronous flag so that we know it's going
	    let asyncKey = '$async_'+validKey;
	    this.$set(this.form.$errors[ this.field.key ], asyncKey, true);
	    
            // setup for async validation
            validator(field, model, (asyncValid = false, asyncValidatorMessage = validatorMessage) => {
              // whenever validation is done via a function we will assume it's asynchronous and will require next() to be called
              // this way it doesn't matter if it's async or not, next() should always be called
              setError(this.form, this.field.key, validKey, !asyncValid, asyncValidatorMessage);
	      this.$set(this.form.$errors[ this.field.key ], asyncKey, false);
	      resolve();
            });
          } else {
            let res = new Function('model', 'field', 'return '+validator+';' );
            valid = !res.call({}, model, field);
            setError(this.form, this.field.key, validKey, valid, validatorMessage);
	    resolve();
          }
          
	});
      });
    }
  },
  components: getTypes(),
  created(){
    this.validate();
    this.$watch(function(){
      return this.model[ this.field.key ];
    }, (val) =>{
      let valid = this.validate();
    });
  },
  mounted(){
    if ( !this.field.wrapper ) return;
    
    //create a temporary element
    let wrapper = document.createElement('DIV');
    //populate it with the wrapper string
    wrapper.innerHTML = this.field.wrapper;
    //get the parent
    let parent = this.$el.parentNode;
    //insert the wrapper before this element
    parent.insertBefore(wrapper, this.$el);
    //append the element to the new wrapper
    wrapper.firstChild.appendChild( this.$el );
    //move the new wrapper back to where it should be
    parent.insertBefore(wrapper.firstChild, wrapper);
    //remove the temporary element
    parent.removeChild(wrapper);
  }
}
