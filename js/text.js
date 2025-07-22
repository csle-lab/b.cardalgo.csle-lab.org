export default class Text {
    constructor() {
        this.text = '';
        this.textAlign = 'center';
        this.x = 9999;
        this.y = 9999;
        this.font = '32px Noto Sans JP';
    }

    draw(context) {
        context.save();

        context.font = this.font;
        context.textAlign = this.textAlign;
        context.textBaseline = 'alphabetic';
        context.lineWidth = '6';
        context.strokeStyle = 'rgb(255, 255, 255)';
        context.strokeText(this.text, this.x, this.y);
        this.measure = context.measureText(this.text);
        context.fillStyle = 'rgb(20, 20, 20)';
        context.fillText(this.text, this.x, this.y);

        context.restore();
    }

    setCoordinate(x, y) {
        this.x = x;
        this.y = y;
    }

    setText(text) {
        this.text = text;
    }

    setTextAlign(str) {
        this.textAlign = str;
    }

    setFont(font) {
        this.font = font;
    }

    mesureText() {
        return this.measure;
    }
}
