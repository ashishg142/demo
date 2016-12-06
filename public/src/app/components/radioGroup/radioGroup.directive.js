(function() {
    'use strict';

    angular
        .module('IMGDMSAPI')
        .directive('radioGroup', radioGroup);

    /** @ngInject */
    function radioGroup () {
        return {
            restrict: 'E',
            scope: {
                form: '=radioGroupForm',
                fieldId: '@radioGroupId',
                submitted: '=radioGroupSubmitted',
                model: '=radioGroupModel',
                required: '=radioGroupRequired',
                label: '@radioGroupLabel',
                data: '=radioGroupData'
            },
            templateUrl: 'app/components/radioGroup/radioGroup.html',
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
