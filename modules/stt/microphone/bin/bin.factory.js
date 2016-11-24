(function() {
    'use strict';

    angular
        .module('microphone', [])
        .factory('BinFactory', BinFactory);
    BinFactory.$inject = [];

    function BinFactory() {
        return Bin;
    }
})();