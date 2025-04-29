import { Player } from './player.js';
import { AsteroidField } from './asteroidfield.js';
import { Shot } from './shot.js';
import { Asteroid } from './asteroid.js';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from './constants.js';

let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');

canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;

let updatable = [];
let drawable = [];
let shots = [];
let asteroids = [];
window.keys = {};
document.addEventListener('keydown', function(event) {
    window.keys[event.key.toLowerCase()] = true;
});

document.addEventListener('keyup', function(event) {
    window.keys[event.key.toLowerCase()] = false;
});



let player = new Player(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, updatable, drawable, shots);
updatable.push(player);
drawable.push(player);

let asteroidField = new AsteroidField(updatable, drawable, asteroids);
updatable.push(asteroidField);

let gameOver = false;
let countdownTime = 3;
let countdownStarted = false;
let countdownStartTime = 0;
let countdownRunning = true;
let showGameOver = false;
let gameOverTime = 0;

let gameTime = 60;
let gameStartTime = 0;
let timeRemaining = gameTime;

let score = 0;

function updateScoreFromHitbox(hitboxRadius) {

    if (hitboxRadius > 71) {
        score += 1;
    } else if (hitboxRadius > 56 && hitboxRadius <= 71) {
        score += 2;
    } else if (hitboxRadius > 38.5 && hitboxRadius <= 56) {
        score += 3;
    } else if (hitboxRadius > 18 && hitboxRadius <= 38.5) {
        score += 4;
    } else if (hitboxRadius <= 18) {
        score += 5;
    }
}


function gameLoop() {
    let now = Date.now();
    let dt = (now - lastTime) / 1000;
    lastTime = now;

    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);  // Clear screen
    ctx.drawImage(backgroundImage, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    ctx.save();
    ctx.fillStyle = "red";
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Zsasteroids", canvas.width / 2, 50);
    ctx.restore();

    ctx.save();
    ctx.fillStyle = 'red';
    ctx.font = '24px Arial';
    ctx.textAlign = 'right';
    ctx.fillText("Score: " + score, SCREEN_WIDTH - 10, 30);
    ctx.restore();

    if (countdownRunning) {
        if (!countdownStarted) {
            countdownStartTime = Date.now();
            countdownStarted = true;
        }

        let elapsedTime = (Date.now() - countdownStartTime) / 1000;

        let displayText = "";
        if (elapsedTime < 1) {
            displayText = "3";
        } else if (elapsedTime < 2) {
            displayText = "2";
        } else if (elapsedTime < 3) {
            displayText = "1";
        } else if (elapsedTime < 4) {
            displayText = "START";
        } else {
            countdownRunning = false;
            gameStartTime = 0;
        }

        ctx.font = '74px Arial';
        ctx.fillStyle = 'red';
        ctx.fillText(displayText, SCREEN_WIDTH / 2 - ctx.measureText(displayText).width / 2, SCREEN_HEIGHT / 2);
    } else if (gameOver) {
        if (!showGameOver) {
            showGameOver = true;
        }

        let elapsedGameOver = (Date.now() - gameOverTime) / 1000;
        
        if (elapsedGameOver < 3) {
            ctx.save();
            ctx.font = '74px Arial';
            ctx.fillStyle = 'red';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText("GAME OVER", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
            ctx.restore();
            
        } else {
            ctx.save();
            ctx.font = '48px Arial';
            ctx.fillStyle = 'red';
            ctx.textAlign = 'center';
            ctx.fillText("Final Score: " + score, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 50);
            ctx.restore();

            restartButton.style.display = "block";
        }
    } else {
        if (gameStartTime === 0) {
            gameStartTime = Date.now();
        }

        const elapsedGameTime = (Date.now() - gameStartTime) / 1000;
        timeRemaining = Math.max(0, gameTime - elapsedGameTime);

        if (timeRemaining <= 0) {
            gameOver = true;
            gameOverTime = Date.now();
        }
        updatable.forEach(object => object.update(dt));

        for (let asteroid of asteroids) {
            
            if (player.collidesWith(asteroid)) {
                console.log("Game over!");
                gameOver = true;
                gameOverTime = Date.now();
                break;
            }

            for (let bullet of shots) {
                if (asteroid.collidesWith(bullet)) {
                    bullet.kill(updatable, drawable, shots);
                    const hitboxBeforeSplit = asteroid.hitboxRadius;
                    updateScoreFromHitbox(hitboxBeforeSplit);
                    asteroid.split();
                    break;
                }
            }
        }

        drawable.forEach(object => object.draw(ctx));
    }
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Time left: ${Math.ceil(timeRemaining)}s`, 20, 30);
    ctx.restore();

    ctx.save();
    ctx.fillStyle = 'red';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('W = forward   A = rotate left   D = rotate right   S = backward   SPACE = shoot', 10, SCREEN_HEIGHT - 10);
    ctx.restore();
    requestAnimationFrame(gameLoop);
}

let lastTime = Date.now();
let backgroundImage = new Image();
backgroundImage.src = 'images/background.jpg';
backgroundImage.onload = function() {
    gameLoop();
};

document.addEventListener('keydown', function(event) {
    if (window.key === 'a') player.rotate(-1);
    if (window.key === 'd') player.rotate(1);
    if (window.key === 'w') player.move(1);
    if (window.key === 's') player.move(-1);
    if (window.key === ' ') player.shoot();
});

function restartGame() {
    updatable.length = 0;
    drawable.length = 0;
    shots.length = 0;
    asteroids.length = 0;

    player = new Player(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, updatable, drawable, shots);
    updatable.push(player);
    drawable.push(player);

    asteroidField = new AsteroidField(updatable, drawable, asteroids);
    updatable.push(asteroidField);

    gameOver = false;
    showGameOver = false;
    gameOverTime = 0;
    countdownStarted = false;
    countdownStartTime = 0;
    countdownRunning = true;

    score = 0

    restartButton.style.display = "none";

    lastTime = Date.now();
    requestAnimationFrame(gameLoop);
}


let restartButton = document.getElementById("restartButton");
restartButton.addEventListener("click", () => {
    restartGame();
});

