/**
 * MAIN.JS — APPLICATION ORCHESTRATION & INTERACTIVE HUD
 * muzguy // Rohit — Futuristic Developer Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize WebGL 3D Background
  let webglApp = null;
  if (typeof window.initWebGLBackground === 'function') {
    try {
      webglApp = window.initWebGLBackground();
    } catch (err) {
      console.warn('WebGL initialization fallback:', err);
    }
  }

  // 2. Initialize Custom Cursor
  if (typeof window.initCustomCursor === 'function') {
    window.initCustomCursor();
  }

  // 3. Initialize 3D Card Tilt
  if (typeof window.initCardTilt === 'function') {
    window.initCardTilt();
  }

  // 4. Initialize Smooth Scrolling & Reveals
  if (typeof window.initScrollController === 'function') {
    window.initScrollController();
  }

  // 5. Live IST Clock
  initLiveClock();

  // 6. Futuristic Web Audio Sound FX
  const soundFX = initAudioSynthesizer();

  // 7. Visual Theme Controller (WebGL, Desert, Driveby, Flow)
  initAtmosphereController(webglApp, soundFX);

  // 8. Light / Dark Display Mode Controller
  initThemeModeToggle(webglApp, soundFX);

  // 9. Email Clipboard Copy
  initEmailCopy(soundFX);

  // 10. Mobile Navigation Drawer
  initMobileNav();

  // 11. Cyber Console Greeting
  printCyberBanner();
});

/* =========================================================
   LIVE IST CLOCK
========================================================= */
function initLiveClock() {
  const clockEl = document.getElementById('istClock');
  if (!clockEl) return;

  function update() {
    const options = {
      timeZone: 'Asia/Kolkata',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    const now = new Intl.DateTimeFormat('en-GB', options).format(new Date());
    clockEl.textContent = `${now} IST`;
  }

  update();
  setInterval(update, 1000);
}

/* =========================================================
   VISUAL THEME SWITCHER (ATMOSPHERE CONTROLLER)
========================================================= */
function initAtmosphereController(webglApp, soundFX) {
  const atmoButtons = document.querySelectorAll('.atmo-btn');
  if (!atmoButtons.length) return;

  // Retrieve saved theme or default to 'webgl'
  let currentTheme = 'webgl';
  try {
    const saved = localStorage.getItem('muzguy_theme');
    if (saved) currentTheme = saved;
  } catch (e) {}

  const currentMode = document.documentElement.getAttribute('data-mode') || 'dark';

  function updateActiveButton(theme) {
    atmoButtons.forEach((btn) => {
      const btnTheme = btn.getAttribute('data-theme') || btn.getAttribute('data-mode');
      if (btnTheme === theme) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Sync initial state
  updateActiveButton(currentTheme);
  document.documentElement.setAttribute('data-theme', currentTheme);
  if (webglApp && typeof webglApp.setTheme === 'function') {
    webglApp.setTheme(currentTheme, currentMode);
  }

  atmoButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme') || btn.getAttribute('data-mode');
      if (!theme || theme === currentTheme) return;

      currentTheme = theme;
      updateActiveButton(currentTheme);

      // 1. Smoothly transition website's accent colors via data-theme
      document.documentElement.setAttribute('data-theme', currentTheme);

      // 2. Persist user preference
      try {
        localStorage.setItem('muzguy_theme', currentTheme);
      } catch (e) {}

      // 3. Update 3D WebGL particle colors
      const activeMode = document.documentElement.getAttribute('data-mode') || 'dark';
      if (webglApp && typeof webglApp.setTheme === 'function') {
        webglApp.setTheme(currentTheme, activeMode);
      }

      // 4. Audio Feedback
      if (soundFX && soundFX.playSwitch) {
        soundFX.playSwitch();
      }
    });
  });
}

