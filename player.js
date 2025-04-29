import { CircleShape } from "./circleshape.js"
import { PLAYER_SHOOT_SPEED } from "./constants.js";
import { Shot } from "./shot.js"

class Player extends CircleShape {
    constructor(x, y, updatable, drawable, shots) {
        super(x, y, 43.5, 22.5);
        this.rotation = 0;
        this.shootTimer = 0;
        this.updatable = updatable;
        this.drawable = drawable;
        this.shots = shots;
        this.image = new Image();
        this.image.src = "images/spaceship.png";
        this.image.onload = () => {
            this.imageLoaded = true;
        };
        this.imageLoaded = false
    }

    draw(ctx) {
        if (this.imageLoaded) {
            ctx.save();
            ctx.translate(this.position.x, this.position.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.drawImage(this.image, -this.radius, -this.radius, this.radius * 2, this.radius * 2);
            ctx.restore();
        }
/*             // Debug: kör hitbox kirajzolása
            ctx.beginPath();
            ctx.arc(this.position.x -1, this.position.y + 1, this.hitboxRadius, 0, 2 * Math.PI);
            ctx.strokeStyle = "red";
            ctx.lineWidth = 2;
            ctx.stroke(); */

    }
    

    rotate(speed) {
        this.rotation += speed;
    }

    update(dt) {
        this.shootTimer -= dt;

        if (window.keys['a']) {
            this.rotate(-300 * dt);
        }
        if (window.keys['d']) {
            this.rotate(300 * dt);
        }
        if (window.keys['w']) {
            this.move(200 * dt);
        }
        if (window.keys['s']) {
            this.move(-200 * dt);
        }
        if (window.keys[' ']) {
            this.shoot();
        }
    }

    move(dt) {
        let forward = this.vector(0, -1).rotate(this.rotation);
        this.position.x += forward.x * dt;
        this.position.y += forward.y * dt;
    }

    shoot() {
        if (this.shootTimer > 0) return;
        this.shootTimer = 0.3;

        let shot = new Shot(this.position.x, this.position.y);
        let forward = this.vector(0, -1).rotate(this.rotation);
        shot.velocity = {
            x: forward.x * PLAYER_SHOOT_SPEED,
            y: forward.y * PLAYER_SHOOT_SPEED
        };

        this.updatable.push(shot);
        this.drawable.push(shot);
        this.shots.push(shot);
    }

    vector(x, y) {
        const createVector = (x, y) => ({
            x,
            y,
            rotate(angle) {
                let rad = angle * Math.PI / 180;
                let cos = Math.cos(rad);
                let sin = Math.sin(rad);
                return createVector(
                    this.x * cos - this.y * sin,
                    this.x * sin + this.y * cos
                );
            },
            multiply(scalar) {
                return createVector(this.x * scalar, this.y * scalar);
            }
        });
    
        return createVector(x, y);
        }

        collidesWithCircle(circle) {
            let adjustedX = this.position.x - 1;
            let adjustedY = this.position.y + 1;
        
            let dx = adjustedX - circle.position.x;
            let dy = adjustedY - circle.position.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
        
            return distance < (this.radius + circle.radius);
        }
    }

export { Player };
