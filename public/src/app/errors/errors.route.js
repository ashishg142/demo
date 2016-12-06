(function() {
    'use strict';

    angular
        .module('IMGDMSAPI')
        .config(routerConfig);

    /** @ngInject */
    function routerConfig($stateProvider) {
        $stateProvider
            .state('errors', {
                url: '/errors',
                templateUrl: 'app/errors/errors.html',
                controller: 'ErrorsController',
                controllerAs: 'errors'
            })
            .state('errors.show', {
                url: '/show',
                templateUrl: 'app/errors/error.html',
                controller: 'ErrorController',
                controllerAs: 'ec',
                params: {error: null}
            });
    }

})();