/* =========================================================
   LIGHT / DARK DISPLAY MODE CONTROLLER
========================================================= */
function initThemeModeToggle(webglApp, soundFX) {
  const modeBtn = document.getElementById('themeModeToggle');
  if (!modeBtn) return;

  let currentMode = 'dark';
  try {
    const saved = localStorage.getItem('muzguy_mode');
    if (saved) currentMode = saved;
  } catch (e) {}

  document.documentElement.setAttribute('data-mode', currentMode);

  modeBtn.addEventListener('click', () => {
    currentMode = currentMode === 'dark' ? 'light' : 'dark';

    // 1. Smoothly adapt the entire UI to dark or light mode
    document.documentElement.setAttribute('data-mode', currentMode);

    // 2. Persist user preference
    try {
      localStorage.setItem('muzguy_mode', currentMode);
    } catch (e) {}

    // 3. Update 3D WebGL particle contrast and colors for the current theme
    const activeTheme = document.documentElement.getAttribute('data-theme') || 'webgl';
    if (webglApp && typeof webglApp.setTheme === 'function') {
      webglApp.setTheme(activeTheme, currentMode);
    }

    // 4. Audio Feedback
    if (soundFX && soundFX.playSwitch) {
      soundFX.playSwitch();
    }
  });
}

/* =========================================================
   SYNTHESIZED SCI-FI AUDIO SFX (Web Audio API)
========================================================= */
function initAudioSynthesizer() {
  let audioCtx = null;
  let isSoundEnabled = false;

  const audioToggle = document.getElementById('audioToggle');

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  if (audioToggle) {
    audioToggle.addEventListener('click', () => {
      isSoundEnabled = !isSoundEnabled;
      if (isSoundEnabled) {
        getAudioContext();
        audioToggle.classList.add('active');
        audioToggle.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
        playTone(520, 'sine', 0.08, 0.04);
      } else {
        audioToggle.classList.remove('active');
        audioToggle.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
      }
    });
  }

  function playTone(freq, type = 'sine', duration = 0.06, gainValue = 0.05) {
    if (!isSoundEnabled) return;
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(gainValue, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio not permitted yet
    }
  }

  // Hover tone on interactive elements
  document.querySelectorAll('a, button, .tech-pill, .atmo-btn').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      playTone(440, 'triangle', 0.04, 0.03);
    });
  });

  return {
    playSuccess: () => {
      playTone(587.33, 'sine', 0.08, 0.05);
      setTimeout(() => playTone(880, 'sine', 0.12, 0.05), 80);
    },
    playSwitch: () => {
      playTone(523.25, 'triangle', 0.05, 0.03);
      setTimeout(() => playTone(783.99, 'sine', 0.08, 0.04), 50);
    }
  };
}

/* =========================================================
   EMAIL CLIPBOARD COPY
========================================================= */
function initEmailCopy(soundFX) {
  const emailBtn = document.getElementById('copyEmailBtn');
  const toast = document.getElementById('copyToast');
  if (!emailBtn || !toast) return;

  emailBtn.addEventListener('click', async () => {
    const email = 'rohit@muzguy.in';
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(email);
      } else {
        const input = document.createElement('input');
        input.value = email;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }

      toast.classList.add('show');
      if (soundFX && soundFX.playSuccess) soundFX.playSuccess();

      setTimeout(() => {
        toast.classList.remove('show');
      }, 2500);
    } catch (err) {
      console.warn('Clipboard failed:', err);
    }
  });
}

/* =========================================================
   MOBILE NAVIGATION
========================================================= */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const drawer = document.getElementById('mobileDrawer');
  if (!toggleBtn || !drawer) return;

  function closeDrawer() {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    toggleBtn.classList.remove('active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function openDrawer() {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    toggleBtn.classList.add('active');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  drawer.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Close drawer on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/* =========================================================
   CYBER CONSOLE GREETING
========================================================= */
function printCyberBanner() {
  console.log(
    '%c [MUZGUY // ROHIT] %c SYSTEM ONLINE // CSE STUDENT & BUILDER ',
    'background: #00f0ff; color: #030307; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
    'background: #14142b; color: #8b5cf6; font-weight: bold; padding: 4px 8px; border-radius: 4px;'
  );
  console.log(
    '%cPortfolio initialized with Three.js WebGL & Lenis Smooth Motion.',
    'color: #9496a8; font-size: 11px;'
  );
}
