(function(){
    'use strict';

    angular.module('views')
        .factory('initialize', initialize);
    initialize.$inject = ['utils', 'displaymetaFactory'];

    // var initRecordButton = require('./recordbutton').initRecordButton;
    // var initDisplayMetadata = require('./displaymetadata').initDisplayMetadata;
    function initialize(utils, displaymetaFactory) {
        var factory = {
            initViews: initViews
        };

        return factory;

        function initViews(context) {
            utils.ctx = context;
            console.log('Initializing views...');
            console.log('context', utils.ctx);
            // initRecordButton(utils.ctx);
            displaymetaFactory.initDisplayMetadata();
        }
    }

})();