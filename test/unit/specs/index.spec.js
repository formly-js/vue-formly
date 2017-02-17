import {expect} from 'chai';

import VueFormly from 'src/index';
import Util, {addType, getTypes, setError, addValidationMessage, parseValidationString} from 'src/util';


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
  
});
