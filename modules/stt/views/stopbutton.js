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
            element.on('click', function() {
                console.log('Stopping microphone');
                var microphone = new MicrophoneFactory({
                    bufferSize: utils.getContext.bufferSize
                });
                $rootScope.$emit('hardsocketstop');
                microphone.stop();
                localStorage.setItem('currentlyDisplaying', 'false');
            });
        }
    }
})();