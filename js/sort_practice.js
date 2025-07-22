import Practice from './practice.js';
import Text from './text.js';
import Utility from './utility.js';
import Network from './network.js';

export default class SortPractice extends Practice {
    constructor(canvas) {
        super(canvas);

        this.pointers = {};
        this.operationLog = [];
    }

    set(array) {
        this.operationLog = [];
        this.build(array);
    }

    pointerDown(id, x, y) {
        var card = this.canvas.findCardPointed(x, y);
        if (card === null) return;
        if (card.fixed) {
            this.unfixCard(card);
            return;
        }
        this.pointers[id] = [x, y, card];
        card.setMoving();
        this.highlightCandidateCard(x, y, card);
    }

    pointerMove(id, x, y) {
        if (!(id in this.pointers)) return;
        var card = this.pointers[id][2];
        var initialPointerX = this.pointers[id][0];
        var initialPointerY = this.pointers[id][1];
        card.setVisualCoordinate(card.getX() + x - initialPointerX, card.getY() + y - initialPointerY);
        this.highlightCandidateCard(x, y, card);
    }

    pointerUp(id, x, y) {
        if (!(id in this.pointers)) return;
        var card = this.pointers[id][2];
        var initialPointerX = this.pointers[id][0];
        var initialPointerY = this.pointers[id][1];
        card.resetMoving();
        this.highlightCandidateCard(9999, 9999, card);
        if (Math.abs(initialPointerX - x) + Math.abs(initialPointerY - y) <= 4) {
            card.moveImmediatelyTo(card.getX(), card.getY());
            if (card.pointerOnSmallPin(x, y)) {
                this.fixCard(card);
            }
            else if (!(this.countOpen() == 2 && !card.open)) {
                this.turnCard(card);
            }
            else {
                this.showCross(card);
            }
        }
        else {
            if (this.getCandidateCards(x, y, card).length == 0) {
                card.moveImmediatelyTo(card.getX(), card.getY());
            }
            else {
                var anotherCard = this.getCandidateCards(x, y, card)[0];
                this.swapCards(card, anotherCard);
            }
        }
        delete this.pointers[id];
    }

    getCandidateCards(x, y, card) {
        var res = [];
        for (var c of this.canvas.getCards()) {
            if (c == card) continue;
            if (c.pointerOn(x, y)) res.push(c);
        }
        return res;
    }

    highlightCandidateCard(x, y, card) {
        for (var c of this.canvas.getCards()) {
            c.resetCandidateFrame();
        }
        for (var c of this.getCandidateCards(x, y, card)) {
            c.setCandidateFrame();
        }
    }

    turnCard(card) {
        Network.uploadOperationLog('turn', `turn ${card.value}`, 'practice');

        card.turn();
        this.operationLog.push(['turnCard', card]);

        if (this.countOpen() == 2) {
            if (this.lastMeaningfulOperation()[0] == 'compareCards'
                && Utility.compareSets(this.lastMeaningfulOperation()[1], this.getIndexOfCardsOpen())) return;
            this.canvas.getText(0).countUp();
            this.operationLog.push(['compareCards', this.getIndexOfCardsOpen()]);
        }
    }

    swapCards(card, anotherCard) {
        Network.uploadOperationLog('swap', `swap ${card.value} ${anotherCard.value}`, 'practice');

        var tmpX = card.getX(), tmpY = card.getY();
        card.moveImmediatelyTo(anotherCard.getX(), anotherCard.getY());
        anotherCard.moveImmediatelyTo(tmpX, tmpY);

        this.canvas.getText(1).countUp();

        this.operationLog.push(['swapCards', card, anotherCard]);
    }

    fixCard(card) {
        Network.uploadOperationLog('fix', `fix ${card.value}`, 'practice');

        card.fix();
        this.operationLog.push(['fixCard', card]);
    }

    unfixCard(card) {
        Network.uploadOperationLog('unfix', `unfix ${card.value}`, 'practice');

        card.unfix();
        this.operationLog.push(['unfixCard', card]);
    }

    showCross(card) {
        this.canvas.addCross(card.getX(), card.getY());
    }

    countOpen() {
        var res = 0;
        for (var c of this.canvas.getCards()) {
            if (c.isOpen()) res++;
        }
        return res;
    }

    getIndexOfCardsOpen() {
        var res = new Set();
        for (var i = 0; i < this.canvas.getCards().length; i++) {
            if (this.canvas.getCard(i).isOpen()) res.add(i);
        }
        return res;
    }

    getIndexOfCard(card) {
        for (var i = 0; i < this.canvas.getCards().length; i++) {
            if (this.canvas.getCard(i) == card) return i;
        }
        return -1;
    }

    lastMeaningfulOperation() {
        for (var i = this.operationLog.length - 1; i >= 0; i--) {
            var operation = this.operationLog[i];
            if (operation[0] == 'swapCards') {
                return operation;
            }
            if (operation[0] == 'fixCard') {
                return operation;
            }
            if (operation[0] == 'unfixCard') {
                return operation;
            }
            if (operation[0] == 'compareCards') {
                return operation;
            }
        }
        return [null];
    }

    back() {
        if (this.operationLog.length == 0) return;
        var operation = this.operationLog.pop();
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
        if (operation[0] == 'compareCards') {
            this.canvas.getText(0).countDown();
            this.back();
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

    addMessage(str) {
        var pos = 24;
        for (var s of str.split('\n')) {
            var tmp = new Text();
            tmp.setCoordinate(4, pos);
            tmp.setText(s);
            tmp.setTextAlign('left');
            tmp.setFont('16px Noto Sans JP');
            this.canvas.addText(tmp);
            pos += 24;
        }
    }

    build() {
        // 入力セット時のデータ管理
    }
}
