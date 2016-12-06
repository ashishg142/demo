/*globals _*/
(function () {
    'use strict';

    angular
        .module('IMGDMSAPI')
        .controller('WebpageActionTypesController', WebpageActionTypesController);

    /** @ngInject */
    function WebpageActionTypesController($scope, $filter, $state, RestService, Notification, $translate, $window, $timeout) {
        var vm = this,
            service = RestService.init('webpageActionType'),
            paginationOptions = {
                limit: 30
            },
            options = {
                paginate: paginationOptions,
                page: 1,
                sort: {
                    column: 'webpage_action_type',
                    order: 'asc'
                }
            };

        vm.webpageActionType = null;
        vm.showSideView = false;
        vm.sideViewStateClass = 'hidden';
        vm.loaded = false;

        /**
         * Handle Incoming postMessage from outside source
         */
        var processPostMessage = function (event) {
            if (angular.isDefined(event.data.appToken) && angular.isDefined(event.data.appId)) {
                service.setAppToken(event.data.appId, event.data.appToken);
                loadWebpageActionTypes(options);
                vm.loaded = true;
            }
        };

        $window.addEventListener('message', processPostMessage, false);
        $scope.$emit('TOGGLE_HIDE_SIDEBAR');

        /**
         * Makes an AJAX request to load webpageActionTypes from the server
         */
        var loadWebpageActionTypes = function (options) {
            service.list(options, options.page).then(function (response) {
                if (response.success) {
                    vm.webpageActionTypes = response.webpageActionTypes.data;

                    paginationOptions = _.merge(paginationOptions, {
                        currentPage: response.webpageActionTypes.current_page,
                        from: response.webpageActionTypes.from,
                        lastPage: response.webpageActionTypes.last_page,
                        perPage: response.webpageActionTypes.per_page,
                        to: response.webpageActionTypes.to,
                        total: response.webpageActionTypes.total
                    });

                    vm.tableOptions.pagination = paginationOptions;

                    _.each(vm.webpageActionTypes, function (webpageActionType) {
                        webpageActionType.added = $filter('date')(new Date(webpageActionType.added), 'M/dd/yy h:mm a');
                        webpageActionType.updated = $filter('date')(new Date(webpageActionType.updated), 'M/dd/yy h:mm a');
                        webpageActionType.inactivetext = webpageActionType.inactive === 1 ? 'Inactive' : 'Active';
                    });
                } else {
                    $translate('GLOBAL.LOAD.FAILURE', {type: 'WebpageActionType'}).then(function (msg) {
                        Notification.error(msg);
                    });
                }
                $timeout(function () {
                    if ($window.location !== $window.parent.location) {
                        $window.parent.postMessage({
                            'messageType': 'webpageActionTypes',
                            'valueLabel': 'height',
                            'value': document.body.offsetHeight
                        }, '*');
                    }
                });
            });
        };

        /**
         * Deletes a webpageActionType
         *
         * @param webpageActionType
         */
        vm.deleteWebpageActionType = function (webpageActionType) {
            service.remove(webpageActionType.webpage_action_typeid).then(function (response) {
                if (response.success) {
                    $translate('GLOBAL.DELETE.SUCCESS', {type: 'WebpageActionType'}).then(function (msg) {
                        _.remove(vm.webpageActionTypes, webpageActionType);

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
            options = {
                filter: filters,
                sort: sort,
                paginate: pagination,
                page: page
            };
            if( vm.loaded ) {
                loadWebpageActionTypes(options);
            }
        };

        /**
         * Toggles the sideview for showing and hiding the webpageActionType form
         *
         * @param webpageActionType
         */
        vm.showWebpageActionType = function (webpageActionType) {
            vm.showSideView = !vm.showSideView;
            vm.sideViewStateClass = '';

            if (vm.showSideView) {
                if (webpageActionType) {
                    $state.go('webpageActionTypes.edit', {webpageActionType: webpageActionType, tokenConfig:service.getAppToken()});
                } else {
                    $state.go('webpageActionTypes.create', {tokenConfig:service.getAppToken()});
                }
            } else {
                $state.go('webpageActionTypes');
            }
        };

        /**
         * These options are used with the img-table component to create the table
         *
         * @type {{columns: *[], rowClick: (any), bulkSelections: *[]}}
         */
        vm.tableOptions = {
            tableId: 'webpageActionTypesTable',
            columns: [
                {title: 'ID', id: 'webpage_action_typeid', filter: 'text'},
                {title: 'Action Type', id: 'webpage_action_type', filter: 'text'},
                {title: 'Description', id: 'webpage_action_type_desc', filter: 'text'},
                {title: 'Added', id: 'added', filter: 'text'},
                {title: 'Updated', id: 'updated', filter: 'text'},
                {title: 'Inactive', id: 'inactivetext', filter: 'text'},
                {title: 'InactiveNum', id: 'inactive', filter: 'text', hidden: true}
            ],
            bulkSelections: [
                {text: 'DELETE', method: vm.deleteWebpageActionType}
            ],
            filter: vm.filter,
            filtersEnabled: true,
            paginationEnabled: true,
            pagination: paginationOptions,
            rowClick: vm.showWebpageActionType,
            sortingEnabled: true,
            sort: vm.sort,
            sortOptions: options.sort
        };

        $scope.$on('REFRESH', function () {
            loadWebpageActionTypes(options);
        });
    }
})();
