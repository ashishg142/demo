/*globals _*/
(function () {
    'use strict';

    angular
        .module('IMGDMSAPI')
        .factory('RestService', RestService);

    /** @ngInject */
    function RestService(config, $http, $q, $window) {
        /**
         * This function encapsulates making a RESTful request to a specific API route (op)
         *
         * @param op
         * @returns {{create: create, list: list, one: one, remove: remove, update: update}}
         * @constructor
         */
        function Service(op) {
            var url = (op) ? config.apiUrl + '/' + op : config.apiUrl,
                tokenConfig = angular.copy(config.appToken);
            /**
             * Handles error responses from the server
             *
             * @param response
             * @returns {*}
             */
            var handleError = function (response) {
                if (!angular.isObject(response.data) || !response.data.message) {
                    return ( $q.reject('An unknown error occurred.') );
                } else if (response.data.errorCode && response.data.errorCode === 401) {
                    //User is not logged in (most likely)
                    if (response.data.url) {
                        $window.location.href = response.data.url;
                    }
                } else if (response.data.errorCode && response.data.errorCode === 403) {
                    //User doesn't have access to the requested resource
                    if (response.data.url) {
                        $window.location.href = response.data.url;
                    }
                }

                return ( $q.reject(response.data) );
            };

            /**
             * Handles successful responses from the server
             *
             * @param response
             */
            var handleSuccess = function (response) {
                if (response.data.hasOwnProperty('errors')) {
                    response.data.message = _.values(response.data.errors).join('<br />');
                }

                return ( response.data );
            };

            /**
             * Makes a RESTful request to the server with the specied options
             *
             * @param httpVerb
             * @param data
             * @param id
             * @returns {*}
             */
            var makeRequest = function (httpVerb, data, id) {
                var requestUrl = (id) ? url + '/' + id : url;
                var requestData = (data) ? data : {};

                if (httpVerb === 'GET' || httpVerb === 'DELETE') {
                    requestUrl += '?' + tokenConfig.appIdKey + '=' + tokenConfig[tokenConfig.appIdKey] + '&' + tokenConfig.apiTokenKey + '=' + tokenConfig[tokenConfig.apiTokenKey];
                } else {
                    requestData.appId = tokenConfig[tokenConfig.appIdKey];
                    requestData.apiToken = tokenConfig[tokenConfig.apiTokenKey];
                }

                var request = $http({
                    method: httpVerb,
                    url: requestUrl,
                    data: requestData
                });

                return ( request.then(handleSuccess, handleError) );
            };

            return {
                /**
                 * Creates a new entry
                 *
                 * @param data
                 * @returns {*}
                 */
                create: function (data) {
                    return makeRequest('POST', data);
                },

                /**
                 * Lists a set of data (with optional filtering)
                 *
                 * @param options
                 * @param page
                 * @returns {*}
                 */
                list: function (options, page) {
                    var httpVerb = options ? 'POST' : 'GET';
                    var extra = options ? 'options' : null;
                    var data = {
                        options: options
                    };

                    if (page) {
                        data.page = page;
                    }

                    return makeRequest(httpVerb, data, extra);
                },

                /**
                 * Retrieves one entry
                 *
                 * @param id
                 * @returns {*}
                 */
                one: function (id) {
                    return makeRequest('GET', null, id);
                },

                /**
                 * Removes an entry
                 *
                 * @param id
                 * @param options
                 * @returns {*}
                 */
                remove: function (id, options) {
                    var httpVerb = options ? 'POST' : 'DELETE';
                    var extra = options ? 'delete/' + id : id;
                    var data = options ? {options: options} : null;

                    return makeRequest(httpVerb, data, extra);
                },

                /**
                 * Updates an entry
                 *
                 * @param id
                 * @param data
                 * @returns {*}
                 */
                update: function (id, data) {
                    return makeRequest('PUT', data, id);
                },

                /**
                 * Set API Token Info
                 *
                 * @param appId
                 * @param apiToken
                 */
                setAppToken: function (appId, apiToken) {
                    tokenConfig.appId = appId;
                    tokenConfig.apiToken = apiToken;
                },
                /**
                 * Get API Token Info
                 */
                getAppToken: function () {
                    return tokenConfig;
                }
            };
        }

        return {
            /**
             * Creates a new Service object for the specified operation (api-level route)
             *
             * @param op
             * @returns {Service}
             */
            init: function (op) {
                return new Service(op);
            }
        };
    }

})();