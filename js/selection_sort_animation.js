import ArraySortAnimation from './array_sort_animation.js';
import AlgorithmTexts from './algorithm_texts.js';

export default class SelectionSortAnimation extends ArraySortAnimation {
    constructor(canvas) {
        super(canvas);
    }

    build(array) {
        super.build(array);
        this.algorithmText = new AlgorithmTexts(this.canvas, `ピン留めされていない左端のカードを開く
次のカードが存在する間繰り返す：
　次のカードを開く
　大きい方を閉じる
今開いているカードを左端に移動させる (元からある場合は不要)
閉じる
ピン留めする
(最後のカードは開かずピン留めする)`);
    }

    getCardColor() {
        return 'red';
    }

    calculateActions(array) {
        var N = array.length;
        var a = [];
        for (var i = 0; i < N; i++) {
            a.push([array[i], i]);
        }
        var actions = [];
        for (var i = 0; i < N - 1; i++) {
            actions.push([
                ['turnCard', a[i][1]],
                ['cursor', this.algorithmText, 0],
            ]);
            var idx = i;
            for (var j = i + 1; j < N; j++) {
                actions.push([
                    ['turnCard', a[j][1]],
                    ['compare'],
                    ['cursor', this.algorithmText, 2],
                ]);
                if (a[idx][0] > a[j][0]) {
                    actions.push([
                        ['turnCard', a[idx][1]],
                        ['cursor', this.algorithmText, 3],
                    ]);
                    idx = j;
                }
                else {
                    actions.push([
                        ['turnCard', a[j][1]],
                        ['cursor', this.algorithmText, 3],
                    ]);
                }
            }
            if (i != idx) {
                actions.push([
                    ['swapCards', a[i][1], a[idx][1]],
                    ['swap'],
                    ['cursor', this.algorithmText, 4],
                ]);
                [a[i], a[idx]] = [a[idx], a[i]];
            }
            actions.push([
                ['turnCard', a[i][1]],
                ['cursor', this.algorithmText, 5],
            ]);
            actions.push([
                ['fixCard', a[i][1]],
                ['cursor', this.algorithmText, 6],
            ]);
        }
        actions.push([
            ['fixCard', a[N - 1][1]],
            ['cursor', this.algorithmText, 7],
        ]);
        return actions;
    }
}