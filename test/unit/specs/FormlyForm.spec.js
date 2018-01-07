import chai from 'chai';
const expect = chai.expect;
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import Vue from 'vue';
import FormlyForm from 'src/components/FormlyForm';
import Filters from 'src/filters/index';
Vue.component('formly-form', FormlyForm);
chai.use(sinonChai);
//install our filters
Filters(Vue);

//mock our formly-field component
let FormlyField = Vue.extend({
  template: '<div class="formly-field"><pre :id="field.key+\'_field\'">{{field}}</pre><pre :id="field.key+\'_model\'">{{model[ field.key ]}}</pre></div>',
  props: ['form', 'model', 'field']
});

//our formly specific field
let FormlyRestrictedField = Vue.extend({
  template: '<div class="restricted-field"></div>'
});


let el, vm;

function createForm(template, data){
  el = document.createElement('div');
  //el.innerHTML = template;
  vm = new Vue({
    data: data,
    template: template
  }).$mount(el);

  return [el, vm];
}


describe('FormlyForm', () => {

  beforeEach( () => {
    //ensure that our mocked component is there
    Vue.component('formly-field', FormlyField);
  });

  
  it('should create a subset of components with the right data', () => {

    let data = {
      form: {},
      model: {
        fname: '',
        lname: 'smith'
      },
      fields: [        
        {
          key: 'fname',
          type: 'input'
        },
        {
          key: 'lname',
          type: 'input'
        }
      ]
    };

    createForm('<formly-form ref="form" :form="form" :model="model" :fields="fields"></formly-form>', data);

    //check the elements have been created

    expect(vm.$el.tagName).to.equal('FIELDSET');
    expect(vm.$el.querySelectorAll('.formly-field')).to.be.length(2);

    //check their data
    expect(vm.$refs.form.$refs.fname.$vnode.key).to.equal('formly_fname');
    expect(vm.$refs.form.$refs.lname.$vnode.key).to.equal('formly_lname')
    expect(vm.$el.querySelector('#lname_model').textContent).to.contain('smith');
    expect(JSON.parse(vm.$el.querySelector('#fname_field').textContent)).to.deep.equal(data.fields[0]);
    expect(JSON.parse(vm.$el.querySelector('#lname_field').textContent)).to.deep.equal(data.fields[1]);
    expect(data.form.$errors).to.deep.equal({});
    expect(data.form.$valid).to.be.true;
    
  });

  
  it('should allow using a custom tag', () => {

    let data = {
      form: {},
      model: {
        fname: '',
      },
      fields: [        
        {
          key: 'fname',
          type: 'input'
        },
      ]
    };

    createForm('<formly-form ref="form" :form="form" :model="model" :fields="fields" tag="div"></formly-form>', data);

    //check the element have been created

    expect(vm.$el.tagName).to.equal('DIV');  
  });

  it('Should not display fields if custom-layout is set', () => {

    let data = {
      form: {},
      model: {
        fname: '',
        lname: 'smith'
      },
      fields: [        
        {
          key: 'fname',
          type: 'input'
        },
        {
          key: 'lname',
          type: 'input'
        }
      ]
    };

    createForm('<formly-form :form="form" :model="model" :fields="fields" custom-layout="true"><template scope="f"><formly-field :form.sync="form" :model.sync="model" :field="f.keys.fname"></formly-field></template></formly-form>', data);

    //check the elements have been created
    expect(vm.$el.querySelectorAll('.formly-field')).to.be.length(1);

    //check their data
    expect(JSON.parse(vm.$el.querySelector('#fname_field').textContent)).to.deep.equal(data.fields[0]);
    expect(data.form.$errors).to.deep.equal({});
    expect(data.form.$valid).to.be.true;
    
  });

  
  it('should restrict some components to formly itself', () => {
    sinon.spy(console, 'error');

    //re-create the formly field
    Vue.component('formly-field', (resolve) =>{
      resolve({
        props: ['form', 'model', 'field'],
        template: '<component :is="field.type"></component>',
        components: Vue.$formlyFields
      });
    });

    Vue.$formlyFields = {
      'restricted': FormlyRestrictedField
    };

    let data = {
      form: {},
      fields: [
        {
          key: 'fname',
          type: 'restricted'
        }
      ],
      model: {}
    };
    createForm('<div><formly-form :form="form" :fields="fields" :model="model"></formly-form><restricted></restricted></div>', data);

    expect(console.error).to.be.called.once;
    expect(vm.$el.querySelectorAll('.restricted-field')).to.be.length(1);
    expect(vm.$el.querySelectorAll('fieldset .restricted-field')).to.be.length(1);
    
  });
  
  it('should compute any errors', (done) => {
    let data = {
      form: {},
      model: {},
      fields: []
    };
    createForm('<formly-form :form="form" :model="model" :fields="fields"></formly-form>', data);
    expect(vm.form.$errors).to.deep.equal({});
    expect(vm.form.$valid).to.be.true;
    vm.$set(vm.form.$errors, 'test', {foo: true});

    setTimeout(()=>{
      expect(vm.form.$valid).to.be.false;
      done();
    },0);
  });

  it('should skip empty errors', (done)=>{
    let data = {
      form: {},
      model: {},
      fields: []
    };
    createForm('<formly-form :form="form" :model="model" :fields="fields"></formly-form>', data);
    vm.$set(vm.form.$errors, 'test', {foo: false});
    setTimeout(() => {
      expect(vm.form.$valid).to.be.true;
      done();
    });
  });

  it('validate()', (done)=>{
    let formlyFieldSpy = sinon.spy();
    let ValidField = Vue.extend({
      template: '<h1>ValidationField</h1>',
      props: ['form', 'model', 'field'],
      methods: {
	validate(){
	  return new Promise(function(resolve, reject){
	    formlyFieldSpy();
	    resolve();
	  });
	}
      }
    });

    let data = {
      form: {
	validTest: {
	  $dirty: false
	},
	validTest2: {
	  $dirty: false
	}
      },
      model: {validTest:'', validTest2: ''},
      fields: [{
	key: 'validTest',
	type: 'input'
      },
	{
	  key: 'validTest2',
	  type: 'input'
	}]
    };

    el = document.createElement('DIV');
    document.body.appendChild(el);
    Vue.component('formly-field', ValidField);
    vm = new Vue({
      data: data,
      template: '<formly-form :form="form" :model="model" :fields="fields"></formly-form>'
    }).$mount(el);
    
    let spy = sinon.spy();

    let prom = vm.$children[0].validate();
    prom.then(()=>spy());
    setTimeout(()=>{
      spy.should.be.calledOnce;
      formlyFieldSpy.should.be.calledTwice;
      done();
    });
  });
});

