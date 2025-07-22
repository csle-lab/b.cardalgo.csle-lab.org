import Animation from './animation.js';
import Config from './config.js';
import Text from './text.js';
import Network from './network.js';

export default class SortAnimation extends Animation {
    constructor(canvas) {
        super(canvas);

        this.actions = [];
        this.step = 0;

        var self = this;
        setInterval(function () {
            Network.uploadSimpleLog(self.step, self.actions.length, '');
        }, 4800);
        setTimeout(function () {
            document.getElementById('timeout').style.display = 'block';
        }, 1000 * 60 * 30);
    }

    set(array) {
        this.build(array);
        this.actions = this.calculateActions(array);
        this.step = 0;
    }

    begin() {
        while (this.step > 0) this.back();
    }

    advance() {
        if (this.step == this.actions.length) {
            return 1;
        }
        for (var action of this.actions[this.step]) {
            if (action[0] == 'turnCard') {
                this.canvas.getCard(action[1]).turn();
            }
            if (action[0] == 'swapCards') {
                var c1 = this.canvas.getCard(action[1]);
                var x1 = c1.getX();
                var y1 = c1.getY();
                var c2 = this.canvas.getCard(action[2]);
                var x2 = c2.getX();
                var y2 = c2.getY();
                c1.moveTo(x2, y2);
                c2.moveTo(x1, y1);
            }
            if (action[0] == 'fixCard') {
                this.canvas.getCard(action[1]).fix();
            }
            if (action[0] == 'markCard') {
                this.canvas.getCard(action[1]).mark();
            }
            if (action[0] == 'unmarkCard') {
                this.canvas.getCard(action[1]).unmark();
            }
            if (action[0] == 'frameCard') {
                this.canvas.getCard(action[1]).toggleFrame();
            }
            if (action[0] == 'showLine') {
                if (action[1] >= 0) this.canvas.getLine(action[1]).show();
            }
            if (action[0] == 'clearLine') {
                if (action[1] >= 0) this.canvas.getLine(action[1]).clear();
            }
            if (action[0] == 'toggleLines') {
                for (var i of action[1]) {
                    this.canvas.getLine(i).toggle();
                }
            }
            if (action[0] == 'compare') {
                this.canvas.getText(0).countUp();
            }
            if (action[0] == 'swap') {
                this.canvas.getText(1).countUp();
            }
            if (action[0] == 'cursor') {
                var algorithmText = action[1];
                algorithmText.setCursor(action[2]);
            }
        }
        this.step++;
        Network.uploadSimpleLog(this.step, this.actions.length, '');

        if (this.step == this.actions.length) {
            confetti({
                particleCount: 500,
                spread: 135,
                ticks: 100,
                origin: { y: 0.6 },
            });
        }
        return 0;
    }

    back() {
        if (this.step == 0) {
            return 1;
        }
        this.step--;
        for (var action of this.actions[this.step]) {
            if (action[0] == 'turnCard') {
                this.canvas.getCard(action[1]).turn();
            }
            if (action[0] == 'swapCards') {
                var c1 = this.canvas.getCard(action[1]);
                var x1 = c1.getX();
                var y1 = c1.getY();
                var c2 = this.canvas.getCard(action[2]);
                var x2 = c2.getX();
                var y2 = c2.getY();
                c1.moveTo(x2, y2);
                c2.moveTo(x1, y1);
            }
            if (action[0] == 'fixCard') {
                this.canvas.getCard(action[1]).unfix();
            }
            if (action[0] == 'markCard') {
                this.canvas.getCard(action[1]).unmark();
            }
            if (action[0] == 'unmarkCard') {
                this.canvas.getCard(action[1]).mark();
            }
            if (action[0] == 'frameCard') {
                this.canvas.getCard(action[1]).toggleFrame();
            }
            if (action[0] == 'showLine') {
                if (action[1] >= 0) this.canvas.getLine(action[1]).clear();
            }
            if (action[0] == 'clearLine') {
                if (action[1] >= 0) this.canvas.getLine(action[1]).show();
            }
            if (action[0] == 'toggleLines') {
                for (var i of action[1]) {
                    this.canvas.getLine(i).toggle();
                }
            }
            if (action[0] == 'compare') {
                this.canvas.getText(0).countDown();
            }
            if (action[0] == 'swap') {
                this.canvas.getText(1).countDown();
            }
        }
        if (this.step - 1 >= 0) {
            for (var action of this.actions[this.step - 1]) {
                if (action[0] == 'cursor') {
                    var algorithmText = action[1];
                    algorithmText.backCursor(action[2]);
                }
            }
        }
        else {
            for (var action of this.actions[this.step]) {
                if (action[0] == 'cursor') {
                    var algorithmText = action[1];
                    algorithmText.backCursor(-1);
                }
            }
        }
        Network.uploadSimpleLog(this.step, this.actions.length, '');
        return 0;
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

    calculateActions() {
        // 操作列を構成
    }
}
