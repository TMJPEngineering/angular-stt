var Scene = function() {
    'use strict';

    const INITIAL_OFFSET_X = 30;
    const INITIAL_OFFSET_Y = 30;
    const FONT_SIZE = 16;
    const RADIUS = 5;
    const SPACE = 4;
    const LINE_WIDTH = 2;

    var element = document.getElementById('canvas'),
        vslider = document.getElementById('vslider'),
        canvas = element.getContext('2d');

    var Scene = function() {
        this._bins = [];
        this._offsetX = INITIAL_OFFSET_X;
        this._offsetY = INITIAL_OFFSET_Y;
        this._width = 0;
        this._height = 0;
        this._shift = 100;
    };

    Scene.prototype.draw = function(offsetX, offsetY) {
        var offsetX = offsetX;
        var offsetY = offsetY;
        var lastBinEndTime = 0;

        for (var counter = 0; counter < this._bins.length; counter++) {
            var bin = this._bins[counter];
            var xVisible = Math.abs(offsetX) <= element.width;
            canvas.beginPath();

            if (bin._startTime > lastBinEndTime) {
                if (xVisible) {
                    canvas.moveTo(offsetX + RADIUS + SPACE, offsetY + FONT_SIZE);
                }
                if (lastBinEndTime > 0) {
                    offsetX += this._shift;
                    if (xVisible) {
                        canvas.strokeStyle = '#4178BE';
                        canvas.lineWidth = LINE_WIDTH;
                        canvas.lineTo(offsetX - (RADIUS + SPACE), offsetY + FONT_SIZE);
                        canvas.stroke();
                    }
                }
                if (xVisible) {
                    canvas.moveTo(offsetX + RADIUS, offsetY + FONT_SIZE);
                    canvas.lineWidth = LINE_WIDTH;
                    canvas.arc(offsetX, offsetY + FONT_SIZE, RADIUS, 0, 2 * Math.PI, false);
                    var startTimeCaption = bin._startTime + ' s';
                    var startTimeShift = canvas.measureText(startTimeCaption).width / 2;
                    canvas.fillText(startTimeCaption, offsetX - startTimeShift, offsetY);
                    canvas.stroke();
                }
            }

            if (xVisible) {
                bin.draw(offsetX, offsetY);
                canvas.moveTo(offsetX + bin.width() + RADIUS, offsetY + FONT_SIZE);
                canvas.strokeStyle = '#ee6e73';
                canvas.lineWidth = LINE_WIDTH;
                canvas.arc(offsetX + bin.width(), offsetY + FONT_SIZE, RADIUS, 0, 2 * Math.PI, false);
                canvas.stroke();
                var endTimeCaption = bin._endTime + ' s';
                var endTimeShift = canvas.measureText(endTimeCaption).width / 2;
                canvas.fillText(endTimeCaption, offsetX + bin.width() - endTimeShift, offsetY);
                canvas.stroke();
            }

            lastBinEndTime = bin._endTime;
            offsetX += bin.width();
            canvas.closePath();
        }
    };

    Scene.prototype.addBin = function(bin) {
        bin._index = this._bins.length;
        this._bins.push(bin);
        var width = 2 * INITIAL_OFFSET_X;
        var lastBinEndTime = 0;
        for (var index = 0; index < this._bins.length; index++) {
            var bin = this._bins[index];
            if (bin._startTime > lastBinEndTime && lastBinEndTime > 0) {
                width += this._shift;
            }
            lastBinEndTime = bin._endTime;
            width += bin.width();
            if (this._height < bin.height()) {
                this._height = bin.height();
                vslider.min = element.height - this._height - 2.5 * INITIAL_OFFSET_Y;
            }
        }
        this._width = width;
    };

    Scene.prototype.width = function() {
        return this._width + 2 * this._shift;
    };

    Scene.prototype.height = function() {
        return this._height;
    };

    Scene.prototype.findBins = function(start_time, end_time) {
        var foundBins = [];
        for (var index = 0; index < this._bins.length; index++) {
            var bin = this._bins[index];
            var binStartTime = bin._startTime;
            var binEndTime = bin._endTime;
            if (binStartTime >= start_time && binEndTime <= end_time) {
                foundBins.push(bin);
            }
        }
        return foundBins;
    };

    Scene.prototype.startTimeToSliderValue = function(start_time) {
        var lastBinEndTime = 0;
        var value = 0;
        for (var binIndex = 0; binIndex < this._bins.length; binIndex++) {
            var bin = this._bins[binIndex];
            if (bin._startTime < start_time) {
                value += bin.width();
                if (bin._startTime > lastBinEndTime && lastBinEndTime > 0) {
                    value += scene._shift;
                }
                lastBinEndTime = bin._endTime;
            }
        }
        return value;
    };

    return Scene;

};
