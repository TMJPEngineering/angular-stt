(function() {
    'use strict';

    angular.module('stt', [
            'utils',
            'views',
            'microphone',
            'socket',
            'models',
            'toast'
        ])
        .constant('lang', {
            name: 'ja-JP',
            rate: 16000,
            description: 'Japanese broadband model'
        })
        .controller('MainController', MainController);
    MainController.$inject = ['$scope', 'utils', 'modelFactory', '$rootScope', 'initialize', 'lang'];

    function MainController($scope, utils, modelFactory, $rootScope, initialize, lang) {
        var vm = this;
        var bufferSize = 8192;

        angular.element(document).ready(function() {
            var model = {
                "url": "https://stream.watsonplatform.net/speech-to-text/api/v1/models/" + lang.name + "_BroadbandModel",
                "rate": lang.rate,
                "name": lang.name + "_BroadbandModel",
                "language": lang.name,
                "description": lang.description
            };

            var tokenGenerator = utils.createTokenGenerator();

            tokenGenerator.getToken().then(function(response) {
                console.log('getToken() called');
                window.onbeforeunload = function() {
                    localStorage.clear();
                };

                if (response.status !== 200) {
                    console.error('No authorization token available');
                    console.error('Attempting to reconnect...');

                    showError('Server error ' + response.status + ': ' + response.data);
                }

                var token = response.data;
                var viewContext = {
                    currentModel: lang.name + '_BroadbandModel',
                    models: model,
                    token: token,
                    bufferSize: bufferSize
                };

                utils.setContext(viewContext);
                initialize.initViews(viewContext);

                // Save model to localstorage
                localStorage.setItem('models', JSON.stringify(model));

                // Check if playback functionality is invoked
                localStorage.setItem('playbackON', false);
                var query = window.location.search.substring(1);
                var vars = query.split('&');
                for (var i = 0; i < vars.length; i++) {
                    var pair = vars[i].split('=');
                    if (decodeURIComponent(pair[0]) === 'debug') {
                        localStorage.setItem('playbackON', decodeURIComponent(pair[1]));
                    }
                }

                // Set default current model
                localStorage.setItem('currentModel', lang.name + '_BroadbandModel');
                localStorage.setItem('sessionPermissions', 'true');

                // getModel(token);
                modelFactory.getModel(viewContext.token);

                $rootScope.$on('clearscreen', function() {
                    $('#resultsText').text('');
                    $('.error-row').hide();
                    $('.notification-row').hide();
                    $('.hypotheses > ul').empty();
                    $('#metadataTableBody').empty();
                });

                // TODO: Clearscreen
                // $scope.on('clearscreen', function(event, data) {
                // });
            });
        });
    }
})();
