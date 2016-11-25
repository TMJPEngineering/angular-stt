(function() {
    'use strict'

    angular.module('models')
        .factory('modelFactory', modelFactory);
    modelFactory.$inject = ['$http'];

    function modelFactory($http) {
        var factory = {
            getModel: getModel
        };

        return factory;

        function getModel(token) {
            console.log('getModel() called')

            $http.get('https://stream.watsonplatform.net/speech-to-text/api/v1/models', {
                withCredentials: true,
                headers: {
                    'Accept': 'application/json',
                    'X-Watson-Authorization-Token': token
                }
            }).then(function(response) {
                console.log('Model Factory: Success');
            }, function (error) {
                console.log('Model Factory: Error:', error);
            })

        }
    }
})();
