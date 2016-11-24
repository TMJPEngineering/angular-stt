(function(){
    'use strict';

    angular
        .module('microphone')
        .factory('WordAlternative', WordAlternative);
    WordAlternative.$inject = ['metadataFactory'];

    function WordAlternative() {
        return WordAlternative;
    }
})();