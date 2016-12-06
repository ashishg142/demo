(function() {
    'use strict';

    angular
        .module('IMGDMSAPI')
        .directive('checkboxGroup', checkboxGroup);

    /** @ngInject */
    function checkboxGroup () {
        return {
            restrict: 'E',
            scope: {
                form: '=checkboxGroupForm',
                fieldId: '@checkboxGroupId',
                submitted: '=checkboxGroupSubmitted',
                model: '=checkboxGroupModel',
                required: '=checkboxGroupRequired',
                label: '@checkboxGroupLabel',
                data: '=checkboxGroupData'
            },
            templateUrl: 'app/components/checkboxGroup/checkboxGroup.html',
            controller: FormFieldController,
            controllerAs: 'vm',
            bindToController: true,
            replace: true
        };

        /** @ngInject */
        function FormFieldController () {

        }
    }

})();
