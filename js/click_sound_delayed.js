document.addEventListener('DOMContentLoaded', () => {
  const clickSound = new Audio('/assets/audio/click.mp3');
  clickSound.volume = 0.5;

  const buttons = document.querySelectorAll('.delayed-button');

  buttons.forEach(button => {
    button.addEventListener('click', e => {
      e.preventDefault();

      const url = button.getAttribute('data-href');

      // Reset and play click sound
      clickSound.currentTime = 0;
      clickSound.play().catch(err => console.warn('Sound error:', err));

      setTimeout(() => {
        window.location.href = url;
      }, 150); // 150ms delay
    });
  });
});
