/*globals _*/
(function() {
  'use strict';

  angular
    .module('IMGDMSAPI')
    .directive('myFooter', myFooter);

  /** @ngInject */
  function myFooter() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/footer/footer.html',
      scope: {
      },
      controller: FooterController,
      controllerAs: 'fc',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function FooterController($scope,navService,AppConstant , footerService) {
      var vm = this;
      vm.menuItems = [];
      vm.imgPath = "";
      vm.addressData = null;
      vm.footerlinks = [];
      vm.copyright = "";
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
      footerService.addressInfo()
      .then(function(data){
        vm.addressData = data;
      }); // get Address info
      footerService.footerLinkData()
      .then(function(data){
        vm.footerlinks =[].concat(data);
        console.log(vm.footerlinks);
      }); //get footer links
      footerService.copyrightInfo()
      .then(function(data){
        vm.copyright = data;
      }); //get copyright text;
    }
  }

})();
