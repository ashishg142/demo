/*globals _*/
(function() {
  'use strict';

  angular
    .module('IMGDMSAPI')
    .directive('searchForm', searchForm);

  /** @ngInject */
  function searchForm() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/searchform/search.html'
    };
    return directive;
  }

})();
