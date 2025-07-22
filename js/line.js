export default class Line {
    constructor() {
        this.x1 = 9999;
        this.y1 = 9999;
        this.x2 = 9999;
        this.y2 = 9999;
        this.color = 'rgb(50, 50, 255)';
        this.isClear = false;
        this.dash = false;
    }

    draw(context) {
        if (this.isClear) return;
        context.save();

        context.strokeStyle = this.color;
        context.lineWidth = 12;
        context.lineJoin = 'round';
        if (this.dash) context.setLineDash([16, 24]);
        context.beginPath();
        context.moveTo(this.x1, this.y1);
        context.lineTo(this.x2, this.y2);
        context.closePath();
        context.stroke();

        context.restore();
    }

    setCoordinate(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    setColor(color) {
        this.color = color;
    }

    show() {
        if (!this.isClear) console.log('already shown');
        this.isClear = false;
    }

    clear() {
        if (this.isClear) console.log('already clear');
        this.isClear = true;
    }

    toggle() {
        this.isClear = !this.isClear;
    }
}