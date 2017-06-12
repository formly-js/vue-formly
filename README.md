# Vue Formly

Vue Formly is a JS based form builder heavily inspired by [Angular Formly](http://angular-formly.com/). Vue Formly was designed to provide an easy way to keep your forms consistent and to remove bloat from your code. As there's no "one way" to design your forms, Vue Formly allows you to create custom input types which you can use in your form schemas. Vue Formly itself does not come with any inputs pre-loaded but a set of Boostrap form inputs can be installed over at [Vue Formly Bootstrap](https://github.com/formly-js/vue-formly-bootstrap).

*NOTE*
This is version 2 of Vue Formly and is only compatible with Vue 2.x. If you are wanting to use this with Vue 1.x then check out the [Vue Formly 1 Branch](https://github.com/formly-js/vue-formly/tree/1.0).

## Installation
```
npm install vue-formly
```
Or via a script
```html
<script src="your_dir/vue-formly/vue-formly.min.js"></script>
```
## Usage
Take a look at the [docs](https://matt-sanders.gitbooks.io/vue-formly/content/v/2.0/) for extended information about using Formly and creating custom input types. But here is a quick example:
*NOTE* that for Vue Formly to work correctly you must also include a set of input types. You can either create your own or check out [Vue Formly Bootstrap](https://github.com/formly-js/vue-formly-bootstrap) which has many already created for you.
```html
<div id="app">
   <form @submit="handleSubmission">
      <formly-form :form="form" :model="model" :fields="fields"></formly-form>
      <button>Submit</button>
   </form>
</div>
```
```js
new Vue({
   el: '#app',
   data: {
      model: {
         name: '',
         email: '',
         password: ''
      },
      form: {},
      fields: [
         {
            key: 'name',
            type: 'input',
            required: true
         },
         {
            key: 'email',
            type: 'input',
            templateOptions: {
               type: 'email'
            },
            required: true,
            validators: {
               validEmail: checkEmailFunction
            }
         },
         {
            key: 'password',
            type: 'input',
            templateOptions: {
               type: 'password'
            },
            required: true,
            validators: {
               validPassword: checkPasswordFunction
            }
         }
      ]
   }
});
```
