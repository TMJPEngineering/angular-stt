var Scene = (function () {
	'use strict';

	var INITIAL_OFFSET_X = 30,
        INITIAL_OFFSET_Y = 30,
        radius = 5,
        space = 4,
        fontSize = 16,
        delta_y = 2 * fontSize;;

	var Scene = function() {
	    this._bins = [];
	    this._offset_X = INITIAL_OFFSET_X;
	    this._offset_Y = INITIAL_OFFSET_Y;
	    this._width = 0;
	    this._height = 0;
	    this._shift = 100;
	};

	Scene.prototype.draw = function(ctx) {
	    var x = this._offset_X;
	    var y = this._offset_Y;
	    var last_bin_end_time = 0;

	    for (var index = 0; index < this._bins.length; index++) {
	        var bin = this._bins[index];
	        var x_visible = Math.abs(x) <= canvas.width;
	        ctx.beginPath();

	        if (bin._startTime > last_bin_end_time) {
	            if (x_visible) {
	                ctx.moveTo(x + radius + space, y + fontSize);
	            }
	            if (last_bin_end_time > 0) {
	                x += this._shift;
	                if (x_visible) {
	                    ctx.strokeStyle = '#4178BE';
	                    ctx.lineWidth = 2;
	                    ctx.lineTo(x - (radius + space), y + fontSize);
	                    ctx.stroke();
	                }
	            }
	            if (x_visible) {
	                ctx.moveTo(x + radius, y + fontSize);
	                ctx.lineWidth = 2;
	                ctx.arc(x, y + fontSize, radius, 0, 2 * Math.PI, false);
	                var start_time_caption = bin._startTime + ' s';
	                var start_time_shift = ctx.measureText(start_time_caption).width / 2;
	                ctx.fillText(start_time_caption, x - start_time_shift, y);
	                ctx.stroke();
	            }
	        }

	        if (x_visible) {
	            bin.draw(x, y);
	            ctx.moveTo(x + bin.width() + radius, y + fontSize);
	            //TIME RECORDER COLOR
	            ctx.strokeStyle = '#ee6e73';
	            ctx.lineWidth = 2;
	            ctx.arc(x + bin.width(), y + fontSize, radius, 0, 2 * Math.PI, false);
	            ctx.stroke();
	            var end_time_caption = bin._endTime + ' s';
	            var end_time_shift = ctx.measureText(end_time_caption).width / 2;
	            ctx.fillText(end_time_caption, x + bin.width() - end_time_shift, y);
	            ctx.stroke();
	        }

	        last_bin_end_time = bin._endTime;
	        x += bin.width();
	        ctx.closePath();
	    }
	};

	Scene.prototype.addBin = function(bin) {
	    bin._index = this._bins.length;
	    this._bins.push(bin);
	    var width = 2 * INITIAL_OFFSET_X;
	    var last_bin_end_time = 0;
	    for (var index = 0; index < this._bins.length; index++) {
	        // eslint-disable-next-line no-redeclare
	        var bin = this._bins[index];
	        if (bin._startTime > last_bin_end_time && last_bin_end_time > 0) {
	            width += this._shift;
	        }
	        last_bin_end_time = bin._endTime;
	        width += bin.width();
	        if (this._height < bin.height()) {
	            this._height = bin.height();
	            vslider.min = canvas.height - this._height - 2.5 * INITIAL_OFFSET_Y;
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
	    var last_bin_end_time = 0;
	    var value = 0;
	    for (var binIndex = 0; binIndex < this._bins.length; binIndex++) {
	        var bin = this._bins[binIndex];
	        if (bin._startTime < start_time) {
	            value += bin.width();
	            if (bin._startTime > last_bin_end_time && last_bin_end_time > 0) {
	                // eslint-disable-next-line no-use-before-define
	                value += scene._shift;
	            }
	            last_bin_end_time = bin._endTime;
	        }
	    }
	    return value;
	};

	return Scene;
})();
