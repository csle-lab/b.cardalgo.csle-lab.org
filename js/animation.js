import Canvas from './canvas.js';
import Network from './network.js';

export default class Animation {
    constructor(canvas) {
        this.canvas = new Canvas(canvas);
        this.canvas.addChangeListener(this.canvasChanged);
    }

    set(array) {
        // 入力セット
    }

    begin() {
        // 最初に戻す
    }

    advance() {
        // 1 コマ進める
    }

    back() {
        // 1 コマ戻す
    }

    mouseMove(x, y) {
        this.canvas.setMouseCoordinate(x, y);
    }

    canvasChanged(canvas) {
        Network.uploadCanvas(canvas, 'animation');
    }
}
