(function(){
    'use strict';

    angular
        .module('diko alam')
        .factory('notification', notification);
    notification.$inject = ['toast']

    function notification(toast) {
        var factory = {
            showError: showError,
            showNotice: showNotice,
            hideError: hideError
        }

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