(function() {
    'use strict'

    angular
        .module('microphone')
        .factory('displaymetaFactory', displaymetaFactory);
    displaymetaFactory.$inject = [
        'SceneFactory',
        'BinFactory',
        'WordAlternativeFactory',
        '$timeout'
    ];


    function displaymetaFactory(SceneFactory, BinFactory, WordAlternativeFactory, $timeout) {
        var scene = new SceneFactory();

        var factory = {
            showResults: showResults,
            initDisplayMetadata: initDisplayMetadata
        };

        // ctx.font = defaultFont;

        const INITIAL_OFFSET_X = 30;
        const INITIAL_OFFSET_Y = 30;
        const timeout = 500;

        var element = document.getElementById('canvas'),
            canvas = element.getContext('2d'),
            keywordsInputDirty = false,
            worker = null,
            runTimer = false,
            scrolled = false,
            pushed = 0,
            popped = 0;

        return factory;

        function initDisplayMetadata() {
            console.log('initDisplayMetadata() called');
            // initTextScroll();
            keywordsInputDirty = false;
            hslider.min = 0;
            hslider.max = 0;
            hslider.value = hslider.min;
            vslider.min = 0;
            vslider.max = 0;
            vslider.value = vslider.max;
            $('#vslider').css('display', 'none');
            $('#hslider').on('change mousemove', function() {
                onHScroll();
            });
            $('#vslider').on('change mousemove', function() {

                onVScroll();
            });

            $('#canvas').css('display', 'none');
            $('#canvas-placeholder').css('display', 'block');

            onResize(); // to adjust the canvas size

            var workerScriptBody =
                'var fifo = [];\n' +
                'var onmessage = function(event) {\n' +
                '  var payload = event.data;\n' +
                '  var type = payload.type;\n' +
                '  if(type == \'push\') {\n' +
                '    fifo.push(payload.msg);\n' +
                '  }\n' +
                '  else if(type == \'shift\' && fifo.length > 0) {\n' +
                '    var msg = fifo.shift();\n' +
                '    postMessage({\n' +
                '     bins:msg.results[0].word_alternatives,\n' +
                '     kws:msg.results[0].keywords_result\n' +
                '    });\n' +
                '  }\n' +
                '  else if(type == \'clear\') {\n' +
                '    fifo = [];\n' +
                '    console.log(\'worker: fifo cleared\');\n' +
                '  }\n' +
                '}\n';

            var blobURL = window.URL.createObjectURL(new Blob([workerScriptBody]));
            worker = new Worker(blobURL);
            worker.onmessage = function(event) {
                var data = event.data;
                showCNsKWS(data.bins);
                popped++;
                console.log('POPPED:', popped);
                console.log('----------------');
            };
        }

        function showCNsKWS(bins, kws) {
            bins.forEach(parseBin);
            hslider.max = scene.width() - canvas.width + INITIAL_OFFSET_X;
            hslider.value = hslider.max;
            onHScroll();
            onVScroll();

            if (vslider.min < 0) {
                $('#vslider').css('display', 'block');
            }
            $('#hslider').css('display', 'block');
            $('#canvas').css('display', 'block');
            $('#canvas-placeholder').css('display', 'none');

        }

        function parseAlternative(element /*, index, array*/ ) {
            var confidence = element['confidence'];
            var word = element['word'];
            var bin = scene._bins[scene._bins.length - 1];
            bin.addWordAlternative(new WordAlternativeFactory(word, confidence));
        }

        function parseBin(element /*, index, array*/ ) {
            var start_time = element['start_time'];
            var end_time = element['end_time'];
            var alternatives = element['alternatives'];
            var bin = new BinFactory(start_time, end_time);
            scene.addBin(bin);
            alternatives.forEach(parseAlternative);
        }

        function showResults(msg, baseString, model) {
            if (msg.results && msg.results.length > 0) {
                //var alternatives = msg.results[0].alternatives;
                var text = msg.results[0].alternatives[0].transcript || '';

                // apply mappings to beautify
                text = text.replace(/%HESITATION\s/g, '');
                //text = text.replace(/([^*])\1{2,}/g, '');   // seems to be getting in the way of smart formatting, 1000101 is converted to 1101

                if (msg.results[0].final) {
                    console.log('TEXT:', text);
                    worker.postMessage({
                        type: 'push',
                        msg: msg
                    });
                    pushed++;
                    console.log('PUSHED:', pushed);
                    if (runTimer == false) {
                        runTimer = true;
                        $timeout(onTimer, timeout);
                    }
                }
                text = text.replace(/D_[^\s]+/g, '');

                // if all words are mapped to nothing then there is nothing else to do
                if ((text.length == 0) || (/^\s+$/.test(text))) {
                    return baseString;
                }

                var japanese = ((model.substring(0, 5) == 'ja-JP') || (model.substring(0, 5) == 'zh-CN'));
                var result;
                // capitalize first word
                // if final results, append a new paragraph
                if (msg.results && msg.results[0] && msg.results[0].final) {
                    text = text.slice(0, -1);
                    text = text.charAt(0).toUpperCase() + text.substring(1);
                    if (japanese) {
                        text = text.trim() + '。';
                        text = text.replace(/ /g, '');
                    } else {
                        text = text.trim() + '. ';
                    }

                    baseString += text;
                    result = baseString;
                } else {
                    if (japanese) {
                        text = text.replace(/ /g, ''); // remove whitespaces
                    } else {
                        text = text.charAt(0).toUpperCase() + text.substring(1);
                    }
                    result = baseString + text;
                }

                $('#resultsText').val(result);
                localStorage.setItem('result', result);
            }
            updateTextScroll();
            return baseString;
        }

        function updateTextScroll() {
            if (!scrolled) {
                var element = $('#resultsText').get(0);
                element.scrollTop = element.scrollHeight;
            }
        }

        function onHScroll() {
            scene._offset_X = INITIAL_OFFSET_X - hslider.value;
            draw();
        }

        function onVScroll() {
            scene._offset_Y = INITIAL_OFFSET_Y + Number(vslider.value);
            draw();
        }

        function onResize() {
            var dpr = window.devicePixelRatio || 1;
            var bsr = canvas.webkitBackingStorePixelRatio ||
                canvas.mozBackingStorePixelRatio ||
                canvas.msBackingStorePixelRatio ||
                canvas.oBackingStorePixelRatio ||
                canvas.backingStorePixelRatio || 1;
            var ratio = dpr / bsr;
            var w = $('#canvas').width();
            var h = $('#canvas').height();
            canvas.width = w * ratio;
            canvas.height = h * ratio;
            canvas.setTransform(ratio, 0, 0, ratio, 0, 0);
            draw();
        }

        function onTimer() {
            worker.postMessage({
                type: 'shift'
            });
            if (runTimer == true) {
                setTimeout(onTimer, timeout);
            }
        }

        function draw() {
            canvas.clearRect(0, 0, 970, 370);
            scene.draw(scene._offset_X, scene._offset_Y);
        }

        function clearScene() {
            scene._bins = [];
            scene._width = 0;
            scene._height = 0;
            scene._offset_X = INITIAL_OFFSET_X;
            scene._offset_Y = INITIAL_OFFSET_Y;
            hslider.max = 0;
            hslider.value = hslider.max;
            vslider.max = 0;
            vslider.min = 0;
            vslider.value = vslider.max;
            $('#hslider').css('display', 'none');
            $('#vslider').css('display', 'none');
            $('#canvas').css('display', 'none');
            $('#canvas-placeholder').css('display', 'block');

            canvas.clearRect(0, 0, canvas.width, canvas.height);
        }

        function onTimer() {
            worker.postMessage({
                type: 'shift'
            });
            if (runTimer == true) {
                $timeout(onTimer, timeout);
            }
        }

        function resetWorker() {
            runTimer = false;
            worker.postMessage({
                type: 'clear'
            });
            pushed = 0;
            popped = 0;
        }

        $rootScope.on('clearscreen', function() {
            clearScene();
            resetWorker();
        });
    }
})();
