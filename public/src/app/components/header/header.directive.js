/*globals _*/
(function() {
  'use strict';

  angular
    .module('IMGDMSAPI')
    .directive('myHeader', myHeader);

  /** @ngInject */
  function myHeader() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/header/header.html',
      scope: {
      },
      controller: HeaderController,
      controllerAs: 'hc',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function HeaderController($scope, $location, navService,AppConstant) {
      var vm = this;
      navService
      .loadAllItems()
      .then(function(menuItems) {
        vm.menuItems = [].concat(menuItems);
      }); // get menu items
      AppConstant
      .loadConstant()
      .then(function(constant) {
        vm.imgPath  = constant.imgPath;
      }); // get constant;
    }
  }

})();
