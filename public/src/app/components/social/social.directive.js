/*globals _*/
(function() {
  'use strict';

  angular
    .module('IMGDMSAPI')
    .directive('socialLinks', socialLinks);

  /** @ngInject */
  function socialLinks() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/social/social.html'
    };
    return directive;
  }

})();
