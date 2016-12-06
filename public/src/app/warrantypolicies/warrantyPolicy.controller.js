/*globals _*/
(function() {
    'use strict';

    angular
        .module('IMGDMSAPI')
        .controller('WarrantyPolicyController', WarrantyPolicyController);

    /** @ngInject */
    function WarrantyPolicyController ($scope, $stateParams, RestService,
                                       Notification, $translate, $timeout, $rootScope) {
        var vm = this,
            warrantyPolicyService = RestService.init('warrantyPolicy');

        $translate(['GLOBAL.CREATE.SUCCESS', 'GLOBAL.UPDATE.SUCCESS'],
            {type: 'WarrantyPolicy'}).then(function(translations) {
            vm.translations = translations;
        });

        vm.submitted = false;

        vm.defaultWarrantyPolicy = {
            warranty_policy: '',
            warranty_policy_desc: '',
            warranty_months: '',
            inactive: 0
        };

        vm.warrantyPolicies = [];

        vm.minLength = 0;
        vm.maxLength = 80;

        vm.warrantyPolicy = ($stateParams.warrantypolicy) ?
            angular.copy($stateParams.warrantypolicy) :
            angular.copy(vm.defaultWarrantyPolicy);

        vm.inactiveButtons = [
            {
                text: 'Yes',
                value: '1',
                name: 'inactive'
            },
            {
                text: 'No',
                value: '0',
                name: 'inactive'
            }
        ];

        //Retrieve warranty policy
        warrantyPolicyService.list().then(function(response) {
            _.each(response.warrantyPolicies, function(warrantyPolicy) {
                vm.warrantyPolicies.push({
                    text: warrantyPolicy.warranty_policy,
                    value: warrantyPolicy.warranty_policyid
                })
            });
        });

        /**
         * reset the warranty policy form with the defaults
         */
        var reset = function() {
            vm.warrantyPolicy = angular.copy(vm.defaultWarrantyPolicy);
            vm.submitted = false;
        };

        /**
         * Closes the side-view
         */
        vm.cancel = function() {
            reset();

            $scope.$emit('CLOSE_SIDEVIEW');
        };

        /**
         * Creates an appWarrantyPolicy or updates it (through AJAX request)
         *
         * @param isValid
         */
        vm.save = function(isValid) {
            vm.submitted = true;

            if (isValid) {
                if (vm.warrantyPolicy.hasOwnProperty('warranty_policyid')) {
                    warrantyPolicyService.update(
                        vm.warrantyPolicy.warranty_policyid, vm.warrantyPolicy)
                        .then(function(response) {
                            if (response.success) {
                                $scope.$emit('REFRESH');
                                vm.cancel();

                                Notification.success(
                                    vm.translations['GLOBAL.UPDATE.SUCCESS']);
                            } else {
                                Notification.error(response.message);
                            }
                        });
                } else {
                    warrantyPolicyService.create(vm.warrantyPolicy)
                        .then(function(response) {
                            if (response.success) {
                                $scope.$emit('REFRESH');
                                vm.cancel();

                                Notification.success(
                                    vm.translations['GLOBAL.CREATE.SUCCESS']);
                            } else {
                                Notification.error(response.message);
                            }
                        });
                }
            }
        };

        $timeout(function() {
            $rootScope.$broadcast('LOAD_SECTIONS', 'Warranty Policy', $stateParams.userid);
        }, 500);
    }
})();
