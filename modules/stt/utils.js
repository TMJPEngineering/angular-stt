(function() {
    'use strict';

    angular
        .module('utils', [])
        .factory('utils', utils);
    utils.$inject = ['$http', '$q'];

    function utils($http, $q) {
        var factory = {
            getCookie: getCookie,
            createTokenGenerator: createTokenGenerator,
            ctx: {}
        };

        return factory;

        function getCookie(name) {
            console.log('getCookie');
            var value = "; " + document.cookie;
            var parts = value.split("; " + name + "=");
            if (parts.length == 2) return parts.pop().split(";").shift();
        }

        function createTokenGenerator() {
            console.log('createTokenGenerator');
            var hasBeenRunTimes = 0;
            return {
                getToken: function(callback) {
                    ++hasBeenRunTimes;

                    if (hasBeenRunTimes > 5) {
                        var err = new Error('Cannot reach server');
                        // callback(null, err);
                        return $q.reject(err);
                    }

                    return $http.post('/api/token', {
                        headers: {
                            'csrf-token': getCookie("_csrf")
                        }
                    }).then(function(response) {
                        console.log(response);
                    }, function(err) {
                        console.log(err);
                    });
                },
                getCount: function() {
                    return hasBeenRunTimes;
                }
            };
        };
    }
})();
