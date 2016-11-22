(function () {
    'use strict';

    angular
        .module('utils', [])
        .factory('utils', utils);

    utils.$inject = ['$http', '$q'];

    function utils($http, $q) {
        var factory = {
            onFileProgress: onFileProgress,
            createTokenGenerator: createTokenGenerator
        }

        return factory;

        function getCookie(name) {
            var value = "; " + document.cookie;
            var parts = value.split("; " + name + "=");
            if (parts.length == 2) return parts.pop().split(";").shift();
        };

        function fileBlock(_offset, length, _file, readChunk) {
            var r = new FileReader();
            var blob = _file.slice(_offset, length + _offset);
            r.onload = readChunk;
            r.readAsArrayBuffer(blob);
        }

        function onFileProgress() {
            var file = options.file;
            var fileSize = file.size;
            var chunkSize = options.bufferSize || 16000;  // in bytes
            var offset = 0;
            var readChunk = function(evt) {
                if (offset >= fileSize) {
                  console.log('Done reading file');
                  onend();
                  return;
            }
            if (!running()) {
              return;
            }
            if (evt.target.error == null) {
              var buffer = evt.target.result;
              var len = buffer.byteLength;
              offset += len;
              // console.log('sending: ' + len);
              ondata(buffer); // callback for handling read chunk
            } else {
              var errorMessage = evt.target.error;
              console.log('Read error: ' + errorMessage);
              onerror(errorMessage);
              return;
            }
            // use this timeout to pace the data upload for the playSample case,
            // the idea is that the hyps do not arrive before the audio is played back
            if (samplingRate) {
              // console.log('samplingRate: ' +
              //  samplingRate + ' timeout: ' + (chunkSize * 1000) / (samplingRate * 2));
              setTimeout(function() {
                fileBlock(offset, chunkSize, file, readChunk);
              }, (chunkSize * 1000) / (samplingRate * 2));
            } else {
              fileBlock(offset, chunkSize, file, readChunk);
            }
            };
            fileBlock(offset, chunkSize, file, readChunk);
        }

        function createTokenGenerator() {
            var hasBeenRunTimes = 0;
              return {
                getToken: function(callback) {
                  ++hasBeenRunTimes;

                  if (hasBeenRunTimes > 5) {
                    var err = new Error('Cannot reach server');
                    // callback(null, err);
                    return $q.reject(err);
                  }

                  return $http.post('/api/token', {
                      headers: {
                          'csrf-token': getCookie("XSRF-TOKEN")
                      }
                  }).then(function (response) {
                        var token = tokenRequest.responseText;
                        return token;
                        // callback(null, token);
                  }, function(err){
                        var error = 'Cannot reach server';
                        // callback(error);
                        return error;
                  });
                  
                },
                getCount: function() { return hasBeenRunTimes; }
              };
            };
        }
})();


// utils.getToken(function (test, result) {
//     if (result == error) error
//     else success
//     console.log()
// });

// utils.getToken().then(function () {

// }, function () {

// })

// var promise = new Promise(success, error);
// promise.then();

// q library
