import ArraySortPracticeStrict from './array_sort_practice_strict.js';
import AlgorithmTexts from './algorithm_texts.js';

export default class BubbleSortPractice extends ArraySortPracticeStrict {
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

    calculateActions(array) {
        var N = array.length;
        var a = [];
        for (var i = 0; i < N; i++) {
            a.push([array[i], i]);
        }
        var actions = [];
        for (var i = 0; i < N - 1; i++) {
            actions.push(
                ['turn', a[0][1], 0],
            );
            for (var j = 0; j < N - 1 - i; j++) {
                actions.push(
                    ['turn', a[j + 1][1], 2],
                );
                if (a[j][0] > a[j + 1][0]) {
                    actions.push(
                        ['swap', new Set([a[j][1], a[j + 1][1]]), 3]
                    );
                    [a[j], a[j + 1]] = [a[j + 1], a[j]];
                }
                actions.push(
                    ['turn', a[j][1], 4]
                );
            }
            actions.push(
                ['turn', a[N - 1 - i][1], 5]
            );
            actions.push(
                ['fix', a[N - 1 - i][1], 6]
            );
        }
        actions.push(
            ['fix', a[0][1], 7]
        );
        return actions;
    }
}