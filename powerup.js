import { CircleShape } from "./circleshape.js";

class PowerUp extends CircleShape {
    constructor(x, y) {
        super(x, y, 23, 21);
        this.image = new Image();
        this.image.src = "images/boost.png";
        this.imageLoaded = false;
        this.image.onload = () => {
            this.imageLoaded = true;
        };
    }

    draw(ctx) {
        if (this.imageLoaded) {
            ctx.save();
            ctx.translate(this.position.x, this.position.y);
            ctx.drawImage(this.image, -this.radius, -this.radius, this.radius * 2, this.radius * 2);
            ctx.restore();
        }
/*              // Debug: kör hitbox kirajzolása
            ctx.beginPath();
            ctx.arc(this.position.x -1, this.position.y + 1, this.hitboxRadius, 0, 2 * Math.PI);
            ctx.strokeStyle = "red";
            ctx.lineWidth = 2;
            ctx.stroke(); */
    }

    update(dt) {

    }
}

export { PowerUp };
