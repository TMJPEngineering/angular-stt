(function(){
    'use strict';

    angular
        .module('views')
        .factory('initialize', initialize);

    // var initRecordButton = require('./recordbutton').initRecordButton;
    // var initDisplayMetadata = require('./displaymetadata').initDisplayMetadata;

    function initialize() {
        var factory = {
            initViews: initViews
        }

        return factory;

        function initViews(context) {
            console.log('Initializing views...');
            console.log('context', context);
            initRecordButton(context);
            initDisplayMetadata();
        }
    }

})();