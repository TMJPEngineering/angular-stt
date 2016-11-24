(function() {
    'use strict'

    angular.module('models')
        .factory('modelFactory', modelFactory);
    modelFactory.$inject = ['$http'];

    function modelFactory($http) {
        var factory = {
            getModel: getModel
        }
        return factory;

        function getModel(token) {
            console.log('getModel() called')
            var modelUrl = 'https://stream.watsonplatform.net/speech-to-text/api/v1/models';

            $http({
                method: "GET",
                url: modelUrl,
                withCredentials: true,
                headers: { 'Accept': 'application/json', 'X-Watson-Authorization-Token': token }
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
