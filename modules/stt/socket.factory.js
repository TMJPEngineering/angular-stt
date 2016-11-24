(function() {
    'use strict';

    angular
        .module('socket')
        .factory('socket', socket);
    socket.$inject = [];

    function socket() {
        var factory = {
            connect: connect
        };

        return factory;

        function connect(token, model) {
            console.log('Socket Factory (token):', token);
            console.log('Socket Factory (model):', model);
            // var socket = io.connect('wss://stream.watsonplatform.net/speech-to-text/api/v1/recognize?watson-token=' + token + '&model=' + model);
            var socket = new WebSocket('wss://stream.watsonplatform.net/speech-to-text/api/v1/recognize?watson-token=' + token + '&model=' + model);
            console.log('SOCKET', socket);
        }
    }
})();