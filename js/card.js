import Utility from './utility.js';

export default class Card {
    constructor(value, backImage, pinImage) {
        this.value = value;
        this.x = 9999;
        this.actualX = 9999;
        this.y = 9999;
        this.actualY = 9999;
        this.width = 140;
        this.height = 210;
        this.angle = 0;
        this.backImage = backImage;
        this.pinImage = pinImage;
        this.open = false;
        this.actualOpen = false;
        this.moving = false;
        this.marked = false;
        this.frame = false;
        this.candidateFrame = false;
        this.fixed = false;
        this.smallPinImage = '';
        this.transparent = false;
        this.guide = 'None';
    }

    draw(context, canvas) {
        var time = Date.now();
        context.save();

        context.translate(this.x, this.y);
        context.scale(Math.cos(this.angle), 1);

        if (this.open) {
            /* Front Side */
            context.fillStyle = 'rgb(245, 245, 245)';
            if (this.marked) {
                context.fillStyle = 'rgb(255, 255, 200)';
            }
            context.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

            context.font = '48px serif';
            context.textAlign = 'center';
            context.textBaseline = 'alphabetic';
            context.fillStyle = 'rgb(20, 20, 20)';
            context.fillText(String(this.value), 0, 0);
        }
        else {
            /* Back Side */
            context.drawImage(canvas.getCardBackImage(this.backImage), -this.width / 2, -this.height / 2, this.width, this.height);

            if (this.marked) {
                context.fillStyle = 'rgba(255, 255, 200, 0.6)';
                context.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
            }

            if (this.fixed) {
                context.save();
                context.translate(0, 40);
                context.drawImage(canvas.getPinImage(this.pinImage), -200 / 2, -120 / 2, 200, 120);
                context.restore();
            }
            else if (this.smallPinImage != '') {
                context.save();
                context.translate(-40, -70);
                context.drawImage(canvas.getPinImage(this.smallPinImage), -100 / 2, -60 / 2, 100, 60);
                context.restore();
            }

            if (this.pointerOn(canvas.mouseX, canvas.mouseY) || this.fixed || (canvas.allTransparent() && !this.smallPinImage) || this.transparent) {
                context.font = '48px serif';
                context.textAlign = 'center';
                context.textBaseline = 'alphabetic';
                context.lineWidth = '8';
                context.strokeStyle = 'rgb(255, 255, 255)';

                context.save();
                context.shadowColor = 'black';
                context.shadowBlur = 4;
                context.shadowOffsetX = 8;
                context.shadowOffsetY = 8;
                context.strokeText(String(this.value), 0, -40);
                context.restore();

                context.fillStyle = 'rgb(0, 0, 0)';
                context.fillText(String(this.value), 0, -40);
            }
        }

        context.lineWidth = '1';
        context.strokeStyle = 'rgb(220, 220, 220)';
        if (this.frame) {
            context.lineWidth = '3';
            context.strokeStyle = 'rgb(20, 20, 20)';
        }
        else if (this.candidateFrame) {
            context.lineWidth = '2';
            context.strokeStyle = 'rgb(220, 40, 40)';

        }
        context.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);

        if (this.guide == 'Tap') {
            context.arc(0, 0, 50 - Math.floor(time / 50) % 20, 0, 2 * Math.PI, false);
            context.fillStyle = 'rgba(240, 240, 20, 0.6)';
            context.fill();
            context.beginPath();
        }
        if (this.guide == 'Left') {
            context.arc(Math.floor(time / 50) % 20 * 2, -Math.floor(time / 50) % 20 * 2, 40, 0, 2 * Math.PI, false);
            context.fillStyle = 'rgba(240, 240, 20, 0.6)';
            context.fill();
            context.beginPath();
        }
        if (this.guide == 'Right') {
            context.arc(-Math.floor(time / 50) % 20 * 2, Math.floor(time / 50) % 20 * 2, 40, 0, 2 * Math.PI, false);
            context.fillStyle = 'rgba(240, 240, 20, 0.6)';
            context.fill();
            context.beginPath();
        }
        if (this.guide == 'Pin') {
            context.arc(-40, -70, 50 - Math.floor(time / 50) % 20, 0, 2 * Math.PI, false);
            context.fillStyle = 'rgba(240, 240, 20, 0.6)';
            context.fill();
            context.beginPath();
        }


