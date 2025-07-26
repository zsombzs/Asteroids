document.addEventListener('DOMContentLoaded', () => {
    const clickSound = new Audio('/assets/audio/click.mp3');
    clickSound.volume = 0.5;
  
    const buttons = document.querySelectorAll('button');
  
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        clickSound.currentTime = 0;
        clickSound.play().catch(e => console.log('Playback error:', e));
      });
    });
  });
  