export default function(Vue){
  
  /**
   * Allows the user to pass extra attributes that should be added to the element. Such as placeholder etc etc
   * @param {Object} value
   */
  Vue.directive('formly-atts',{
    bind:function(el, binding){
      
      if ( !binding.value ) return;
      
      Object.keys(binding.value).forEach((key) => {
        el.setAttribute(key, binding.value[key]);
      });
      
    }
  });

  /**
   * In Vue 2.0 we cannot bind the :type and v-model at the same time.
   * They recommended using if statements to render our elements, but that's just ridiculous for a project like this
   * So instead we'll use this directive to add the type when the element is bound
   */
  Vue.directive('formly-input-type', {
    bind: function(el, binding){
      if ( !binding.value ) return;

      el.setAttribute('type', binding.value);
    }
  });
  
}
