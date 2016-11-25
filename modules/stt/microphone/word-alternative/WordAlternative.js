'use strict';

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
    this._height = 2 * fontSize;
    ctx.font = defaultFont;
    this._width = ctx.measureText(this._text + ((this._confidence.toFixed(3) * 100).toFixed(1)) + '%').width + 60;
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

WordAlternative.prototype.draw = function(x, y, width) {
    ctx.fillStyle = this._selected ? this._selectedFillStyle : this._fillStyle;
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#26a69a';
    ctx.fillRect(x, y, width, this.height());
    ctx.strokeRect(x, y, width, this.height());

    ctx.fillStyle = this._foreColor;
    ctx.font = this._selected ? boldFont : defaultFont;
    ctx.fillText(this._text, x + 16, y + 20);
    ctx.font = italicFont;
    const appendix = (this._confidence.toFixed(3) * 100).toFixed(1) + '%';
    const rightOffset = ctx.measureText(appendix).width + 32;
    ctx.fillText(appendix, x + 16 + width - rightOffset, y + 20);
    ctx.font = defaultFont;
};