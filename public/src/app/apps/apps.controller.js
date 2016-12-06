/*globals _*/
(function () {
    'use strict';

    angular
        .module('IMGDMSAPI')
        .controller('AppsController', AppsController);

    /** @ngInject */
    function AppsController($scope, $filter, $state, RestService, Notification, $translate) {
        var vm = this,
            service = RestService.init('app'),
            paginationOptions = {
                limit: 30
            },
            options = {
                paginate: paginationOptions,
                page: 1,
                sort: {
                    column: 'appid',
                    order: 'desc'
                }
            };

        vm.app = null;
        vm.showSideView = false;
        vm.sideViewStateClass = 'hidden';

        /**
         * Makes an AJAX request to load apps from the server
         */
        var loadApps = function (options) {
            service.list(options, options.page).then(function (response) {
                if (response.success) {
                    vm.apps = response.apps.data;

                    paginationOptions = _.merge(paginationOptions, {
                        currentPage: response.apps.current_page,
                        from: response.apps.from,
                        lastPage: response.apps.last_page,
                        perPage: response.apps.per_page,
                        to: response.apps.to,
                        total: response.apps.total
                    });

                    vm.tableOptions.pagination = paginationOptions;

                    _.each(vm.apps, function (app) {
                        app.added = $filter('date')(new Date(app.added), 'M/dd/yy h:mm a');
                        app.updated = $filter('date')(new Date(app.updated), 'M/dd/yy h:mm a');
                    });
                } else {
                    $translate('GLOBAL.LOAD.FAILURE', {type: 'App'}).then(function (msg) {
                        Notification.error(msg);
                    });
                }
            });
        };

        loadApps(options);

        /**
         * Deletes a app
         *
         * @param app
         */
        vm.deleteApp = function (app) {
            service.remove(app.appid).then(function (response) {
                if (response.success) {
                    $translate('GLOBAL.DELETE.SUCCESS', {type: 'App'}).then(function (msg) {
                        _.remove(vm.apps, app);

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

            loadApps(options);
        };

        /**
         * Toggles the sideview for showing and hiding the app form
         *
         * @param app
         */
        vm.showApp = function (app) {
            vm.showSideView = !vm.showSideView;
            vm.sideViewStateClass = '';

            if (vm.showSideView) {
                if (app) {
                    $state.go('apps.edit', {app: app});
                } else {
                    $state.go('apps.create');
                }
            } else {
                $state.go('apps');
            }
        };

        /**
         * These options are used with the img-table component to create the table
         *
         * @type {{columns: *[], rowClick: (any), bulkSelections: *[]}}
         */
        vm.tableOptions = {
            tableId: 'appsTable',
            columns: [
                {title: 'ID', id: 'appid', filter: 'text'},
                {title: 'App Name', id: 'app', filter: 'text'},
                {title: 'External', id: 'app', filter: 'text'},
                {title: 'Added', id: 'added', filter: 'text'},
                {title: 'Updated', id: 'updated', filter: 'text'},
                {title: 'Inactive', id: 'inactive', filter: 'text', hidden: true}
            ],
            bulkSelections: [
                {text: 'DELETE', method: vm.deleteApp}
            ],
            filter: vm.filter,
            filtersEnabled: true,
            paginationEnabled: true,
            pagination: paginationOptions,
            rowClick: vm.showApp,
            sortingEnabled: true,
            sort: vm.sort,
            sortOptions: options.sort
        };

        $scope.$on('REFRESH', function () {
            loadApps(options);
        });
    }
})();
