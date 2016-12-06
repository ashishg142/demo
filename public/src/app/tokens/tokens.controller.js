/*globals _*/
(function () {
    'use strict';

    angular
        .module('IMGDMSAPI')
        .controller('TokensController', TokensController);

    /** @ngInject */
    function TokensController($scope, $filter, $state, RestService, Notification, $translate) {
        var vm = this,
            service = RestService.init('appToken'),
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
         * Makes an AJAX request to load appTokens from the server
         */
        var loadTokens = function (filter) {
            service.list(filter, filter.page).then(function (response) {
                if (response.success) {
                    vm.tokens = response.data.data;

                    paginationOptions = _.merge(paginationOptions, {
                        currentPage: response.data.current_page,
                        from: response.data.from,
                        lastPage: response.data.last_page,
                        perPage: response.data.per_page,
                        to: response.data.to,
                        total: response.data.total
                    });

                    vm.tableOptions.pagination = paginationOptions;

                    _.each(vm.tokens, function (token) {
                        token.added = $filter('date')(new Date(token.added), 'M/dd/yy h:mm a');
                        token.updated = $filter('date')(new Date(token.updated), 'M/dd/yy h:mm a');
                    });
                } else {
                    $translate('APPTOKEN.LOAD.FAILURE').then(function (msg) {
                        Notification.error(msg);
                    });
                }
            });
        };

        loadTokens(filter);

        /**
         * Deletes a token
         *
         * @param token
         */
        vm.deleteToken = function (token) {
            service.remove(token.appid).then(function (response) {
                if (response.success) {
                    $translate('APPTOKEN.DELETE.SUCCESS').then(function (msg) {
                        _.remove(vm.tokens, token);

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

            loadTokens(filter);
        };

        /**
         * Toggles the sideview for showing and hiding the token form
         *
         * @param token
         */
        vm.toggleTokenForm = function (token) {
            vm.showSideView = !vm.showSideView;
            vm.sideViewStateClass = '';

            if (vm.showSideView) {
                if (token) {
                    $state.go('tokens.edit', {token: token});
                } else {
                    $state.go('tokens.create');
                }
            } else {
                $state.go('tokens');
            }
        };

        /**
         * These options are used with the img-table component to create the table
         *
         * @type {{columns: *[], rowClick: (any), bulkSelections: *[]}}
         */
        vm.tableOptions = {
            tableId: 'tokensTable',
            columns: [
                {title: 'App', id: 'app.app', filter: 'text', sort: false},
                {title: 'To App', id: 'to_app.app', filter: 'text', sort: false},
                {title: 'Public Key', id: 'app_pub_key', filter: 'text'},
                {title: 'Private Key', id: 'app_priv_key', filter: 'text'},
                {title: 'Added', id: 'added', filter: 'text'},
                {title: 'Updated', id: 'updated', filter: 'text'}
            ],
            bulkSelections: [
                {text: 'DELETE', method: vm.deleteToken}
            ],
            filter: vm.filter,
            filtersEnabled: true,
            paginationEnabled: true,
            pagination: paginationOptions,
            rowClick: vm.toggleTokenForm,
            sortingEnabled: true,
            sort: vm.sort
        };

        $scope.$on('REFRESH', function () {
            loadTokens(filter);
        });
    }
})();
