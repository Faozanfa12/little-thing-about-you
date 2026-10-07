/**
 * Romantic Atmosphere & Floating Elements Module
 * Adds animated ambient lighting, starlight sparkles, bokeh orbs,
 * falling rose petals, butterflies, and interactive cursor fairy dust.
 */

let cursorListenerActive = false;
let clickListenerActive = false;

export function initAtmosphere() {
  if (document.querySelector('[data-romantic-atmosphere]')) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const atmosphere = document.createElement('div');
  atmosphere.className = 'romantic-atmosphere';
  atmosphere.setAttribute('data-romantic-atmosphere', '');
  atmosphere.setAttribute('aria-hidden', 'true');

  // Sparkles definitions
  const sparkleConfigs = [
    { x: '7%', y: '24%', size: '3px', dur: '4.2s', delay: '-0.8s' },
    { x: '88%', y: '16%', size: '4px', dur: '5.1s', delay: '-2.4s' },
    { x: '14%', y: '74%', size: '3px', dur: '3.9s', delay: '-1.5s' },
    { x: '92%', y: '62%', size: '4px', dur: '5.5s', delay: '-3.8s' },
    { x: '70%', y: '12%', size: '3px', dur: '4.6s', delay: '-2.1s' },
    { x: '5%', y: '52%', size: '4px', dur: '5.7s', delay: '-3.2s' },
    { x: '78%', y: '82%', size: '3px', dur: '4.1s', delay: '-1.6s' },
    { x: '42%', y: '7%', size: '4px', dur: '5.3s', delay: '-4.1s' },
    { x: '26%', y: '90%', size: '3px', dur: '4.5s', delay: '-0.6s' },
    { x: '96%', y: '40%', size: '4px', dur: '5.4s', delay: '-2.6s' },
    { x: '52%', y: '94%', size: '3px', dur: '4.8s', delay: '-1.2s' },
    { x: '18%', y: '36%', size: '4px', dur: '5.0s', delay: '-3.5s' }
  ];

  const starSymbols = ['✦', '✧', '✦', '✧', '✦', '✧', '✦', '✧'];
  const starPositions = [
    { x: '12%', y: '18%', size: '15px', dur: '5.2s', delay: '-1.2s' },
    { x: '84%', y: '28%', size: '13px', dur: '4.8s', delay: '-2.8s' },
    { x: '22%', y: '65%', size: '14px', dur: '5.6s', delay: '-0.5s' },
    { x: '76%', y: '68%', size: '16px', dur: '4.4s', delay: '-3.1s' },
    { x: '38%', y: '22%', size: '12px', dur: '6.0s', delay: '-4.0s' },
    { x: '64%', y: '88%', size: '14px', dur: '5.1s', delay: '-1.8s' },
    { x: '92%', y: '84%', size: '15px', dur: '4.7s', delay: '-2.2s' },
    { x: '6%', y: '86%', size: '13px', dur: '5.5s', delay: '-3.7s' }
  ];

  const sparklesHtml = sparkleConfigs.map((s) =>
    `<i style="--sparkle-x:${s.x};--sparkle-y:${s.y};--sparkle-size:${s.size};--sparkle-duration:${s.dur};--sparkle-delay:${s.delay};"></i>`
  ).join('');

  const starsHtml = starPositions.map((s, idx) =>
    `<i class="star-cross" style="--sparkle-x:${s.x};--sparkle-y:${s.y};--star-size:${s.size};--sparkle-duration:${s.dur};--sparkle-delay:${s.delay};">${starSymbols[idx]}</i>`
  ).join('');

  // Bokeh bubbles
  const bokehOrbs = [
    { x: '10%', size: '28px', dur: '16s', delay: '0s', drift: '45px' },
    { x: '25%', size: '38px', dur: '20s', delay: '-6s', drift: '-35px' },
    { x: '45%', size: '22px', dur: '18s', delay: '-12s', drift: '50px' },
    { x: '65%', size: '32px', dur: '22s', delay: '-4s', drift: '-40px' },
    { x: '82%', size: '26px', dur: '19s', delay: '-15s', drift: '30px' },
    { x: '92%', size: '36px', dur: '21s', delay: '-8s', drift: '-50px' }
  ];

  const bokehHtml = bokehOrbs.map((b) =>
    `<span class="bokeh-orb" style="--bokeh-x:${b.x};--bokeh-size:${b.size};--bokeh-duration:${b.dur};--bokeh-delay:${b.delay};--drift-x:${b.drift};"></span>`
  ).join('');

  // Falling petals
  const petals = [
    { x: '8%', w: '13px', h: '16px', dur: '11s', delay: '0s', driftX: '50px', driftXEnd: '90px' },
    { x: '22%', w: '15px', h: '19px', dur: '14s', delay: '-4s', driftX: '-60px', driftXEnd: '-110px' },
    { x: '38%', w: '12px', h: '15px', dur: '12s', delay: '-8s', driftX: '40px', driftXEnd: '80px' },
    { x: '58%', w: '16px', h: '20px', dur: '15s', delay: '-2s', driftX: '-50px', driftXEnd: '-100px' },
    { x: '74%', w: '14px', h: '18px', dur: '13s', delay: '-9s', driftX: '55px', driftXEnd: '95px' },
    { x: '88%', w: '15px', h: '17px', dur: '16s', delay: '-5s', driftX: '-45px', driftXEnd: '-85px' }
  ];

  const petalsHtml = petals.map((p) =>
    `<span class="falling-petal" style="--petal-x:${p.x};--petal-w:${p.w};--petal-h:${p.h};--petal-duration:${p.dur};--petal-delay:${p.delay};--drift-x:${p.driftX};--drift-x-end:${p.driftXEnd};"></span>`
  ).join('');

  atmosphere.innerHTML = `
    <div class="ambient-glow ambient-glow--rose"></div>
    <div class="ambient-glow ambient-glow--gold"></div>
    <div class="ambient-glow ambient-glow--lavender"></div>
    <div class="ambient-glow ambient-glow--peach"></div>
    <div class="light-ray light-ray--one"></div>
    <div class="light-ray light-ray--two"></div>
    <div class="bokeh-field">${bokehHtml}</div>
    <div class="petal-field">${petalsHtml}</div>
    <div class="atmosphere-sparkles">
      ${sparklesHtml}
      ${starsHtml}
    </div>
    <div class="butterfly-field">
      <svg width="0" height="0" style="position:absolute;">
        <defs>
          <linearGradient id="butterflyGradPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f8a2bf" />
            <stop offset="100%" stop-color="#b64164" />
          </linearGradient>
        </defs>
      </svg>
      <span class="butterfly butterfly--one">
        <svg viewBox="0 0 64 56" focusable="false">
          <path class="wing wing--upper" d="M31 26C23 9 5 2 4 13c-1 8 10 16 25 17Z"/>
          <path class="wing wing--lower" d="M29 30C17 24 5 29 10 39c4 8 14 8 21-5Z"/>
          <path class="wing wing--upper" d="M33 26C41 9 59 2 60 13c1 8-10 16-25 17Z"/>
          <path class="wing wing--lower" d="M35 30c12-6 24-1 19 9-4 8-14 8-21-5Z"/>
          <path class="butterfly-body" d="M32 23c-2 0-3 4-3 9s1 9 3 9 3-4 3-9-1-9-3-9Z"/>
          <path class="butterfly-antenna" d="M31 24c-2-5-5-6-7-7m9 7c2-5 5-6 7-7"/>
        </svg>
      </span>
      <span class="butterfly butterfly--two">
        <svg viewBox="0 0 64 56" focusable="false">
          <path class="wing wing--upper" d="M31 26C23 9 5 2 4 13c-1 8 10 16 25 17Z"/>
          <path class="wing wing--lower" d="M29 30C17 24 5 29 10 39c4 8 14 8 21-5Z"/>
          <path class="wing wing--upper" d="M33 26C41 9 59 2 60 13c1 8-10 16-25 17Z"/>
          <path class="wing wing--lower" d="M35 30c12-6 24-1 19 9-4 8-14 8-21-5Z"/>
          <path class="butterfly-body" d="M32 23c-2 0-3 4-3 9s1 9 3 9 3-4 3-9-1-9-3-9Z"/>
          <path class="butterfly-antenna" d="M31 24c-2-5-5-6-7-7m9 7c2-5 5-6 7-7"/>
        </svg>
      </span>
      <span class="butterfly butterfly--three">
        <svg viewBox="0 0 64 56" focusable="false">
          <path class="wing wing--upper" d="M31 26C23 9 5 2 4 13c-1 8 10 16 25 17Z"/>
          <path class="wing wing--lower" d="M29 30C17 24 5 29 10 39c4 8 14 8 21-5Z"/>
          <path class="wing wing--upper" d="M33 26C41 9 59 2 60 13c1 8-10 16-25 17Z"/>
          <path class="wing wing--lower" d="M35 30c12-6 24-1 19 9-4 8-14 8-21-5Z"/>
          <path class="butterfly-body" d="M32 23c-2 0-3 4-3 9s1 9 3 9 3-4 3-9-1-9-3-9Z"/>
          <path class="butterfly-antenna" d="M31 24c-2-5-5-6-7-7m9 7c2-5 5-6 7-7"/>
        </svg>
      </span>
    </div>
  `;

  document.body.appendChild(atmosphere);
  initCursorTrail();
  initClickSparkleBurst();
}

