import chai from 'chai';
const expect = chai.expect;
import Vue from 'vue';
import FormlyField from 'src/components/FormlyField.vue';

let el, vm;

function createForm(template, data){
    el = document.createElement('div');
  //el.innerHTML = template;
    vm = new Vue({
        el: el,
      data: data,
      template: template,
        components: {
            'formly-field': FormlyField
        }
    });

    return [el, vm];
}

/*
describe('FormlyField', () => {

    it('should take on the type of another component', () => {

        Vue.component('formly_test', {
            props: ['form', 'key'],
            template: '<div id="testComponent">{{form[key].type}}</div>'
        });

        let data = {
            form:{
                $errors: {},
                $valid: {},
                test: {
                    type: 'test'
                }
            }
        };
        
        createForm('<formly-field :form="form" key="test"></formly-field>', data);

        let innerElem = vm.$el.querySelector('#testComponent');

        expect(innerElem.textContent).to.contain(data.form.test.type);
        
    });

 
    it('should mimic the model of the parent', (done) => {

        Vue.component('formly_test', {
            props: ['form', 'key'],
            template: '<input type="text" id="testInput" v-model="form[key].value">'
        });

        let data = {
            form: {
                $errors: {},
                $valid: {},
                search: {
                    type: 'test',
                    value: 'foo'
                }
            }
        };

        createForm('<formly-field :form.sync="form" key="search"></formly-field>', data);

        let input = vm.$el.querySelector('#testInput');

        expect(input.value).to.contain('foo');

        //change the value and expect a change
        vm.form.search.value = 'bar';

        setTimeout(() => {
            expect(input.value).to.equal('bar');
            done();
        }, 0);
        
    });

    describe('Validation', ()=>{

        before(()=>{
            Vue.component('formly_test', {
                props: ['form', 'key'],
                template: '<div></div>'
            });
        });

        function createValidField(data){
            return createForm('<formly-field :form.sync="form" key="search"></formly-field>', data);
        };

        it('should handle required values', (done) => {

            let data = {
                form: {
                    $valid: true,
                    $errors: {},
                    search: {
                        type: 'test',
                        value: '',
                        required: true
                    }
                }
            };
            
            createValidField(data);
            expect(vm.form.$errors.search.required).to.be.true;

            vm.$set('form.search.value','testing');
            setTimeout(()=>{
                expect(vm.form.$errors.search.required).to.be.false;
                done();
            },0);
            
        });

        it('should take an expression', (done) => {
            let data = {
                form: {
                    $valid: true,
                    $errors: {},
                    search: {
                        type: 'test',
                        value: 'testing',
                        validators: {
                            expression: 'field.value == "test"'
                        }
                    }
                }
            };

            createValidField(data);
            expect(vm.form.$errors.search.expression).to.be.true;

            vm.$set('form.search.value', 'test');
            setTimeout(()=>{
                expect(vm.form.$errors.search.expression).to.be.false;
                done();
            },0);
        });

        it('should not require non-required values', (done) => {
            let data = {
                form: {
                    $valid: true,
                    $errors: {},
                    search: {
                        type: 'test',
                        value: '',
                        validators: {
                            expression: 'field.value == "test"'
                        }
                    }
                }
            };

            createValidField(data);
            expect(vm.form.$errors.search.expression).to.be.false;

            vm.$set('form.search.value', 'testing');
            setTimeout(()=>{
                expect(vm.form.$errors.search.expression).to.be.true;
                done();
            },0);
        });

        it('should take a function', (done) => {
            let data = {
                form: {
                    $valid: true,
                    $errors: {},
                    search: {
                        type: 'test',
                        value: 'testing',
                        validators: {
                            expression: function(field){
                                return field.value == 'test';
                            }
                        }
                    }
                }
            };

            createValidField(data);
            expect(vm.form.$errors.search.expression).to.be.true;

            vm.$set('form.search.value', 'test');
            setTimeout(()=>{
                expect(vm.form.$errors.search.expression).to.be.false;
                done();
            },0);
        });
        
    });
    
});
*/
