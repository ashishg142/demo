(function() {
    'use strict';

    angular
        .module('IMGDMSAPI')
        .config(routerConfig);

    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider, $locationProvider) {
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'app/main/main.html',
                controller: 'MainController',
                controllerAs: 'main'
            })
            .state('demo', {
                url: '/',
                templateUrl: 'app/demo/demo.html',
                controller: 'DemoController',
                controllerAs: 'demo'
            });

        $urlRouterProvider.otherwise('/');

        $locationProvider.html5Mode(true);
    }

})();
