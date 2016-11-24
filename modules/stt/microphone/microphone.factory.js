(function() {
    'use strict';

    angular
        .module('microphone')
        .factory('MicrophoneFactory', MicrophoneFactory);
    MicrophoneFactory.$inject = [];

    function MicrophoneFactory() {
        return Microphone;
    }
})();
