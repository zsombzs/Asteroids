export const urlParams = new URLSearchParams(window.location.search);
export const theme = urlParams.get('theme') || 'space';

import { Player } from './player.js';
import { AsteroidField } from './asteroidfield.js';
import { Shot } from './shot.js';
import { Asteroid } from './asteroid.js';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from './constants.js';
import { supabase } from './supabase.js';
import { PowerUp } from "./powerup.js";
import { Strike } from './strike.js';

document.body.style.backgroundImage = `url('themes/${theme}/background.jpg')`;


let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');

function resizeCanvas() {
    const targetHeightRatio = 0.96;
    const targetWidthRatio = 0.94;
    const aspectRatio = SCREEN_WIDTH / SCREEN_HEIGHT;

    const maxHeight = window.innerHeight * targetHeightRatio;
    const maxWidth = maxHeight * aspectRatio * targetWidthRatio;

    canvas.width = SCREEN_WIDTH;
    canvas.height = SCREEN_HEIGHT;

    canvas.style.width = `${maxWidth}px`;
    canvas.style.height = `${maxHeight}px`;

    ctx.imageSmoothingEnabled = false;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
  

let updatable = [];
export let drawable = [];
let shots = [];
let asteroids = [];

let highScores = [];
let scoreSubmitted = false;

export let powerUps = [];

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
let countdownStarted = false;
let countdownStartTime = 0;
let countdownRunning = true;
let showGameOver = false;
let gameOverTime = 0;
let gameOverReason = null;

let gameTime = 60;
let gameStartTime = 0;
let powerUpSpawnTime = 0;
let timeRemaining = gameTime;

let score = 0;

let lastEarnedPoints = null;

function updateScoreFromHitbox(hitboxRadius) {

    if (hitboxRadius > 142) {
        lastEarnedPoints = 1;
        score += 1;
    } else if (hitboxRadius > 112 && hitboxRadius <= 142) {
        lastEarnedPoints = 2;
        score += 2;
    } else if (hitboxRadius > 77 && hitboxRadius <= 112) {
        lastEarnedPoints = 3;
        score += 3;
    } else if (hitboxRadius > 36 && hitboxRadius <= 77) {
        lastEarnedPoints = 4;
        score += 4;
    } else if (hitboxRadius <= 36) {
        lastEarnedPoints = 5;
        score += 5;
    }
}

let powerUpImage = new Image();
powerUpImage.src = `themes/${theme}/boost.png`;
let multishotImage = new Image();
multishotImage.src = `themes/${theme}/multishot.png`;
let strikeImage = new Image();
strikeImage.src = `themes/${theme}/strike.png`;

let textColor;
if (theme === 'ocean') {
  textColor = '#f3f3b6';
} else if (theme === 'jungle') {
  textColor = 'rgb(251, 213, 42)';
} else if (theme === 'ww2') {
    textColor = '#f7ede2';
} else {
  textColor = 'red';
}

let timeColor;
if (theme === 'ocean') {
    timeColor = 'white';
} else if (theme === 'jungle') {
    timeColor = 'white';
} else if (theme === 'ww2') {
    timeColor = 'white';
} else {
    timeColor = 'white';
}

let multishotSpawnTimes = [50, 30, 10];
let spawnedMultishots = new Set();

let spawnedStrikes = new Set();

let pendingStrikeTimes = [10, 30, 50];
let nextStrikeCountdownStart = null;
let currentStrikeTime = null;
let strikeCountdownText = null;



function gameLoop() {
    let now = Date.now();
    let dt = (now - lastTime) / 1000;
    lastTime = now;

    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);  // Clear screen
    ctx.drawImage(backgroundImage, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    if (!gameOver && !countdownRunning) {
        const elapsedGameTime = (Date.now() - gameStartTime) / 1000;
    
        if (pendingStrikeTimes.length > 0 && !nextStrikeCountdownStart) {
            if (elapsedGameTime >= pendingStrikeTimes[0] - 3) {
                nextStrikeCountdownStart = Date.now();
                currentStrikeTime = pendingStrikeTimes[0];
            }
        }
    
        if (nextStrikeCountdownStart) {
            const countdownElapsed = (Date.now() - nextStrikeCountdownStart) / 1000;
            if (countdownElapsed < 1) {
                strikeCountdownText = "Strike incoming in 3...";
            } else if (countdownElapsed < 2) {
                strikeCountdownText = "Strike incoming in 2...";
            } else if (countdownElapsed < 3) {
                strikeCountdownText = "Strike incoming in 1...";
            } else {
                strikeCountdownText = null;
                spawnStrike();
                spawnedStrikes.add(currentStrikeTime);
                pendingStrikeTimes.shift();
                nextStrikeCountdownStart = null;
                currentStrikeTime = null;
            }
        }
    }

    if (strikeCountdownText !== null) {
        ctx.save();
        ctx.font = "bold 32px Arial";
        ctx.fillStyle = timeColor;
        ctx.textAlign = "center";
        ctx.globalAlpha = 0.5 + 0.5 * Math.sin(Date.now() / 100);
        ctx.fillText(strikeCountdownText, canvas.width / 2, 125);
        ctx.restore();
    }

    ctx.save();
    ctx.fillStyle = textColor;
    ctx.font = "80px Arial";
    ctx.textAlign = "center";
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.fillText("Zsasteroids", canvas.width / 2, 75);
    ctx.restore();

    ctx.save();
    ctx.fillStyle = textColor;
    ctx.font = '40px Arial';
    ctx.textAlign = 'right';
    ctx.fillText("Score: " + score, SCREEN_WIDTH - 20, 45);
    ctx.restore();

    if (lastEarnedPoints !== null) {
        ctx.save();
        ctx.fillStyle = textColor;
        ctx.font = '26px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(`+${lastEarnedPoints} points`, SCREEN_WIDTH - 10, 80);
        ctx.restore();
    }

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
            gameStartTime = Date.now();
            powerUpSpawnTime = gameStartTime + 5000;
        }

        ctx.save();
        ctx.font = `100px Arial`;
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(displayText, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
        ctx.restore();
    } else if (gameOver) {
        if (!showGameOver) {
            showGameOver = true;
        }

        let elapsedGameOver = (Date.now() - gameOverTime) / 1000;
        
        if (elapsedGameOver < 3) {
            ctx.save();
            const pulse = Math.sin(Date.now() / 400) * 1.3 + 100;
            ctx.font = `${pulse}px Arial`;
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            if (gameOverReason === "timeout") {
                ctx.fillText("Time is up!", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
            } else if (gameOverReason === "collision") {
                ctx.fillText("GAME OVER", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
            }
            ctx.restore();
            
        } else {
            ctx.save();
            ctx.font = '86px Arial';
            ctx.fillStyle = textColor;
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
            gameOverReason = "timeout";
            if (!scoreSubmitted) {
                if (score >= topThreeThreshold) {
                    promptForNameAndSave(score);
                  } else {
                    saveScore(score);
                  }
                
                  scoreSubmitted = true;
                  fetchTopScores();
            }
        }
        updatable.forEach(object => object.update(dt));

        for (let asteroid of asteroids) {
            
            if (player.collidesWith(asteroid)) {
/*                 console.log("Game over!"); */
                gameOver = true;
                gameOverTime = Date.now();
                gameOverReason = "collision";
                if (!scoreSubmitted) {
                    if (score >= topThreeThreshold) {
                        promptForNameAndSave(score);
                      } else {
                        saveScore(score);
                      }
                    
                      scoreSubmitted = true;
                      fetchTopScores();
                    
                }
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

        for (let spawnTime of multishotSpawnTimes) {
            if (timeRemaining <= spawnTime && !spawnedMultishots.has(spawnTime)) {
                spawnPowerUp("multishot");
                spawnedMultishots.add(spawnTime);
            }
        }

        if (Date.now() >= powerUpSpawnTime) {
            spawnPowerUp();
            powerUpSpawnTime = Date.now() + 15000;
        }
    }
    ctx.save();
    ctx.fillStyle = timeColor;
    ctx.font = '35px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Time left: ${Math.ceil(timeRemaining)}s`, 20, 45);
    ctx.restore();

    if (!gameOver && player.powerUpEndTime) {
        const remaining = (player.powerUpEndTime - Date.now()) / 1000;
    
        if (remaining > 0) {
            ctx.fillStyle = timeColor;
            ctx.font = "28px Arial";
            ctx.fillText(`Power-up time: ${remaining.toFixed(1)}s`, 21, 85);
        } else {
            player.powerUpEndTime = null;
        }
    }

    if (!gameOver && player.multishotEndTime) {
        const remainingMultishotTime = (player.multishotEndTime - Date.now()) / 1000;
    
        if (remainingMultishotTime > 0) {
            ctx.fillStyle = timeColor;
            ctx.font = "28px Arial";
            ctx.fillText(`Multishot time: ${remainingMultishotTime.toFixed(1)}s`, 21, 125);
        } else {
            player.multishotEndTime = null;
        }
    }

    ctx.save();
    ctx.fillStyle = textColor;
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('W = forward   A = rotate left   D = rotate right   S = backward   SPACE = shoot, restart', 10, SCREEN_HEIGHT - 10);
    ctx.restore();

    const iconSize = 30;
    const iconX = 7;
    const iconY = canvas.height -60;
    if (powerUpImage.complete) {
        ctx.drawImage(powerUpImage, iconX, iconY, iconSize, iconSize);
    }

    ctx.font = "20px Arial";
    ctx.fillStyle = textColor;
    ctx.fillText("- Power-Up: Doubles speed and fire rate", iconX + iconSize + 10, iconY + 21);

    const multishotIconSize = 33;
    const multishotIconX = 6;
    const multishotIconY = canvas.height - 95;

    if (multishotImage.complete) {
        ctx.drawImage(multishotImage, multishotIconX, multishotIconY, multishotIconSize, multishotIconSize);
    }

    ctx.font = "20px Arial";
    ctx.fillStyle = textColor;
    ctx.fillText("- Multishot: Shoots 3 bullets at once", multishotIconX + multishotIconSize + 10, multishotIconY + 25);

    const strikeIconSize = 33;
    const strikeIconX = 6;
    const strikeIconY = canvas.height - 130;

    if (strikeImage.complete) {
        ctx.drawImage(strikeImage, strikeIconX, strikeIconY, strikeIconSize, strikeIconSize);
    }

    ctx.font = "20px Arial";
    ctx.fillStyle = textColor;
    ctx.fillText("- Strike: Hit: +200 points, Collision: game over", strikeIconX + strikeIconSize + 10, strikeIconY + 25);

    ctx.save();
    ctx.fillStyle = textColor;
    ctx.font = '28px Arial';
    ctx.textAlign = 'right';

    ctx.fillText("Top Scores:", SCREEN_WIDTH - 10, SCREEN_HEIGHT - 650);

    let startY = SCREEN_HEIGHT - 615;
    let padding = 30;
    
    highScores.forEach((entry, index) => {
        let indexText = `${index + 1}.`;
        let scoreText = entry.score.toString();
    
        ctx.fillText(indexText, SCREEN_WIDTH - 80, startY + index * padding);
        ctx.fillText(scoreText, SCREEN_WIDTH - 10, startY + index * padding);
    });

    ctx.restore();

    requestAnimationFrame(gameLoop);
}

let lastTime = Date.now();
let backgroundImage = new Image();
backgroundImage.src = `themes/${theme}/background.jpg`;

const radius = 23

function spawnPowerUp(type = "boost") {
    let x = Math.random() * (SCREEN_WIDTH - 2 * radius) + radius;
    let y = Math.random() * (SCREEN_HEIGHT - 2 * radius) + radius;
    let p = new PowerUp(x, y, type);
    powerUps.push(p);
    drawable.push(p);
    updatable.push(p);
}

backgroundImage.onload = function() {
    gameLoop();
};
fetchTopScores();
gameLoop();


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
    scoreSubmitted = false;

    gameStartTime = Date.now();

    spawnedMultishots = new Set();
    multishotSpawnTimes = [10, 30, 50];
    
    spawnedStrikes = new Set();
    pendingStrikeTimes = [10, 30, 50];
    nextStrikeCountdownStart = null;
    currentStrikeTime = null;
    strikeCountdownText = null;

    restartButton.style.display = "none";

    lastTime = Date.now();

    requestAnimationFrame(gameLoop);
}


let restartButton = document.getElementById("restartButton");
restartButton.addEventListener("click", () => {
    restartGame();
});

document.addEventListener("keydown", (event) => {
    if (event.code === "Space" && gameOver && !isNamePromptActive) {
        restartGame();
    }
});

async function saveScore(score) {
    await supabase.from('scores').insert([{ score }]);
}

let topThreeThreshold = Infinity;

async function fetchTopScores() {
    const { data, error } = await supabase
        .from('scores')
        .select('score')
        .order('score', { ascending: false })
        .limit(10);
        if (!error && data) {
            highScores = data;
            if (data.length >= 5) {
                topThreeThreshold = data[4].score;
            } else {
                topThreeThreshold = -1;
            }
        } else {
            console.error('Failed to fetch scores:', error);
        }
}

let isNamePromptActive = false;

async function promptForNameAndSave(score) {
    if (score > topThreeThreshold) {
        const modal = document.getElementById("nameModal");
        const input = document.getElementById("playerNameInput");
        const submitButton = document.getElementById("submitNameButton");
        const cancelButton = document.getElementById("cancelNameButton");
      
        isNamePromptActive = true
        modal.style.display = "flex";
        input.value = "";
        input.focus();
      
        submitButton.onclick = async () => {
            const name = input.value.trim().slice(0, 8);
            const finalName = name === "" ? null : name;
      
            await supabase.from('scores').insert([{ score, name: finalName }]);
            modal.style.display = "none";
            isNamePromptActive = false;
            fetchTopScores();
        };
        cancelButton.onclick = async () => {
            const finalName = "Anonymous";
            await supabase.from('scores').insert([{ score, name: finalName }]);
            modal.style.display = "none";
            isNamePromptActive = false;
            fetchTopScores();
        };
    } else {
        await saveScore(score);
    }
}

function spawnStrike() {
    new Strike(
        updatable,
        drawable,
        player,
        () => {
            gameOver = true;
            gameOverTime = Date.now();
            gameOverReason = "collision";
            if (!scoreSubmitted) {
                if (score >= topThreeThreshold) {
                    promptForNameAndSave(score);
                } else {
                    saveScore(score);
                }
                scoreSubmitted = true;
                fetchTopScores();
            }
        },
        () => {
            score += 200;
            lastEarnedPoints = 200;
        }
    );
}


