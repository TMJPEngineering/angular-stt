(function() {
    'use strict';

    angular
        .module('microphone', [])
        .factory('SceneFactory', SceneFactory);
    SceneFactory.$inject = [];

    function SceneFactory() {
        return Scene;
    }
})();