import ArraySortPracticeStrict from './array_sort_practice_strict.js';
import AlgorithmTexts from './algorithm_texts.js';

export default class SelectionSortPractice extends ArraySortPracticeStrict {
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

    calculateActions(array) {
        var N = array.length;
        var a = [];
        for (var i = 0; i < N; i++) {
            a.push([array[i], i]);
        }
        var actions = [];
        for (var i = 0; i < N - 1; i++) {
            var idx = i;
            actions.push(
                ['turn', a[idx][1], 0]
            );
            for (var j = i + 1; j < N; j++) {
                actions.push(
                    ['turn', a[j][1], 2]
                );
                if (a[idx][0] > a[j][0]) {
                    actions.push(
                        ['turn', a[idx][1], 3]
                    );
                    idx = j;
                }
                else {
                    actions.push(
                        ['turn', a[j][1], 3]
                    );
                }
            }
            if (i != idx) {
                actions.push(
                    ['swap', new Set([a[i][1], a[idx][1]]), 4]
                );
                [a[i], a[idx]] = [a[idx], a[i]];
            }
            actions.push(
                ['turn', a[i][1], 5]
            );
            actions.push(
                ['fix', a[i][1], 6]
            );
        }
        actions.push(
            ['fix', a[N - 1][1], 7]
        );
        return actions;
    }
}