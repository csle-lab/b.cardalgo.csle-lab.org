export default class Cross {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.a = 0;
        this.length = 100;
        this.width = 10;
        this.mes = '';
    }

    draw(context) {
        context.save();
        context.translate(this.x, this.y);

        context.rotate(45 * Math.PI / 180);
        context.fillStyle = 'rgba(255, 50, 50, ' + this.a + ')';
        context.fillRect(0, -(this.length - this.width) / 2, this.width, this.length);
        context.fillRect(-(this.length - this.width) / 2, 0, (this.length - this.width) / 2, this.width);
        context.fillRect(this.width, 0, (this.length - this.width) / 2, this.width);
        context.beginPath();

        context.restore();

        context.save();

        context.translate(this.x, this.y);
        context.font = '32px Noto Sans JP';
        context.textAlign = 'center';
        context.textBaseline = 'top';
        context.fillStyle = 'rgba(255, 50, 50, ' + this.a + ')';
        context.fillText(this.mes, 0, this.length / 2);

        context.restore();
    }

    setAlpha(a) {
        this.a = a;
    }

    setSize(w, l) {
        this.width = w;
        this.length = l;
    }

    addMessage(mes) {
        this.mes = mes;
    }
}