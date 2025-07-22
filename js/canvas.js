import Card from './card.js';
import Grid from './grid.js';
import Line from './line.js';
import Text from './text.js';
import Cross from './cross.js';
import Circle from './circle.js';

export default class Canvas {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
        this.cards = [];
        this.grids = [];
        this.lines = [];
        this.texts = [];
        this.crosses = [];
        this.width = 1280;
        this.height = 720;
        this.mouseX = 0;
        this.mouseY = 0;
        this.dataURL = '';
        this.changeListener = [];

        this.cardBackImageBlue = new Image();
        this.cardBackImageBlue.src = './image/card_back_blue.png';
        this.cardBackImageRed = new Image();
        this.cardBackImageRed.src = './image/card_back_red.png';
        this.cardBackImageGreen = new Image();
        this.cardBackImageGreen.src = './image/card_back_green.png';
        this.cardBackImageGray = new Image();
        this.cardBackImageGray.src = './image/card_back_gray.png';
        this.pinImageGreen = new Image();
        this.pinImageGreen.src = './image/pin_green.png';
        this.pinImageRed = new Image();
        this.pinImageRed.src = './image/pin_red.png';
        this.pinImageShadow = new Image();
        this.pinImageShadow.src = './image/pin_shadow.png';

        setInterval(this.draw.bind(this), 20); // 50 fps
        setInterval(this.watch.bind(this), 1020);
    }

    clearAll() {
        this.cards = [];
        this.grids = [];
        this.lines = [];
        this.texts = [];
        this.crosses = [];
    }

    addCard(card) {
        this.cards.push(card);
    }

    addGrid(grid) {
        this.grids.push(grid);
    }

    addLine(line) {
        this.lines.push(line);
    }

    addText(text) {
        this.texts.push(text);
    }

    addCross(x, y) {
        var cross = new Cross(x, y);
        this.crosses.push(cross);

        var self = this;
        const maxT = 20;
        for (var t = 0; t <= maxT; t++) {
            setTimeout(function (cross, t, maxT) {
                cross.setAlpha(1 - t * (1 / maxT));
                if (t == maxT) {
                    self.removeCross(cross);
                    return;
                }
            }, 20 * t, cross, t, maxT);
        }

        return cross;
    }

    addCircle(x, y) {
        var circle = new Circle(x, y);
        this.crosses.push(circle);

        var self = this;
        const maxT = 20;
        for (var t = 0; t <= maxT; t++) {
            setTimeout(function (circle, t, maxT) {
                circle.setAlpha(1 - t * (1 / maxT));
                if (t == maxT) {
                    self.removeCross(circle);
                    return;
                }
            }, 20 * t, circle, t, maxT);
        }

        return circle;
    }

    removeCross(cross) {
        this.crosses = this.crosses.filter(el => el != cross);
    }

    getCard(i) {
        return this.cards[i];
    }

    getGrid(i) {
        return this.grids[i];
    }

    getLine(i) {
        return this.lines[i];
    }

    getText(i) {
        return this.texts[i];
    }

    getCards() {
        return this.cards;
    }

    getLines() {
        return this.lines;
    }

    findCardPointed(x, y) {
        for (var c of this.cards) {
            if (c.pointerOn(x, y)) return c;
        }
        return null;
    }

    getCardBackImage(imageName) {
        switch (imageName) {
            case 'blue':
                return this.cardBackImageBlue;
            case 'red':
                return this.cardBackImageRed;
            case 'green':
                return this.cardBackImageGreen;
            default:
                return this.cardBackImageGray;
        }
    }

    getPinImage(imageName) {
        switch (imageName) {
            case 'green':
                return this.pinImageGreen;
            case 'red':
                return this.pinImageRed;
            default:
                return this.pinImageShadow;
        }
    }

    setMouseCoordinate(x, y) {
        this.mouseX = x;
        this.mouseY = y;
    }

    allTransparent() {
        // fix me
        if (document.getElementById('checkbox_make_all_transparent') === null) return false;
        return document.getElementById('checkbox_make_all_transparent').checked;
    }

    fillCanvas() {
        this.context.save();

        this.context.fillStyle = 'rgba(240, 240, 240, 1)';
        this.context.fillRect(0, 0, this.width, this.height);

        this.context.restore();
    }

    draw() {
        this.fillCanvas();
        for (var g of this.grids) {
            g.draw(this.context);
        }
        for (var l of this.lines) {
            l.draw(this.context);
        }
        for (var c of this.cards) {
            c.draw(this.context, this);
        }
        for (var c of this.cards) {
            if (c.moving) c.draw(this.context, this);
        }
        for (var t of this.texts) {
            t.draw(this.context);
        }
        for (var c of this.crosses) {
            c.draw(this.context);
        }
    }

    importJSON(json) {
        var dict = JSON.parse(JSON.stringify(json));
        this.clearAll();
        for (var obj of dict['cards']) {
            this.cards.push(Object.assign(new Card, obj));
        }
        for (var obj of dict['grids']) {
            this.grids.push(Object.assign(new Grid, obj));
        }
        for (var obj of dict['lines']) {
            this.lines.push(Object.assign(new Line, obj));
        }
        for (var obj of dict['texts']) {
            this.texts.push(Object.assign(new Text, obj));
        }
        for (var obj of dict['crosses']) {
            if (obj.length) this.crosses.push(Object.assign(new Cross, obj));
            if (obj.r) this.crosses.push(Object.assign(new Circle, obj));
        }

        if (dict['allTransparent']) {
            for (var c of this.cards) c.transparent = true;
        }
    }

    exportJSON() {
        return JSON.stringify({
            cards: this.cards,
            grids: this.grids,
            lines: this.lines,
            texts: this.texts,
            crosses: this.crosses,
            allTransparent: this.allTransparent()
        });
    }

    addChangeListener(f) {
        this.changeListener.push(f);
    }

    watch() {
        /*var tmp = this.canvas.toDataURL();
        if (tmp != this.dataURL) {
            for (var f of this.changeListener) {
                f(this);
            }
        }
        this.dataURL = tmp;*/

        var tmp = this.exportJSON();
        if (tmp != this.dataURL) {
            console.log(tmp);
            for (var f of this.changeListener) {
                f(this);
            }
        }
        this.dataURL = tmp;
    }
}