import { CircleShape } from "./circleshape.js"
import { PLAYER_SHOOT_SPEED } from "./constants.js";
import { Shot } from "./shot.js"
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "./constants.js";
import { powerUps, drawable } from "./main.js"
import { theme } from "./main.js"

import { playSound, getSoundVariant } from './soundManager.js';

class Player extends CircleShape {
    
    constructor(x, y, updatable, drawable, shots) {
        super(x, y, 65.25, 33.75);
        this.rotation = 0;
        this.shootTimer = 0;
        this.updatable = updatable;
        this.drawable = drawable;
        this.shots = shots;
        this.image = new Image();
        this.image.src = `/themes/${theme}/spaceship.png`;
        this.image.onload = () => {
            this.imageLoaded = true;
        };
        this.imageLoaded = false
        this.speedMultiplier = 1;
        this.shootTimerMultiplier = 1;
        this.powerUpTimeout = null

        this.multishotActive = false;
        this.multishotEndTime = null;
    }

    draw(ctx) {
        let scale;
        if (theme === 'ocean') {
          scale = 0.9;
        } else if (theme === 'space') {
            scale = 0.82;
        }  else if (theme === 'jungle') {
          scale = 0.9;
        } else if (theme === 'ww2') {
            scale = 0.64;
        } else if (theme === 'city') {
            scale = 0.67;
        } else {
          scale = 1;
        }
        if (this.imageLoaded) {
            ctx.save();
            ctx.translate(this.position.x, this.position.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.drawImage(this.image, -this.radius * scale, -this.radius * scale, this.radius * 2 * scale, this.radius * 2 * scale);
            ctx.restore();
        }
/*              // Debug: kör hitbox kirajzolása
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

        if (this.multishotActive && Date.now() > this.multishotEndTime) {
            this.multishotActive = false;
        }

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
            // Wrap-around logic
        if (this.position.x < -this.hitboxRadius) {
            this.position.x = SCREEN_WIDTH + this.hitboxRadius;
        } else if (this.position.x > SCREEN_WIDTH + this.hitboxRadius) {
            this.position.x = -this.hitboxRadius;
            }

        if (this.position.y < -this.hitboxRadius) {
            this.position.y = SCREEN_HEIGHT + this.hitboxRadius;
        } else if (this.position.y > SCREEN_HEIGHT + this.hitboxRadius) {
            this.position.y = -this.hitboxRadius;
            }
        
        powerUps.forEach((powerUp, index) => {
            if (this.collidesWithCircle(powerUp)) {
                if (getSoundVariant()) {
                    playSound("/assets/audio/adi_good.mp3", 0.15);
                  } else {
                    playSound("/assets/audio/powerup_activated.mp3", 0.15);
                  }
                powerUps.splice(index, 1);
                drawable.splice(drawable.indexOf(powerUp), 1);
                if (powerUp.type === "boost") {
                    this.activatePowerUp();
                } else if (powerUp.type === "multishot") {
                    this.activateMultishot();
                }
            }
        });
        
        if (this.multishotActive && this.multishotEndTime && Date.now() > this.multishotEndTime) {
            this.multishotActive = false;
            this.multishotEndTime = null;
        }
     }
    

    move(dt) {
        let forward = this.vector(0, -1).rotate(this.rotation);
        this.position.x += forward.x * dt * this.speedMultiplier;
        this.position.y += forward.y * dt * this.speedMultiplier;
    }

    shoot() {
        if (this.shootTimer > 0) return;
        this.shootTimer = 0.3  * this.shootTimerMultiplier;;
        let forward = this.vector(0, -1).rotate(this.rotation);

        let shot1 = new Shot(this.position.x, this.position.y);
        shot1.velocity = {
            x: forward.x * PLAYER_SHOOT_SPEED,
            y: forward.y * PLAYER_SHOOT_SPEED
        };
        this.updatable.push(shot1);
        this.drawable.push(shot1);
        this.shots.push(shot1);

        if (this.multishotActive) {
            const angleOffset = 15;
        
            let offsetLeft = this.vector(-10, 0).rotate(this.rotation);
            let shot2 = new Shot(this.position.x + offsetLeft.x, this.position.y + offsetLeft.y);
            let rotatedLeft = this.vector(forward.x, forward.y).rotate(-angleOffset);
            shot2.velocity = {
                x: rotatedLeft.x * PLAYER_SHOOT_SPEED,
                y: rotatedLeft.y * PLAYER_SHOOT_SPEED
            };
            this.updatable.push(shot2);
            this.drawable.push(shot2);
            this.shots.push(shot2);
        
            let offsetRight = this.vector(10, 0).rotate(this.rotation);
            let shot3 = new Shot(this.position.x + offsetRight.x, this.position.y + offsetRight.y);
            let rotatedRight = this.vector(forward.x, forward.y).rotate(angleOffset);
            shot3.velocity = {
                x: rotatedRight.x * PLAYER_SHOOT_SPEED,
                y: rotatedRight.y * PLAYER_SHOOT_SPEED
            };
            this.updatable.push(shot3);
            this.drawable.push(shot3);
            this.shots.push(shot3);
        }
        
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
    
    activatePowerUp() {
        this.speedMultiplier = 2;
        this.shootTimerMultiplier = 0.5;

        this.powerUpEndTime = Date.now() + 8000

        if (this.powerUpTimeout) clearTimeout(this.powerUpTimeout);

        clearTimeout(this.powerUpTimeout);
        this.powerUpTimeout = setTimeout(() => {
            this.speedMultiplier = 1;
            this.shootTimerMultiplier = 1;
            this.powerUpTimeout = null;
            this.powerUpEndTime = null;
        }, 8000);
    }

    activateMultishot() {
        this.multishotActive = true;
        this.multishotEndTime = Math.max(this.multishotEndTime, Date.now() + 8000);
    }
}

export { Player };
