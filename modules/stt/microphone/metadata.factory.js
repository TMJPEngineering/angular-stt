(function(){
    'use strict';

    angular
        .module('microphone')
        .factory('metadata', metadata);
    metadata.$inject = [];

    function metadata() {
        var factory = {
            INITIAL_OFFSET_X:30,
            INITIAL_OFFSET_Y:30,
            fontSize:16,
            delta_y:2 * fontSize,
            radius:5,
            space:4,
            hstep:32,
            timeout:500,
            defaultFont:fontSize + 'px Arial',
            boldFont:'bold ' + fontSize + 'px Arial',
            italicFont:'italic ' + fontSize + 'px Arial',
            opacity:'0.6',

            showAllHypotheses:true,
            keywordsInputDirty:false,
            keywords_to_search:[],
            detected_keywords:{},
            canvas:document.getElementById('canvas'),
            ctx:canvas.getContext('2d'),
            hslider:document.getElementById('hslider'),
            vslider:document.getElementById('vslider'),
            leftArrowEnabled:false,
            rightArrowEnabled:false,
            worker:null,
            runTimer:false,
            scrolled:false,
            // var textScrolled = false;
            pushed:0,
            poppep: 0

            // ctx.font: defaultFont;
        }
        return factory;
    }
})();