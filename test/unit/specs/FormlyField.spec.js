import chai from 'chai';
const expect = chai.expect;
import Vue from 'vue';
import FormlyField from 'src/components/FormlyField';
import Utils from 'src/util';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

let el, vm;

function createForm(template, data){
  el = document.createElement('DIV');
  document.body.appendChild(el);
  //el.innerHTML = template;
  vm = new Vue({
    data: data,
    template: template,
    components: {
      'formly-field': FormlyField
    }
  }).$mount(el);

  return [el, vm];
}


describe('FormlyField', () => {

  it('should take on the type of another component', () => {

    Vue.component('formly_test', {
      props: ['form', 'model', 'field'],
      template: '<div id="testComponent">{{field.type}}</div>'
    });

    let data = {
      form:{
        $errors: {},
        $valid: {},
      },
      fields: [
        {
          key: 'test',
          type: 'test' 
        }
      ],
      model: {
        test: ''
      }
    };
    
    createForm('<formly-field :form="form" :model="model" :field="fields[0]"></formly-field>', data);

    expect(vm.$el.textContent).to.equal(data.fields[0].type);
    
  });

  
  it('should mimic the model of the parent', (done) => {

    Vue.component('formly_test', {
      props: ['form', 'field', 'model'],
      template: '<input type="text" id="testInput" v-model="model[ field.key ]">'
    });

    let data = {
      form: {
        $errors: {},
        $valid: {}
      },
      fields: [
        {
          key: 'search',
          type: 'test' 
        }
      ],
      model: {
        search: 'foo'
      }
    };

    createForm('<formly-field :form.sync="form" :field="fields[0]" :model="model"></formly-field>', data);

    expect(vm.$el.value).to.equal('foo');

    //change the value and expect a change
    vm.model.search = 'bar';

    setTimeout(() => {
      expect(vm.$el.value).to.equal('bar');
      done();
    }, 0);
    
  });

  it('Should pass template options', () => {

    Vue.component('formly_test', {
      props: ['form', 'field', 'model', 'to'],
      template: '<div>{{to}}</div>'
    });

    let data = {
      form: {
        $errors: {},
        $valid: {}
      },
      fields: [
        {
          key: 'search',
          type: 'test',
          templateOptions: {
            foo: 'bar',
            something: 'else'
          }
        }
      ],
      model: {
        search: ''
      }
    };

    createForm('<formly-field :form.sync="form" :field="fields[0]" :model="model"></formly-field>', data);

    expect(JSON.parse(vm.$el.textContent)).to.deep.equal(data.fields[0].templateOptions);
    
  });

  it('Should default {} to templateOptions if none are defined', () => {
    Vue.component('formly_test', {
      props: ['form', 'field', 'model', 'to'],
      template: '<div></div>'
    });

    let data = {
      form: {
        $errors: {},
        $valid: {}
      },
      fields: [
        {
          key: 'search',
          type: 'test'
        }
      ],
      model: {
        search: ''
      }
    };

    createForm('<formly-field ref="formlyField" :form.sync="form" :field="fields[0]" :model="model"></formly-field>', data);

    expect(vm.$refs.formlyField.templateOptions).to.deep.equal({});
  });

  it('Should take a wrapper string', () => {
    Vue.component('formly_test', {
      props: ['form', 'field', 'model', 'to'],
      template: '<div></div>'
    });
    
    let data = {
      form: {
        $errors: {},
        $valid: {}
      },
      fields: [
        {
          key: 'wrapped',
          type: 'test',
          wrapper: '<div id="test_wrapper_element"></div>'
        }
      ],
      model: {
        wrapped: ''
      }
    };
    createForm('<formly-field :form.sync="form" :field="fields[0]" :model="model"></formly-field>', data);

    let parent = vm.$el.parentNode;
    expect(parent.firstChild).to.equal(vm.$el);
    expect(parent.id).to.equal('test_wrapper_element');    
  });

  it('Should be hidden if display is false', (done) => {
    Vue.component('formly_test', {
      props: ['form', 'field', 'model'],
      template: '<div></div>'
    });
    
    let data = {
      form: {
	$errors: {},
	$valid: true
      },
      model: {
	hidden: '',
	hiddenVal: 'test'
      },
      fields: [
	{
	  key: 'hidden',
	  type: 'test',
	  display: function(field, model){
	    return model.hiddenVal === 'hello';
	  }
	}
      ]
    };

    createForm('<formly-field :form.sync="form" :field="fields[0]" :model="model"></formly-field>', data);
    expect(vm.$el.nodeName).to.equal('#comment');
    data.model.hiddenVal = 'hello';
    setTimeout(()=>{
      expect(vm.$el.style.display).to.equal('');
      done();
    });
  });

  it('Should take a display property as a string expression', (done) => {
    Vue.component('formly_test', {
      props: ['form', 'field', 'model'],
      template: '<div></div>'
    });
    
    let data = {
      form: {
	$errors: {},
	$valid: true
      },
      model: {
	hiddenString: '',
	hiddenStringVal: 'test'
      },
      fields: [
	{
	  key: 'hiddenString',
	  type: 'test',
	  display: 'model.hiddenStringVal === "hello"'
	}
      ]
    };

    createForm('<formly-field :form.sync="form" :field="fields[0]" :model="model"></formly-field>', data);
    expect(vm.$el.nodeName).to.equal('#comment');
    data.model.hiddenStringVal = 'hello';
    setTimeout(()=>{
      expect(vm.$el.style.display).to.equal('');
      done();
    });
  });

  
  describe('Validation', ()=>{

    before(()=>{
      Vue.component('formly_test', {
        props: ['form', 'field', 'model'],
        template: '<div></div>'
      });
    });

    function createValidField(data){
      return createForm('<formly-field :form.sync="form" :field="fields[0]" :model="model"></formly-field>', data);
    };

    it('should return a promise', (done)=>{
      let data = {
        form: {
          $valid: true,
          $errors: {}
        },
        model: {
          search: ''
        },
        fields: [
          {
            key: 'search',
            type: 'test',
            required: true
          }
        ]
      };
      createValidField(data);
      let cb = sinon.spy();

      let prom = vm.$children[0].validate();
      expect(typeof prom.then).to.equal('function');

      prom.then(()=>cb());
      setTimeout(()=>{
	cb.should.be.called;
	done();
      });
    });

    it('should handle required values', (done) => {

      let data = {
        form: {
          $valid: true,
          $errors: {}
        },
        model: {
          search: ''
        },
        fields: [
          {
            key: 'search',
            type: 'test',
            required: true
          }
        ]
      };
      
      createValidField(data);
      expect(vm.form.$errors.search.required).to.be.true;
      vm.model.search = 'testing';
      setTimeout(()=>{
        expect(vm.form.$errors.search.required).to.be.false;
        done();
      },0);
      
    });

    it('should only require values if they are displayed', () => {
      let data = {
        form: {
          $valid: true,
          $errors: {}
        },
        model: {
          conditional: '',
	  hiddenVal: ''
        },
        fields: [
          {
            key: 'conditional',
            type: 'test',
            required: true,
	    display: function(field, model){
	      return model.hiddenVal === 'test';
	    }
          }
        ]
      };
      
      createValidField(data);
      expect(vm.form.$errors.conditional.required).to.be.false;
      data.model.hiddenVal = 'test';
      vm.$children[0].validate();
      expect(vm.form.$errors.conditional.required).to.be.true;
      
    });

    it('should take an expression', (done) => {
      let data = {
        form: {
          $valid: true,
          $errors: {}
        },
        model: {
          search: 'testing'
        },
        fields: [
          {
            key: 'search',
            type: 'test',
            validators: {
              expression: 'model.search == "test"'
            }
          }
        ]
      };

      createValidField(data);
      expect(vm.form.$errors.search.expression).to.be.true;
      vm.model.search = 'test';
      setTimeout(()=>{
        expect(vm.form.$errors.search.expression).to.be.false;
        done();
      },0);
    });

    it('should not require non-required values', (done) => {
      let data = {
        form: {
          $valid: true,
          $errors: {}
        },
        model: {
          search: ''
        },
        fields: [
          {
            key: 'search',
            type: 'test',
            required: false,
            validators: {
              expression: 'field.value == "test"'
            }
          }
        ]
      };

      createValidField(data);
      expect(vm.form.$errors.search.expression).to.be.false;

      vm.model.search = 'testing';
      setTimeout(()=>{
        expect(vm.form.$errors.search.expression).to.be.true;
        done();
      },0);
    });  

    it('should take a function', (done) => {
      let data = {
        form: {
          $valid: true,
          $errors: {}
        },
        model: {
          search: 'testing'
        },
        fields: [
          {
            key: 'search',
            type: 'test',
            validators: {
              expression: function(field, model, next){
                let valid = model.search == 'test';
                next( valid );
                //return model.search == 'test';
              }
            }
          }
        ]
      };

      createValidField(data);
      expect(vm.form.$errors.search.expression).to.be.true;
      vm.model.search = 'test';
      setTimeout(()=>{
        expect(vm.form.$errors.search.expression).to.be.false;
        done();
      },0);
    });

    it('should run validators even if require does not exists and model is empty', done => {
      let data = {
        form: {
          $valid: true,
          $errors: {}
        },
        model: {
          search: null
        },
        fields: [
          {
            key: 'search',
            type: 'test',
            validators: {
              aValidator: () => done()
            }
          }
        ]
      };

      createValidField(data);
    })

    it('Async Validation', (done) => {
      let data = {
        form: {
          $valid: true,
          $errors: {}
        },
        model: {
          search: 'testing'
        },
        fields: [
          {
            key: 'search',
            type: 'test',
            validators: {
              asyncExpression: function(field, model, next){
                let valid = model.search == 'test';
                setTimeout( function(){
                  next( valid );
                }, 500);
              }
            }
          }
        ]
      };

      createValidField(data);
      expect(vm.form.$errors.search.asyncExpression).to.be.false;
      expect(vm.form.$errors.search.$async_asyncExpression).to.be.true;
      vm.model.search = 'test';      
      setTimeout(()=>{
        expect(vm.form.$errors.search.asyncExpression).to.be.false;
	expect(vm.form.$errors.search.$async_asyncExpression).to.be.false;
	expect(vm.form.$valid).to.be.true;
        done();
      },1000);
    });

    describe("Validation Messages", (done) => {

      //what do we want to do

      //--- define messages ---
      //vf.addValidationString('validatorKey', 'message');

      //add specific messages
      /*
       * validators: {
       *    test: {
       *      expression: function(){},
       *      message: '%l requires 10, you entered %s'
       *    }
       * }
       */

      it('Inline messages', () => {
        let data = {
          form: {
            $valid: true,
            $errors: {}
          },
          model: {
            search: 'testing'
          },
          fields: [
            {
              key: 'search',
              type: 'test',
              validators: {
                validatorMessage:
                {
                  expression: 'model.search == "test"',
                  message: 'Must equal test'
                }
              }
            }
          ]
        };

        createValidField(data);
        expect(vm.form.$errors.search.validatorMessage).to.equal('Must equal test');
      });

      it('Inline messages with a function', () => {
        let data = {
          form: {
            $valid: true,
            $errors: {}
          },
          model: {
            search: 'testing'
          },
          fields: [
            {
              key: 'search',
              type: 'test',
              validators: {
                validatorMessage:
                {
                  expression: function(field, model, next){
                    let valid = model.search == "test";
                    next(valid);
                  },
                  message: 'Must equal test'
                }
              }
            }
          ]
        };

        createValidField(data);
        expect(vm.form.$errors.search.validatorMessage).to.equal('Must equal test');
      });

      it('Inline messages with values parsed', () => {
        let data = {
          form: {
            $valid: true,
            $errors: {}
          },
          model: {
            search: 'testing'
          },
          fields: [
            {
              key: 'search',
              type: 'test',
              templateOptions: {
                label: 'test'
              },
              validators: {
                validatorMessage:
                {
                  expression: 'model.search == "test"',
                  message: '%l and %v'
                }
              }
            }
          ]
        };

        createValidField(data);
        expect(vm.form.$errors.search.validatorMessage).to.equal('test and testing');
      });

      it('Global messages with values parsed', () => {
        let data = {
          form: {
            $valid: true,
            $errors: {}
          },
          model: {
            search: 'testing'
          },
          fields: [
            {
              key: 'search',
              type: 'test',
	      required: true,
              templateOptions: {
                label: 'test'
              },
              validators: {
                validatorMessage: 'model.search == "test"',
              }
            }
          ]
        };

        //just mock the other vue functions
        Utils.validationMessages.validatorMessage = '%l and %v';
        
        createValidField(data);
        expect(vm.form.$errors.search.validatorMessage).to.equal('test and testing');
      });

      it('Global required message', () => {
        let data = {
          form: {
            $valid: true,
            $errors: {}
          },
          model: {
            search: ''
          },
          fields: [
            {
              key: 'search',
              type: 'test',
	      required: true,
              templateOptions: {
                label: 'test'
              }
            }
          ]
        };

        //just mock the other vue functions
        Utils.validationMessages.required = 'hello world';
        
        createValidField(data);
	expect(vm.form.$errors.search.required).to.equal('hello world');
      });
      
    });
    
  });
   
});

