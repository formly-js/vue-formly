import {expect} from 'chai';
import Vue from 'vue';
import VueFormly from 'src/index';
import Util, {addType, getTypes, setError, addValidationMessage, parseValidationString, set} from 'src/util';


describe('module', () => {

  it('module props', () => {
    expect(VueFormly).to.exist;
    expect(VueFormly.install).to.be.a('function');
    expect(VueFormly.addType).to.be.a('function');
    expect(VueFormly.getTypes).to.be.a('function');
    expect(VueFormly.addValidationMessage).to.be.a('function');
    expect(addType).to.be.a('function');
    expect(getTypes).to.be.a('function');
    expect(setError).to.be.a('function');
    expect(Util.formlyFields).to.be.a('object');
  });

  it('addType()', () => {

    //mock vue
    window.Vue = {
      component(){},
      filter(){}
    };
    VueFormly.install(Vue);

    let newField = {
      foo: 'bar'
    };
    addType('test', newField);
    expect(getTypes().formly_test).to.deep.equal(newField);
  });

  it('setError()',()=>{
    let form = {
      $errors: {}
    };
    setError(form, 'fname', 'required', true);
    expect(form.$errors.fname.required).to.be.true;

    setError(form, 'fname', 'required', false);
    expect(form.$errors.fname.required).to.be.false;

    setError(form, 'fname', 'required', true, 'Hey there');
    expect(form.$errors.fname.required).to.equal('Hey there');

    setError(form, 'fname', 'required', false, 'Hey there');
    expect(form.$errors.fname.required).to.be.false;
  });

  it('addValidationMessage()', () => {
    addValidationMessage('test', 'testing');
    expect(Util.validationMessages.test).to.equal('testing');
  });

  it('parseValidationString()', () => {
    addValidationMessage('parseTest', '%l just %v testing');
    let message = '%l just %v testing';
    let expected = 'label just value testing';
    let output = parseValidationString('parseTest', false, 'label', 'value');
    expect(output).to.equal(expected);
    
    output = parseValidationString(false, message, 'label', 'value');
    expect(output).to.equal(expected);

    output = parseValidationString('blahblahblah', false, '', '');
    expect(output).to.be.false;
  });

  describe('set()', () => {

    it('should be present on the Vue instance', () => {
      const test = new Vue();
      expect(test.$formlySet).to.be.a('function');
    });

    it('should take a nested field', () => {
      const test = new Vue({
	data: {
	  deeply: {
	    nested: {
	      child: 'foo'
	    }
	  }
	}
      });

      expect(test.deeply.nested.child).to.equal('foo');
      test.$formlySet(test.deeply, 'nested.child', 'bar');
      expect(test.deeply.nested.child).to.equal('bar');
    });

    it('should set dotted properties', () => {
      const test = new Vue({
	data: {
	  deeply: {
	    'nested.child': 'foo'
	  }
	}
      });
      
      test.$formlySet(test.deeply, 'nested.child', 'bar');
      expect(test.deeply['nested.child']).to.equal('bar');
    });
    
  });

  describe("Directives", () => {

    it('formly-atts', () => {
      let atts = {
	placeholder: 'testing',
	foo: 'bar'
      };

      let el = document.createElement('div');
      
      let vm = new Vue({
	data: {
	  atts: atts
	},
	template: '<div v-formly-atts="atts"></div>'
      }).$mount(el);

      expect(vm.$el.getAttribute('placeholder')).to.equal(atts.placeholder);
      expect(vm.$el.getAttribute('foo')).to.equal(atts.foo);
    });

    it('formly-input-type', () => {

      let el = document.createElement('div');
      
      let vm = new Vue({
	data: {
	  type: 'email'
	},
	template: '<input type="text" v-formly-input-type="type">'
      }).$mount(el);

      expect(vm.$el.getAttribute('type')).to.equal('email');
      
    });
    
  });
  
});
