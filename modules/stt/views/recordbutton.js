(function() {
    'use strict';

    // var Microphone = require('../Microphone');
    // var handleMicrophone = require('../handlemicrophone').handleMicrophone;
    // replaced by toast
    // var showError = require('./showerror').showError;

    angular
        .module('views')
        .directive('recordAudio', recordAudio);
    recordAudio.$inject = ['utils', 'MicrophoneFactory', 'microphoneHandler'];

    function recordAudio(utils, MicrophoneFactory, microphoneHandler) {
        var directive = {
            restrict: 'E',
            template: '<button type="button" class="btn btn-default" aria-label="Play" id="recordAudio">Play</button>',
            link: linkFn
        }

        return directive;

        function linkFn(scope, element, attr) {
            element.on('click', function(evt) {
                evt.preventDefault();
                var running = false;
                var token = utils.getContext.token;
                var micOptions = {
                    bufferSize: utils.getContext.bufferSize
                };

                var mic = new MicrophoneFactory(micOptions);
                var currentModel = localStorage.getItem('currentModel');
                var currentlyDisplaying = localStorage.getItem('currentlyDisplaying');

                if (currentlyDisplaying == 'sample' || currentlyDisplaying == 'fileupload') {
                    showError('Currently another file is playing, please stop the file or wait until it finishes');
                    return;
                }

                localStorage.setItem('currentlyDisplaying', 'record');
                if (!running) {
                    $('#resultsText').val(''); // clear hypotheses from previous runs
                    console.log('Not running, handleMicrophone()');
                    console.log(token, currentModel);
                    microphoneHandler.handleMicrophone(token, currentModel, mic, function(err) {
                            if (err) {
                                var msg = 'Error: ' + err.message;
                                console.log(msg);
                                showError(msg);
                                running = false;
                                localStorage.setItem('currentlyDisplaying', 'false');
                                console.log('Running = false');
                            } else {
                                element.css('background-color', '#d74108');
                                element.find('img').attr('src', 'images/stop.svg');
                                console.log('starting mic');
                                mic.record();
                                running = true;
                                console.log('Running = trues')
                            }
                    });
                } else {
                    console.log('Stopping microphone, sending stop action message');
                    element.removeAttr('style');
                    element.find('img').attr('src', 'images/microphone.svg');
                    $rootScope.emit('hardsocketstop');
                    mic.stop();
                    running = false;
                    localStorage.setItem('currentlyDisplaying', 'false');
                }
            });
        }
    }
})();
