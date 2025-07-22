import Config from './config.js';
import SortPractice from './sort_practice.js';
import Utility from './utility.js';
import Network from './network.js';

export default class SortPracticeStrict extends SortPractice {
    constructor(canvas) {
        super(canvas);

        this.correctOperations = [];
        this.step = 0;
        this.lastMeaningfulOperationTime = Date.now() + 500;
        setInterval(this.manageGuide.bind(this), 50);

        var self = this;
        setInterval(function () {
            Network.uploadSimpleLog(self.step, self.correctOperations.length, '');
        }, 4800);
        setTimeout(function () {
            document.getElementById('timeout').style.display = 'block';
        }, 1000 * 60 * 30);

        this.algorithmText = null;
    }

    set(array) {
        super.set(array);

        this.correctOperations = this.calculateActions(array);
        this.step = 0;
    }

    turnCard(card) {
        Network.uploadOperationLog('turn', `turn ${card.value}`, 'practice');

        card.turn();
        this.operationLog.push(['turnCard', card]);

        if (this.countOpen() == 2) {
            this.canvas.getText(0).countUp();
            this.operationLog.push(['comparePlus']);
        }

        if (this.step < this.correctOperations.length
            && this.correctOperations[this.step][0] == 'turn'
            && this.correctOperations[this.step][1] == this.getIndexOfCard(card)) {
            this.step++;
            this.operationLog.push(['stepForward']);
            this.detectCorrectOperation();
        }
        else {
            this.detectWrongOperation(`turn ${card.value}`);
        }
    }

    swapCards(card, anotherCard) {
        Network.uploadOperationLog('swap', `swap ${card.value} ${anotherCard.value}`, 'practice');

        var tmpX = card.getX(), tmpY = card.getY();
        card.moveImmediatelyTo(anotherCard.getX(), anotherCard.getY());
        anotherCard.moveImmediatelyTo(tmpX, tmpY);

        this.canvas.getText(1).countUp();

        this.operationLog.push(['swapCards', card, anotherCard]);

        if (this.step < this.correctOperations.length
            && this.correctOperations[this.step][0] == 'swap'
            && Utility.compareSets(this.correctOperations[this.step][1], new Set([this.getIndexOfCard(card), this.getIndexOfCard(anotherCard)]))) {
            this.step++;
            this.operationLog.push(['stepForward']);
            this.detectCorrectOperation();
        }
        else {
            this.detectWrongOperation(`swap ${card.value} ${anotherCard.value}`);
        }
    }

    fixCard(card) {
        Network.uploadOperationLog('fix', `fix ${card.value}`, 'practice');

        card.fix();
        this.operationLog.push(['fixCard', card]);

        if (this.step < this.correctOperations.length
            && this.correctOperations[this.step][0] == 'fix'
            && this.correctOperations[this.step][1] == this.getIndexOfCard(card)) {
            this.step++;
            this.operationLog.push(['stepForward']);
            this.detectCorrectOperation();
        }
        else {
            this.detectWrongOperation(`fix ${card.value}`);
        }
    }

    unfixCard(card) {
        Network.uploadOperationLog('unfix', `unfix ${card.value}`, 'practice');

        card.unfix();
        this.operationLog.push(['unfixCard', card]);
        this.detectWrongOperation(`unfix ${card.value}`);
    }

    detectCorrectOperation() {
        Network.uploadOperationLog('success', `success`, 'practice');

        this.lastMeaningfulOperationTime = Date.now();

        Network.uploadSimpleLog(this.step, this.correctOperations.length, '');

        this.algorithmText.setCursor(this.correctOperations[this.step - 1][2]);

        setTimeout(function () {
            this.canvas.addCircle(640, 360).setSize(40, 150);
        }.bind(this), 200);

        if (this.step == this.correctOperations.length) {
            confetti({
                particleCount: 500,
                spread: 135,
                ticks: 100,
                origin: { y: 0.6 },
            });
        }
    }

