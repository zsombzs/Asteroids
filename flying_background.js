const images = [
  'themes/space/boost.png',
  'themes/space/spaceship.png',
  'themes/space/asteroid.png',
  'themes/ocean/spaceship.png',
  'themes/ocean/asteroid.png',
  'themes/ocean/boost.png',
  'themes/jungle/boost.png',
  'themes/jungle/spaceship.png',
  'themes/jungle/asteroid.png',
  'themes/ww2/boost.png',
  'themes/ww2/spaceship.png',
  'themes/ww2/asteroid.png',
  'images/zsasteroids_icon_no_bg.png',
  'themes/space/multishot.png',
  'themes/ocean/multishot.png',
  'themes/jungle/multishot.png',
  'themes/ww2/multishot.png',
  'themes/space/strike.png',
  'themes/ocean/strike.png',
  'themes/jungle/strike.png',
  'themes/ww2/strike.png',

];

function spawnRandomFlyingImage() {
  const img = document.createElement('img');
  img.src = images[Math.floor(Math.random() * images.length)];
  img.className = 'floating-image';

  const container = document.querySelector('.background-container');
  if (!container) {
      console.error('Error: .background-container element not found.');
      return;
  }
  container.appendChild(img);

  let scaleValue = 1.2;

  if (img.src.endsWith('boost.png')) {
      scaleValue = 0.7;
  }

  if (img.src.endsWith('multishot.png')) {
    scaleValue = 0.7;
}

  // 0=bal, 1=jobb, 2=fent, 3=lent
  const side = Math.floor(Math.random() * 4);
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let x, y, targetX, targetY;

  if (side === 0) {
      x = -100;
      y = Math.random() * vh;
      targetX = vw + 100;
      targetY = Math.random() * vh;
  } else if (side === 1) {
      x = vw + 100;
      y = Math.random() * vh;
      targetX = -100;
      targetY = Math.random() * vh;
  } else if (side === 2) {
      x = Math.random() * vw;
      y = -100;
      targetX = Math.random() * vw;
      targetY = vh + 100;
  } else {
      x = Math.random() * vw;
      y = vh + 100;
      targetX = Math.random() * vw;
      targetY = -100;
  }

  img.style.left = `${x}px`;
  img.style.top = `${y}px`;

  const deltaX = targetX - x;
  const deltaY = targetY - y;

  const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
  img.style.transform = `scale(${scaleValue}) rotate(${angle}deg)`;

  const duration = 10 + Math.random() * 5;
  img.animate([
      { transform: `translate(0px, 0px) scale(${scaleValue}) rotate(${angle}deg)` },
      { transform: `translate(${deltaX}px, ${deltaY}px) scale(${scaleValue}) rotate(${angle}deg)` }
  ], {
      duration: duration * 1000,
      easing: 'linear'
  });

  setTimeout(() => img.remove(), duration * 1000);
}

setInterval(spawnRandomFlyingImage, 2000);