(function() {
    'use strict';

    // var Microphone = require('../Microphone');
    // var handleMicrophone = require('../handlemicrophone').handleMicrophone;
    // replaced by toast
    // var showError = require('./showerror').showError;

    angular
        .module('views', [
            'utils',
            'microphone'
        ])
        .directive('recordAudio', recordAudio);
    recordAudio.$inject = ['utils', 'AngularMicrophone'];

    function recordAudio(utils, AngularMicrophone) {
        var directive = {
            restrict: 'E',
            template: '<button type="button" class="btn btn-default" aria-label="Play" id="recordAudio">Play</button>',
            link: linkFn
        }

        return directive;

        function linkFn(scope, element, attr) {
            var running = false;
            var token = utils.ctx.token;
            var micOptions = {
                bufferSize: utils.ctx.buffersize
            };
            var mic = new AngularMicrophone(micOptions);

            element.on('click', function(evt) {
                evt.preventDefault();
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
                    handleMicrophone(token, currentModel, mic, function(err) {
                        if (err) {
                            var msg = 'Error: ' + err.message;
                            console.log(msg);
                            showError(msg);
                            running = false;
                            localStorage.setItem('currentlyDisplaying', 'false');
                        } else {
                            recordButton.css('background-color', '#d74108');
                            recordButton.find('img').attr('src', 'images/stop.svg');
                            console.log('starting mic');
                            mic.record();
                            running = true;
                        }
                    });
                } else {
                    console.log('Stopping microphone, sending stop action message');
                    recordButton.removeAttr('style');
                    recordButton.find('img').attr('src', 'images/microphone.svg');
                    $.publish('hardsocketstop');
                    mic.stop();
                    running = false;
                    localStorage.setItem('currentlyDisplaying', 'false');
                }
            });
        }
    }
})();
