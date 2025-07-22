export default class Circle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.a = 0;
        this.r = 100;
        this.width = 10;
    }

    draw(context) {
        context.save();

        context.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        context.strokeStyle = `rgba(50, 255, 50, ${this.a})`;
        context.lineWidth = this.width;
        context.stroke();
        context.beginPath();

        context.restore();
    }

    setAlpha(a) {
        this.a = a;
    }

    setSize(w, r) {
        this.width = w;
        this.r = r;
    }
}