(function () {
    'use strict';

    angular
        .module('IMGDMSAPI')
        .directive('tinyMce', tinyMce);

    /** @ngInject */
    function tinyMce() {
        return {
            restrict: 'E',
            scope: {
                form: '=tinyMceForm',
                fieldId: '@tinyMceId',
                submitted: '=tinyMceSubmitted',
                model: '=tinyMceModel',
                required: '=tinyMceRequired',
                label: '@tinyMceLabel'
            },
            templateUrl: 'app/components/tinymce/tinymce.html',
            controller: TinyMceController,
            controllerAs: 'vm',
            bindToController: true,
            replace: true
        };

        /** @ngInject */
        function TinyMceController() {
            var vm = this;

            vm.options = {
                inline: false,
                theme: 'modern'
            };
        }
    }

})();
