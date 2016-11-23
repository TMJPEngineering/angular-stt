(function(){
    'use strict';

    angular
        .module('views')
        .factory('notification', notification);
    notification.$inject = ['toast']

    function notification(toast) {
        var factory = {
            showError: showError,
            showNotice: showNotice
        };

        return factory;

        function showError(msg) {
            console.log('Error ', msg);
            toast.error(msg);
        }

        function showNotice(msg) {
            console.log('Error ', msg);
            toast.info(msg);
        }

    }
})();