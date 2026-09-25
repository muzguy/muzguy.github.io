/**
 * WEBGL-BACKGROUND.JS
 * High-performance Three.js interactive 3D particle constellation & neural warp.
 * Features mouse gravity, scroll depth parallax, dynamic theme palettes, and battery saver pause.
 */

const THEME_PALETTES = {
  webgl: {
    dark: [
      new THREE.Color(0x00f0ff), // Cyber Cyan
      new THREE.Color(0x8b5cf6), // Neon Purple
      new THREE.Color(0xec4899), // Plasma Pink
      new THREE.Color(0xffffff)  // Pure White
    ],
    light: [
      new THREE.Color(0x0284c7), // Cyan/Sky
      new THREE.Color(0x7c3aed), // Deep Purple
      new THREE.Color(0xdb2777), // Deep Pink
      new THREE.Color(0x0f172a)  // Slate Obsidian
    ],
    line1: { r: 0.0, g: 0.94, b: 1.0 },
    line2: { r: 0.55, g: 0.36, b: 0.96 },
    lineLight1: { r: 0.01, g: 0.52, b: 0.78 },
    lineLight2: { r: 0.49, g: 0.23, b: 0.93 }
  },
  desert: {
    dark: [
      new THREE.Color(0xfbbf24), // Amber Gold
      new THREE.Color(0xf59e0b), // Amber
      new THREE.Color(0xea580c), // Flame Orange
      new THREE.Color(0xfef3c7)  // Warm Sand White
    ],
    light: [
      new THREE.Color(0xd97706), // Rich Amber
      new THREE.Color(0xc2410c), // Solar Flame
      new THREE.Color(0xb45309), // Dark Ochre
      new THREE.Color(0x78350f)  // Deep Sienna
    ],
    line1: { r: 0.98, g: 0.75, b: 0.14 },
    line2: { r: 0.92, g: 0.35, b: 0.05 },
    lineLight1: { r: 0.85, g: 0.47, b: 0.02 },
    lineLight2: { r: 0.76, g: 0.25, b: 0.05 }
  },
  driveby: {
    dark: [
      new THREE.Color(0xff1a53), // Electric Crimson
      new THREE.Color(0xd946ef), // Electric Magenta
      new THREE.Color(0xf43f5e), // Rose Neon
      new THREE.Color(0xffe4e6)  // Crystal Rose White
    ],
    light: [
      new THREE.Color(0xe11d48), // Deep Rose Red
      new THREE.Color(0xc026d3), // Rich Magenta
      new THREE.Color(0xbe123c), // Crimson
      new THREE.Color(0x881337)  // Deep Burgundy
    ],
    line1: { r: 1.0, g: 0.10, b: 0.33 },
    line2: { r: 0.85, g: 0.27, b: 0.94 },
    lineLight1: { r: 0.88, g: 0.11, b: 0.28 },
    lineLight2: { r: 0.75, g: 0.15, b: 0.83 }
  },
  flow: {
    dark: [
      new THREE.Color(0x10b981), // Emerald
      new THREE.Color(0x05df72), // Neon Mint
      new THREE.Color(0x34d399), // Jade
      new THREE.Color(0xecfdf5)  // Mint White
    ],
    light: [
      new THREE.Color(0x059669), // Rich Emerald
      new THREE.Color(0x047857), // Deep Jade
      new THREE.Color(0x10b981), // Vivid Green
      new THREE.Color(0x064e3b)  // Deep Forest Green
    ],
    line1: { r: 0.06, g: 0.72, b: 0.51 },
    line2: { r: 0.02, g: 0.87, b: 0.45 },
    lineLight1: { r: 0.02, g: 0.59, b: 0.41 },
    lineLight2: { r: 0.02, g: 0.47, b: 0.34 }
  }
};

