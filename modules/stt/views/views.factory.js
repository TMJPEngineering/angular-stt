(function(){
    'use strict';

    angular.module('views')
        .factory('initialize', initialize);
    initialize.$inject = ['utils', 'displaymetaFactory'];


    function initialize(utils, displaymetaFactory) {
        var factory = {
            initViews: initViews
        };

        return factory;

        function initViews(context) {
            console.log('initViews() called');
            displaymetaFactory.initDisplayMetadata();
        }
    }

})();