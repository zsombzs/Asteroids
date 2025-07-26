document.addEventListener('DOMContentLoaded', () => {
  const musicButtons = document.querySelectorAll('.music-toggle');
  const audio = document.getElementById('background-music');
  let isPlaying = false;

  audio.loop = true;
  audio.volume = 0.15;

  musicButtons.forEach(button => {
    button.addEventListener('click', () => {
      isPlaying = !isPlaying;

      if (isPlaying) {
        audio.play().catch(e => console.log('Playback error:', e));
      } else {
        audio.pause();
      }

      musicButtons.forEach(btn => {
        const icon = btn.querySelector('i');
        icon.classList.toggle('fa-play', !isPlaying);
        icon.classList.toggle('fa-pause', isPlaying);
      });
      button.blur();
    });
  });
});
