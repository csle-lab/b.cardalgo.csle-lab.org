import ArraySortAnimation from './array_sort_animation.js';
import AlgorithmTexts from './algorithm_texts.js';

export default class BubbleSortAnimation extends ArraySortAnimation {
    constructor(canvas) {
        super(canvas);
    }

    build(array) {
        super.build(array);
        this.algorithmText = new AlgorithmTexts(this.canvas, `左端のカードを開く
右隣のカードが存在する間繰り返す：
　右隣のカードを開く
　大小が逆になっていたら交換する (正しい場合は不要)
　左側のカードを閉じる
今開いているカードを閉じる
ピン留めする
(最後のカードは開かずピン留めする)`);
    }

    getCardColor() {
        return 'blue';
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
                ['turnCard', a[0][1]],
                ['cursor', this.algorithmText, 0],
            ]);
            for (var j = 0; j < N - 1 - i; j++) {
                actions.push([
                    ['turnCard', a[j + 1][1]],
                    ['compare'],
                    ['cursor', this.algorithmText, 2],
                ]);
                if (a[j][0] > a[j + 1][0]) {
                    actions.push([
                        ['swapCards', a[j][1], a[j + 1][1]],
                        ['swap'],
                        ['cursor', this.algorithmText, 3],
                    ]);
                    [a[j], a[j + 1]] = [a[j + 1], a[j]];
                }
                actions.push([
                    ['turnCard', a[j][1]],
                    ['cursor', this.algorithmText, 4],
                ]);
            }
            actions.push([
                ['turnCard', a[N - 1 - i][1]],
                ['cursor', this.algorithmText, 5],
            ]);
            actions.push([
                ['fixCard', a[N - 1 - i][1]],
                ['cursor', this.algorithmText, 6],
            ]);
        }
        actions.push([
            ['fixCard', a[0][1]],
            ['cursor', this.algorithmText, 7],
        ]);
        return actions;
    }
}