import { LOVE_CONFIG } from './config.js';
import { initNavigation } from './navigation.js';
import { initInteractions } from './interactions.js';
import { initGallery } from './gallery.js';
import { initCelebration } from './celebration.js';
import { initPageNavigation } from './page-navigation.js';
import { initAtmosphere } from './atmosphere.js';

function setVh() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

function hydrateConfigText() {
  document.querySelectorAll('[data-her-name]').forEach((el) => {
    el.textContent = LOVE_CONFIG.herName;
  });
  document.querySelectorAll('[data-my-name]').forEach((el) => {
    el.textContent = LOVE_CONFIG.myName;
  });
  document.querySelectorAll('[data-site-title]').forEach((el) => {
    el.textContent = LOVE_CONFIG.title;
  });
}

let noteInterval = null;

function initMusic() {
  const audio = document.querySelector('audio[data-background-music]');
  const toggle = document.querySelector('[data-music-toggle]');
  if (!audio || !toggle) return;

  const playingKey = 'little-website-music-playing';
  const timeKey = 'little-website-music-time';
  audio.volume = LOVE_CONFIG.defaultVolume;
  audio.muted = false;
  const alreadyPlaying = !audio.paused && !audio.ended;

  const spawnMusicNote = () => {
    if (!toggle || toggle.classList.contains('is-muted')) return;
    const note = document.createElement('span');
    const symbols = ['♪', '♫', '♩', '♬'];
    note.className = 'music-note-bubble';
    note.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    note.style.setProperty('--drift-x', `${(Math.random() * 28 - 14).toFixed(1)}px`);
    note.style.setProperty('--rot', `${(Math.random() * 40 - 20).toFixed(1)}deg`);
    toggle.appendChild(note);
    setTimeout(() => note.remove(), 2800);
  };

  const updateToggle = (isPlaying) => {
    toggle.classList.toggle('is-muted', !isPlaying);
    toggle.setAttribute('aria-pressed', String(isPlaying));
    toggle.setAttribute('aria-label', isPlaying ? 'Pause romantic background music' : 'Play romantic background music');
    toggle.title = isPlaying ? 'Jeda Musik Romantis ♫' : 'Putar Musik Romantis ♪';

    if (isPlaying) {
      toggle.innerHTML = `
        <div class="music-eq" aria-hidden="true">
          <span></span><span></span><span></span>
        </div>
      `;
      if (!noteInterval) {
        noteInterval = setInterval(spawnMusicNote, 1600);
      }
      let nowPlaying = document.querySelector('.now-playing-pill');
      if (!nowPlaying && LOVE_CONFIG.songTitle) {
        nowPlaying = document.createElement('div');
        nowPlaying.className = 'now-playing-pill';
        nowPlaying.innerHTML = `<span>♫</span> ${LOVE_CONFIG.songTitle}`;
        toggle.parentElement?.appendChild(nowPlaying);
        setTimeout(() => {
          nowPlaying?.classList.add('is-fadeout');
          setTimeout(() => nowPlaying?.remove(), 500);
        }, 4500);
      }
    } else {
      toggle.innerHTML = '♪';
      document.querySelector('.now-playing-pill')?.remove();
      if (noteInterval) {
        clearInterval(noteInterval);
        noteInterval = null;
      }
    }
  };

  const savePlaybackTime = () => {
    if (!audio.paused && Number.isFinite(audio.currentTime)) {
      sessionStorage.setItem(timeKey, String(audio.currentTime));
    }
  };

  const restorePlaybackTime = () => {
    const savedTime = Number(sessionStorage.getItem(timeKey));
    if (Number.isFinite(savedTime) && savedTime >= 0 && Number.isFinite(audio.duration) && audio.duration > 0) {
      audio.currentTime = savedTime % audio.duration;
    }
  };

  updateToggle(alreadyPlaying);

  if (audio.dataset.musicPersistence !== 'enabled') {
    audio.addEventListener('timeupdate', savePlaybackTime);
    window.addEventListener('pagehide', savePlaybackTime);
    audio.dataset.musicPersistence = 'enabled';
  }

  const startPlayback = () => {
    if (!audio.paused && !audio.ended) {
      updateToggle(true);
      return;
    }
    restorePlaybackTime();
    audio.play().then(() => {
      sessionStorage.setItem(playingKey, 'true');
      toggle.removeAttribute('data-playback-error');
      updateToggle(true);
    }).catch((error) => {
      sessionStorage.setItem(playingKey, 'false');
      updateToggle(false);
      toggle.setAttribute('data-playback-error', 'true');
      console.warn('Playback waiting for user interaction:', error);
    });
  };

  if (!alreadyPlaying && LOVE_CONFIG.musicEnabled && (LOVE_CONFIG.autoPlayMusic || sessionStorage.getItem(playingKey) === 'true')) {
    if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) {
      startPlayback();
    } else {
      audio.addEventListener('loadedmetadata', startPlayback, { once: true });
      audio.load();
    }
  }

  // Also auto-start music on first user click anywhere if user previously listened
  const handleFirstInteraction = () => {
    if (sessionStorage.getItem(playingKey) === 'true' && audio.paused) {
      startPlayback();
    }
    window.removeEventListener('pointerdown', handleFirstInteraction);
  };
  window.addEventListener('pointerdown', handleFirstInteraction);

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (audio.paused) {
      if (audio.readyState < HTMLMediaElement.HAVE_METADATA) {
        audio.addEventListener('loadedmetadata', startPlayback, { once: true });
        audio.load();
      } else {
        startPlayback();
      }
      return;
    }

    savePlaybackTime();
    audio.pause();
    sessionStorage.setItem(playingKey, 'false');
    updateToggle(false);
  });
}

function initPage() {
  initAtmosphere();
  hydrateConfigText();
  initNavigation();
  initInteractions();
  initGallery();
  initCelebration();
  initMusic();
}

export function initApp() {
  setVh();
  initPage();
  window.addEventListener('resize', setVh);
  initPageNavigation(initPage);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
