(function() {
    'use strict';

    angular.module('IMGDMSAPI')
        .factory('config', config);

    function config() {
        var host = (location.host.indexOf(':') !== -1) ? location.host.substring(0, location.host.indexOf(':')) : location.host;
        var apiUrl = location.protocol + '//' + host + '/api';

        var config = {
            apiUrl: apiUrl,
            appToken: {
                appId: 1,
                apiToken: 'eyJpdiI6IjM2SnRKY2hBVysxdk51aFp1eXJ2b2c9PSIsInZhbHVlIjoiMDNPU0JVT2Y0ekVOUGQ3bldkaG9VUjhPTEdQeUR5dnU0VHlLUUJ3aU1nZz0iLCJtYWMiOiJlYmU4YTA4MjA4NmIyNTRiNzZmMTMyYTRlYTk4ODUzYzE5NTdjNWVkY2ZiYjMyMGM5NWY3ODgyZDczY2U5OGRhIn0=',
                appIdKey: 'appId',
                apiTokenKey: 'apiToken'
            }
        };

        return config;
    }
})();