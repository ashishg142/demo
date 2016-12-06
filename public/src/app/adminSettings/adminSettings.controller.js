/*globals _*/
(function () {
    'use strict';

    angular
        .module('IMGDMSAPI')
        .controller('AdminSettingsController', AdminSettingsController);

    /** @ngInject */
    function AdminSettingsController($scope, $filter, $state, $stateParams, RestService, Notification, $translate, $window, $timeout) {
        var vm = this,
            service = RestService.init('adminSetting'),
            paginationOptions = {
                limit: 30
            },
            options = {
                paginate: paginationOptions,
                page: 1,
                sort: {
                    column: 'admin_setting',
                    order: 'asc'
                }
            },
            appId = $stateParams.appId,
            apiToken = $stateParams.apiToken;

        vm.adminSetting = null;
        vm.showSideView = false;
        vm.sideViewStateClass = 'hidden';
        vm.loaded = false;

        /**
         * Makes an AJAX request to load adminSettings from the server
         */
        var loadAdminSettings = function (options) {
            service.list(options, options.page).then(function (response) {
                if (response.success) {
                    vm.adminSettings = response.admin_settings.data;

                    paginationOptions = _.merge(paginationOptions, {
                        currentPage: response.admin_settings.current_page,
                        from: response.admin_settings.from,
                        lastPage: response.admin_settings.last_page,
                        perPage: response.admin_settings.per_page,
                        to: response.admin_settings.to,
                        total: response.admin_settings.total
                    });

                    vm.tableOptions.pagination = paginationOptions;

                    _.each(vm.adminSettings, function (adminSetting) {
                        adminSetting.added = $filter('date')(new Date(adminSetting.added), 'M/dd/yy h:mm a');
                        adminSetting.updated = $filter('date')(new Date(adminSetting.updated), 'M/dd/yy h:mm a');
                        adminSetting.inactivetext = adminSetting.inactive === 1 ? 'Inactive' : 'Active';
                    });
                } else {
                    $translate('GLOBAL.LOAD.FAILURE', {type: 'Admin Setting'}).then(function (msg) {
                        Notification.error(msg);
                    });
                }

                $timeout(function () {
                    if ($window.location !== $window.parent.location) {
                        $window.parent.postMessage({
                            'id': 'adminSettings',
                            'messageType': 'iFrameSettings',
                            'valueLabel': 'height',
                            'value': document.body.offsetHeight
                        }, '*');
                    }
                });
            });
        };

        /**
         * Deletes a adminSetting
         *
         * @param adminSetting
         */
        vm.deleteAdminSetting = function (adminSetting) {
            service.remove(adminSetting.admin_settingid).then(function (response) {
                if (response.success) {
                    $translate('GLOBAL.DELETE.SUCCESS', {type: 'Admin Setting'}).then(function (msg) {
                        _.remove(vm.adminSettings, adminSetting);

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
                loadAdminSettings(options);
            }
        };

        /**
         * Toggles the sideview for showing and hiding the adminSetting form
         *
         * @param adminSetting
         */
        vm.showAdminSetting = function (adminSetting) {
            vm.showSideView = !vm.showSideView;
            vm.sideViewStateClass = '';

            if (vm.showSideView) {
                if (adminSetting) {
                    $state.go('adminSettings.edit', {adminSetting: adminSetting, tokenConfig:service.getAppToken()});
                } else {
                    $state.go('adminSettings.create', {tokenConfig: service.getAppToken()});
                }
            } else {
                $state.go('adminSettings');
            }
        };

        /**
         * These options are used with the img-table component to create the table
         *
         * @type {{columns: *[], rowClick: (any), bulkSelections: *[]}}
         */
        vm.tableOptions = {
            tableId: 'adminSettingsTable',
            columns: [
                {title: 'ID', id: 'admin_settingid', filter: 'text'},
                {title: 'Admin Setting', id: 'admin_setting', filter: 'text'},
                {title: 'Value', id: 'admin_setting_val', filter: 'text'},
                {title: 'Added', id: 'added', filter: 'text'},
                {title: 'Updated', id: 'updated', filter: 'text'},
                {title: 'Inactive', id: 'inactivetext', filter: 'text'},
                {title: 'InactiveNum', id: 'inactive', filter: 'text', hidden: true}
            ],
            bulkSelections: [
                {text: 'DELETE', method: vm.deleteAdminSetting}
            ],
            filter: vm.filter,
            filtersEnabled: true,
            paginationEnabled: true,
            pagination: paginationOptions,
            rowClick: vm.showAdminSetting,
            sortingEnabled: true,
            sort: vm.sort,
            sortOptions: options.sort
        };

        $scope.$on('REFRESH', function () {
            loadAdminSettings(options);
        });

        service.setAppToken(appId, apiToken);
        loadAdminSettings(options);
        vm.loaded = true;

        $scope.$emit('TOGGLE_HIDE_SIDEBAR');
    }
})();
