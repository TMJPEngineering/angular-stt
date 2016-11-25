(function(){
    'use strict';

    angular
        .module('microphone')
        .factory('metadata', metadata);
    metadata.$inject = [];

    function metadata() {
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

        var factory = {

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