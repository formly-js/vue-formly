import {expect} from 'chai';

import VueFormly from 'src/index';


describe('module', () => {

    it('module props', () => {
        expect(VueFormly).to.exist;
        expect(VueFormly.install).to.be.a('function');
        expect(VueFormly.addType).to.be.a('function');
    });

    it('should add fields to Vue', () => {

        //mock vue
        window.Vue = {
            component(){}                
        };
        VueFormly.install(Vue);
        expect(Vue.$formlyFields).to.be.a('object');

        let newField = {
            foo: 'bar'
        };
        VueFormly.addType('test', newField);
        expect(Vue.$formlyFields.test).to.deep.equal(newField);
    });
    
});
