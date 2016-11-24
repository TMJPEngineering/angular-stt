(function() {
    'use strict';

    angular
        .module('microphone', [
            'word-alternative',
            'bin',
            'scene'
        ])
        .factory('MicrophoneFactory', MicrophoneFactory);
    MicrophoneFactory.$inject = [];

    function MicrophoneFactory() {
        return Microphone;
    }
})();
