(function() {
  'use strict';

  angular
    .module('IMGDMSAPI')
    .controller('MotherController', MotherController)
  function MotherController ($scope) {
    var vm = this,
      bodyClasses = [];
    vm.bodyClass = ''
    vm.imagePath = APP.imagePath;
  }
})()
