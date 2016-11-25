(function(){
    'use strict';

    angular
        .module('views')
        .directive('stopRecord', stopRecord);
    stopRecord.$inject = ['utils', 'MicrophoneFactory', 'microphoneHandler', '$rootScope'];

    function stopRecord(utils, MicrophoneFactory, microphoneHandler, $rootScope) {
        var directive = {
            restrict: 'E',
            template: '<button type="button" class="btn btn-default" aria-label="Play" id="recordAudio">Stop</button>',
            link: linkFn
        }
        return directive;

        function linkFn(scope, element, attr) {
            var micOptions = {
                bufferSize: ctx.buffersize
            };
            var mic = new Microphone(micOptions);

            element.on('click', function() {
                console.log('Stopping microphone, sending stop action message');
                $rootScope.$emit('hardsocketstop');
                mic.stop();
                localStorage.setItem('currentlyDisplaying', 'false');
            });
        }
    }
})();