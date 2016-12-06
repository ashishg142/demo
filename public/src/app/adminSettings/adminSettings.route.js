(function () {
    'use strict';

    angular
        .module('IMGDMSAPI')
        .config(routerConfig);

    /** @ngInject */
    function routerConfig($stateProvider) {
        $stateProvider
            .state('adminSettings', {
                url: '/adminSettings/:appId/:apiToken',
                templateUrl: 'app/adminSettings/adminSettings.html',
                controller: 'AdminSettingsController',
                controllerAs: 'adminSettings',
                params: {appId: null, apiToken: null}
            })
            .state('adminSettings.create', {
                url: '/create',
                templateUrl: 'app/adminSettings/adminSetting.html',
                controller: 'AdminSettingController',
                controllerAs: 'adminSetting',
                params: {tokenConfig: null}
            })
            .state('adminSettings.edit', {
                url: '/edit',
                templateUrl: 'app/adminSettings/adminSetting.html',
                controller: 'AdminSettingController',
                controllerAs: 'adminSetting',
                params: {adminSetting: null, tokenConfig: null}
            });
    }

})();
