var Bin = (function() {
    'use strict';

    const LINE_WIDTH = 2;

    var element = document.getElementById('canvas'),
        canvas = element.getContext('2d');

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

    Bin.prototype.draw = function(x, y) {
        for (var counter = 0; counter < this._wordAlternatives.length; counter++) {
            var wordAlternative = this._wordAlternatives[counter];
            wordAlternative.draw(x + this._connectorWidth, y + delta_y * (counter + 1), this._maxWordAlternativeWidth);
            if (showAllHypotheses == false)
                break;
        }

        canvas.moveTo(x + space + radius, y + fontSize);
        if (this._wordAlternatives.length > 0) {
            canvas.strokeStyle = '#4178BE';
            canvas.lineWidth = LINE_WIDTH;
            canvas.lineTo(x + this.width() - (space + radius), y + fontSize);
            canvas.stroke();
        }
    };

    return Bin;
})();
