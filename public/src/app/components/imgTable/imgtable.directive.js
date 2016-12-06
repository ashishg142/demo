/*globals _*/
/*eslint angular/module-getter: 0*/
(function () {
    'use strict';

    angular
        .module('IMGDMSAPI')
        .directive('imgTable', imgTable);

    /** @ngInject */
    function imgTable() {
        return {
            restrict: 'E',
            templateUrl: 'app/components/imgTable/imgTable.html',
            scope: {
                tableOptions: '=',
                tableData: '='
            },
            controller: IMGTableController,
            controllerAs: 'vm',
            bindToController: true,
            replace: true
        };

        /** @ngInject */
        function IMGTableController($scope, $timeout, $filter) {
            var vm = this,
                filterTimeout = null,
                savedOptions = {};

            vm.checked = false;
            vm.pages = [];
            vm.page = 1;
            vm.selection = null;
            vm.sortColumn = '';
            vm.sortOrder = '';
            vm.paginationLimits = [
                {text: 10, value: 10},
                {text: 20, value: 20},
                {text: 30, value: 30},
                {text: 40, value: 40},
                {text: 50, value: 50},
                {text: 100, value: 100},
                {text: 200, value: 200},
                {text: 500, value: 500}
            ];


            if (vm.tableOptions.hasOwnProperty('sortOptions')) {
                vm.sortColumn = vm.tableOptions.sortOptions.column;
                vm.sortOrder = vm.tableOptions.sortOptions.order;
            }

            /**
             * Gets a deep nested value in an object
             *
             * @param row
             * @param columnId
             * @returns {*}
             */
            var getRowVal = function (row, columnId) {
                if (columnId.indexOf('.') !== -1) {
                    var ids = columnId.split('.');
                    var obj = row;

                    _.each(ids, function (id) {
                        if (angular.isObject(obj) && obj.hasOwnProperty(id)) {
                            obj = obj[id];
                        }
                    });

                    return obj;
                }

                return row[columnId];
            };

            //check saved table options (i.e. user preferences)
            if (localStorage.hasOwnProperty(vm.tableOptions.tableId)) {
                savedOptions = angular.fromJson(localStorage.getItem(vm.tableOptions.tableId));

                var columnOptions = savedOptions.columns;

                _.each(vm.tableOptions.columns, function (column) {
                    if (columnOptions.hasOwnProperty(column.id)) {
                        column.hidden = columnOptions[column.id].hidden;
                    }
                });
            }

            /**
             * Toggles the 'checked' status of every checkbox in the table
             */
            vm.checkAll = function () {
                _.each(vm.tableData, function (row) {
                    row.checked = vm.checked;
                });
            };

            /**
             * Filters the data set according to the column, sorting and pagination are also at play
             *
             * @param column
             * @param page
             */
            vm.filter = function (column) {
                var filters = [],
                    sort = {
                        column: vm.sortColumn,
                        order: vm.sortOrder
                    },
                    clearTableData = false;

                _.each(vm.tableOptions.columns, function (col) {
                    if (col.filterValue !== '') {
                        filters.push({
                            column: col.id,
                            columnVal: col.filterValue,
                            filterType: col.filter
                        });

                        clearTableData = true;
                    }
                });

                if (column && column.filter === 'text') {
                    $timeout.cancel(filterTimeout);
                    filterTimeout = $timeout(function () {
                        vm.tableOptions.filter(filters, sort, vm.tableOptions.pagination, vm.page, clearTableData);
                    }, 350);
                } else {
                    vm.tableOptions.filter(filters, sort, vm.tableOptions.pagination, vm.page, clearTableData);
                }
            };

            /**
             * Performs a bulk action call in the table (as triggered by the user)
             */
            vm.go = function () {
                var selection = _.find(vm.tableOptions.bulkSelections, {text: vm.selection});

                if (selection) {
                    if (selection.hasOwnProperty('method')) {
                        var selected = _.filter(vm.tableData, {checked: true});

                        if (selection.hasOwnProperty('all')) {
                            selection.method(selected);
                        } else {
                            _.each(selected, function (row) {
                                selection.method(row);
                            });
                        }
                    }
                }
            };

            /**
             * Retrieves the next page of data if there is one
             */
            vm.nextPage = function () {
                var current = parseInt(vm.tableOptions.pagination.currentPage);
                var lastPage = parseInt(vm.tableOptions.pagination.lastPage);

                if (current < lastPage) {
                    vm.page = current + 1;
                }
            };

            /**
             * Retrieves the previous page of data if there is one
             */
            vm.previousPage = function () {
                var current = parseInt(vm.tableOptions.pagination.currentPage);

                if (current > 1) {
                    vm.page = current - 1;
                }
            };

            /**
             * Navigates to a specific page of data
             *
             * @param page
             */
            vm.setPage = function (page) {
                vm.page = page;
            };

            /**
             * Sorts the data by the specified column and order
             *
             * @param column
             */
            vm.sort = function (column) {
                vm.sortColumn = column.id;
                vm.sortOrder = (vm.sortOrder === 'asc') ? 'desc' : 'asc';

                if (vm.tableOptions.filtersEnabled) {
                    vm.filter();
                } else if (vm.tableOptions.hasOwnProperty('sort')) {
                    vm.tableOptions.sort(vm.sortColumn, vm.sortOrder);
                }
            };

            /**
             * Shows or hides a column (saves it to localStorage)
             *
             * @param column
             */
            vm.toggleColumn = function (column) {
                column.hidden = !column.hidden;

                if (savedOptions.hasOwnProperty('columns')) {
                    if (savedOptions.columns.hasOwnProperty(column.id)) {
                        savedOptions.columns[column.id].hidden = !savedOptions.columns[column.id].hidden;
                    } else {
                        savedOptions.columns[column.id] = {hidden: true};
                    }
                } else {
                    savedOptions.columns = {};
                    savedOptions.columns[column.id] = {hidden: true};
                }

                localStorage.setItem(vm.tableOptions.tableId, angular.toJson(savedOptions));
            };

            /**
             * Sets up the pages (for pagination)
             */
            var setupPages = function () {
                var lastPage = vm.tableOptions.pagination.lastPage,
                    i = 1;

                vm.pages = [];

                while(i <= lastPage) {
                    vm.pages.push(i);

                    i += 1;
                }
            };

            /**
             * Watches for table data changes
             */
            $scope.$watch('vm.tableData', function () {
                _.each(vm.tableData, function (row) {
                    _.each(vm.tableOptions.columns, function (column) {
                        if (column.id.indexOf('.') !== -1) {
                            row[column.id] = getRowVal(row, column.id);
                        }

                        if (column.hasOwnProperty('format')) {
                            if (angular.isFunction(column.format)) {
                                row['_' + column.id] = column.format(row[column.id]);
                            } else {
                                row['_' + column.id] = $filter(column.format)(row[column.id]);
                            }
                        } else {
                            row['_' + column.id] = row[column.id];
                        }
                    });
                });
            }, true);

            $scope.$watch('vm.page', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    vm.filter();
                }
            });

            /**
             * Watches for pagination changes
             */
            if (vm.tableOptions.hasOwnProperty('pagination')) {
                $scope.$watch('vm.tableOptions.pagination', function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        vm.filter();
                        setupPages();
                    }
                }, true);
            }

        }
    }

})();
