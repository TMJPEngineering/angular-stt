(function() {
    'use strict';

    angular.module('socket')
        .factory('socketFactory', socketFactory);
    socketFactory.$inject = ['$rootScope'];

    function socketFactory($rootScope) {
        var factory = {
            connect: connect,
            initSocket: initSocket
        };

        return factory;

        function connect(token, model) {
            var socket;
            console.log('Socket Factory (token):', token);
            console.log('Socket Factory (model):', model);

            try {
                socket = new WebSocket('wss://stream.watsonplatform.net/speech-to-text/api/v1/recognize?watson-token=' + token + '&model=' + model);
            } catch (error) {
                console.error('WS connection error:', error);
            }

            console.log('SOCKET:', socket);

            return socket;
        }

        function initSocket(options, onOpen, onListening, onMessage, onError, onClose) {
            var listening;
            var model = options.model || localStorage.getItem('currentModel');
            var message = options.message || { 'action': 'start' };
            console.log('options (initSocket):', options);
            var socket = connect(options.token, model);

            socket.onopen = function() {
                listening = false;

                // TODO: Convert to Angular Event
                $rootScope.$on('hardsocketstop', function() {
                    console.log('MICROPHONE: close.');
                    socket.send(JSON.stringify({ action: 'stop' }));
                    socket.close();
                });
                $rootScope.$on('socketstop', function() {
                    console.log('MICROPHONE: close.');
                    socket.close();
                });

                socket.send(JSON.stringify(message));
                onOpen(socket);
            };

            socket.onmessage = function(event) {
                var message = JSON.parse(event.data)
                if (message.error) {
                    // TODO: Change to toast
                    showError(message.error);
                    // TODO: Change to Angular Event
                    $rootScope.$emit('hardsocketstop');
                    return;
                }

                if (message.state === 'listening') {
                    if (!listening) {
                        onListening(socket);
                        listening = true;
                    } else {
                        console.log('MICROPHONE: Closing socket');
                        socket.close();
                    }
                }

                onMessage(message, socket);
            };

            socket.onerror = function(event) {
                console.log('WS onerror:', event);
                // TODO: Change to toast
                showError('Application error ' + event.code + ': please refresh your browser and try again');
                // TODO: Change to Angular Event
                $rootScope.$emit('clearscreen');
                onError(event);
            };

            socket.onclose = function(event) {
                console.log('WS onclose:', event);
                if (event.code === 1006) {
                    // Authentication error, try to reconnect
                    console.log('generator count', tokenGenerator.getCount());
                    if (tokenGenerator.getCount() > 1) {
                        // TODO: Change to Angular Event
                        $rootScope.$emit('hardsocketstop');
                        throw new Error('No authorization token is currently available');
                    }
                    tokenGenerator.getToken(function(error, token) {
                        if (error) {
                            // TODO: Change to Angular Event
                            $rootScope.$emit('hardsocketstop');
                            return false;
                        }
                        console.log('Fetching additional token...');
                        options.token = token;
                        initSocket(options, onOpen, onListening, onMessage, onError, onClose);
                    });

                    return false;
                }

                if (event.code === 1011) {
                    console.error('Server error ' + event.code + ': please refresh your browser and try again');
                    return false;
                }

                if (event.code > 1000) {
                    console.error('Server error ' + event.code + ': please refresh your browser and try again');
                    return false;
                }

                // TODO: Change to Angular Event
                // Made it through, normal close
                // $.unsubscribe('hardsocketstop');
                // $.unsubscribe('socketstop');

                onClose(event);
            }
        }
    }
})();
