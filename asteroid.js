import { CircleShape } from './circleshape.js';
import { ASTEROID_MIN_RADIUS } from './constants.js';
import { Player } from "./player.js"

class Asteroid extends CircleShape {
    constructor(x, y, radius, updatable, drawable, asteroids) {
        super(x, y, radius, undefined, { x: -3, y: 0 });

        this.updatable = updatable;
        this.drawable = drawable;
        this.asteroids = asteroids;

        this.image = new Image();
        this.image.src = 'images/asteroid.png';
        this.image.onload = () => {
            this.image.width = radius * 2;
            this.image.height = radius * 2;
        };
        this.setHitbox();
    }

    draw(ctx) {
        ctx.drawImage(
            this.image,
            this.position.x - this.radius,
            this.position.y - this.radius,
            this.radius * 2,
            this.radius * 2
        );
/*             const hitboxX = this.position.x + (this.hitboxOffset?.x || 0);
            const hitboxY = this.position.y + (this.hitboxOffset?.y || 0);
            
            ctx.beginPath();
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 1;
            ctx.arc(hitboxX, hitboxY, this.hitboxRadius, 0, Math.PI * 2);
            ctx.stroke(); */

/*     ctx.fillStyle = 'lime';
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
        if (this.radius === 24) {
            this.hitboxRadius = 18;
        } else if (this.radius === 48) {
            this.hitboxRadius = 38.5;
        } else if (this.radius === 72) {
            this.hitboxRadius = 56;
        } else if (this.radius === 96) {
            this.hitboxRadius = 71;
        } else if (this.radius === 120) {
            this.hitboxRadius = 91;
        } else {
            this.hitboxRadius = this.radius * 0.75;
        }
        console.log("Hitbox for radius", this.radius, "is", this.hitboxRadius);
    }
    

    split() {
        if (this.radius < ASTEROID_MIN_RADIUS) {
            this.kill();
            return;
        }
    
        for (let i = 0; i < 2; i++) {
            let newRadius = this.radius / 2;
            let newAsteroid = new Asteroid(this.position.x, this.position.y, newRadius, this.updatable, this.drawable, this.asteroids);
    
            let angle = Math.random() * 360;
            let rad = angle * Math.PI / 180;
            let speed = Math.random() * 90 + 50;
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
