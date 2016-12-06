/*globals _*/
(function () {
    'use strict';

    angular
        .module('IMGDMSAPI')
        .controller('ActionTrackerController', ActionTrackerController);

    /** @ngInject */
    function ActionTrackerController($state, RestService, ModalService, $filter, $window, $translate, $timeout, $scope) {
        var vm = this,
            service = RestService.init('actionTracker'),
            paginationOptions = {
                limit: 10
            },
            options = {
                page: 1,
                paginate: paginationOptions,
                url: '',
                sort: {
                    column: 'webpage_actionid',
                    order: 'desc'
                }
            },
            previousPage = 1,
            userid = '',
            url = '',
            seen = [];

        vm.actionTracker = [];
        vm.showSideView = false;
        vm.sideViewStateClass = 'hidden';
        vm.loaded = false;

        var confirmRollbackMsg = '';

        $translate('ACTIONTRACKER.CONFIRM_ROLLBACK').then(function (translation) {
            confirmRollbackMsg = translation;
        });

        /**
         * Removes the initial 'new-action' class which makes the row appear green
         */
        var updateActionTrackerClass = function () {
            _.each(vm.actionTracker, function (action) {
                action.class = '';
            });
        };

        /**
         * Makes an AJAX request to get a listing of action, but only adds new ones
         */
        var loadActionTracker = function (filter, clearTableData) {
            service.list(filter, filter.page).then(function (response) {
                updateActionTrackerClass();

                paginationOptions = _.merge(paginationOptions, {
                    currentPage: response.actions.current_page,
                    from: response.actions.from,
                    lastPage: response.actions.last_page,
                    perPage: response.actions.per_page,
                    to: response.actions.to,
                    total: response.actions.total
                });

                vm.tableOptions.pagination = paginationOptions;

                if (previousPage !== filter.page) {
                    previousPage = filter.page;
                    vm.actionTracker = [];
                }

                if (clearTableData) {
                    vm.actionTracker = [];
                }

                var wasEmpty = vm.actionTracker.length === 0;

                //add new entries
                _.each(response.actions.data, function (action) {
                    var actionIndex = _.findIndex(vm.actionTracker, {webpage_actionid: action.webpage_actionid});
                    var seenIndex = _.indexOf(seen, action.webpage_actionid);

                    if (actionIndex === -1) {
                        action.action_at = $filter('date')(action.action_at, 'M/dd/yy h:mm a');
                        action.class = (seenIndex !== -1) ? '' : 'new-action';

                        if (wasEmpty) {
                            vm.actionTracker.push(action);
                        } else if (vm.actionTracker.length !== vm.tableOptions.pagination.limit) {
                            vm.actionTracker.unshift(action);
                        } else {
                            vm.actionTracker.pop();
                            vm.actionTracker.unshift(action);
                        }

                        seen.push(action.webpage_actionid);
                    }
                });

                vm.actionTracker = _.orderBy(vm.actionTracker, [options.sort.column], [options.sort.order]);

                $timeout(function () {
                    if ($window.location !== $window.parent.location) {
                        $window.parent.postMessage({
                            'messageType': 'actionTracker',
                            'valueLabel': 'height',
                            'value': document.body.offsetHeight
                        }, '*');
                    }
                });
            });
        };

        /**
         * Filters the table with the specified criteria
         *
         * @param filters
         * @param sort
         * @param pagination
         * @param page
         * @param clearTableData
         */
        vm.filter = function (filters, sort, pagination, page, clearTableData) {
            options = {
                filter: filters,
                sort: sort,
                paginate: pagination,
                page: page,
                url: url
            };
            if( vm.loaded) {
                loadActionTracker(options, clearTableData);
            }
        };

        /**
         * Handle Rollback a token
         *
         * @param rollback
         */
        vm.rollBackItems = function (rollback) {
            ModalService.confirm(confirmRollbackMsg, function (result) {
                if (result) {
                    rollback = _.orderBy(rollback, ['webpage_actionid'], ['desc']);

                    _.each(rollback, function (r) {
                        var actionType = r.webpage_action_type.webpage_action_type;

                        if (actionType === 'Check') {
                            actionType = 'Uncheck';
                        } else if (actionType === 'Uncheck') {
                            actionType = 'Check';
                        }

                        var data = {
                            'userId': userid,
                            'visitorId': null,
                            'url': url,
                            'actionType': actionType,
                            'actionAt': $filter('date')(Date.now(), 'yyyy-MM-dd HH:mm:ss'),
                            'actionObject': r.action_object,
                            'actionDataOrig': r.action_data,
                            'actionDataOrigExt': r.action_data_ext,
                            'actionData': r.action_data_orig,
                            'actionDataExt': r.action_data_orig_ext
                        };

                        service.create(data);
                        $window.parent.postMessage({
                            'messageType': 'actionTracker',
                            'valueLabel': 'rollback',
                            'value': r
                        }, '*');
                    });
                }
            });

        };

        /**
         * Displays an action in the sieview
         *
         * @param action
         */
        vm.showAction = function (action) {
            vm.showSideView = !vm.showSideView;
            vm.sideViewStateClass = '';

            if (vm.tableOptions.hasOwnProperty('bulkSelections')) {
                action.allowRollback = true;
            }

            if (vm.showSideView) {
                if (action) {
                    $state.go('actionTracker.show', {action: action});
                }
            } else {
                $state.go('actionTracker');
            }
        };

        /**
         * These options are used with the img-table component to create the table
         *
         * @type {{columns: *[], rowClick: (any), bulkSelections: *[]}}
         */
        vm.tableOptions = {
            columns: [
                {title: 'ID', id: 'webpage_actionid', filter: 'text', hidden: true},
                {title: 'User', id: 'url_visit.user.user_display_name', sort: false},
                {title: 'Action', id: 'webpage_action_type.webpage_action_type', sort: false},
                {title: 'Label', id: 'action_object_lbl', sort: false},
                {title: 'Target', id: 'action_object', sort: false},
                {title: 'Orig Value', id: 'action_data_orig', filter: 'text'},
                {title: 'Value', id: 'action_data', filter: 'text'},
                {title: 'Date/Time', id: 'action_at', filter: 'text'}
            ],
            filter: vm.filter,
            filtersEnabled: true,
            paginationEnabled: true,
            pagination: paginationOptions,
            rowClick: vm.showAction,
            sortingEnabled: true,
            sortOptions: options.sort
        };

        /**
         * Handle Incoming postMessage from outside source
         */
        var processPostMessage = function (event) {
            if (angular.isDefined(event.data.appToken) && angular.isDefined(event.data.appId)) {
                service.setAppToken(event.data.appId, event.data.appToken);
                vm.loaded = true;
            }

            if (angular.isDefined(event.data.userid)) {
                userid = event.data.userid;
            }

            if (event.data.messageType === 'url') {
                if (event.data.value !== '' && event.data.value.indexOf('integrity-action-tracker') === -1) {
                    options.url = url = event.data.value;
                    vm.tableOptions['bulkSelections'] = [
                        {
                            text: 'Rollback',
                            method: vm.rollBackItems,
                            all: true
                        }
                    ];
                } else {
                    vm.tableOptions.columns.push({
                        title: 'URL', id: 'url_visit.url.url'
                    });
                    options.url = url = '';
                }
                loadActionTracker(options);
            }
        };

        $window.addEventListener('message', processPostMessage, false);
        $scope.$emit('TOGGLE_HIDE_SIDEBAR');

    }
})();

