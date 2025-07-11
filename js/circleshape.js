import { Player } from './player.js';
class CircleShape {
    constructor(x, y, radius, hitboxRadius = radius, hitboxOffset = { x: -3, y: 0 }) {
        this.position = { x: x, y: y };
        this.velocity = { x: 0, y: 0 };
        this.radius = radius;
        this.hitboxRadius = hitboxRadius;
        this.hitboxOffset = hitboxOffset;
    }

    draw(ctx) {
        // This method should be overridden by subclasses
        throw new Error("Method 'draw()' must be implemented.");
    }

    update(dt) {
        // This method should be overridden by subclasses
        throw new Error("Method 'update()' must be implemented.");
    }

    collidesWith(other) {
        const thisHitboxX = this.position.x + (this.hitboxOffset?.x || 0);
        const thisHitboxY = this.position.y + (this.hitboxOffset?.y || 0);
        const otherHitboxX = other.position.x + (other.hitboxOffset?.x || 0);
        const otherHitboxY = other.position.y + (other.hitboxOffset?.y || 0);

        const dx = this.position.x - other.position.x;
        const dy = this.position.y - other.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const totalRadius = this.hitboxRadius + other.hitboxRadius;
        
        return distance < totalRadius;
    }
}

export { CircleShape };