    detectWrongOperation(message) {
        Network.uploadOperationLog('failure', `failure`, 'practice');

        Network.uploadSimpleLog(this.step, this.correctOperations.length, message);

        setTimeout(function () {
            this.back();
            let tmp = this.canvas.addCross(640, 360);
            tmp.setSize(40, 400);
            if (this.step < this.correctOperations.length
                && this.correctOperations[this.step][0] == 'fix')
                tmp.addMessage('ピン留めを忘れずに');
        }.bind(this), 200);
    }

    back() {
        if (this.operationLog.length == 0) return;
        var operation = this.operationLog.pop();
        if (operation[0] == 'stepForward') {
            this.step--;
            if (this.step - 1 >= 0) {
                this.algorithmText.backCursor(this.correctOperations[this.step - 1][2]);
            }
            else {
                this.algorithmText.backCursor(-1);
            }
            this.back();
            Network.uploadSimpleLog(this.step, this.correctOperations.length, '');
        }
        if (operation[0] == 'comparePlus') {
            this.canvas.getText(0).countDown();
            this.back();
        }
        if (operation[0] == 'turnCard') {
            this.backTurnCard(operation[1]);
        }
        if (operation[0] == 'swapCards') {
            this.backSwapCards(operation[1], operation[2]);
        }
        if (operation[0] == 'fixCard') {
            this.backFixCard(operation[1]);
        }
        if (operation[0] == 'unfixCard') {
            this.backUnfixCard(operation[1]);
        }
    }

    backTurnCard(card) {
        card.turn();
    }

    backSwapCards(card, anotherCard) {
        var tmpX = card.getX(), tmpY = card.getY();
        card.moveTo(anotherCard.getX(), anotherCard.getY());
        anotherCard.moveTo(tmpX, tmpY);

        this.canvas.getText(1).countDown();
    }

    backFixCard(card) {
        card.unfix();
    }

    backUnfixCard(card) {
        card.fix();
    }

    begin() {
        while (this.operationLog.length > 0) this.back();
    }

    build() {
        // オーバーライドすべき
    }

    calculateActions() {
        // 操作列を構成
    }

    manageGuide() {
        if (this.step < this.correctOperations.length
            && Date.now() > this.lastMeaningfulOperationTime + Config.guideDelay) {
            if (this.correctOperations[this.step][0] == 'compare') {
                for (var c of this.canvas.getCards()) {
                    if (this.correctOperations[this.step][1].has(this.getIndexOfCard(c))) {
                        c.setGuide('Tap');
                    }
                    else {
                        c.setGuide('');
                    }
                }
            }
            if (this.correctOperations[this.step][0] == 'swap') {
                var right = -1;
                for (var c of this.canvas.getCards()) {
                    if (this.correctOperations[this.step][1].has(this.getIndexOfCard(c))) {
                        c.setGuide('Tap');
                        right = Math.max(right, c.actualX);
                    }
                    else {
                        c.setGuide('');
                    }
                }
                for (var c of this.canvas.getCards()) {
                    if (this.correctOperations[this.step][1].has(this.getIndexOfCard(c))) {
                        if (c.actualX == right) {
                            c.setGuide('Right');
                        }
                        else {
                            c.setGuide('Left');
                        }
                    }
                    else {
                        c.setGuide('');
                    }
                }
            }
            if (this.correctOperations[this.step][0] == 'fix') {
                for (var c of this.canvas.getCards()) {
                    if (this.correctOperations[this.step][1] == this.getIndexOfCard(c)) {
                        c.setGuide('Pin');
                    }
                    else {
                        c.setGuide('');
                    }
                }
            }
            if (this.correctOperations[this.step][0] == 'turn') {
                for (var c of this.canvas.getCards()) {
                    if (this.correctOperations[this.step][1] == this.getIndexOfCard(c)) {
                        c.setGuide('Tap');
                    }
                    else {
                        c.setGuide('');
                    }
                }
            }
            this.algorithmText.setGuide(this.correctOperations[this.step][2]);
        }
        else {
            for (var c of this.canvas.getCards()) {
                c.setGuide('None');
            }
            this.algorithmText.setGuide(-1);
        }
    }
}