class WebGLBackground {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas || typeof THREE === 'undefined') {
      console.warn('Three.js or Canvas element not found.');
      return;
    }

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particles = null;
    this.lineMesh = null;

    const config = this.getResponsiveConfig();
    this.particleCount = config.count;
    this.bounds = config.bounds;
    this.maxDistance = config.maxDistance;
    this.particlePositions = null;
    this.particleVelocities = [];

    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.scrollProgress = 0;
    this.targetScrollProgress = 0;
    this.isRunning = true;
    this.isModeActive = true;
    this.wasRunningBeforeHidden = false;
    this.animationFrameId = null;

    this.currentTheme = document.documentElement.getAttribute('data-theme') || 'webgl';
    this.currentMode = document.documentElement.getAttribute('data-mode') || 'dark';
    this.activeLineColor1 = { r: 0.0, g: 0.94, b: 1.0 };
    this.activeLineColor2 = { r: 0.55, g: 0.36, b: 0.96 };

    this.init();
  }

  getResponsiveConfig() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;

    const cameraZ = 650;
    const vFOV = (60 * Math.PI) / 180;
    const visibleHeight = 2 * Math.tan(vFOV / 2) * cameraZ;
    const visibleWidth = visibleHeight * (width / height);

    // Responsive particle count: fewer on mobile, but all guaranteed inside visible viewport
    const count = isMobile ? 55 : (isTablet ? 95 : 155);

    // Dynamic bounds matching exact viewport dimensions with safe perimeter margin
    const bounds = {
      x: visibleWidth * 0.54,
      y: visibleHeight * 0.54,
      z: 220
    };

    // Connection distance scales naturally with viewport width on mobile
    const maxDistance = isMobile
      ? Math.max(85, Math.min(visibleWidth * 0.28, 105))
      : 135;

    return { isMobile, isTablet, count, bounds, maxDistance, visibleWidth, visibleHeight };
  }

  init() {
    const isMobile = window.innerWidth < 768;

    // 1. Scene & Camera setup
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      2000
    );
    this.camera.position.z = 650;

    // 2. WebGL Renderer with alpha transparency & antialiasing
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));

    // 3. Create Particle Field
    this.createParticles();

    // 4. Apply initial theme colors immediately
    this.setTheme(this.currentTheme, this.currentMode);

    // 5. Bind events
    this.bindEvents();

    // 6. Start Render Loop (unless user prefers reduced motion)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.renderer.render(this.scene, this.camera);
    } else {
      this.render();
    }
  }

  createParticles() {
    const config = this.getResponsiveConfig();
    this.particleCount = config.count;
    this.bounds = config.bounds;
    this.maxDistance = config.maxDistance;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);
    const colors = new Float32Array(this.particleCount * 3);
    this.particleVelocities = [];

    const isLight = this.currentMode === 'light';

    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 2 * this.bounds.x;
      positions[i3 + 1] = (Math.random() - 0.5) * 2 * this.bounds.y;
      positions[i3 + 2] = (Math.random() - 0.5) * 2 * this.bounds.z;

      // Gentle responsive velocities
      const speedFactor = config.isMobile ? 0.30 : 0.42;
      this.particleVelocities.push({
        x: (Math.random() - 0.5) * speedFactor,
        y: (Math.random() - 0.5) * speedFactor,
        z: (Math.random() - 0.5) * speedFactor * 0.6
      });

      colors[i3] = 0.0;
      colors[i3 + 1] = 0.94;
      colors[i3 + 2] = 1.0;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    this.particlePositions = positions;

    // Glowing particle texture
    const particleTexture = this.generateParticleTexture();

    const particleSize = config.isMobile 
      ? (isLight ? 3.5 : 3.2)
      : (isLight ? 4.8 : 4.2);

    const particleMaterial = new THREE.PointsMaterial({
      size: particleSize,
      map: particleTexture,
      transparent: true,
      opacity: isLight ? 0.88 : 0.82,
      vertexColors: true,
      blending: isLight ? THREE.NormalBlending : THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particles = new THREE.Points(geometry, particleMaterial);
    this.scene.add(this.particles);

    // Dynamic Line Mesh connecting nearby nodes
    const maxLineSegments = (this.particleCount * (this.particleCount - 1)) / 2;
    const linePositions = new Float32Array(maxLineSegments * 6);
    const lineColors = new Float32Array(maxLineSegments * 6);

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: isLight ? 0.26 : 0.20,
      blending: isLight ? THREE.NormalBlending : THREE.AdditiveBlending,
      depthWrite: false
    });

    this.lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    this.scene.add(this.lineMesh);
  }

  generateParticleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.25, 'rgba(255, 255, 255, 0.9)');
    gradient.addColorStop(0.55, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  bindEvents() {
    window.addEventListener('resize', () => this.onResize(), { passive: true });
    window.addEventListener('orientationchange', () => setTimeout(() => this.onResize(), 100), { passive: true });

    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    // Touch interaction for mobile devices
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        this.mouse.targetX = (e.touches[0].clientX / window.innerWidth - 0.5) * 1.5;
        this.mouse.targetY = -(e.touches[0].clientY / window.innerHeight - 0.5) * 1.5;
      }
    }, { passive: true });

    window.addEventListener('scroll', () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      this.targetScrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    }, { passive: true });

    // Pause WebGL rendering when tab is hidden or phone screen is locked to save battery
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (this.isRunning) {
          this.wasRunningBeforeHidden = true;
          this.pause();
        }
      } else if (this.wasRunningBeforeHidden) {
        this.wasRunningBeforeHidden = false;
        this.resume();
      }
    });

    // Respect prefers-reduced-motion changes dynamically
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionQuery.addEventListener('change', () => {
      if (motionQuery.matches) {
        this.pause();
      } else {
        this.resume();
      }
    });
  }

  onResize() {
    if (!this.camera || !this.renderer) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMobile = width < 768;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));

    const config = this.getResponsiveConfig();
    this.bounds = config.bounds;
    this.maxDistance = config.maxDistance;

    // Rescale out-of-bounds particles immediately so constellation stays full on mobile
    if (this.particles && this.particlePositions) {
      const positions = this.particles.geometry.attributes.position.array;
      for (let i = 0; i < this.particleCount; i++) {
        const i3 = i * 3;
        if (Math.abs(positions[i3]) > this.bounds.x) {
          positions[i3] = (Math.random() - 0.5) * 2 * this.bounds.x;
        }
        if (Math.abs(positions[i3 + 1]) > this.bounds.y) {
          positions[i3 + 1] = (Math.random() - 0.5) * 2 * this.bounds.y;
        }
      }
      this.particles.geometry.attributes.position.needsUpdate = true;
    }
  }

  render() {
    if (!this.isRunning) return;

    // Autonomous subtle harmonic drift so field breathes on mobile when idle
    const time = performance.now() * 0.0006;
    const autoX = Math.sin(time) * 0.15;
    const autoY = Math.cos(time * 0.8) * 0.12;

    // Smooth lerp mouse & scroll
    this.mouse.x += (this.mouse.targetX + autoX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY + autoY - this.mouse.y) * 0.05;
    this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * 0.08;

    // Subtle camera drift based on mouse & scroll depth
    this.camera.position.x = this.mouse.x * 60;
    this.camera.position.y = this.mouse.y * 60;
    this.camera.position.z = 650 - this.scrollProgress * 250;
    this.camera.lookAt(this.scene.position);

    // Particle update and connection calculation
    if (this.particles && this.lineMesh) {
      const positions = this.particles.geometry.attributes.position.array;
      const linePositions = this.lineMesh.geometry.attributes.position.array;
      const lineColors = this.lineMesh.geometry.attributes.color.array;

      let lineVertexCount = 0;

      for (let i = 0; i < this.particleCount; i++) {
        const i3 = i * 3;

        // Apply velocity
        positions[i3] += this.particleVelocities[i].x;
        positions[i3 + 1] += this.particleVelocities[i].y;
        positions[i3 + 2] += this.particleVelocities[i].z;

        // Bounce back within dynamic responsive bounds
        if (Math.abs(positions[i3]) > this.bounds.x) this.particleVelocities[i].x *= -1;
        if (Math.abs(positions[i3 + 1]) > this.bounds.y) this.particleVelocities[i].y *= -1;
        if (Math.abs(positions[i3 + 2]) > this.bounds.z) this.particleVelocities[i].z *= -1;

        // Connect lines between nearby nodes
        for (let j = i + 1; j < this.particleCount; j++) {
          const j3 = j * 3;
          const dx = positions[i3] - positions[j3];
          const dy = positions[i3 + 1] - positions[j3 + 1];
          const dz = positions[i3 + 2] - positions[j3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < this.maxDistance) {
            linePositions[lineVertexCount * 3] = positions[i3];
            linePositions[lineVertexCount * 3 + 1] = positions[i3 + 1];
            linePositions[lineVertexCount * 3 + 2] = positions[i3 + 2];

            lineColors[lineVertexCount * 3] = this.activeLineColor1.r;
            lineColors[lineVertexCount * 3 + 1] = this.activeLineColor1.g;
            lineColors[lineVertexCount * 3 + 2] = this.activeLineColor1.b;
            lineVertexCount++;

            linePositions[lineVertexCount * 3] = positions[j3];
            linePositions[lineVertexCount * 3 + 1] = positions[j3 + 1];
            linePositions[lineVertexCount * 3 + 2] = positions[j3 + 2];

            lineColors[lineVertexCount * 3] = this.activeLineColor2.r;
            lineColors[lineVertexCount * 3 + 1] = this.activeLineColor2.g;
            lineColors[lineVertexCount * 3 + 2] = this.activeLineColor2.b;
            lineVertexCount++;
          }
        }
      }

      this.particles.geometry.attributes.position.needsUpdate = true;
      this.lineMesh.geometry.setDrawRange(0, lineVertexCount);
      this.lineMesh.geometry.attributes.position.needsUpdate = true;
      this.lineMesh.geometry.attributes.color.needsUpdate = true;

      // Slow orbital rotation
      this.particles.rotation.y += 0.0006;
      this.lineMesh.rotation.y += 0.0006;
    }

    this.renderer.render(this.scene, this.camera);
    this.animationFrameId = requestAnimationFrame(() => this.render());
  }

  setTheme(themeName, mode = 'dark') {
    this.currentTheme = themeName || 'webgl';
    this.currentMode = mode || 'dark';

    const paletteObj = THEME_PALETTES[this.currentTheme] || THEME_PALETTES.webgl;
    const isLight = this.currentMode === 'light';
    const colorChoices = isLight ? paletteObj.light : paletteObj.dark;

    // Update dynamic line colors
    this.activeLineColor1 = isLight ? paletteObj.lineLight1 : paletteObj.line1;
    this.activeLineColor2 = isLight ? paletteObj.lineLight2 : paletteObj.line2;

    // Adapt material blending and opacity for crisp contrast in light mode
    const isMobile = window.innerWidth < 768;
    if (this.particles && this.particles.material) {
      if (isLight) {
        this.particles.material.blending = THREE.NormalBlending;
        this.particles.material.opacity = 0.9;
        this.particles.material.size = isMobile ? 3.5 : 4.8;
      } else {
        this.particles.material.blending = THREE.AdditiveBlending;
        this.particles.material.opacity = 0.85;
        this.particles.material.size = isMobile ? 3.2 : 4.2;
      }
      this.particles.material.needsUpdate = true;
    }

    if (this.lineMesh && this.lineMesh.material) {
      if (isLight) {
        this.lineMesh.material.blending = THREE.NormalBlending;
        this.lineMesh.material.opacity = 0.28;
      } else {
        this.lineMesh.material.blending = THREE.AdditiveBlending;
        this.lineMesh.material.opacity = 0.22;
      }
      this.lineMesh.material.needsUpdate = true;
    }

    // Refresh particle colors buffer
    if (this.particles && this.particles.geometry) {
      const colors = this.particles.geometry.attributes.color.array;
      for (let i = 0; i < this.particleCount; i++) {
        const i3 = i * 3;
        const chosenColor = colorChoices[i % colorChoices.length];
        colors[i3] = chosenColor.r;
        colors[i3 + 1] = chosenColor.g;
        colors[i3 + 2] = chosenColor.b;
      }
      this.particles.geometry.attributes.color.needsUpdate = true;
    }
  }

  setMode(mode) {
    this.currentMode = mode || 'dark';
    this.setTheme(this.currentTheme, this.currentMode);
    const container = document.getElementById('bg-canvas-container');
    if (container) container.classList.remove('hidden');
    this.resume();
  }

  pause() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  resume() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.render();
  }
}

// Global initialization helper
window.initWebGLBackground = function() {
  return new WebGLBackground('three-canvas');
};
