(function(){
  'use strict';

  angular.module('IMGDMSAPI')
          .service('AppConstant', [
          '$q',
          AppConstant
  ]);

  function AppConstant($q){
   var constant = {
       "imgPath": APP.imagePath
   }

    return {
      loadConstant:function(){
        return $q.when(constant);
      }
    };
  }
})();
