(function () {
    'use strict';

    angular
        .module('IMGDMSAPI')
        .directive('numberField', numberField);

    /** @ngInject */
    function numberField() {
        return {
            restrict: 'E',
            scope: {
                form: '=numberFieldForm',
                fieldId: '@numberFieldId',
                submitted: '=numberFieldSubmitted',
                model: '=numberFieldModel',
                required: '=numberFieldRequired',
                label: '@numberFieldLabel',
                minLength: '@numberFieldMinlength',
                maxLength: '@numberFieldMaxlength'
            },
            templateUrl: 'app/components/numberField/numberField.html',
            controller: NumberFieldController,
            controllerAs: 'vm',
            bindToController: true,
            replace: true
        };

        /** @ngInject */
        function NumberFieldController() {
            var vm = this;

            vm.integerval = /^\d*$/;

            vm.model[vm.fieldId] = parseInt(vm.model[vm.fieldId]);
        }
    }

})();
