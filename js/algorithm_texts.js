import Text from './text.js';

const marginX = 192;

export default class AlgorithmTexts {

    constructor(canvas, texts) {
        this.texts = texts;
        this.textObjects = [];
        this.cursor = -1;
        this.bold = -1;
        var pos = 48;
        for (var text of this.texts.split('\n')) {
            var obj = new Text();
            obj.setCoordinate(marginX, pos);
            obj.setTextAlign('left');
            obj.setFont('24px Noto Sans JP');
            obj.setText('hoge');
            canvas.addText(obj);
            this.textObjects.push(obj);
            pos += 32;
        }
        this.cursorText = new Text();
        this.cursorText.setCoordinate(9999, 9999);
        this.cursorText.setTextAlign('left');
        this.cursorText.setFont('bold 32px Noto Sans JP');
        this.cursorText.setText('┛');
        canvas.addText(this.cursorText);
        this.update();

        setInterval(this.update.bind(this), 20);
    }

    update() {
        for (var i = 0; i < this.textObjects.length; i++) {
            var text = this.texts.split('\n')[i];
            var obj = this.textObjects[i];
            obj.setText(text);
            if (this.cursor == i) {
                this.cursorText.setCoordinate(marginX + obj.mesureText().width + 24, 48 + 32 * i + 12);
                this.cursorText.setFont('32px Noto Sans JP');
            }
            if (this.bold == i) obj.setFont('bold 24px Noto Sans JP');
            else obj.setFont('24px Noto Sans JP');
            var timing =  Math.floor(Date.now() / 50) % 20;
            if (this.guide == i && timing < 10) obj.setFont('bold 24px Noto Sans JP');
        }
        if (this.cursor == -1) {
            this.cursorText.setCoordinate(9999, 9999);
        }
    }

    setCursor(x) {
        this.cursor = -1;
        this.bold = x;
        var self = this;
        setTimeout(function () {
            self.bold = -1;
            self.cursor = x;
            self.update();
        }, 200);
        this.update();
    }

    backCursor(x) {
        this.bold = this.cursor;
        this.cursor = -1;
        var self = this;
        setTimeout(function () {
            self.bold = -1;
            self.cursor = x;
            self.update();
        }, 200);
        this.update();
    }

    setGuide(x) {
        this.guide = x;
    }
}
