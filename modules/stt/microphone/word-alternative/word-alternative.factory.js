(function() {
    'use strict';

    angular
        .module('microphone')
        .factory('WordAlternativeFactory', WordAlternativeFactory);
    WordAlternativeFactory.$inject = ['metadataFactory'];

    function WordAlternativeFactory() {
        return WordAlternative;
    }
})();
