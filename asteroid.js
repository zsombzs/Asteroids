import { CircleShape } from './circleshape.js';
import { ASTEROID_MIN_RADIUS } from './constants.js';
import { Player } from "./player.js"
import { theme } from "./main.js"

class Asteroid extends CircleShape {
    constructor(x, y, radius, updatable, drawable, asteroids) {
        super(x, y, radius, undefined, { x: -3, y: 0 });

        this.updatable = updatable;
        this.drawable = drawable;
        this.asteroids = asteroids;

        this.image = new Image();
        this.image.src = `themes/${theme}/asteroid.png`;
        this.image.onload = () => {
            this.image.width = radius * 2;
            this.image.height = radius * 2;
        };
        this.hitboxOffset = { x: 0, y: theme === 'ocean' ? -4 : 0 };
        this.setHitbox();
    }

    draw(ctx) {
        let scale;
        if (theme === 'ocean') {
          scale = 1.45;
        } else if (theme === 'jungle') {
          scale = 1.27;
        } else if (theme === 'ww2') {
            scale = 0.965;
        } else {
          scale = 1;
        }
        ctx.drawImage(
            this.image,
            this.position.x - this.radius * scale,
            this.position.y - this.radius * scale,
            this.radius * 2 * scale,
            this.radius * 2 * scale
            );

/*             const hitboxX = this.position.x + (this.hitboxOffset?.x || 0);
            const hitboxY = this.position.y + (this.hitboxOffset?.y || 0);
            
            ctx.beginPath();
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 1;
            ctx.arc(hitboxX, hitboxY, this.hitboxRadius, 0, Math.PI * 2);
            ctx.stroke();

    ctx.fillStyle = 'lime';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`r: ${this.radius}`, this.position.x, this.position.y - this.radius - 10); */

    ctx.restore();
    }

    update(dt) {
        this.position.x += this.velocity.x * dt;
        this.position.y += this.velocity.y * dt;
    }

    setHitbox() {
        if (this.radius === 48) {
            this.hitboxRadius = 36;
        } else if (this.radius === 96) {
            this.hitboxRadius = 70;
        } else if (this.radius === 144) {
            this.hitboxRadius = 112;
        } else if (this.radius === 192) {
            this.hitboxRadius = 150;
        } else if (this.radius === 240) {
            this.hitboxRadius = 185;
        } else {
            this.hitboxRadius = this.radius * 0.75;
        }
    }
    

    split() {
        if (this.radius < (ASTEROID_MIN_RADIUS / 2)) {
            this.kill();
            return;
        }
    
        for (let i = 0; i < 2; i++) {
            let newRadius = this.radius / 2;
            let newAsteroid = new Asteroid(this.position.x, this.position.y, newRadius, this.updatable, this.drawable, this.asteroids);
    
            let angle = Math.random() * 360;
            let rad = angle * Math.PI / 180;
            let speed = Math.random() * 105 + 50;
            newAsteroid.velocity = {
                x: Math.cos(rad) * speed,
                y: Math.sin(rad) * speed
            };

            newAsteroid.setHitbox();
    
            this.updatable.push(newAsteroid);
            this.drawable.push(newAsteroid);
            this.asteroids.push(newAsteroid);
        }
    
        this.kill();
    }

    kill() {
        const indexUpdatable = this.updatable.indexOf(this);
        if (indexUpdatable > -1) this.updatable.splice(indexUpdatable, 1);
    
        const indexDrawable = this.drawable.indexOf(this);
        if (indexDrawable > -1) this.drawable.splice(indexDrawable, 1);
    
        const indexAsteroids = this.asteroids.indexOf(this);
        if (indexAsteroids > -1) this.asteroids.splice(indexAsteroids, 1);
    }
    
}

export { Asteroid };
