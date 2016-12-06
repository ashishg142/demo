(function () {
    'use strict';

    angular
        .module('IMGDMSAPI')
        .controller('AppController', AppController);

    /** @ngInject */
    function AppController($scope, $stateParams, RestService, Notification, $translate) {
        var vm = this,
            service = RestService.init('app');

        $translate(['GLOBAL.CREATE.SUCCESS','GLOBAL.UPDATE.SUCCESS'], {type: 'App'}).then(function (translations) {
           vm.translations = translations;
        });

        vm.submitted = false;

        vm.defaultApp = {
            app: '',
            external: ''
        };

        vm.externalSelections = [
            {text: 'Yes', value: 1},
            {text: 'No', value: 0}
        ];

        vm.app = ($stateParams.app) ? angular.copy($stateParams.app) : angular.copy(vm.defaultApp);

        var reset = function () {
            vm.app = angular.copy(vm.defaultApp);
            vm.submitted = false;
        };

        /**
         * Closes the side-view
         */
        vm.cancel = function () {
            reset();

            $scope.$emit('CLOSE_SIDEVIEW');
        };

        /**
         * Creates an appApp or updates it (through AJAX request)
         *
         * @param isValid
         */
        vm.save = function (isValid) {
            vm.submitted = true;

            if (isValid) {
                if (vm.app.hasOwnProperty('appid')) {
                    service.update(vm.app.appid, vm.app).then(function (response) {
                        if (response.success) {
                            $scope.$emit('REFRESH');
                            vm.cancel();

                            Notification.success(vm.translations['GLOBAL.UPDATE.SUCCESS']);
                        } else {
                            Notification.error(response.message);
                        }
                    });
                } else {
                    service.create(vm.app).then(function (response) {
                        if (response.success) {
                            $scope.$emit('REFRESH');
                            vm.cancel();

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
