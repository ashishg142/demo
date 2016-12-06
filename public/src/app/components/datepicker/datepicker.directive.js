(function () {
    'use strict';

    angular
        .module('IMGDMSAPI')
        .directive('datePicker', datePicker);

    /** @ngInject */
    function datePicker() {
        return {
            restrict: 'E',
            scope: {
                form: '=datePickerForm',
                fieldId: '@datePickerId',
                submitted: '=datePickerSubmitted',
                model: '=datePickerModel',
                required: '=datePickerRequired',
                label: '@datePickerLabel'
            },
            templateUrl: 'app/components/datepicker/datepicker.html',
            controller: DatePickerController,
            controllerAs: 'vm',
            bindToController: true,
            replace: true
        };

        /** @ngInject */
        function DatePickerController() {
            var vm = this;

            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);

            var afterTomorrow = new Date();
            afterTomorrow.setDate(tomorrow.getDate() + 1);

            vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            vm.format = vm.formats[0];
            vm.altInputFormats = ['M!/d!/yyyy'];

            vm.popup1 = {
                opened: false
            };

            vm.popup2 = {
                opened: false
            };

            vm.events = [
                {
                    date: tomorrow,
                    status: 'full'
                },
                {
                    date: afterTomorrow,
                    status: 'partially'
                }
            ];

            /**
             * Disables weekend selection
             *
             * @param data
             * @returns {boolean}
             */
            function disabled(data) {
                var date = data.date,
                    mode = data.mode;
                return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
            }

            /**
             * Gets the class for the day
             *
             * @param data
             * @returns {*}
             */
            function getDayClass(data) {
                var date = data.date,
                    mode = data.mode;

                if (mode === 'day') {
                    var dayToCheck = new Date(date).setHours(0,0,0,0);

                    for (var i = 0; i < vm.events.length; i++) {
                        var currentDay = new Date(vm.events[i].date).setHours(0,0,0,0);

                        if (dayToCheck === currentDay) {
                            return vm.events[i].status;
                        }
                    }
                }

                return '';
            }

            vm.inlineOptions = {
                customClass: getDayClass,
                minDate: new Date(),
                showWeeks: true
            };

            vm.dateOptions = {
                dateDisabled: disabled,
                formatYear: 'yy',
                maxDate: new Date(2020, 5, 22),
                minDate: new Date(),
                startingDay: 1
            };

            /**
             * Clears the date picker field
             */
            vm.clear = function() {
                vm.dt = null;
            };

            /**
             * Opens the first popup
             */
            vm.open1 = function() {
                vm.popup1.opened = true;
            };

            /**
             * Opens the second popup
             */
            vm.open2 = function() {
                vm.popup2.opened = true;
            };

            /**
             * Sets the date
             *
             * @param year
             * @param month
             * @param day
             */
            vm.setDate = function(year, month, day) {
                vm.dt = new Date(year, month, day);
            };

            /**
             * Resets date to current date
             */
            vm.today = function() {
                vm.dt = new Date();
            };

            /**
             * Toggles min date
             */
            vm.toggleMin = function() {
                vm.inlineOptions.minDate = vm.inlineOptions.minDate ? null : new Date();
                vm.dateOptions.minDate = vm.inlineOptions.minDate;
            };

            vm.today();
            vm.toggleMin();
        }
    }

})();
