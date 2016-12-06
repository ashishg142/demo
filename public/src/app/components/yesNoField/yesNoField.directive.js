(function () {
    'use strict';

    angular
        .module('IMGDMSAPI')
        .directive('yesNoField', yesNoField);

    /** @ngInject */
    function yesNoField() {
        return {
            restrict: 'E',
            scope: {
                form: '=yesNoFieldForm',
                fieldId: '@yesNoFieldId',
                submitted: '=yesNoFieldSubmitted',
                model: '=yesNoFieldModel',
                required: '=yesNoFieldRequired',
                label: '@yesNoFieldLabel'
            },
            templateUrl: 'app/components/yesNoField/yesNoField.html',
            controller: YesNoFieldController,
            controllerAs: 'vm',
            bindToController: true
        };

        /** @ngInject */
        function YesNoFieldController() {
            var vm = this;
            
            vm.data = [
                {text: 'Yes', value: 'y'},
                {text: 'No', value: 'n'}
            ];
        }
    }

})();
