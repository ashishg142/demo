(function() {
    'use strict';

    angular
        .module('IMGDMSAPI')
        .config(routerConfig);

    /** @ngInject */
    function routerConfig($stateProvider) {
        $stateProvider
            .state('tokens', {
                url: '/tokens',
                templateUrl: 'app/tokens/tokens.html',
                controller: 'TokensController',
                controllerAs: 'tokens'
            })
            .state('tokens.create', {
                url: '/create',
                templateUrl: 'app/tokens/token.html',
                controller: 'TokenController',
                controllerAs: 'tc'
            })
            .state('tokens.edit', {
                url: '/edit',
                templateUrl: 'app/tokens/token.html',
                controller: 'TokenController',
                controllerAs: 'tc',
                params: {token: null}
            });
    }

})();
