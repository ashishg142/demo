(function () {
    'use strict';

    angular
        .module('IMGDMSAPI')
        .controller('ActionController', ActionController);

    /** @ngInject */
    function ActionController($scope, $stateParams, RestService, ModalService, $translate, $window, $filter) {
        var vm = this,
            service = RestService.init('actionTracker');

        vm.action = $stateParams.action || null;
        vm.inFrame = $window.location !== $window.parent.location;

        var confirmRollbackMsg = '';

        $translate('ACTIONTRACKER.CONFIRM_ROLLBACK').then(function (translation) {
            confirmRollbackMsg = translation;
        });

        /**
         * Triggers a window post message event to the parent window if there is one
         *
         * @param actionObject
         */
        vm.findElement = function (actionObject) {
            if ($window.location !== $window.parent.location) {
                $window.parent.postMessage({
                    'messageType': 'actionTracker',
                    'valueLabel': 'actionObject',
                    'value': actionObject
                }, '*');
            }
        };

        /**
         * Rolls back the UI to a previous entry
         */
        vm.rollback = function () {
            ModalService.confirm(confirmRollbackMsg, function (result) {
                if (result) {
                    var actionType = vm.action.webpage_action_type.webpage_action_type;

                    if (actionType === 'Check') {
                        actionType = 'Uncheck';
                    } else if (actionType === 'Uncheck') {
                        actionType = 'Check';
                    }

                    var data = {
                        'userId': vm.action.userid,
                        'visitorId': null,
                        'url': vm.action.url,
                        'actionType': actionType,
                        'actionAt': $filter('date')(Date.now(), 'yyyy-MM-dd HH:mm:ss'),
                        'actionObject': vm.action.action_object,
                        'actionDataOrig': vm.action.action_data,
                        'actionDataOrigExt': vm.action.action_data_ext,
                        'actionData': vm.action.action_data_orig,
                        'actionDataExt': vm.action.action_data_orig_ext
                    };

                    service.create(data);

                    if ($window.location !== $window.parent.location) {
                        $window.parent.postMessage({
                            'messageType': 'actionTracker',
                            'valueLabel': 'rollback',
                            'value': vm.action
                        }, '*');
                    }
                }
            });
        };

        /**
         * Closes the sideview
         */
        vm.cancel = function () {
            $scope.$emit('CLOSE_SIDEVIEW');
        };
    }
})();
