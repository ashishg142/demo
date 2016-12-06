/*globals _*/
(function () {
    'use strict';

    angular
        .module('IMGDMSAPI')
        .controller('AdminSettingController', AdminSettingController);

    /** @ngInject */
    function AdminSettingController($scope, $stateParams, RestService, Notification, $translate) {
        var vm = this,
            service = RestService.init('adminSetting'),
            typeService = RestService.init('adminSettingType');

        service.setAppToken($stateParams.tokenConfig.appId, $stateParams.tokenConfig.apiToken);

        $translate(['GLOBAL.CREATE.SUCCESS', 'GLOBAL.UPDATE.SUCCESS'], {type: 'AdminSetting'}).then(function (translations) {
            vm.translations = translations;
        });

        vm.submitted = false;

        vm.defaultAdminSetting = {
            admin_setting: '',
            admin_setting_val: '',
            admin_setting_typeid: '',
            auto_load: 0,
            enable_short_code: 0,
            frm_fldid: 0,
            fld_order: 0,
            inactive: 0
        };

        vm.types = [];

        vm.inactive = [
            {text: 'Inactive', value: 1},
            {text: 'Active', value: 0}
        ];

        vm.adminSetting = ($stateParams.adminSetting) ? angular.copy($stateParams.adminSetting) : angular.copy(vm.defaultAdminSetting);

        var reset = function () {
            vm.adminSetting = angular.copy(vm.defaultAdminSetting);
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
         * Creates an adminSettingAdminSetting or updates it (through AJAX request)
         *
         * @param isValid
         */
        vm.save = function (isValid) {
            vm.submitted = true;

            if (isValid) {
                if (vm.adminSetting.hasOwnProperty('admin_settingid')) {
                    service.update(vm.adminSetting.admin_settingid, vm.adminSetting).then(function (response) {
                        if (response.success) {
                            $scope.$emit('REFRESH');
                            vm.cancel();

                            Notification.success(vm.translations['GLOBAL.UPDATE.SUCCESS']);
                        } else {
                            Notification.error(response.message);
                        }
                    });
                } else {
                    service.create(vm.adminSetting).then(function (response) {
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

        typeService.list().then(function (response) {
            _.each(response.admin_setting_types, function (type) {
                vm.types.push({
                    text: type.admin_setting_type,
                    value: type.admin_setting_typeid
                });
            });
        });
    }
})();
