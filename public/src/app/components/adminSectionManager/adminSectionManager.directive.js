/*globals */
(function () {
    'use strict';

    angular
        .module('IMGDMSAPI')
        .directive('adminSectionManager', AdminSectionManager);

    /** @ngInject */
    function AdminSectionManager() {

        return {
            restrict: 'E',
            templateUrl: 'app/components/adminSectionManager/adminSectionManager.html',
            controller: AdminSectionManagerController,
            controllerAs: 'adminSectionManager',
            bindToController: true
        };

        function AdminSectionManagerController($scope, RestService) {
            var adminSectionService = RestService.init('adminSection'),
                vm = this,
                userId = 0;

            vm.children = [];

            $scope.$on('LOAD_SECTIONS', function (event, sectionName, userid) {
                userId = userid;
                adminSectionService.one('metaBoxes/' + sectionName + '/' + userid)
                    .then(function (response) {
                        vm.children = angular.copy(response.metaBoxes);
                        vm.cols = response.cols;

                        if (vm.cols < 5) {
                            vm.colSize = Math.floor(12 / vm.cols);
                        }
                    });
            });

            /**
             * Handles re-arranging of the meta-boxes
             */
            vm.onSort = function () {
                var metaBoxes = {boxes: []};

                for (var i = 0; i < vm.children.length; i++) {
                    var col = vm.children[i];

                    for (var j = 0; j < col.length; j++) {
                        var box = {
                            admin_sectionid: col[j].admin_sectionid,
                            admin_section_col: i,
                            sort_order: j
                        };
                        metaBoxes.boxes.push(box);
                    }
                }
                adminSectionService.update('storeOrder/' + userId, metaBoxes);
            };
        }
    }
})();