/**
 * Interactive fairy dust sparkles trailing after the cursor or touch
 */
function initCursorTrail() {
  if (cursorListenerActive) return;
  cursorListenerActive = true;

  const symbols = ['✦', '✧', '•', '♥', '✨', '•'];
  const colors = ['#f8b4c8', '#f8d795', '#e88ba9', '#ffffff', '#fed2e2'];
  let lastX = 0;
  let lastY = 0;
  let lastTime = 0;

  const spawnParticle = (x, y) => {
    const particle = document.createElement('span');
    const isSymbol = Math.random() > 0.45;
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = isSymbol ? (Math.random() * 8 + 10) : (Math.random() * 4 + 3);

    particle.textContent = isSymbol ? symbol : '';
    particle.style.position = 'fixed';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.fontSize = `${size}px`;
    particle.style.width = isSymbol ? 'auto' : `${size}px`;
    particle.style.height = isSymbol ? 'auto' : `${size}px`;
    particle.style.color = color;
    particle.style.backgroundColor = isSymbol ? 'transparent' : color;
    particle.style.borderRadius = isSymbol ? '0' : '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9999';
    particle.style.transform = 'translate(-50%, -50%) scale(1)';
    particle.style.filter = `drop-shadow(0 0 6px ${color})`;
    particle.style.transition = 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.65s ease';
    particle.style.opacity = '0.9';

    document.body.appendChild(particle);

    const driftX = (Math.random() - 0.5) * 32;
    const driftY = Math.random() * 24 + 10;
    const rot = (Math.random() - 0.5) * 60;

    requestAnimationFrame(() => {
      particle.style.transform = `translate(calc(-50% + ${driftX}px), calc(-50% + ${driftY}px)) scale(0.2) rotate(${rot}deg)`;
      particle.style.opacity = '0';
    });

    setTimeout(() => {
      particle.remove();
    }, 700);
  };

  const handleMove = (x, y) => {
    const now = Date.now();
    const dist = Math.hypot(x - lastX, y - lastY);
    if (dist > 18 && now - lastTime > 40) {
      lastX = x;
      lastY = y;
      lastTime = now;
      spawnParticle(x, y);
    }
  };

  window.addEventListener('pointermove', (e) => {
    handleMove(e.clientX, e.clientY);
  }, { passive: true });
}

