(function(){
  'use strict';

  angular.module('IMGDMSAPI')
          .service('navService', [
          '$q',
          navService
  ]);

  function navService($q){
    var menuItems = [
      {
        name: 'Home',
        sref: 'home'
      },
      {
        name: 'New RVs',
        sref: 'newrvs'
      },
      {
        name: 'Used Rvs',
        sref: 'usedrvs'
      },
      {
        name: 'custom Build',
        sref: 'custom-build'
      },
      {
        name: 'Blog',
        sref: 'blog'
      },
       {
        name: 'Clearance Rvs',
        sref: 'clearancervs'
      },
      {
        name: 'Model Info',
        sref: 'model-info'
      },
       {
        name: 'Service',
        sref: 'service'
      },
      {
        name: 'About',
        sref: 'about'
      }
    ];

    return {
      loadAllItems:function(){
        return $q.when(menuItems);
      }
    };
  }
})();
