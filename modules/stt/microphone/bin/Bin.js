var Bin = (function() {
    'use strict';

    const RADIUS = 5;
    const SPACE = 4;
    const LINE_WIDTH = 2;
    const FONT_SIZE = 16;
    const DELTA_Y = 2 * FONT_SIZE;

    var element = document.getElementById('canvas'),
        canvas = element.getContext('2d'),
        showAllHypotheses = true;

    var Bin = function(startTime, endTime) {
        this._connectorWidth = 40;
        this._startTime = startTime;
        this._endTime = endTime;
        this._wordAlternatives = [];
        this._maxWordAlternativeWidth = 0;
        this._height = 0;
        this._index = 0;
    };

    Bin.prototype.addWordAlternative = function(wordAlternative) {
        this._wordAlternatives.push(wordAlternative);
        for (var counter = 0; counter < this._wordAlternatives.length; counter++) {
            var width = this._wordAlternatives[counter].width();
            if (width > this._maxWordAlternativeWidth)
                this._maxWordAlternativeWidth = width;
        }
        this._height += wordAlternative.height();
    };

    Bin.prototype.height = function() {
        return this._height;
    };

    Bin.prototype.width = function() {
        return this._maxWordAlternativeWidth + 2 * this._connectorWidth;
    };

    Bin.prototype.draw = function(offsetX, offsetY) {
        for (var counter = 0; counter < this._wordAlternatives.length; counter++) {
            var wordAlternative = this._wordAlternatives[counter];
            wordAlternative.draw(offsetX + this._connectorWidth, offsetY + DELTA_Y * (counter + 1), this._maxWordAlternativeWidth);
            if (showAllHypotheses == false)
                break;
        }

        canvas.moveTo(offsetX + SPACE + RADIUS, offsetY + FONT_SIZE);
        if (this._wordAlternatives.length > 0) {
            canvas.strokeStyle = '#4178BE';
            canvas.lineWidth = LINE_WIDTH;
            canvas.lineTo(offsetX + this.width() - (SPACE + RADIUS), offsetY + FONT_SIZE);
            canvas.stroke();
        }
    };

    return Bin;
})();
