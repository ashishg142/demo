/*globals _*/
(function() {
  'use strict';

  angular
    .module('IMGDMSAPI')
    .directive('sidebar', sidebar);

  /** @ngInject */
  function sidebar() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/sidebar/sidebar.html',
      scope: {
      },
      controller: SidebarController,
      controllerAs: 'sc',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function SidebarController($scope, $location) {
      var vm = this;

      vm.collapsed = (localStorage.hasOwnProperty('sidebarCollapsed')) ? angular.fromJson(localStorage.getItem('sidebarCollapsed')) : false;
      vm.removed = true;

      vm.menu = [
        {text: 'Dashboard', link: '/', icon: 'fa fa-tachometer', state: ''},
        {text: 'Apps', link: '/apps', icon: 'fa fa-globe', state: ''},
        {text: 'App Tokens', link: '/tokens', icon: 'fa fa-cubes', state: ''},
        {text: 'Error Log', link: '/errors', icon: 'fa fa-exclamation-circle', state: ''},
        {text: 'Site Config', link: '/siteconfig', icon: 'fa fa-sitemap', state: ''}
      ];

      /**
       * Sets the active menu item
       * @param item
       */
      vm.setActiveMenu = function (item) {
        _.each(vm.menu, function (property, key) {
          vm.menu[key].state = '';
        });

        item.state = 'active';

        $location.path(item.link);
      };

      /**
       * Toggles collapsing the sidebar
       */
      vm.toggleSidebar = function () {
        vm.collapsed = !vm.collapsed;

        localStorage.setItem('sidebarCollapsed', vm.collapsed);

        $scope.$emit('TOGGLE_SIDEBAR');
      };

      _.each(vm.menu, function (item) {
        if ($location.path() == item.link) {
          item.state = 'active';
        }
      });

      if (vm.collapsed) {
        $scope.$emit('TOGGLE_SIDEBAR');
      }
    }
  }

})();
