/**
 * SMOOTH-SCROLL.JS
 * Smooth momentum scrolling using Lenis (with native fallback)
 * and IntersectionObserver scroll reveals.
 */

class ScrollController {
  constructor() {
    this.lenis = null;
    this.initLenis();
    this.initReveals();
    this.initAnchorLinks();
  }

  initLenis() {
    // Check if Lenis is loaded via CDN
    if (typeof Lenis !== 'undefined') {
      const isTouch = window.matchMedia('(pointer: coarse)').matches;
      this.lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        smoothTouch: false,
        syncTouch: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.0,
        infinite: false
      });

      const raf = (time) => {
        this.lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    } else {
      // Fallback smooth scroll
      document.documentElement.style.scrollBehavior = 'smooth';
    }
  }

  initReveals() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach((el) => observer.observe(el));
  }

  initAnchorLinks() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#' || !targetId) return;

        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          if (this.lenis) {
            this.lenis.scrollTo(targetEl, { offset: -80 });
          } else {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }

          // Close mobile drawer if open
          const mobileDrawer = document.getElementById('mobileDrawer');
          if (mobileDrawer && mobileDrawer.classList.contains('open')) {
            mobileDrawer.classList.remove('open');
          }
        }
      });
    });
  }
}

window.initScrollController = function() {
  return new ScrollController();
};
