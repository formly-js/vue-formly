import {expect} from 'chai';
import Vue from 'vue';
import VueFormly from 'src/index';
Vue.use(VueFormly);

let el, vm;

function createForm(template){
    el = document.createElement('div');
    el.innerHTML = template;
    vm = new Vue({
        el: el
    });

    return [el, vm];
}

describe('VueFormly', () => {

    it('should create two new components', () => {
        createForm('<vue-formly></vue-formly><vf-input></vf-input>');

        console.log(vm.$el);
        console.log(vm.$refs);
        
    });
});
