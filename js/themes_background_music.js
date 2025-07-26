import { theme } from "./main.js"

document.addEventListener('DOMContentLoaded', () => {
    const music = document.getElementById('background-music');
    const musicToggle = document.getElementById('musicToggle');
    const musicIcon = musicToggle.querySelector('i');

    music.src = `/themes/${theme}/music.mp3`;
    music.load();
  
    const updateMusicIcon = () => {
      if (music.paused) {
        musicIcon.className = 'fas fa-volume-mute'; // OFF
      } else {
        musicIcon.className = 'fas fa-music'; // ON
      }
    };
  
    const toggleMusic = () => {
      if (music.paused) {
        music.play();
      } else {
        music.pause();
      }
      updateMusicIcon();
    };
  
    const tryPlayMusic = () => {
      music.volume = 0.05;
      music.play().then(updateMusicIcon).catch(() => {
        updateMusicIcon();
        document.addEventListener('click', () => {
          music.play().then(updateMusicIcon);
        }, { once: true });
      });
    };
  
    tryPlayMusic();
  
    musicToggle.addEventListener('click', () => {
        toggleMusic();
        musicToggle.blur();
      });
  
    document.addEventListener('keydown', (event) => {
      if (event.key === 'm' || event.key === 'M') {
        toggleMusic();
      }
    });
  });
  