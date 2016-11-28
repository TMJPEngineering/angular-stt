(function() {
    'use strict';

    angular.module('scene')
        .factory('SceneFactory', SceneFactory);
    SceneFactory.$inject = [];

    function SceneFactory() {
        return Scene();
    }
})();