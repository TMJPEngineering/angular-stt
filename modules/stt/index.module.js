(function() {
    'use strict';

    angular
        .module('stt', ['utils'])
        .controller('MainController', MainController);
    MainController.$inject = ['$scope', 'utils'];

    function MainController($scope, utils) {
        var vm = this;

        window.BUFFERSIZE = 8192;

        angular.element(document).ready(function() {
            var models = {
                "url": "https://stream.watsonplatform.net/speech-to-text/api/v1/models/ja-JP_BroadbandModel",
                "rate": 16000,
                "name": "ja-JP_BroadbandModel",
                "language": "ja-JP",
                "description": "Japanese broadband model."
            };

            var tokenGenerator = utils.createTokenGenerator();

            tokenGenerator.getToken(function(err, token) {
                window.onbeforeunload = function() {
                    localStorage.clear();
                };

                if (!token) {
                    console.error('No authorization token available');
                    console.error('Attempting to reconnect...');

                    if (err && err.code)
                        showError('Server error ' + err.code + ': ' + err.error);
                    else
                        showError('Server error ' + err.code + ': please refresh your browser and try again');
                }

                var viewContext = {
                    currentModel: 'ja-JP_BroadbandModel',
                    models: models,
                    token: token,
                    bufferSize: BUFFERSIZE
                };

                initViews(viewContext);

                // Save models to localstorage
                localStorage.setItem('models', JSON.stringify(models));

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

                getModels(token);

                // $.subscribe('clearscreen', function() {
                //     $('#resultsText').text('');
                //     $('.error-row').hide();
                //     $('.notification-row').hide();
                //     $('.hypotheses > ul').empty();
                //     $('#metadataTableBody').empty();
                // });

                $scope.on('clearscreen', function(event, data) {

                });

            });
        })
    }

})();
