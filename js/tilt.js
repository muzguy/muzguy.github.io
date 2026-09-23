/**
 * TILT.JS
 * 3D Perspective Tilt and Specular Spotlight Glare Engine.
 * Adds tactile depth to cards on desktop.
 */

class CardTiltEngine {
  constructor(selector = '.glass-card') {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    this.cards = document.querySelectorAll(selector);
    this.init();
  }

  init() {
    this.cards.forEach((card) => {
      // Ensure card-glare element exists
      if (!card.querySelector('.card-glare')) {
        const glare = document.createElement('div');
        glare.className = 'card-glare';
        card.appendChild(glare);
      }

      let bounds;

      const onMouseEnter = () => {
        bounds = card.getBoundingClientRect();
      };

      const onMouseMove = (e) => {
        if (!bounds) bounds = card.getBoundingClientRect();

        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;

        const percentX = (mouseX / bounds.width - 0.5) * 2;
        const percentY = (mouseY / bounds.height - 0.5) * 2;

        const maxTilt = 8; // degrees
        const tiltX = -percentY * maxTilt;
        const tiltY = percentX * maxTilt;

        card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.setProperty('--mouse-x', `${mouseX}px`);
        card.style.setProperty('--mouse-y', `${mouseY}px`);
      };

      const onMouseLeave = () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => {
          card.style.transition = '';
        }, 500);
      };

      card.addEventListener('mouseenter', onMouseEnter);
      card.addEventListener('mousemove', onMouseMove, { passive: true });
      card.addEventListener('mouseleave', onMouseLeave);
    });
  }
}

window.initCardTilt = function() {
  return new CardTiltEngine('.glass-card');
};
