import {expect} from 'chai';

import VueFormly from 'src/index';
import Util, {addType, getTypes, addError, removeError} from 'src/util';


describe('module', () => {

    it('module props', () => {
        expect(VueFormly).to.exist;
        expect(VueFormly.install).to.be.a('function');
        expect(VueFormly.addType).to.be.a('function');
        expect(VueFormly.getTypes).to.be.a('function');
        expect(addType).to.be.a('function');
        expect(getTypes).to.be.a('function');
        expect(addError).to.be.a('function');
        expect(removeError).to.be.a('function');
        expect(Util.formlyFields).to.be.a('object');
    });

    it('should add fields to Vue', () => {

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

    it('should handle errors',()=>{
        let form = {
            '$errors': {}
        };
        addError(form, 'fname', 'required');
        expect(form.$errors.fname.required).to.be.true;

        removeError(form, 'fname', 'required');
        expect(typeof form.$errors.fname).to.equal('undefined');
    });
    
});
