var Bin = (function(){
    'use strict';

    var fontSize = 16;
    var delta_y = 2 * fontSize;
    var showAllHypotheses = true;
    var space = 4;
    var ctx;

    var Bin = function(startTime, endTime, canvas) {
        ctx = canvas;
        this._connectorWidth = 40;
        this._startTime = startTime;
        this._endTime = endTime;
        this._wordAlternatives = [];
        this._maxWordAlternativeWidth = 0;
        this._height = 0;
        this._index = 0;
    };

    Bin.prototype.addWordAlternative = function(wa) {
        this._wordAlternatives.push(wa);
        for (var index = 0; index < this._wordAlternatives.length; index++) {
            var width = this._wordAlternatives[index].width();
            if (width > this._maxWordAlternativeWidth)
                this._maxWordAlternativeWidth = width;
        }
        this._height += wa.height();
    };

    Bin.prototype.height = function() {
        return this._height;
    };

    Bin.prototype.width = function() {
        return this._maxWordAlternativeWidth + 2 * this._connectorWidth;
    };

    Bin.prototype.draw = function(x, y) {
        for (var index = 0; index < this._wordAlternatives.length; index++) {
            var wa = this._wordAlternatives[index];
            wa.draw(x + this._connectorWidth, y + delta_y * (index + 1), this._maxWordAlternativeWidth);
            if (showAllHypotheses == false)
                break;
        }

        ctx.moveTo(x + space + radius, y + fontSize);
        if (this._wordAlternatives.length > 0) {
            ctx.strokeStyle = '#4178BE';
            ctx.lineWidth = 2;
            ctx.lineTo(x + this.width() - (space + radius), y + fontSize);
            ctx.stroke();
        }
    };

    return Bin;
})();