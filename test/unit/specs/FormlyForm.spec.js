import chai from 'chai';
const expect = chai.expect;
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import Vue from 'vue';
import FormlyForm from 'src/components/FormlyForm.vue';
import Filters from 'src/filters/index';
Vue.component('formly-form', FormlyForm);
chai.use(sinonChai);
//install our filters
Filters(Vue);

//mock our formly-field component
let FormlyField = Vue.extend({
    template: '<div class="formly-field"><pre id="{{key}}_field">{{form[key] | json}}</pre><pre id="{{key}}_model">{{form[key].value | json}}</pre></div>',
    props: ['form', 'key']
});

//our formly specific field
let FormlyRestrictedField = Vue.extend({
    template: '<div class="restricted-field"></div>'
});


let el, vm;

function createForm(template, data){
    el = document.createElement('div');
    el.innerHTML = template;
    vm = new Vue({
        el: el,
        data: data
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
            form: {
                fname: {
                    type: 'input'
                },
                lname: {
                    type: 'input',
                    value: 'smith'
                }
            }
        };

        createForm('<formly-form :form="form"></formly-form>', data);

        //check the elements have been created
        expect(vm.$el.querySelectorAll('fieldset')).to.be.length(1);
        expect(vm.$el.querySelectorAll('.formly-field')).to.be.length(2);

        //check their data
        expect(vm.$el.querySelector('#lname_model').textContent).to.contain('smith');
        expect(JSON.parse(vm.$el.querySelector('#lname_field').textContent)).to.deep.equal(data.form.lname);
        expect(JSON.parse(vm.$el.querySelector('#fname_field').textContent)).to.deep.equal({type: 'input', value: ''});
        expect(data.form.$errors).to.deep.equal({});
        expect(data.form.$valid).to.be.true;
        
    });

    it('should restrict some components to formly itself', () => {
        sinon.spy(console, 'error');

        //re-create the formly field
        Vue.component('formly-field', (resolve) =>{
            resolve({
                props: ['form', 'key'],
                template: '<component :is="form[key].type"></component>',
                components: Vue.$formlyFields
            });
        });

        Vue.$formlyFields = {
            'restricted': FormlyRestrictedField
        };

        let data = {
            form: {
                fname: {
                    type: 'restricted'
                }
            }
        };
        createForm('<formly-form :form="form"></formly-form><restricted></restricted>', data);

        expect(console.error).to.be.called.once;
        expect(vm.$el.querySelectorAll('.restricted-field')).to.be.length(1);
        expect(vm.$el.querySelectorAll('fieldset .restricted-field')).to.be.length(1);
        
    });

    it('should compute any errors', (done) => {
        let data = {
            form: {
                
            }
        };
        createForm('<formly-form :form="form"></formly-form>', data);
        expect(vm.form.$errors).to.deep.equal({});
        expect(vm.form.$valid).to.be.true;
        vm.$set('form.$errors.test', 'testing');

        setTimeout(()=>{
            expect(vm.form.$valid).to.be.false;
            done();
        },0);
    });
    
});
