import {expect} from 'chai';

import VueFormly from 'src/index';


describe('module', () => {

    it('module props', () => {
        expect(VueFormly).to.exist;
        expect(VueFormly.install).to.be.a('function');        
    });
    
});
