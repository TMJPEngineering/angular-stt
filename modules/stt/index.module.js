(function() {
    'use strict';

    angular.module('stt', [
            'utils',
            'views',
            'microphone',
            'socket',
            'models'
        ])
        .controller('MainController', MainController);
    MainController.$inject = ['$scope', 'utils', 'modelFactory', '$rootScope', 'initialize'];

    function MainController($scope, utils, modelFactory, $rootScope, initialize) {
        var vm = this;

        window.BUFFERSIZE = 8192;

        angular.element(document).ready(function() {
            var model = {
                "url": "https://stream.watsonplatform.net/speech-to-text/api/v1/models/ja-JP_BroadbandModel",
                "rate": 16000,
                "name": "ja-JP_BroadbandModel",
                "language": "ja-JP",
                "description": "Japanese broadband model."
            };

            var tokenGenerator = utils.createTokenGenerator();

            tokenGenerator.getToken().then(function(response) {
                console.log('response', response);
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
                    currentModel: 'ja-JP_BroadbandModel',
                    models: model,
                    token: token,
                    bufferSize: BUFFERSIZE
                };

                // utils.setContext(viewContext);
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
                localStorage.setItem('currentModel', 'ja-JP_BroadbandModel');
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
