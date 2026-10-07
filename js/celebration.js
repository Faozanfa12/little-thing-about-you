/**
 * Celebration & Proposal Interaction Module
 * Controls the confetti cannons, flying love hearts, magical chime audio,
 * and the playful "LET ME THINK" dodging button on the proposal page.
 */

function playCelebrationChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    // Fairy chime frequencies (C major 9th harp glissando: C5, E5, G5, B5, C6, E6, G6)
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51, 1567.98];
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.001, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.28, now + idx * 0.08 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 1.25);
    });
  } catch (err) {
    // AudioContext might be restricted or unsupported; fail silently
  }
}

export function startCelebration() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const confettiLayer = document.querySelector('[data-confetti]');
  const floatingLayer = document.querySelector('[data-float-hearts]');
  if (!confettiLayer && !floatingLayer) return;

  if (prefersReducedMotion) {
    if (confettiLayer) confettiLayer.innerHTML = '';
    if (floatingLayer) floatingLayer.innerHTML = '';
    return;
  }

  const confettiColors = ['#e85078', '#f8d280', '#b83b5e', '#d49a4a', '#fa709a', '#ffffff', '#ffd2e2'];
  const heartSymbols = ['❤', '♥', '💖', '💗', '✨', '💕'];

  // Confetti foil pieces
  if (confettiLayer) {
    confettiLayer.innerHTML = '';
    for (let i = 0; i < 60; i += 1) {
      const piece = document.createElement('span');
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.top = `${Math.random() * 40}%`;
      piece.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      piece.style.width = `${Math.random() * 8 + 8}px`;
      piece.style.height = `${Math.random() * 14 + 10}px`;
      piece.style.borderRadius = Math.random() > 0.5 ? '999px' : '3px';
      piece.style.setProperty('--tx', `${(Math.random() * 220 - 110).toFixed(2)}px`);
      piece.style.setProperty('--rot', `${(Math.random() * 720 - 360).toFixed(2)}deg`);
      piece.style.animationDelay = `${(Math.random() * 1.2).toFixed(2)}s`;
      piece.style.animationDuration = `${(Math.random() * 2 + 3.5).toFixed(2)}s`;
      confettiLayer.appendChild(piece);
    }
  }

  // Soaring glowing hearts
  if (floatingLayer) {
    floatingLayer.innerHTML = '';
    for (let i = 0; i < 22; i += 1) {
      const heart = document.createElement('span');
      heart.textContent = heartSymbols[i % heartSymbols.length];
      heart.style.left = `${Math.random() * 96 + 2}%`;
      heart.style.top = `${Math.random() * 85 + 10}%`;
      heart.style.fontSize = `${Math.random() * 16 + 18}px`;
      heart.style.animationDelay = `${(Math.random() * 0.8).toFixed(2)}s`;
      heart.style.animationDuration = `${(Math.random() * 2 + 3.8).toFixed(2)}s`;
      heart.style.setProperty('--tx', `${(Math.random() * 160 - 80).toFixed(2)}px`);
      heart.style.setProperty('--rot', `${(Math.random() * 140 - 70).toFixed(2)}deg`);
      heart.style.filter = 'drop-shadow(0 4px 12px rgba(216, 77, 114, 0.45))';
      floatingLayer.appendChild(heart);
    }
  }
}

export function initCelebration() {
  const pageBody = document.body;
  const isCelebrationPage = pageBody.getAttribute('data-page') === 'celebration';
  if (isCelebrationPage) {
    startCelebration();
  }

  // Playful "LET ME THINK" button interaction
  const thinkButtons = document.querySelectorAll('[data-celebration-trigger]');
  const yesButton = document.querySelector('[data-yes-button]');

  const playfulSteps = [
    { text: "Yakin mau mikir? 🥺", scale: 0.88, yesScale: 1.08 },
    { text: "Pikir lagi dong... 👉👈", scale: 0.76, yesScale: 1.18 },
    { text: "Gak boleh nolak yaa 🙈", scale: 0.65, yesScale: 1.28 },
    { text: "Tinggal bilang YES aja~ ✨", scale: 0.55, yesScale: 1.38 },
    { text: "Mau banget! 💖", scale: 1, yesScale: 1.45, isYes: true }
  ];

  thinkButtons.forEach((button) => {
    let clickCount = 0;

    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (clickCount >= playfulSteps.length - 1) {
        yesButton?.click();
        return;
      }

      const step = playfulSteps[clickCount];
      button.innerHTML = step.text;
      button.style.transform = `scale(${step.scale})`;

      if (yesButton) {
        yesButton.style.transform = `scale(${step.yesScale})`;
        yesButton.style.boxShadow = `0 ${16 * step.yesScale}px ${38 * step.yesScale}px rgba(133, 34, 60, 0.45), 0 0 ${35 * step.yesScale}px rgba(224, 82, 120, 0.75)`;
      }

      clickCount += 1;

      // On reaching the final step, switch button to "Mau banget! 💖"
      if (clickCount === playfulSteps.length - 1) {
        const lastStep = playfulSteps[clickCount];
        button.innerHTML = lastStep.text;
        button.style.background = 'linear-gradient(135deg, #e05278, #942442)';
        button.style.color = '#ffffff';
        button.style.borderColor = 'transparent';
        button.style.transform = 'scale(1)';
        button.style.boxShadow = '0 12px 28px rgba(148, 36, 66, 0.35)';
      }
    });
  });

  // Radiant YES button
  if (yesButton) {
    yesButton.addEventListener('click', () => {
      playCelebrationChime();
      startCelebration();

      yesButton.style.transform = 'scale(1.15)';
      yesButton.innerHTML = '💖 YES, I DO! 💖';

      setTimeout(() => {
        document.dispatchEvent(new CustomEvent('site:navigate', {
          detail: { url: './page-10-celebration.html' }
        }));
      }, 700);
    });
  }
}