        context.restore();
    }

    getX() {
        return this.actualX;
    }

    getY() {
        return this.actualY;
    }

    getVisualX() {
        return this.x;
    }

    getVisualY() {
        return this.y;
    }

    setCoordinate(x, y) {
        this.x = this.actualX = Math.round(x * 100) / 100;
        this.y = this.actualY = Math.round(y * 100) / 100;
    }

    setActualCoordinate(x, y) {
        this.actualX = Math.round(x * 100) / 100;
        this.actualY = Math.round(y * 100) / 100;
    }

    setVisualCoordinate(x, y) {
        this.x = Math.round(x * 100) / 100;
        this.y = Math.round(y * 100) / 100;
    }

    setAngle(angle) {
        this.angle = Math.round(angle * 100) / 100;
    }

    setMoving() {
        this.moving = true;
    }

    resetMoving() {
        this.moving = false;
    }

    setCandidateFrame() {
        this.candidateFrame = true;
    }

    resetCandidateFrame() {
        this.candidateFrame = false;
    }

    setSmallPinImage(image) {
        this.smallPinImage = image;
    }

    turn() {
        const maxT = 10;
        var self = this;
        self.actualOpen = !self.actualOpen;
        for (var t = 0; t <= maxT; t++) {
            setTimeout(function (t, maxT) {
                if (t == maxT) {
                    self.setAngle(0);
                    return;
                }
                if (t == maxT / 2) {
                    self.open = !self.open;
                }
                if (t < maxT / 2) {
                    self.setAngle(Math.PI / maxT * t);
                }
                else {
                    self.setAngle(Math.PI / maxT * (maxT - t));
                }
            }, 20 * t, t, maxT);
        }
    }

    isOpen() {
        return this.actualOpen;
    }

    moveTo(x2, y2) {
        const maxT = 30;
        this.moving = true;
        var self = this;
        for (var t = 0; t <= maxT; t++) {
            setTimeout(function (t, maxT, x1, y1, x2, y2) {
                var x = Utility.easeInOut(t, maxT, x1, x2);
                var y = Utility.easeInOut(t, maxT, y1, y2);
                self.setVisualCoordinate(x, y);
                if (t == maxT) {
                    self.moving = false;
                }
            }, 20 * t, t, maxT, this.getVisualX(), this.getVisualY(), x2 - this.getVisualX(), y2 - this.getVisualY());
        }
        this.setActualCoordinate(x2, y2);
    }

    moveImmediatelyTo(x2, y2) {
        const maxT = 20;
        var self = this;
        for (var t = 0; t <= maxT; t++) {
            setTimeout(function (t, maxT, x1, y1, x2, y2) {
                var x = Utility.easeOut(t, maxT, x1, x2);
                var y = Utility.easeOut(t, maxT, y1, y2);
                self.setVisualCoordinate(x, y);
            }, 20 * t, t, maxT, this.getVisualX(), this.getVisualY(), x2 - this.getVisualX(), y2 - this.getVisualY());
        }
        this.setActualCoordinate(x2, y2);
    }

    fix() {
        this.fixed = true;
    }

    unfix() {
        this.fixed = false;
    }

    mark() {
        this.marked = true;
    }

    unmark() {
        this.marked = false;
    }

    toggleFrame() {
        this.frame = !this.frame;
    }

    pointerOn(x, y) {
        return (this.x - this.width / 2 <= x && x <= this.x + this.width / 2
            && this.y - this.height / 2 <= y && y <= this.y + this.height / 2);
    }

    pointerOnSmallPin(x, y) {
        var width = 100;
        var height = 60;
        return !this.open && (this.x - 40 - width / 2 <= x && x <= this.x - 40 + width / 2
            && this.y - 70 - height / 2 <= y && y <= this.y - 70 + height / 2);
    }

    setGuide (guide) {
        this.guide = guide;
    }
}