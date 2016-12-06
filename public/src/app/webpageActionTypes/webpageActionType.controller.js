(function () {
    'use strict';

    angular
        .module('IMGDMSAPI')
        .controller('WebpageActionTypeController', WebpageActionTypeController);

    /** @ngInject */
    function WebpageActionTypeController($scope, $stateParams, RestService, Notification, $translate) {
        var vm = this,
            service = RestService.init('webpageActionType');

        service.setAppToken($stateParams.tokenConfig.appId,$stateParams.tokenConfig.apiToken);
        $translate(['GLOBAL.CREATE.SUCCESS','GLOBAL.UPDATE.SUCCESS'], {type: 'WebpageActionType'}).then(function (translations) {
           vm.translations = translations;
        });

        vm.submitted = false;

        vm.defaultWebpageActionType = {
            webpage_action_type: '',
            webpage_action_type_desc: '',
            inactive: 0
        };

        vm.inactive = [
            {text: 'Inactive', value: 1},
            {text: 'Active', value: 0}
        ];

        vm.webpageActionType = ($stateParams.webpageActionType) ? angular.copy($stateParams.webpageActionType) : angular.copy(vm.defaultWebpageActionType);

        var reset = function () {
            vm.webpageActionType = angular.copy(vm.defaultWebpageActionType);
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
         * Creates an webpageActionTypeWebpageActionType or updates it (through AJAX request)
         *
         * @param isValid
         */
        vm.save = function (isValid) {
            vm.submitted = true;

            if (isValid) {
                if (vm.webpageActionType.hasOwnProperty('webpage_action_typeid')) {
                    service.update(vm.webpageActionType.webpage_action_typeid, vm.webpageActionType).then(function (response) {
                        if (response.success) {
                            $scope.$emit('REFRESH');
                            vm.cancel();

                            Notification.success(vm.translations['GLOBAL.UPDATE.SUCCESS']);
                        } else {
                            Notification.error(response.message);
                        }
                    });
                } else {
                    service.create(vm.webpageActionType).then(function (response) {
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
