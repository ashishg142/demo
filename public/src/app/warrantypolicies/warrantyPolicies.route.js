(function() {
    'use strict';

    angular
        .module('IMGDMSAPI')
        .config(routerConfig);

    /** @ngInject */
    function routerConfig($stateProvider) {
        $stateProvider
            .state('warrantypolicies', {
                url: '/warrantypolicies/:userid',
                templateUrl: 'app/warrantypolicies/warrantypolicies.html',
                controller: 'WarrantyPoliciesController',
                controllerAs: 'warrantyPolicies',
                params: {userid: null}
            })
            .state('warrantypolicies.create', {
                url: '/create/:userid',
                templateUrl: 'app/warrantypolicies/warrantypolicy.html',
                controller: 'WarrantyPolicyController',
                controllerAs: 'wp',
                params: {warrantypolicy: null, userid: null}
            })
            .state('warrantypolicies.edit', {
                url: '/edit/:userid',
                templateUrl: 'app/warrantypolicies/warrantypolicy.html',
                controller: 'WarrantyPolicyController',
                controllerAs: 'wp',
                params: {warrantypolicy: null, userid: null}
            });
    }
})();
