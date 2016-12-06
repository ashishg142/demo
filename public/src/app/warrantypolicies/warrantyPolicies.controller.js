/*globals _*/
(function () {
    'use strict';

    angular
        .module('IMGDMSAPI')
        .controller('WarrantyPoliciesController', WarrantyPoliciesController);

    /** @ngInject */
    function WarrantyPoliciesController($scope, $filter, $state, RestService,
                                        Notification, $translate, $timeout,
                                        $window, $stateParams) {
        var vm = this,
            service = RestService.init('warrantyPolicy'),
            paginationOptions = {
                limit: 30
            },
            filter = {
                paginate: paginationOptions,
                page: 1
            };

        vm.showSideView = false;
        vm.sideViewStateClass = 'hidden';

        /**
         * Makes an AJAX request to load appWarrantyPolicies from the server
         */
        var loadWarrantyPolicies = function (filter) {
            service.list(filter, filter.page).then(function (response) {
                if (response.success) {
                    vm.warrantyPolicies = response.policies.data;

                    paginationOptions = _.merge(paginationOptions, {
                        currentPage: response.policies.current_page,
                        from: response.policies.from,
                        lastPage: response.policies.last_page,
                        perPage: response.policies.per_page,
                        to: response.policies.to,
                        total: response.policies.total
                    });

                    vm.tableOptions.pagination = paginationOptions;

                    _.each(vm.warrantyPolicies, function (warrantyPolicy) {
                        warrantyPolicy.added =
                            $filter('date')(new Date(warrantyPolicy.added),
                                'M/dd/yy h:mm a');
                        warrantyPolicy.updated =
                            $filter('date')(new Date(warrantyPolicy.updated),
                                'M/dd/yy h:mm a');
                    });
                } else {
                    $translate('GLOBAL.LOAD.FAILURE', {type: 'Warranty Policy'})
                        .then(function (msg) {
                            Notification.error(msg);
                        });
                }

                $timeout(function () {
                    if ($window.location !== $window.parent.location) {
                        $window.parent.postMessage({
                            'id': 'warrantyPolicy',
                            'messageType': 'iFrameSettings',
                            'valueLabel': 'height',
                            'value': document.body.offsetHeight
                        }, '*');
                    }
                });
            });
        };

        loadWarrantyPolicies(filter);

        /**
         * Deletes a warrantyPolicy
         *
         * @param warrantyPolicy
         */
        vm.deleteWarrantyPolicy = function (warrantyPolicy) {
            service.remove(warrantyPolicy.warranty_policyid)
                .then(function (response) {
                    if (response.success) {
                        $translate('GLOBAL.DELETE.SUCCESS', {type: 'Warranty Policy'})
                            .then(function (msg) {
                                _.remove(vm.warrantyPolicies, warrantyPolicy);

                                Notification.success(msg);
                            });
                    } else {
                        Notification.error(response.message);
                    }
                });
        };

        /**
         * Filters the table with the specified criteria
         *
         * @param filters
         * @param sort
         * @param pagination
         * @param page
         */
        vm.filter = function (filters, sort, pagination, page) {
            filter = {
                filter: filters,
                sort: sort,
                paginate: pagination,
                page: page
            };

            loadWarrantyPolicies(filter);
        };

        /**
         * Toggles the sideview for showing and hiding the warrantyPolicy form
         *
         * @param warrantyPolicy
         */
        vm.toggleWarrantyPolicyForm = function (warrantyPolicy) {
            vm.showSideView = !vm.showSideView;
            vm.sideViewStateClass = '';

            if (vm.showSideView) {
                if (warrantyPolicy) {
                    $state.go('warrantypolicies.edit',
                        {warrantypolicy: warrantyPolicy, userid: $stateParams.userid});
                } else {
                    $state.go('warrantypolicies.create', {userid: $stateParams.userid});
                }
            } else {
                $state.go('warrantypolicies', {userid: $stateParams.userid});
            }
        };

        /**
         * These options are used with the img-table component to create the
         * table
         *
         * @type {{columns: *[], rowClick: (any), bulkSelections: *[]}}
         */
        vm.tableOptions = {
            tableId: 'warrantyPoliciesTable',
            columns: [
                {
                    title: 'Warranty Policy', id: 'warranty_policy',
                    filter: 'text'
                },
                {
                    title: 'Warranty Policy Description',
                    id: 'warranty_policy_desc', filter: 'text'
                },
                {
                    title: 'Warranty Months', id: 'warranty_months',
                    filter: 'text'
                },
                {title: 'Added', id: 'added', filter: 'text'},
                {title: 'Updated', id: 'updated', filter: 'text'},
                {title: 'Inactive', id: 'inactive', filter: 'text'}
            ],
            bulkSelections: [
                {text: 'DELETE', method: vm.deleteWarrantyPolicy}
            ],
            filter: vm.filter,
            filtersEnabled: true,
            paginationEnabled: true,
            pagination: paginationOptions,
            rowClick: vm.toggleWarrantyPolicyForm,
            sortingEnabled: true,
            sort: vm.sort
        };

        $scope.$on('REFRESH', function () {
            loadWarrantyPolicies(filter);
        });

        $scope.$emit('TOGGLE_HIDE_SIDEBAR');
    }
})();
