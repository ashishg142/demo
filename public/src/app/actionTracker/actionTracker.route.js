(function() {
    'use strict';

    angular
        .module('IMGDMSAPI')
        .config(routerConfig);

    /** @ngInject */
    function routerConfig($stateProvider) {
        $stateProvider
            .state('actionTracker', {
                url: '/actionTracker',
                templateUrl: 'app/actionTracker/actionTracker.html',
                controller: 'ActionTrackerController',
                controllerAs: 'actionTracker'
            })
            .state('actionTracker.show', {
                url: '/show',
                templateUrl: 'app/actionTracker/action.html',
                controller: 'ActionController',
                controllerAs: 'ac',
                params: {action: null}
            });
    }

})();
