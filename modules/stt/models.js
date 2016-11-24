(function() {
    'use strict'

    angular
        .module('stt')
        .factory('models', models);
    models.$inject = ['$http'];

    function models($http) {
        var factory = {
            getModels: getModels
        }
        return factory;

        function getModels(viewContext) {
            console.log('getModels() called')
            var modelUrl = 'https://stream.watsonplatform.net/speech-to-text/api/v1/models';

            $http({
                method: "GET",
                url: modelUrl,
                withCredentials: true,
                headers: { 'Accept': 'application/json', 'X-Watson-Authorization-Token': viewContext.token }
            }).then(function (response) {
                console.log('Success');
                console.log('response', response);
            }, function (response) {
                console.log('Error');
                console.log(response);
            });

        }
    }
})();
