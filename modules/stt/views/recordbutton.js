(function() {
    'use strict';

    // var Microphone = require('../Microphone');
    // var handleMicrophone = require('../handlemicrophone').handleMicrophone;
    // replaced by toast
    // var showError = require('./showerror').showError;

    angular
        .module('views')
        .directive('recordAudio', recordAudio);
    recordAudio.$inject = ['utils', 'MicrophoneFactory', 'microphoneHandler', 'notification'];

    function recordAudio(utils, MicrophoneFactory, microphoneHandler, notification) {
        var directive = {
            restrict: 'E',
            template: '<button type="button" class="btn btn-default" aria-label="Play" id="recordAudio">Play</button>',
            link: linkFn
        }

        return directive;

        function linkFn(scope, element, attr) {
            element.on('click', function(event) {
                event.preventDefault();
                var token = utils.getContext.token;
                var config = {
                    bufferSize: utils.getContext.bufferSize
                };

                var microphone = new MicrophoneFactory(config);
                var currentModel = localStorage.getItem('currentModel');
                var currentlyDisplaying = localStorage.getItem('currentlyDisplaying');

                if (currentlyDisplaying == 'sample' || currentlyDisplaying == 'fileupload') {
                    notification.showError('Currently another file is playing, please stop the file or wait until it finishes');
                    return;
                }

                $('#resultsText').val(''); // clear hypotheses from previous runs
                microphoneHandler.handleMicrophone(token, currentModel, microphone, function(error) {
                    if (error) {
                        console.log('handleMicrophone(): not running');
                        notification.showError('Error: ' + error.message);
                        localStorage.setItem('currentlyDisplaying', 'false');
                    } else {
                        console.log('handleMicrophone(): running');
                        microphone.record();
                        element.css('background-color', '#d74108');
                        element.find('img').attr('src', 'images/stop.svg');
                        localStorage.setItem('currentlyDisplaying', 'record');
                    }
                });
            });
        }
    }
})();
