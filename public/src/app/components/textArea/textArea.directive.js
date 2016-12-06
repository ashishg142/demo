(function () {
    'use strict';

    angular
        .module('IMGDMSAPI')
        .directive('textArea', textArea);

    /** @ngInject */
    function textArea() {
        return {
            restrict: 'E',
            scope: {
                form: '=textAreaForm',
                fieldId: '@textAreaId',
                submitted: '=textAreaSubmitted',
                model: '=textAreaModel',
                required: '=textAreaRequired',
                label: '@textAreaLabel',
                minLength: '@textAreaMinlength',
                maxLength: '@textAreaMaxlength'
            },
            templateUrl: 'app/components/textArea/textArea.html',
            controller: FormAreaController,
            controllerAs: 'vm',
            bindToController: true,
            replace: true
        };

        /** @ngInject */
        function FormAreaController() {}
    }

})();
