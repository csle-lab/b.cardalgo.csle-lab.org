import Card from './card.js';
import Config from './config.js';
import Grid from './grid.js';
import SortPractice from './sort_practice.js';
import Text from './text.js';
import CounterText from './counter_text.js';

export default class ArraySortPractice extends SortPractice {
    static maxLength = 5;

    constructor(canvas) {
        super(canvas);

        this.posX = [];
        this.posY = [];
        for (var i = 0; i < ArraySortPractice.maxLength; i++) {
            this.posX.push(280 + 180 * i);
            this.posY.push(420);
        }
    }

    build(array) {
        this.canvas.clearAll();
        for (var i = 0; i < ArraySortPractice.maxLength; i++) {
            var grid = new Grid(i);
            grid.setCoordinate(this.posX[i], this.posY[i]);
            this.canvas.addGrid(grid);
        }
        for (var i = 0; i < array.length; i++) {
            var card = new Card(array[i], 'gray', 'green');
            card.setCoordinate(626 + 4 * i, 120);
            card.moveImmediatelyTo(this.posX[i], this.posY[i] + 10);
            card.setSmallPinImage('shadow');
            this.canvas.addCard(card);
        }
        var compareText = new CounterText(`${Config.wordCompare}: <counter> ${Config.wordTime}`);
        compareText.setCoordinate(640, 640);
        this.canvas.addText(compareText);
        var swapText = new CounterText(`${Config.wordSwap}: <counter> ${Config.wordTime}`);
        swapText.setCoordinate(640, 680);
        this.canvas.addText(swapText);
        var smallText = new Text();
        smallText.setText(`${Config.wordSmall}`);
        smallText.setCoordinate(196, 580);
        smallText.setTextAlign('left');
        smallText.setFont('24px Noto Sans JP');
        this.canvas.addText(smallText);
        var largeText = new Text();
        largeText.setText(`${Config.wordLarge}`);
        largeText.setCoordinate(1084, 580);
        largeText.setTextAlign('right');
        largeText.setFont('32px Noto Sans JP');
        this.canvas.addText(largeText);
    }
}