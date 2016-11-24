(function() {
    'use strict';

    angular.module('bin')
        .factory('BinFactory', BinFactory);
    BinFactory.$inject = [];

    function BinFactory() {
        return Bin;
    }
})();