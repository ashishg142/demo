(function () {
    'use strict';

    angular
        .module('IMGDMSAPI')
        .controller('ErrorController', ErrorController);

    /** @ngInject */
    function ErrorController($scope, $stateParams) {
        var vm = this;

        vm.error = ($stateParams.error) ? angular.copy($stateParams.error) : null;

        /**
         * Closes the sideview
         */
        vm.cancel = function () {
            $scope.$emit('CLOSE_SIDEVIEW');
        };
    }
})();
