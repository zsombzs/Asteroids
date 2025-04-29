import { Asteroid } from './asteroid.js';
import { ASTEROID_MAX_RADIUS, ASTEROID_SPAWN_RATE, ASTEROID_MIN_RADIUS, ASTEROID_KINDS, SCREEN_WIDTH, SCREEN_HEIGHT } from './constants.js';

class AsteroidField {
    constructor(updatable, drawable, asteroids) {
        this.edges = [
            [
                { x: 1, y: 0 },
                (y) => new Vector2(-ASTEROID_MAX_RADIUS, y * SCREEN_HEIGHT),
            ],
            [
                { x: -1, y: 0 },
                (y) => new Vector2(SCREEN_WIDTH + ASTEROID_MAX_RADIUS, y * SCREEN_HEIGHT),
            ],
            [
                { x: 0, y: 1 },
                (x) => new Vector2(x * SCREEN_WIDTH, -ASTEROID_MAX_RADIUS),
            ],
            [
                { x: 0, y: -1 },
                (x) => new Vector2(x * SCREEN_WIDTH, SCREEN_HEIGHT + ASTEROID_MAX_RADIUS),
            ]
        ];
        this.updatable = updatable;
        this.drawable = drawable;
        this.asteroids = asteroids;
        this.spawn_timer = 0;
    }

    spawn(radius, position, velocity) {
        let asteroid = new Asteroid(position.x, position.y, radius, this.updatable, this.drawable, this.asteroids);
        asteroid.velocity = velocity;
        this.updatable.push(asteroid);
        this.drawable.push(asteroid);
        this.asteroids.push(asteroid);
    }

    update(dt) {
        this.spawn_timer += dt;

        if (this.spawn_timer > ASTEROID_SPAWN_RATE) {
            this.spawn_timer = 0;

            let edge = this.edges[Math.floor(Math.random() * this.edges.length)];
            let speed = Math.floor(Math.random() * (100 - 40 + 1)) + 40;
            let velocity = new Vector2(edge[0].x, edge[0].y).multiply(speed);
            let randomRotation = Math.floor(Math.random() * (30 - -30 + 1)) + -30;
            velocity = velocity.rotate(randomRotation);
            let position = edge[1](Math.random());
            let kind = Math.floor(Math.random() * ASTEROID_KINDS) + 1;

            this.spawn(ASTEROID_MIN_RADIUS * kind, position, velocity);
        }
    }
}

class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    multiply(scalar) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    rotate(angle) {
        let radians = angle * (Math.PI / 180);
        let cos = Math.cos(radians);
        let sin = Math.sin(radians);
        return new Vector2(
            this.x * cos - this.y * sin,
            this.x * sin + this.y * cos
        );
    }
}

export { AsteroidField };
