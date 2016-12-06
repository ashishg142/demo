(function() {
    'use strict';

    angular
        .module('IMGDMSAPI')
        .config(routerConfig);

    /** @ngInject */
    function routerConfig($stateProvider) {
        $stateProvider
            .state('webpageActionTypes', {
                url: '/webpageActionTypes',
                templateUrl: 'app/webpageActionTypes/webpageActionTypes.html',
                controller: 'WebpageActionTypesController',
                controllerAs: 'webpageActionTypes'
            })
            .state('webpageActionTypes.create', {
                url: '/create',
                templateUrl: 'app/webpageActionTypes/webpageActionType.html',
                controller: 'WebpageActionTypeController',
                controllerAs: 'webpageActionType',
                params: {tokenConfig: null}
            })
            .state('webpageActionTypes.edit', {
                url: '/edit',
                templateUrl: 'app/webpageActionTypes/webpageActionType.html',
                controller: 'WebpageActionTypeController',
                controllerAs: 'webpageActionType',
                params: {webpageActionType: null, tokenConfig: null}
            });
    }

})();
