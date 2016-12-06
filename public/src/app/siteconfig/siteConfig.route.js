(function() {
    'use strict';

    angular
        .module('IMGDMSAPI')
        .config(routerConfig);

    /** @ngInject */
    function routerConfig($stateProvider) {
        $stateProvider
            .state('siteConfig', {
                url: '/siteconfig',
                templateUrl: 'app/siteconfig/siteConfigList.html',
                controller: 'SiteConfigListController',
                controllerAs: 'siteConfigList'
            })
            .state('siteConfig.show', {
                url: '/show',
                templateUrl: 'app/siteconfig/siteConfig.html',
                controller: 'SiteConfigController',
                controllerAs: 'siteConfig',
                params: {entry: null}
            });
    }

})();
