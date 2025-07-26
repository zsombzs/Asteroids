let isSoundMuted = false;

export function setMuted(muted) {
  isSoundMuted = muted;
}

export function toggleMuted() {
  isSoundMuted = !isSoundMuted;
  return isSoundMuted;
}

export function getMuted() {
  return isSoundMuted;
}

export function playSound(path, volume = 0.5) {
  if (isSoundMuted) return;
  if (adibodizs) {
  }
  const sound = new Audio(path);
  sound.volume = volume;
  sound.currentTime = 0;
  sound.play().catch(e => console.log(`Sound playback error (${path}):`, e));
}

export function createLoopedSound(path, volume = 1.0) {
  const audio = new Audio(path);
  audio.loop = true;
  audio.volume = volume;

  const play = () => {
    if (!isSoundMuted) audio.play().catch(() => {});
  };

  const stop = () => {
    audio.pause();
    audio.currentTime = 0;
  };

  return { play, stop, audio };
}

let adibodizs = false;

export function toggleSoundVariant() {
  adibodizs = !adibodizs;
  return adibodizs;
}

export function getSoundVariant() {
  return adibodizs;
}