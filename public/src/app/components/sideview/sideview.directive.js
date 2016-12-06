(function() {
  'use strict';

  angular
    .module('IMGDMSAPI')
    .directive('sideView', sideView);

  /** @ngInject */
  function sideView() {
    return {
      restrict: 'E',
      scope: {
          show: '=',
          toggleShow: '&'
      },
      templateUrl: 'app/components/sideview/sideview.html',
      controller: SideViewController,
      controllerAs: 'vm',
      bindToController: true
    };

    /** @ngInject */
    function SideViewController($scope) {
      var vm = this;

      /**
       * Toggles showing the side view
       */
      vm.toggleShow = function () {
        vm.show = !vm.show;
      };

      /**
       * Handles the CLOSE_SIDEVIEW event which hides the sideview
       */
      $scope.$on('CLOSE_SIDEVIEW', function () {
        vm.toggleShow();
      });
    }
  }

})();
