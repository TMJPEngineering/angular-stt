(function() {
    'use strict'

    angular
        .module('microphone')
        .factory('displaymetaFactory', displaymetaFactory);
    displaymetaFactory.$inject = ['SceneFactory'];

    function displaymetaFactory(SceneFactory) {
        var factory = {
            showResults: showResults,
            initDisplayMetadata: initDisplayMetadata
        };

        const INITIAL_OFFSET_X = 30;
        const INITIAL_OFFSET_Y = 30;
        const fontSize = 16;
        const delta_y = 2 * fontSize;
        const radius = 5;
        const space = 4;
        const hstep = 32;
        const timeout = 500;
        const defaultFont = fontSize + 'px Arial';
        const boldFont = 'bold ' + fontSize + 'px Arial';
        const italicFont = 'italic ' + fontSize + 'px Arial';
        const opacity = '0.6';

        var showAllHypotheses = true;
        var keywordsInputDirty = false;
        var keywords_to_search = [];
        var detected_keywords = {};
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');
        var hslider = document.getElementById('hslider');
        var vslider = document.getElementById('vslider');
        var leftArrowEnabled = false;
        var rightArrowEnabled = false;
        window.worker = null;
        var runTimer = false;
        var scrolled = false;
        // var textScrolled = false;
        var pushed = 0;
        var popped = 0;
        var scene = new SceneFactory;

        return factory;

        function initDisplayMetadata() {
            console.log('intiDisplayMetadata() called');
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
            $('#left-arrow').css('display', 'none');
            $('#right-arrow').css('display', 'none');

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
            console.log("BLOB URL", blobURL);
            worker = new Worker(blobURL);
            worker.onmessage = function(event) {
                var data = event.data;
                // eslint-disable-next-line no-use-before-define
                // showCNsKWS(data.bins, data.kws);
                popped++;
                console.log('----> popped', popped);
            };
            console.log('worker instantiate');
        }

        function showResults(msg, baseString, model) {
            if (msg.results && msg.results.length > 0) {
                //var alternatives = msg.results[0].alternatives;
                var text = msg.results[0].alternatives[0].transcript || '';

                // apply mappings to beautify
                text = text.replace(/%HESITATION\s/g, '');
                //text = text.replace(/([^*])\1{2,}/g, '');   // seems to be getting in the way of smart formatting, 1000101 is converted to 1101

                if (msg.results[0].final) {
                    console.log('-> ' + text);
                    worker.postMessage({
                        type: 'push',
                        msg: msg
                    });
                    pushed++;
                    console.log('----> pushed', pushed);
                    if (runTimer == false) {
                        runTimer = true;
                        setTimeout(onTimer, timeout);
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
            if (hslider.value == 0) {
                leftArrowEnabled = false;
                rightArrowEnabled = true;
                $('#left-arrow').attr('src', 'images/arrow-left-icon-disabled.svg');
                $('#left-arrow').css('background-color', 'transparent');
                $('#right-arrow').attr('src', 'images/arrow-right-icon.svg');
                $('#right-arrow').css('background-color', '#C7C7C7');
            } else if (hslider.value == Math.floor(hslider.max)) {
                leftArrowEnabled = true;
                rightArrowEnabled = false;
                $('#left-arrow').attr('src', 'images/arrow-left-icon.svg');
                $('#left-arrow').css('background-color', '#C7C7C7');
                $('#right-arrow').attr('src', 'images/arrow-right-icon-disabled.svg');
                $('#right-arrow').css('background-color', 'transparent');
            } else {
                leftArrowEnabled = true;
                rightArrowEnabled = true;
                $('#left-arrow').attr('src', 'images/arrow-left-icon.svg');
                $('#left-arrow').css('background-color', '#C7C7C7');
                $('#right-arrow').attr('src', 'images/arrow-right-icon.svg');
                $('#right-arrow').css('background-color', '#C7C7C7');
            }
            scene._offset_X = INITIAL_OFFSET_X - hslider.value;
            draw();
        }

        function onVScroll() {
            scene._offset_Y = INITIAL_OFFSET_Y + Number(vslider.value);
            draw();
        }

        function onResize() {
            var dpr = window.devicePixelRatio || 1;
            var bsr = ctx.webkitBackingStorePixelRatio ||
                ctx.mozBackingStorePixelRatio ||
                ctx.msBackingStorePixelRatio ||
                ctx.oBackingStorePixelRatio ||
                ctx.backingStorePixelRatio || 1;
            var ratio = dpr / bsr;
            console.log('dpr/bsr =', ratio);
            var w = $('#canvas').width();
            var h = $('#canvas').height();
            canvas.width = w * ratio;
            canvas.height = h * ratio;
            ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
            draw();
        }

        function draw() {
            ctx.clearRect(0, 0, 970, 370);
            scene.draw();
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
            $('#show_alternate_words').css('display', 'none');
            $('#canvas').css('display', 'none');
            $('#canvas-placeholder').css('display', 'block');
            $('#left-arrow').css('display', 'none');
            $('#right-arrow').css('display', 'none');

            showAllHypotheses = true;
            $('#show_alternate_words').text('Hide alternate words');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        function resetWorker() {
            runTimer = false;
            worker.postMessage({
                type: 'clear'
            });
            pushed = 0;
            popped = 0;
            console.log('---> resetWorker called');
        }

        $rootScope.on('clearscreen', function() {
            clearScene();
            resetWorker();
        });
    }
})();
