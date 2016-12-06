/*globals _*/
(function() {
    'use strict';

    angular
        .module('IMGDMSAPI')
        .controller('ErrorsController', ErrorsController);

    /** @ngInject */
    function ErrorsController($rootScope, RestService, $state, $filter, $interval, $translate, Notification) {
        var vm = this,
            timeout = 15 * 1000,
            service = RestService.init('log'),
            appService = RestService.init('app'),
            paginationOptions = {
                limit: 30
            },
            filter = {
                paginate: paginationOptions,
                page: 1
            };

        vm.app = '';
        vm.apps = [];
        vm.errors = [];
        vm.showSideView = false;
        vm.sideViewStateClass = 'hidden';


        /**
         * Removes the initial 'new-error' class which makes the row appear green
         */
        var updateErrorClass = function () {
            _.each(vm.errors, function (error) {
                error.class = '';
            });
        };

        /**
         * Makes an AJAX request to get a listing of errors, but only adds new ones
         */
        var loadErrors = function (filter) {
            service.list(filter, filter.page).then(function (response) {
                updateErrorClass();

                paginationOptions = _.merge(paginationOptions, {
                    currentPage: response.data.current_page,
                    from: response.data.from,
                    lastPage: response.data.last_page,
                    perPage: response.data.per_page,
                    to: response.data.to,
                    total: response.data.total
                });

                vm.tableOptions.pagination = paginationOptions;

                _.each(response.data.data, function (error) {
                    var errorIndex = _.findIndex(vm.errors, {error_logid: error.error_logid});

                    if (errorIndex === -1) {
                        error.added = $filter('date')(error.added, 'M/dd/yy h:mm a');
                        error.updated = $filter('date')(error.updated, 'M/dd/yy h:mm a');
                        error.class = 'new-error';

                        vm.errors.unshift(error);
                    }
                });

            });
        };

        /**
         * Sends an AJAX request to delete the error and removes it from the table
         *
         * @param error
         */
        vm.deleteError = function (error) {
            service.remove(error.error_logid, {appid: vm.app.appid}).then(function (response) {
                if (response.success) {
                    $translate('GLOBAL.DELETE.SUCCESS', {type: 'Error'}).then(function (msg) {
                        Notification.success(msg);
                        _.remove(vm.errors, error);
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
                page: page,
                appid: vm.app.appid
            };

            loadErrors(filter);
        };

        /**
         * Refresh the listing of errors according to the selected app
         */
        vm.refresh = function (newApp) {
            vm.errors = [];
            vm.app = newApp;
            filter.appid = newApp.appid || null;

            loadErrors(filter);
        };

        /**
         * Displays an error in the sieview
         *
         * @param error
         */
        vm.showError = function (error) {
            vm.showSideView = !vm.showSideView;
            vm.sideViewStateClass = '';

            if (vm.showSideView) {
                if (error) {
                    $state.go('errors.show', {error: error});
                }
            } else {
                $state.go('errors');
            }
        };

        /**
         * These options are used with the img-table component to create the table
         *
         * @type {{columns: *[], rowClick: (any), bulkSelections: *[]}}
         */
        vm.tableOptions = {
            columns: [
                {title: 'ID', id: 'error_logid', filter: 'text'},
                {title: 'Error', id: 'error', filter: 'text'},
                {title: 'URL', id: 'url', filter: 'text'},
                {title: 'Line', id: 'line', filter: 'text'},
                {title: 'Added', id: 'added', filter: 'text'},
                {title: 'Updated', id: 'updated', filter: 'text'}
            ],
            bulkSelections: [
                {text: 'DELETE', method: vm.deleteError}
            ],
            filter: vm.filter,
            filtersEnabled: true,
            paginationEnabled: true,
            pagination: paginationOptions,
            rowClick: vm.showError,
            sortingEnabled: true
        };

        /**
         * Loads any new errors (from the server) and updates the table
         */
        var interval = $interval(function() {
            loadErrors(filter);
        }, timeout);

        var stateChange = $rootScope.$on('$stateChangeStart', function () {
            $interval.cancel(interval);
        });

        $rootScope.$on('$destroy', stateChange);


        //load listing of apps and then load the filter for the first app coming back
        appService.list().then(function (response) {
            vm.apps = response.apps;
            vm.app = vm.apps[0];

            filter.appid = vm.app.appid;
        });
    }
})();
