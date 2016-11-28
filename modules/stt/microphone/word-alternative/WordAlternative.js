var WordAlternative = function() {
    'use strict';

    const FONT_SIZE = 16;
    const DEFAULT_FONT = FONT_SIZE + 'px Arial';
    const BOLD_FONT = 'bold' + FONT_SIZE + 'px Arial';
    const ITALIC_FONT = 'italic' + FONT_SIZE + 'px Arial';

    var element = document.getElementById('canvas'),
        canvas = element.getContext('2d');

    var WordAlternative = function(text, confidence) {
        if (text == '<eps>') {
            this._text = '<silence>';
            this._foreColor = '#888';
        } else if (text == '%HESITATION') {
            this._text = '<hesitation>';
            this._foreColor = '#888';
        } else {
            this._foreColor = '#000';
            this._text = text;
        }
        this._confidence = confidence;
        this._height = 2 * FONT_SIZE;
        canvas.font = DEFAULT_FONT;
        this._width = canvas.measureText(this._text + ((this._confidence.toFixed(3) * 100).toFixed(1)) + '%').width + 60;

        //FILL COLOR
        this._fillStyle = '#fff';
        this._selectedFillStyle = '#e3e3e3';
        this._selected = false;
    };

    WordAlternative.prototype.width = function() {
        return this._width;
    };

    WordAlternative.prototype.height = function() {
        return this._height;
    };

    WordAlternative.prototype.width = function() {
        return this._width;
    };

    WordAlternative.prototype.select = function() {
        this._selected = true;
    };

    WordAlternative.prototype.unselect = function() {
        this._selected = false;
    };

    WordAlternative.prototype.draw = function(offsetX, offsetY, width) {
        canvas.fillStyle = this._selected ? this._selectedFillStyle : this._fillStyle;
        canvas.lineWidth = 1;
        canvas.strokeStyle = '#26a69a';
        canvas.fillRect(offsetX, offsetY, width, this.height());
        canvas.strokeRect(offsetX, offsetY, width, this.height());

        canvas.fillStyle = this._foreColor;
        canvas.font = this._selected ? BOLD_FONT : DEFAULT_FONT;
        canvas.fillText(this._text, offsetX + 16, offsetY + 20);
        canvas.font = ITALIC_FONT;

        const appendix = (this._confidence.toFixed(3) * 100).toFixed(1) + '%';
        const rightOffset = canvas.measureText(appendix).width + 32;
        
        canvas.fillText(appendix, offsetX + 16 + width - rightOffset, offsetY + 20);
        canvas.font = DEFAULT_FONT;
    };

    return WordAlternative;
};
