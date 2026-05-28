/**
 * ============================================================
 * BAILEY APLICATIVOS — Configuração Dinâmica do Ecossistema
 * v5.0 - Sistema Solar + Escala Mobile
 * ============================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(MotionPathPlugin);

  const container = document.getElementById('branches-container');
  const svgElement = document.getElementById('network-svg');
  const CYCLE_TIME = 4000;

  if (!container || !svgElement) return;

  // ─── MENU MOBILE ────────────────────────────────────────────────
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileNav    = document.getElementById('mobile-nav');

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('is-open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      // Anima as 3 barras do hambúrguer
      const bars = mobileToggle.querySelectorAll('span');
      if (isOpen) {
        bars[0].style.transform = 'translateY(7px) rotate(45deg)';
        bars[1].style.opacity   = '0';
        bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        bars[0].style.transform = '';
        bars[1].style.opacity   = '';
        bars[2].style.transform = '';
      }
    });

    // Fecha o menu ao clicar em qualquer link do nav mobile
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('is-open');
        const bars = mobileToggle.querySelectorAll('span');
        bars.forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
      });
    });
  }

  // Configuração dos Ramos do Ecossistema
  const branches = [
    {
      id: 'delivery',
      categoryName: "App Deliverys",
      angle: 190,
      distance: 290,
      apps: [
        { name: 'iFood',  icon: 'images/icons/ifood.png',   isImage: true, bg: '#EA1D2C', color: '#FFF' },
        { name: '99Food', icon: 'images/icons/99food.png',   isImage: true, bg: '#FFC400', color: '#000' },
        { name: 'Keeta',  icon: 'images/icons/keeta.png',    isImage: true, bg: '#FF7A00', color: '#FFF' }
      ]
    },
    {
      id: 'automacoes',
      categoryName: "Automações",
      angle: 220,
      distance: 270,
      apps: [
        { name: 'Python',    icon: 'images/icons/python.png',    isImage: true, bg: '#c8a22a', color: '#FFF' },
        { name: 'Oracle VM', icon: 'images/icons/oracle-vm.png', isImage: true, bg: '#00758F', color: '#FFF' }
      ]
    },
    {
      id: 'ferramentas',
      categoryName: "Ferramentas",
      angle: 320,
      distance: 270,
      apps: [
        { name: 'Canva',     icon: 'images/icons/canva.png',    isImage: true, bg: '#4828b4', color: '#FFF' },
        { name: 'AnyDesk',     icon: 'images/icons/anydesk.png',    isImage: true, bg: '#bf2f28', color: '#FFF' }
      ]
    },
    {
      id: 'inteligencia',
      categoryName: "Inteligência Artificial",
      angle: 160,
      distance: 270,
      apps: [
        { name: 'ChatGPT', icon: 'images/icons/chatgpt.png', isImage: true, bg: '#10A37F', color: '#FFF' },
        { name: 'Gemini',  icon: 'images/icons/gemini.png',  isImage: true, bg: '#00758F', color: '#FFF' }
      ]
    },
    {
      id: 'comunicacao',
      categoryName: "Comunicação",
      angle: 30,
      distance: 290,
      apps: [
        { name: 'WhatsApp', icon: 'fab fa-whatsapp', bg: '#25D366', color: '#FFF' },
        { name: 'Meta',     icon: 'fab fa-meta',     bg: '#0064E0', color: '#FFF' }
      ]
    },
    {
      id: 'sistemas',
      categoryName: "Sistemas Internos",
      angle: 360,
      distance: 280,
      apps: [
        { name: 'Bailey PDV',    icon: 'fas fa-desktop',  bg: '#7c3aed', color: '#FFF' },
        { name: 'Cardápio Dig.', icon: 'fas fa-utensils', bg: '#4ade80', color: '#000' }
      ]
    }
  ];

  // ─── FILTRO GLOW NEON ───────────────────────────────────────────
  function createGlowFilter() {
    const defs   = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', 'purplePulseGlow');
    filter.setAttribute('x', '-50%'); filter.setAttribute('y', '-50%');
    filter.setAttribute('width', '200%'); filter.setAttribute('height', '200%');

    const blur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
    blur.setAttribute('stdDeviation', '3');
    blur.setAttribute('result', 'coloredBlur');

    const merge  = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
    const mNode1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    mNode1.setAttribute('in', 'coloredBlur');
    const mNode2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    mNode2.setAttribute('in', 'SourceGraphic');

    merge.appendChild(mNode1); merge.appendChild(mNode2);
    filter.appendChild(blur);  filter.appendChild(merge);
    defs.appendChild(filter);
    svgElement.appendChild(defs);
  }

  // ─── ECOSSISTEMA (com escala mobile) ───────────────────────────
  function buildEcosystem() {
    const centerX = container.offsetWidth  / 2;
    const centerY = container.offsetHeight / 2;

    // Fator de escala: 1 no desktop, reduz proporcionalmente no mobile
    // Referência: 1000px de largura = escala 1.0
    const scaleFactor = Math.min(1, container.offsetWidth / 1000);

    createGlowFilter();

    branches.forEach((branch, index) => {
      const rad      = (branch.angle * Math.PI) / 180;
      const distance = branch.distance * scaleFactor;
      const appOffX  = 145 * scaleFactor;

      const catX = centerX + Math.cos(rad) * distance;
      const catY = centerY + Math.sin(rad) * distance;
      const isRightSide = Math.cos(rad) > 0;
      const appX = catX + (isRightSide ? appOffX : -appOffX);
      const appY = catY;

      // Curva S para a linha principal
      const controlX1 = centerX + (catX - centerX) / 2;
      const controlY1 = centerY;
      const controlX2 = centerX + (catX - centerX) / 2;
      const controlY2 = catY;

      const path   = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const pathId = `route-${branch.id}`;
      path.setAttribute('id', pathId);
      path.setAttribute('d', `M ${centerX} ${centerY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${catX} ${catY}`);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', 'rgba(74, 222, 128, 0.15)');
      path.setAttribute('stroke-width', '1.5');
      svgElement.appendChild(path);

      // Linha horizontal até o app pill
      const shortLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      shortLine.setAttribute('x1', catX); shortLine.setAttribute('y1', catY);
      shortLine.setAttribute('x2', appX); shortLine.setAttribute('y2', appY);
      shortLine.setAttribute('stroke', 'rgba(74, 222, 128, 0.3)');
      shortLine.setAttribute('stroke-width', '1');
      svgElement.appendChild(shortLine);

      // Ponto de junção
      const jointDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      jointDot.setAttribute('cx', catX); jointDot.setAttribute('cy', catY);
      jointDot.setAttribute('r', '2.5'); jointDot.setAttribute('fill', '#4ade80');
      svgElement.appendChild(jointDot);

      // Pílula de Categoria
      const pillOffset = Math.max(32, 48 * scaleFactor);
      const catNode = document.createElement('div');
      catNode.className = 'branch-node category-pill';
      catNode.style.left = `${catX + (isRightSide ? -pillOffset : pillOffset)}px`;
      catNode.style.top  = `${catY}px`;
      catNode.innerHTML  = isRightSide
        ? `<span class="w-1.5 h-1.5 bg-bailey-green rounded-full shadow-[0_0_5px_#4ade80] flex-shrink-0"></span> ${branch.categoryName}`
        : `${branch.categoryName} <span class="w-1.5 h-1.5 bg-bailey-green rounded-full shadow-[0_0_5px_#4ade80] flex-shrink-0"></span>`;
      container.appendChild(catNode);

      // Pílula do App (rotativa)
      const appNode = document.createElement('div');
      appNode.className = 'branch-node app-pill';
      appNode.style.left = `${appX}px`;
      appNode.style.top  = `${appY}px`;
      container.appendChild(appNode);

      startAppCycle(appNode, branch.apps);

      // Flutuação orgânica
      gsap.to([catNode, appNode], {
        y: '+=6',
        duration: 2.5 + Math.random() * 1.5,
        repeat: -1, yoyo: true,
        ease: "sine.inOut"
      });

      // Bolinha roxa percorrendo a linha
      setTimeout(() => {
        const energyBall = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        energyBall.setAttribute('r', '3.5');
        energyBall.setAttribute('fill', '#a855f7');
        energyBall.setAttribute('style', 'filter: url(#purplePulseGlow);');
        svgElement.appendChild(energyBall);

        gsap.timeline({ repeat: -1, delay: index * 0.6 })
          .fromTo(energyBall, { opacity: 0 }, { opacity: 1, duration: 0.2 })
          .to(energyBall, {
            duration: 2.2 + Math.random() * 0.8,
            ease: "power1.inOut",
            motionPath: {
              path: `#${pathId}`,
              align: `#${pathId}`,
              alignOrigin: [0.5, 0.5]
            }
          })
          .to(energyBall, { opacity: 0, duration: 0.2 });
      }, 100);
    });
  }

  function startAppCycle(nodeElement, appsArray) {
    let currentIndex = 0;

    function renderApp() {
      const app = appsArray[currentIndex];
      gsap.to(nodeElement, { opacity: 0, duration: 0.3, onComplete: () => {
        nodeElement.style.backgroundColor = app.bg;
        nodeElement.style.color           = app.color;
        nodeElement.style.boxShadow       = `0 0 20px ${app.bg}40`;
        const media = app.isImage
          ? `<div class="app-icon-box"><img src="${app.icon}" alt="${app.name}"></div>`
          : `<div class="app-icon-box" style="color:${app.color};"><i class="${app.icon}"></i></div>`;
        nodeElement.innerHTML = `${media}<span>${app.name}</span>`;
        gsap.to(nodeElement, { opacity: 1, duration: 0.3 });
        currentIndex = (currentIndex + 1) % appsArray.length;
      }});
    }

    renderApp();
    if (appsArray.length > 1) setInterval(renderApp, CYCLE_TIME);
  }

  // ─── CANVAS DO HUB CENTRAL ──────────────────────────────────────
  function initHubCanvas() {
    // Inicializa todos os canvas do hub (desktop + mobile usam o mesmo id via querySelectorAll)
    const allBgCanvases  = document.querySelectorAll('#hub-bg-canvas, .hub-bg-canvas-mobile');
    const bgCanvas       = document.getElementById('hub-bg-canvas');
    const auraCanvas     = document.getElementById('hub-aura-canvas');
    const viewport       = document.getElementById('ecosystem-viewport');
    if (!bgCanvas || !auraCanvas || !viewport) return;

    const bgCtx   = bgCanvas.getContext('2d');
    bgCanvas.width = bgCanvas.height = 120;

    const auraCtx   = auraCanvas.getContext('2d');
    auraCanvas.width = auraCanvas.height = 260;

    let targetMX = 0, targetMY = 0, smoothMX = 0, smoothMY = 0;

    viewport.addEventListener('mousemove', e => {
      const r = viewport.getBoundingClientRect();
      targetMX = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
      targetMY = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
    });
    viewport.addEventListener('mouseleave', () => { targetMX = targetMY = 0; });

    const orbitRings = [
      { r: 72,  speed:  0.003,  phase: 0,   dashLen: 18, gap: 10, opacity: 0.55, width: 1.2 },
      { r: 88,  speed: -0.002,  phase: 1.2, dashLen: 28, gap: 14, opacity: 0.35, width: 0.8 },
      { r: 105, speed:  0.0015, phase: 2.5, dashLen: 40, gap: 20, opacity: 0.22, width: 0.7 },
    ];

    const particles = Array.from({ length: 12 }, () => ({
      angle:  Math.random() * Math.PI * 2,
      radius: 18 + Math.random() * 38,
      speed:  (Math.random() - 0.5) * 0.012,
      size:   1 + Math.random() * 1.5,
      opacity: 0.3 + Math.random() * 0.5,
    }));

    let time = 0;

    function drawBgCanvas() {
      const w = 120, h = 120, cx = 60, cy = 60;
      bgCtx.clearRect(0, 0, w, h);
      const ox = smoothMX * 14, oy = smoothMY * 14;
      const grad = bgCtx.createRadialGradient(cx + ox, cy + oy, 2, cx, cy, 62);
      grad.addColorStop(0,   'rgba(124,58,237,0.45)');
      grad.addColorStop(0.4, 'rgba(90,30,180,0.22)');
      grad.addColorStop(1,   'rgba(5,8,6,0)');
      bgCtx.fillStyle = grad;
      bgCtx.beginPath(); bgCtx.arc(cx, cy, 60, 0, Math.PI * 2); bgCtx.fill();

      particles.forEach(p => {
        p.angle += p.speed;
        const px = cx + Math.cos(p.angle) * p.radius + smoothMX * 6;
        const py = cy + Math.sin(p.angle) * p.radius + smoothMY * 6;
        bgCtx.beginPath();
        bgCtx.arc(px, py, p.size, 0, Math.PI * 2);
        bgCtx.fillStyle = `rgba(168,85,247,${p.opacity})`;
        bgCtx.fill();
      });
    }

    function drawAuraCanvas() {
      const w = 260, h = 260, cx = 130, cy = 130;
      auraCtx.clearRect(0, 0, w, h);
      const offsetX = smoothMX * 10, offsetY = smoothMY * 10;

      orbitRings.forEach(ring => {
        ring.phase += ring.speed;
        const tiltX = 1 + smoothMX * 0.18, tiltY = 1 + smoothMY * 0.18;
        auraCtx.save();
        auraCtx.translate(cx + offsetX * 0.4, cy + offsetY * 0.4);
        auraCtx.scale(tiltX, tiltY);
        auraCtx.rotate(ring.phase);
        auraCtx.beginPath(); auraCtx.arc(0, 0, ring.r, 0, Math.PI * 2);
        auraCtx.setLineDash([ring.dashLen, ring.gap]);
        auraCtx.strokeStyle = `rgba(124,58,237,${ring.opacity})`;
        auraCtx.lineWidth = ring.width; auraCtx.stroke();
        auraCtx.setLineDash([]); auraCtx.restore();
      });

      const glowAngle = time * 0.8 + smoothMX * 1.5;
      const gx = cx + Math.cos(glowAngle) * 72 + offsetX * 0.3;
      const gy = cy + Math.sin(glowAngle) * 72 + offsetY * 0.3;
      const gGrad = auraCtx.createRadialGradient(gx, gy, 0, gx, gy, 7);
      gGrad.addColorStop(0, 'rgba(168,85,247,0.9)');
      gGrad.addColorStop(1, 'rgba(124,58,237,0)');
      auraCtx.beginPath(); auraCtx.arc(gx, gy, 7, 0, Math.PI * 2);
      auraCtx.fillStyle = gGrad; auraCtx.fill();
    }

    function loop() {
      time += 0.016;
      smoothMX += (targetMX - smoothMX) * 0.06;
      smoothMY += (targetMY - smoothMY) * 0.06;
      drawBgCanvas(); drawAuraCanvas();
      requestAnimationFrame(loop);
    }
    loop();
  }

  // ─── SISTEMA SOLAR (FUNDO DO HERO) ─────────────────────────────
  function initSolarSystem() {
    const canvas = document.getElementById('solar-system-canvas');
    const hero   = document.getElementById('hero-section');
    if (!canvas || !hero) return;

    const ctx = canvas.getContext('2d');
    let W, H, cx, cy;

    function resize() {
      W = canvas.width  = hero.offsetWidth;
      H = canvas.height = hero.offsetHeight;
      cx = W / 2;
      cy = H / 2;
    }
    resize();

    // ── Estrelas ────────────────────────────────────────────────
    const stars = Array.from({ length: 160 }, () => ({
      x:     Math.random(),   // normalizado 0–1
      y:     Math.random(),
      r:     Math.random() * 1.3 + 0.2,
      base:  Math.random() * 0.45 + 0.08,
      phase: Math.random() * Math.PI * 2,
      spd:   Math.random() * 0.012 + 0.004,
    }));

    // ── Anéis orbitais (ellipse inclinada para efeito 3D suave) ──
    // rx/ry normalizados pelo menor lado (para escalar na tela)
    const orbits = [
      { rxR: 0.18, ryR: 0.09, tilt: 0.25,  rotSpd:  0.0006, dash: [22, 12], rgb: '74,222,128',  opacity: 0.13, lw: 1.3 },
      { rxR: 0.30, ryR: 0.15, tilt: -0.18, rotSpd: -0.0004, dash: [38, 20], rgb: '124,58,237',   opacity: 0.10, lw: 1.0 },
      { rxR: 0.43, ryR: 0.21, tilt: 0.12,  rotSpd:  0.0003, dash: [60, 30], rgb: '74,222,128',   opacity: 0.07, lw: 0.8 },
      { rxR: 0.58, ryR: 0.28, tilt: -0.08, rotSpd: -0.0002, dash: [90, 45], rgb: '168,85,247',   opacity: 0.05, lw: 0.6 },
    ];

    // ── Planetas ─────────────────────────────────────────────────
    const planetDefs = [
      { oi: 0, angle: 0.3,        spd:  0.009, r: 2.8, rgb: '74,222,128',  gr: 9  },
      { oi: 0, angle: Math.PI,    spd:  0.009, r: 2.0, rgb: '168,85,247',  gr: 7  },
      { oi: 1, angle: 1.1,        spd: -0.006, r: 3.8, rgb: '124,58,237',  gr: 12 },
      { oi: 1, angle: 3.8,        spd: -0.006, r: 2.2, rgb: '74,222,128',  gr: 8  },
      { oi: 2, angle: 2.4,        spd:  0.004, r: 3.2, rgb: '168,85,247',  gr: 10 },
      { oi: 2, angle: 5.1,        spd:  0.004, r: 1.8, rgb: '74,222,128',  gr: 6  },
      { oi: 3, angle: 0.8,        spd: -0.003, r: 2.5, rgb: '124,58,237',  gr: 8  },
      { oi: 3, angle: 4.2,        spd: -0.003, r: 1.5, rgb: '168,85,247',  gr: 5  },
    ];
    // Cópia mutable para os ângulos
    const planets = planetDefs.map(p => ({ ...p }));

    // Nebulosa central (gradiente radial estático)
    function drawNebula() {
      const maxR = Math.min(W, H) * 0.38;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
      g.addColorStop(0,    'rgba(124,58,237,0.07)');
      g.addColorStop(0.35, 'rgba(74,222,128,0.04)');
      g.addColorStop(1,    'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
      ctx.fill();
    }

    // Posição de um planeta na sua órbita elíptica inclinada
    function getPlanetPos(p) {
      const o = orbits[p.oi];
      const base = Math.min(W, H);
      const rx = o.rxR * base;
      const ry = o.ryR * base;
      // Ellipse with tilt rotation
      const ex = rx * Math.cos(p.angle);
      const ey = ry * Math.sin(p.angle);
      return {
        x: cx + ex * Math.cos(o.tilt) - ey * Math.sin(o.tilt),
        y: cy + ex * Math.sin(o.tilt) + ey * Math.cos(o.tilt),
      };
    }

    let animId;

    function draw() {
      ctx.clearRect(0, 0, W, H);

      drawNebula();

      // Estrelas
      stars.forEach(s => {
        s.phase += s.spd;
        const alpha = s.base * (0.5 + 0.5 * Math.sin(s.phase));
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
        ctx.fill();
      });

      // Anéis + planetas
      const base = Math.min(W, H);
      orbits.forEach((o, oi) => {
        o.tilt += o.rotSpd;
        const rx = o.rxR * base;
        const ry = o.ryR * base;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(o.tilt);
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.setLineDash(o.dash);
        ctx.strokeStyle = `rgba(${o.rgb},${o.opacity})`;
        ctx.lineWidth = o.lw;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        // Planetas neste anel
        planets.filter(p => p.oi === oi).forEach(p => {
          p.angle += p.spd;
          const pos = getPlanetPos(p);

          // Halo (glow)
          const gGrad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, p.gr);
          gGrad.addColorStop(0, `rgba(${p.rgb},0.75)`);
          gGrad.addColorStop(1, `rgba(${p.rgb},0)`);
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, p.gr, 0, Math.PI * 2);
          ctx.fillStyle = gGrad;
          ctx.fill();

          // Núcleo
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgb(${p.rgb})`;
          ctx.fill();
        });
      });

      animId = requestAnimationFrame(draw);
    }

    draw();

    window.addEventListener('resize', () => {
      cancelAnimationFrame(animId);
      resize();
      // Redistribui estrelas proporcionalmente
      stars.forEach(s => { s.x = Math.random(); s.y = Math.random(); });
      draw();
    });
  }

  // ─── INICIALIZAÇÃO ──────────────────────────────────────────────
  buildEcosystem();
  initHubCanvas();
  initSolarSystem();

  // Resize do ecossistema
  window.addEventListener('resize', () => {
    svgElement.innerHTML  = '';
    container.innerHTML   = '';
    buildEcosystem();
  });
});