/**
 * Click / tap radial burst of love sparkles
 */
function initClickSparkleBurst() {
  if (clickListenerActive) return;
  clickListenerActive = true;

  const clickSymbols = ['❤', '✦', '✨', '♥', '✧', '♡'];
  const clickColors = ['#f4729b', '#f5be54', '#ffffff', '#e85d85', '#ffd7e5'];

  window.addEventListener('pointerdown', (e) => {
    const count = 7;
    for (let i = 0; i < count; i += 1) {
      const spark = document.createElement('span');
      const symbol = clickSymbols[Math.floor(Math.random() * clickSymbols.length)];
      const color = clickColors[Math.floor(Math.random() * clickColors.length)];
      const angle = (i / count) * 2 * Math.PI + (Math.random() - 0.5) * 0.4;
      const distance = Math.random() * 45 + 30;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;

      spark.textContent = symbol;
      spark.style.position = 'fixed';
      spark.style.left = `${e.clientX}px`;
      spark.style.top = `${e.clientY}px`;
      spark.style.fontSize = `${Math.random() * 8 + 14}px`;
      spark.style.color = color;
      spark.style.pointerEvents = 'none';
      spark.style.zIndex = '9999';
      spark.style.transform = 'translate(-50%, -50%) scale(0.5)';
      spark.style.filter = `drop-shadow(0 0 8px ${color})`;
      spark.style.transition = 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.55s ease';
      spark.style.opacity = '1';

      document.body.appendChild(spark);

      requestAnimationFrame(() => {
        spark.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1.1) rotate(${(Math.random() - 0.5) * 90}deg)`;
        spark.style.opacity = '0';
      });

      setTimeout(() => {
        spark.remove();
      }, 600);
    }
  });
}
