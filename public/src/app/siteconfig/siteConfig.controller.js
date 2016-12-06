(function () {
    'use strict';

    angular
        .module('IMGDMSAPI')
        .controller('SiteConfigController', SiteConfigController);

    /** @ngInject */
    function SiteConfigController($scope, $stateParams, RestService, $translate, Notification) {
        var vm = this,
            service = RestService.init('siteConfig');

        $translate(['GLOBAL.CREATE.SUCCESS','GLOBAL.UPDATE.SUCCESS'], {type: 'Site Config Entry'}).then(function (translations) {
            vm.translations = translations;
        });

        vm.entry = ($stateParams.entry) ? angular.copy($stateParams.entry) : null;
        vm.submitted = false;

        vm.statuses = [
            {text: 'Active', value: 0},
            {text: 'Inactive', value: 1}
        ];

        /**
         * Closes the sideview
         */
        vm.cancel = function () {
            $scope.$emit('CLOSE_SIDEVIEW');
        };

        /**
         * Creates a new entry or updates it (through AJAX request)
         *
         * @param isValid
         */
        vm.save = function (isValid) {
            vm.submitted = true;

            if (isValid) {
                if (vm.entry.hasOwnProperty('site_configid')) {
                    service.update(vm.entry.site_configid, vm.entry).then(function (response) {
                        if (response.success) {
                            $scope.$emit('REFRESH');
                            $scope.$emit('CLOSE_SIDEVIEW');

                            Notification.success(vm.translations['GLOBAL.UPDATE.SUCCESS']);
                        } else {
                            Notification.error(response.message);
                        }
                    });
                } else {
                    service.create(vm.entry).then(function (response) {
                        if (response.success) {
                            $scope.$emit('REFRESH');
                            $scope.$emit('CLOSE_SIDEVIEW');

                            Notification.success(vm.translations['GLOBAL.CREATE.SUCCESS']);
                        } else {
                            Notification.error(response.message);
                        }
                    });
                }
            }
        };
    }
})();
