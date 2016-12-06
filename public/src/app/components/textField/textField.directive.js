(function () {
    'use strict';

    angular
        .module('IMGDMSAPI')
        .directive('textField', textField);

    /** @ngInject */
    function textField() {
        return {
            restrict: 'E',
            scope: {
                form: '=textFieldForm',
                fieldId: '@textFieldId',
                submitted: '=textFieldSubmitted',
                model: '=textFieldModel',
                required: '=textFieldRequired',
                label: '@textFieldLabel',
                minLength: '@textFieldMinlength',
                maxLength: '@textFieldMaxlength'
            },
            templateUrl: 'app/components/textField/textField.html',
            controller: FormFieldController,
            controllerAs: 'vm',
            bindToController: true,
            replace: true
        };

        /** @ngInject */
        function FormFieldController() {}
    }

})();
