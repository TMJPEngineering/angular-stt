(function(){
    'use strict';

    angular
        .module('di ko alam')
        .factory('initialize', initialize);

    var initRecordButton = require('./recordbutton').initRecordButton;
    var initDisplayMetadata = require('./displaymetadata').initDisplayMetadata;

    function initialize() {
        var factory = {
            initViews: initViews
        }

        return factory;

        function initViews(ctx) {
            console.log('Initializing views...');
            initRecordButton(ctx);
            initDisplayMetadata();
        }
    }

})();