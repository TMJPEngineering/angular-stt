(function(){
    'use strict'

    angular
        .module('di ko alam')
        .factory('models', models);
    models.$inject = ['$http'];

    function models($http) {
        var factory = {
            getModels: getModels
        }
        return factory;

        function getModels() {
            var viewContext = {
                currentModel: 'ja-JP_BroadbandModel',
                models: {
                    "url": "https://stream.watsonplatform.net/speech-to-text/api/v1/models/ja-JP_BroadbandModel", 
                    "rate": 16000, 
                    "name": "ja-JP_BroadbandModel", 
                    "language": "ja-JP", 
                    "description": "Japanese broadband model."
                },
                token: token,
                bufferSize: BUFFERSIZE
                };
                var modelUrl = 'http://localhost:3000/bm-stt/speech-to-text/api/v1/models';

                $http({
                    method : "GET",
                    url : modelUrl,
                    withCredentials: true,
                    headers: {'Accept': 'application/json', 'X-Watson-Authorization-Token': token}
                }).then(function mySucces(response) {
                    console.log('Success');
                }, function myError(response) {
                    console.log(response);
                });

        }
    }
})();