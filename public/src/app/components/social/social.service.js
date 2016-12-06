(function(){
  'use strict';

  angular.module('IMGDMSAPI')
          .service('socialLinkService', [
          '$q',
          socialLinkService
  ]);

  function socialLinkService($q){
    var socialLinks = [];

    return {
      loadAllItems:function(){
        return $q.when(socialLinks);
      }
    };
  }
})();
