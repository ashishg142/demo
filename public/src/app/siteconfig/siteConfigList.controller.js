/*globals _*/
(function() {
    'use strict';

    angular
        .module('IMGDMSAPI')
        .controller('SiteConfigListController', SiteConfigListController);

    /** @ngInject */
    function SiteConfigListController($scope, RestService, $state, $filter, $interval, $translate, Notification) {
        var vm = this,
            service = RestService.init('siteConfig'),
            paginationOptions = {
                limit: 30
            },
            filter = {
                paginate: paginationOptions,
                page: 1
            };

        vm.entries = [];
        vm.showSideView = false;
        vm.sideViewStateClass = 'hidden';

        /**
         * Makes an AJAX request to get a listing of Site Config entries, but only adds new ones
         */
        var loadEntries = function (filter) {
            service.list(filter, filter.page).then(function (response) {
                paginationOptions = _.merge(paginationOptions, {
                    currentPage: response.data.current_page,
                    from: response.data.from,
                    lastPage: response.data.last_page,
                    perPage: response.data.per_page,
                    to: response.data.to,
                    total: response.data.total
                });

                vm.tableOptions.pagination = paginationOptions;

                _.each(response.data.data, function (entry) {
                    var entryIndex = _.findIndex(vm.entries, {site_configid: entry.site_configid});

                    if (entryIndex === -1) {
                        entry.added = $filter('date')(entry.added, 'M/dd/yy h:mm a');
                        entry.updated = $filter('date')(entry.updated, 'M/dd/yy h:mm a');

                        vm.entries.unshift(entry);
                    }
                });

            });
        };

        loadEntries(filter);

        /**
         * Sends an AJAX request to delete the entry and removes it from the table
         *
         * @param entry
         */
        vm.deleteEntry = function (entry) {
            service.remove(entry.site_configid).then(function (response) {
                if (response.success) {
                    $translate('GLOBAL.DELETE.SUCCESS', {type: 'Site Config Entry'}).then(function (msg) {
                        Notification.success(msg);
                        _.remove(vm.entries, entry);
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

            loadEntries(filter);
        };

        /**
         * Displays an entry in the sieview
         *
         * @param entry
         */
        vm.showEntry = function (entry) {
            vm.showSideView = !vm.showSideView;
            vm.sideViewStateClass = '';

            if (vm.showSideView) {
                if (entry) {
                    $state.go('siteConfig.show', {entry: entry});
                }
            } else {
                $state.go('siteConfig');
            }
        };

        /**
         * These options are used with the img-table component to create the table
         *
         * @type {{columns: *[], rowClick: (any), bulkSelections: *[]}}
         */
        vm.tableOptions = {
            columns: [
                {title: 'ID', id: 'site_configid', filter: 'text'},
                {title: 'Primary Domain Name', id: 'primary_domain_nameid', filter: 'text'},
                {title: 'Site Path', id: 'site_path', filter: 'text'},
                {title: 'Table Prefix', id: 'tbl_prefix', filter: 'text'},
                {title: 'Default Image Path', id: 'default_img_path', filter: 'text', hidden: true},
                {title: 'Default JS Path', id: 'default_js_path', filter: 'text', hidden: true},
                {title: 'Default CSS Path', id: 'default_css_path', filter: 'text', hidden: true},
                {title: 'Default Video Path', id: 'default_video_path', filter: 'text', hidden: true},
                {title: 'Default Misc Path', id: 'default_misc_path', filter: 'text', hidden: true},
                {title: 'Default Admin Rows Per Page', id: 'default_admin_rows_per_page', filter: 'text', hidden: true},
                {title: 'Default Public Rows Per Page', id: 'default_public_rows_per_page', filter: 'text', hidden: true},
                {title: 'Added', id: 'added', filter: 'text'},
                {title: 'Updated', id: 'updated', filter: 'text'},
                {title: 'Inactive', id: 'inactive', filter: 'text', hidden: true}
            ],
            bulkSelections: [
                {text: 'DELETE', method: vm.deleteEntry}
            ],
            filter: vm.filter,
            filtersEnabled: true,
            paginationEnabled: true,
            pagination: paginationOptions,
            rowClick: vm.showEntry,
            sortingEnabled: true
        };

        $scope.$on('REFRESH', function () {
            loadEntries(filter);
        });
    }
})();
