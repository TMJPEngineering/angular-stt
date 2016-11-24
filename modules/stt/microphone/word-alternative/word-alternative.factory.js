(function() {
    'use strict';

    angular.module('word-alternative')
        .factory('WordAlternativeFactory', WordAlternativeFactory);
    WordAlternativeFactory.$inject = ['metadataFactory'];

    function WordAlternativeFactory() {
        return WordAlternative;
    }
})();
