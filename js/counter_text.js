import Text from './text.js';

export default class CounterText extends Text {
    constructor(format) {
        super();
        this.format = format;
        this.counter = 0;
        this.updateCounterText();
    }

    updateCounterText() {
        this.setText(this.format.replace("<counter>", String(this.counter)));
    }

    setCounter(x) {
        this.counter = x;
        this.updateCounterText();
    }

    countUp() {
        this.counter++;
        this.updateCounterText();
    }

    countDown() {
        this.counter--;
        this.updateCounterText();
    }
}
