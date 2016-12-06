/*globals _*/
(function () {
    'use strict';

    angular
        .module('IMGDMSAPI')
        .controller('TokenController', TokenController);

    /** @ngInject */
    function TokenController($scope, $stateParams, RestService, Notification, $translate) {
        var vm = this,
            service = RestService.init('appToken'),
            appService = RestService.init('app'),
            siteConfigService = RestService.init('siteConfig');

        $translate(['GLOBAL.CREATE.SUCCESS','GLOBAL.UPDATE.SUCCESS'], {type: 'AppToken'}).then(function (translations) {
           vm.translations = translations;
        });

        vm.submitted = false;

        vm.defaultToken = {
            app: '',
            app_priv_key: '',
            app_pub_key: '',
            app_key_method: 'AES-128-CBC'
        };

        vm.keyMethods = [
            {text: 'AES-128-CBC', value: 'AES-128-CBC'},
            {text: 'AES-256-CBC', value: 'AES-256-CBC'}
        ];

        vm.apps = [];
        vm.siteConfigs = [];

        vm.minLength = 16;
        vm.maxLength = 16;

        vm.token = ($stateParams.token) ? angular.copy($stateParams.token) : angular.copy(vm.defaultToken);

        //Retrieve app listing
        appService.list().then(function (response) {
            _.each(response.apps, function (app) {
                vm.apps.push({
                    text: app.app,
                    value: app.appid
                });
            });
        });

        //Retrieve site config listing
        siteConfigService.list().then(function (response) {
            _.each(response.data, function (config) {
                vm.siteConfigs.push({
                    text: config.tbl_prefix,
                    value: config.site_configid
                });
            });
        });

        var reset = function () {
            vm.token = angular.copy(vm.defaultToken);
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
         * Creates an appToken or updates it (through AJAX request)
         *
         * @param isValid
         */
        vm.save = function (isValid) {
            vm.submitted = true;

            if (isValid) {
                if (vm.token.hasOwnProperty('app_tokenid')) {
                    service.update(vm.token.app_tokenid, vm.token).then(function (response) {
                        if (response.success) {
                            $scope.$emit('REFRESH');
                            vm.cancel();

                            Notification.success(vm.translations['GLOBAL.UPDATE.SUCCESS']);
                        } else {
                            Notification.error(response.message);
                        }
                    });
                } else {
                    service.create(vm.token).then(function (response) {
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

        /**
         * Handles <select> event when change is made and sets up the correct field lengths for the private key
         */
        vm.keyMethodChange = function () {
            if (vm.token.app_key_method === 'AES-256-CBC') {
                vm.minLength = 32;
                vm.maxLength = 32;
            } else {
                vm.minLength = 16;
                vm.maxLength = 16;
            }
        };
    }
})();
