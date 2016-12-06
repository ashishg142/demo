(function() {
  'use strict';

  angular
    .module('IMGDMSAPI')
    .config(config);

  /** @ngInject */
  function config($logProvider, $translateProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

    // Load translations
    $translateProvider.preferredLanguage('en');
    $translateProvider.useSanitizeValueStrategy('sanitize');
    $translateProvider.useLoader('translations');

    if (window.location.port === '') {
      tinyMCE.baseURL = '/scripts';
    }
  }

})();
