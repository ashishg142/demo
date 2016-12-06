(function() {
  'use strict';

  angular
    .module('IMGDMSAPI')
    .controller('DemoController', DemoController);

  /** @ngInject */
  function DemoController(AppConstant, contentData) {
    var vm = this;
    AppConstant
      .loadConstant()
      .then(function(constant) {
        vm.imgPath  = constant.imgPath;
      }); // image path
    contentData.contentInfo()
    .then(function(data){
      vm.textData = data;
    })
    contentData.planInfo()
    .then(function(data){
      vm.planDetails = data;
    })

  }
})();
