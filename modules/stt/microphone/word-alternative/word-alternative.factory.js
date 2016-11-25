(function() {
    'use strict';

    angular.module('word-alternative')
        .factory('WordAlternativeFactory', WordAlternativeFactory);
    WordAlternativeFactory.$inject = [];

    function WordAlternativeFactory() {
        return WordAlternative;
    }
})();
