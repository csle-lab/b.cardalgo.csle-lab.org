import Canvas from './canvas.js';
import Network from './network.js';

export default class Practice {
    constructor(canvas) {
        this.canvas = new Canvas(canvas);
        this.canvas.addChangeListener(this.canvasChanged);
    }

    set(array) {
        // 入力セット
    }

    begin() {
        // 最初から
    }

    back() {
        // 1 つ戻す
    }

    canvasChanged(canvas) {
        Network.uploadCanvas(canvas, 'practice');
    }
}
