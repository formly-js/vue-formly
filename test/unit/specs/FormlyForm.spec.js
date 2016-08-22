import chai from 'chai';
const expect = chai.expect;
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import Vue from 'vue';
import FormlyForm from 'src/components/FormlyForm.vue';
chai.use(sinonChai);

//mock our formly-field component
let FormlyField = Vue.extend({
    template: '<div class="formly-field"><pre id="{{field.key}}_field">{{field | json}}</pre><pre id="{{field.key}}_model">{{model | json}}</pre></div>',
    props: ['field', 'model']
});

let el, vm;

function createForm(template, data){
    el = document.createElement('div');
    el.innerHTML = template;
    vm = new Vue({
        el: el,
        data: data,
        components: {
            'formly-form': FormlyForm
        }
    });

    return [el, vm];
}

describe('FormlyForm', () => {

    beforeEach( () => {
        //ensure that our mocked component is there
        Vue.component('formly-field', FormlyField);
    });

    it('should create a subset of components with the right data', () => {

        let data = {
            schema: [
                {
                    key: 'fname',
                    type: 'input'
                },
                {
                    key: 'lname',
                    type: 'input'
                }
            ],
            model: {
                fname: '',
                lname: 'smith'
            }
        };

        createForm('<formly-form :fields="schema" :model="model"></formly-form>', data);

        //check the elements have been created
        expect(vm.$el.querySelectorAll('fieldset')).to.be.length(1);
        expect(vm.$el.querySelectorAll('.formly-field')).to.be.length(2);

        //check their data
        expect(vm.$el.querySelector('#lname_model').textContent).to.contain('smith');
        expect(JSON.parse(vm.$el.querySelector('#lname_field').textContent)).to.deep.equal(data.schema[1]);
        
    });
    
});
