(function() {
    'use strict';

    angular.module('IMGDMSAPI')
        .factory('translations', translationsConfig);

    function translationsConfig($timeout, $q) {
        return function (/*options*/) {
            var deferred = $q.defer();

            var translations = {
                GLOBAL: {
                    CREATE: {
                        SUCCESS: '{{type}} was created successfully!'
                    },
                    DELETE: {
                        SUCCESS: '{{type}} was deleted successfully!'
                    },
                    UPDATE: {
                        SUCCESS: '{{type}} was updated successfully!'
                    }
                },
                ACTIONTRACKER: {
                    CONFIRM_ROLLBACK: 'Are you sure you want to rollback this action? This will apply a change, but not the update. You will need to click "Update" to save the change(s).'
                }
            };

            $timeout(function() {
                deferred.resolve(translations);
            }, 1000);

            return deferred.promise;
        };
    }
})();