import chai from 'chai';
const expect = chai.expect;
import Vue from 'vue';
import FormlyField from 'src/components/FormlyField.vue';

let el, vm;

function createForm(template, data){
    el = document.createElement('div');
    el.innerHTML = template;
    vm = new Vue({
        el: el,
        data: data,
        components: {
            'formly-field': FormlyField
        }
    });

    return [el, vm];
}

describe('FormlyField', () => {

    it('should take on the type of another component', () => {

        Vue.component('test', {
            props: ['form', 'key'],
            template: '<div id="testComponent">{{form.fields[key].type}}</div>'
        });

        let data = {
            form:{
                fields: {
                    test: {
                        type: 'test'
                    }
                }
            }
        };
        
        createForm('<formly-field :form="form" key="test"></formly-field>', data);

        let innerElem = vm.$el.querySelector('#testComponent');

        expect(innerElem.textContent).to.contain(data.form.fields.test.type);
        
    });

    it('should mimic the model of the parent', (done) => {

        Vue.component('test', {
            props: ['form', 'key'],
            template: '<input type="text" id="testInput" v-model="form.fields[key].value">'
        });

        let data = {
            form: {
                fields: {
                    search: {
                        type: 'test',
                        value: 'foo'
                    }
                }
            }
        };

        createForm('<formly-field :form.sync="form" key="search"></formly-field>', data);

        let input = vm.$el.querySelector('#testInput');

        expect(input.value).to.contain('foo');

        //change the value and expect a change
        vm.form.fields.search.value = 'bar';

        setTimeout(() => {
            expect(input.value).to.equal('bar');
            done();
        }, 0);
        
    });
    
});
