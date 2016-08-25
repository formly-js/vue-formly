export default function(Vue){
    //filter valid formly fields.
    //this shouldn't pass any $ fields. eg $errors or $valid
    Vue.filter('formlyFields', (fields) => {
        let re = /^\$/;
        let valid = Object.keys(fields).filter( (key) => {
            return !re.test(key);
        });
        return valid;
    });
}
