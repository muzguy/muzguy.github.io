/**
 * CURSOR.JS
 * Dual-stage magnetic cursor with requestAnimationFrame lerp smoothing,
 * dynamic contextual morphing, and interactive click particle burst.
 */

class FuturisticCursor {
  constructor() {
    // Only initialize on desktop / pointer:fine devices
    if (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 1024) {
      return;
    }

    this.dot = document.getElementById('custom-cursor-dot');
    this.ring = document.getElementById('custom-cursor-ring');
    this.label = this.ring ? this.ring.querySelector('.cursor-label') : null;

    if (!this.dot || !this.ring) return;

    document.body.classList.add('has-custom-cursor');

    this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.dotPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.ringPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    this.targetScale = 1;
    this.currentScale = 1;
    this.isVisible = false;

    this.init();
  }

  init() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      if (!this.isVisible) {
        this.isVisible = true;
        this.dot.style.opacity = '1';
        this.ring.style.opacity = '1';
      }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      this.isVisible = false;
      this.dot.style.opacity = '0';
      this.ring.style.opacity = '0';
    });

    // Click wave burst
    window.addEventListener('mousedown', (e) => {
      this.createClickBurst(e.clientX, e.clientY);
      this.ring.style.transform = `translate(-50%, -50%) scale(0.85)`;
    });

    window.addEventListener('mouseup', () => {
      this.ring.style.transform = `translate(-50%, -50%) scale(1)`;
    });

    // Setup magnetic hover listeners on interactive elements
    this.setupHoverTargets();

    // Start render loop
    this.loop();
  }

  setupHoverTargets() {
    // Links, buttons, interactive tags
    const links = document.querySelectorAll('a, button, .tech-pill, .atmo-btn, .audio-toggle-btn');
    links.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover-link');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover-link');
      });
    });

    // Project cards
    const cards = document.querySelectorAll('.project-card');
    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover-card');
        if (this.label) this.label.textContent = 'EXPLORE';
      });
      card.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover-card');
      });
    });
  }

  createClickBurst(x, y) {
    const burst = document.createElement('div');
    burst.style.position = 'fixed';
    burst.style.left = `${x}px`;
    burst.style.top = `${y}px`;
    burst.style.width = '10px';
    burst.style.height = '10px';
    burst.style.borderRadius = '50%';
    burst.style.border = '2px solid rgba(0, 240, 255, 0.9)';
    burst.style.transform = 'translate(-50%, -50%) scale(1)';
    burst.style.pointerEvents = 'none';
    burst.style.zIndex = '9998';
    burst.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease';
    burst.style.opacity = '1';

    document.body.appendChild(burst);

    requestAnimationFrame(() => {
      burst.style.transform = 'translate(-50%, -50%) scale(5)';
      burst.style.opacity = '0';
    });

    setTimeout(() => {
      if (burst.parentNode) burst.parentNode.removeChild(burst);
    }, 500);
  }

  loop() {
    // Lerp dot
    this.dotPos.x += (this.mouse.x - this.dotPos.x) * 0.75;
    this.dotPos.y += (this.mouse.y - this.dotPos.y) * 0.75;
    this.dot.style.left = `${this.dotPos.x}px`;
    this.dot.style.top = `${this.dotPos.y}px`;

    // Lerp ring with fluid lag
    this.ringPos.x += (this.mouse.x - this.ringPos.x) * 0.16;
    this.ringPos.y += (this.mouse.y - this.ringPos.y) * 0.16;
    this.ring.style.left = `${this.ringPos.x}px`;
    this.ring.style.top = `${this.ringPos.y}px`;

    requestAnimationFrame(() => this.loop());
  }
}

window.initCustomCursor = function() {
  return new FuturisticCursor();
};
