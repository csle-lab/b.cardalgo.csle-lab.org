export default class Grid {
    constructor(value) {
        this.value = value;
        this.x = 9999;
        this.y = 9999;
        this.width = 180;
        this.height = 238;
        this.marked = false;
    }

    draw(context) {
        if (this.marked) {
            context.save();
            context.strokeStyle = 'rgb(100, 200, 100)';
            context.lineWidth = 12;
            var width = this.width - 12;
            var height = this.height - 12;
            context.strokeRect(this.x - width / 2, this.y - height / 2, width, height);
            context.restore();
        }

        context.save();

        context.fillStyle = 'rgb(255, 255, 255)';
        context.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);

        context.strokeStyle = 'rgb(20, 20, 20)';
        context.strokeRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);

        context.font = '24px Noto Sans JP';
        context.textAlign = 'left';
        context.textBaseline = 'top';
        context.fillStyle = 'rgb(20, 20, 20)';
        context.fillText(String(Grid.numToChar(this.value)), this.x - this.width / 2 + 2, this.y - this.height / 2 + 2);

        context.restore();
    }

    setCoordinate(x, y) {
        this.x = x;
        this.y = y;
    }

    static numToChar(num) {
        var arr = ['⓪', '①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', ''];
        return arr[num + 1];
    }
}