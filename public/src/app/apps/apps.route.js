(function() {
    'use strict';

    angular
        .module('IMGDMSAPI')
        .config(routerConfig);

    /** @ngInject */
    function routerConfig($stateProvider) {
        $stateProvider
            .state('apps', {
                url: '/apps',
                templateUrl: 'app/apps/apps.html',
                controller: 'AppsController',
                controllerAs: 'apps'
            })
            .state('apps.create', {
                url: '/create',
                templateUrl: 'app/apps/app.html',
                controller: 'AppController',
                controllerAs: 'app'
            })
            .state('apps.edit', {
                url: '/edit',
                templateUrl: 'app/apps/app.html',
                controller: 'AppController',
                controllerAs: 'app',
                params: {app: null}
            });
    }

})();
