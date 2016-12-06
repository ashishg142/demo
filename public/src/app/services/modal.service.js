(function () {
    'use strict';

    angular
        .module('IMGDMSAPI')
        .factory('ModalService', ModalService);

    /** @ngInject */

    function ModalService($uibModal) {
        return {
            confirm: function (message, callback) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    backdrop: 'static',
                    templateUrl: 'app/modals/confirm.html',
                    controller: function ($uibModalInstance) {
                        var modal = this;

                        modal.message = message;

                        modal.yes = function () {
                            $uibModalInstance.close(true);
                        };

                        modal.no = function () {
                            $uibModalInstance.close(false);
                        };
                    },
                    controllerAs: 'vm'
                });

                modalInstance.result.then(callback);
            }
        };
    }

})();