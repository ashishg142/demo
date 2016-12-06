/*globals _*/
(function () {
    'use strict';

    angular
        .module('IMGDMSAPI')
        .directive('selectField', selectField);

    /** @ngInject */
    function selectField() {
        return {
            restrict: 'E',
            scope: {
                form: '=selectFieldForm',
                fieldId: '@selectFieldId',
                submitted: '=selectFieldSubmitted',
                model: '=selectFieldModel',
                required: '=selectFieldRequired',
                label: '@selectFieldLabel',
                data: '=selectFieldData',
                onchange: '=selectFieldOnchange'
            },
            templateUrl: 'app/components/selectField/selectField.html',
            controller: SelectFieldController,
            controllerAs: 'vm',
            bindToController: true,
            replace: true
        };

        /** @ngInject */
        function SelectFieldController() {
            var vm = this,
                newData = [];

            _.each(vm.data, function (d) {
                if (!angular.isObject(d)) {
                    newData.push({text: d, value: d});
                } else {
                    newData.push(d);
                }
            });

            vm.data = newData;
        }
    }

})();
