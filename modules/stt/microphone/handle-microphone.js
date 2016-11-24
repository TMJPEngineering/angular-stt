(function(){
    'use strict';

//yet to add socket and displaymetadata.js
/*    var initSocket = require('./socket').initSocket;
    var display = require('./views/displaymetadata');*/

    angular
        .module('microphone')
        .factory('microphoneHandler', microphoneHandler);
    microphoneHandler.$inject = ['$rootScope'];

    function microphoneHandler($rootScope) {
        var factory = {
            handleMicrophone: handleMicrophone
        }

        return factory;

        function handleMicrophone(token, model, mic, callback) {
            console.log('handleMicrophone');
            if (model.indexOf('Narrowband') > -1) {
                var err = new Error('Microphone transcription cannot accomodate narrowband models, ' +
                    'please select another');
                callback(err, null);
                return false;
            }

            $rootScope.$emit('clearscreen');

            $rootScope.$on('showjson', function() {
                var $resultsJSON = $('#resultsJSON');
                $resultsJSON.val(baseJSON);
            });

            // Test out websocket
            var baseString = '';
            // var baseJSON = '';

            // var keywords = display.getKeywordsToSearch();
            // var keywords_threshold = keywords.length == 0 ? null : 0.01;

            var options = {};
            options.token = token;
            options.message = {
                'action': 'start',
                'content-type': 'audio/l16;rate=16000',
                'interim_results': true,
                'continuous': true,
                'word_confidence': true,
                'timestamps': true,
                'max_alternatives': 3,
                'inactivity_timeout': 600,
                'word_alternatives_threshold': 0.001,
                // 'keywords_threshold': keywords_threshold,
                // 'keywords': keywords,
                'smart_formatting': true
            };
            options.model = model;

             function onOpen(socket) {
                console.log('Mic socket: opened');
                callback(null, socket);
            }

            function onListening(socket) {
                mic.onAudio = function(blob) {
                    if (socket.readyState < 2) {
                    socket.send(blob);
                    }
                };
            }

            function onMessage(msg) {
                if (msg.results) {
                // Convert to closure approach
                    baseString = display.showResult(msg, baseString, model);
                    baseJSON = JSON.stringify(msg, null, 2);
                    display.showJSON(baseJSON);
                }
            }

            function onError() {
            console.log('Mic socket err: ', err);
            }

            function onClose(evt) {
            console.log('Mic socket close: ', evt);
            }

            // initSocket(options, onOpen, onListening, onMessage, onError, onClose);
            // };
        }
    }
})();