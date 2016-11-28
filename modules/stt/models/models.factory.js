(function() {
    'use strict'

    angular.module('models')
        .factory('modelFactory', modelFactory);
    modelFactory.$inject = ['$http', '$window'];

    function modelFactory($http, $window) {
        var factory = {
            getModel: getModel
        };

        return factory;

        function getModel(token) {
            console.log('getModel() called')

            $http.get($window.__env.modelUrl, {
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
