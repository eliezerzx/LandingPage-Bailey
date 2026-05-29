/**
 * ============================================================
 * BAILEY APLICATIVOS v6.1 — CORRIGIDO
 * Fix: const branches movido para topo (TDZ bug)
 * Fix: initSectionAtmosphere com detecção mais robusta
 * ============================================================
 */

document.addEventListener("DOMContentLoaded", () => {

  // ══════════════════════════════════════════════════════════
  // CONSTANTES NO TOPO — evita erro de Temporal Dead Zone
  // (const NÃO é hoisted como function declaration)
  // ══════════════════════════════════════════════════════════
  const CYCLE_TIME = 4000;

  const branches = [
    {
      id: 'delivery', categoryName: "App Deliverys", angle: 190, distance: 290,
      apps: [
        { name: 'iFood',  icon: 'images/icons/ifood.png',  isImage: true, bg: '#EA1D2C', color: '#FFF' },
        { name: '99Food', icon: 'images/icons/99food.png', isImage: true, bg: '#FFC400', color: '#000' },
        { name: 'Keeta',  icon: 'images/icons/keeta.png',  isImage: true, bg: '#FF7A00', color: '#FFF' }
      ]
    },
    {
      id: 'automacoes', categoryName: "Automações", angle: 220, distance: 270,
      apps: [
        { name: 'Python',    icon: 'images/icons/python.png',    isImage: true, bg: '#c8a22a', color: '#FFF' },
        { name: 'Oracle VM', icon: 'images/icons/oracle-vm.png', isImage: true, bg: '#00758F', color: '#FFF' }
      ]
    },
    {
      id: 'ferramentas', categoryName: "Ferramentas", angle: 320, distance: 270,
      apps: [
        { name: 'Canva',   icon: 'images/icons/canva.png',   isImage: true, bg: '#4828b4', color: '#FFF' },
        { name: 'AnyDesk', icon: 'images/icons/anydesk.png', isImage: true, bg: '#bf2f28', color: '#FFF' }
      ]
    },
    {
      id: 'inteligencia', categoryName: "Inteligência Artificial", angle: 160, distance: 270,
      apps: [
        { name: 'ChatGPT', icon: 'images/icons/chatgpt.png', isImage: true, bg: '#10A37F', color: '#FFF' },
        { name: 'Gemini',  icon: 'images/icons/gemini.png',  isImage: true, bg: '#00758F', color: '#FFF' }
      ]
    },
    {
      id: 'comunicacao', categoryName: "Comunicação", angle: 30, distance: 290,
      apps: [
        { name: 'WhatsApp', icon: 'fab fa-whatsapp', bg: '#25D366', color: '#FFF' },
        { name: 'Meta',     icon: 'fab fa-meta',     bg: '#0064E0', color: '#FFF' }
      ]
    },
    {
      id: 'sistemas', categoryName: "Sistemas Internos", angle: 360, distance: 280,
      apps: [
        { name: 'Bailey PDV',    icon: 'fas fa-desktop',  bg: '#7c3aed', color: '#FFF' },
        { name: 'Cardápio Dig.', icon: 'fas fa-utensils', bg: '#4ade80', color: '#000' }
      ]
    }
  ];

  // ══════════════════════════════════════════════════════════
  // INICIALIZAÇÕES INDEPENDENTES
  // ══════════════════════════════════════════════════════════
  initMobileMenu();
  initSectionAtmosphere();
  initFAQ();

  // ══════════════════════════════════════════════════════════
  // ECOSSISTEMA
  // ══════════════════════════════════════════════════════════
  gsap.registerPlugin(MotionPathPlugin);

  const container  = document.getElementById('branches-container');
  const svgElement = document.getElementById('network-svg');

  if (container && svgElement) {
    buildEcosystem();
    initHubCanvas();

    window.addEventListener('resize', () => {
      svgElement.innerHTML = '';
      container.innerHTML  = '';
      buildEcosystem();
    });
  }

  initSolarSystem();

  // ══════════════════════════════════════════════════════════
  // DEFINIÇÕES DE FUNÇÕES
  // ══════════════════════════════════════════════════════════

  // ─── MENU MOBILE ────────────────────────────────────────────────
  function initMobileMenu() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const nav    = document.getElementById('mobile-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen);
      const bars = toggle.querySelectorAll('span');
      if (isOpen) {
        bars[0].style.transform = 'translateY(7px) rotate(45deg)';
        bars[1].style.opacity   = '0';
        bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        bars[0].style.transform = bars[2].style.transform = '';
        bars[1].style.opacity   = '';
      }
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        toggle.querySelectorAll('span').forEach(b => {
          b.style.transform = ''; b.style.opacity = '';
        });
      });
    });
  }

  // ─── ATMOSFERA POR SEÇÃO ────────────────────────────────────────
  function initSectionAtmosphere() {
    const sectionThemes = {
      'hero-section':            'atm-hero',
      'synchronization-section': 'atm-sync',
      'pdv-detail-section':      'atm-pdv',
      'resultados':              'atm-results',
      'faq-section':             'atm-faq',
      'pricing-section':         'atm-pricing',
    };

    let activeTheme = null;

    function activateTheme(themeName) {
      if (themeName === activeTheme) return;
      activeTheme = themeName;
      document.querySelectorAll('.atm-layer').forEach(layer => {
        if (layer.classList.contains(themeName)) {
          layer.classList.add('is-active');
        } else {
          layer.classList.remove('is-active');
        }
      });
    }

    // Activa hero por padrão imediatamente
    activateTheme('atm-hero');

    // IntersectionObserver: dispara quando a seção ocupa >25% da viewport
    const observer = new IntersectionObserver((entries) => {
      // Encontra a seção com maior área visível
      let bestEntry  = null;
      let bestRatio  = 0;

      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
          bestRatio = entry.intersectionRatio;
          bestEntry = entry;
        }
      });

      if (bestEntry) {
        const theme = sectionThemes[bestEntry.target.id];
        if (theme) activateTheme(theme);
      }
    }, {
      threshold: [0, 0.1, 0.25, 0.5, 0.75],
      rootMargin: '-5% 0px -5% 0px',
    });

    // Observa cada seção
    Object.keys(sectionThemes).forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // Fallback: scroll listener para garantir transição mesmo em seções longas
    let scrollTimer;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const viewportMid = window.scrollY + window.innerHeight / 2;

        for (const [id, theme] of Object.entries(sectionThemes)) {
          const el = document.getElementById(id);
          if (!el) continue;
          const top    = el.offsetTop;
          const bottom = top + el.offsetHeight;
          if (viewportMid >= top && viewportMid <= bottom) {
            activateTheme(theme);
            break;
          }
        }
      }, 50);
    }, { passive: true });
  }

  // ─── FAQ ACCORDION ───────────────────────────────────────────────
  function initFAQ() {
    document.querySelectorAll('.faq-trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const item    = trigger.closest('.faq-item');
        const content = item.querySelector('.faq-body');
        const icon    = trigger.querySelector('.faq-icon');
        const isOpen  = item.classList.contains('is-open');

        // Fecha todos
        document.querySelectorAll('.faq-item.is-open').forEach(open => {
          open.classList.remove('is-open');
          open.querySelector('.faq-body').style.maxHeight = '0';
          open.querySelector('.faq-icon').style.transform = 'rotate(0deg)';
        });

        // Abre o clicado (se estava fechado)
        if (!isOpen) {
          item.classList.add('is-open');
          content.style.maxHeight   = content.scrollHeight + 'px';
          icon.style.transform      = 'rotate(45deg)';
        }
      });
    });
  }

  // ─── GLOW FILTER SVG ────────────────────────────────────────────
  function createGlowFilter() {
    const defs   = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', 'purplePulseGlow');
    filter.setAttribute('x', '-50%'); filter.setAttribute('y', '-50%');
    filter.setAttribute('width', '200%'); filter.setAttribute('height', '200%');
    const blur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
    blur.setAttribute('stdDeviation', '3'); blur.setAttribute('result', 'coloredBlur');
    const merge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
    const mn1   = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode'); mn1.setAttribute('in','coloredBlur');
    const mn2   = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode'); mn2.setAttribute('in','SourceGraphic');
    merge.appendChild(mn1); merge.appendChild(mn2);
    filter.appendChild(blur); filter.appendChild(merge);
    defs.appendChild(filter); svgElement.appendChild(defs);
  }

  // ─── BUILD ECOSYSTEM ────────────────────────────────────────────
  function buildEcosystem() {
    const centerX     = container.offsetWidth  / 2;
    const centerY     = container.offsetHeight / 2;
    const scaleFactor = Math.min(1, container.offsetWidth / 1000);

    createGlowFilter();

    branches.forEach((branch, index) => {
      const rad      = (branch.angle * Math.PI) / 180;
      const distance = branch.distance * scaleFactor;
      const appOffX  = 145 * scaleFactor;
      const catX     = centerX + Math.cos(rad) * distance;
      const catY     = centerY + Math.sin(rad) * distance;
      const isRight  = Math.cos(rad) > 0;
      const appX     = catX + (isRight ? appOffX : -appOffX);

      // Curva S
      const pathId = `route-${branch.id}`;
      const path   = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('id', pathId);
      path.setAttribute('d', `M ${centerX} ${centerY} C ${centerX+(catX-centerX)/2} ${centerY}, ${centerX+(catX-centerX)/2} ${catY}, ${catX} ${catY}`);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', 'rgba(74,222,128,0.15)');
      path.setAttribute('stroke-width', '1.5');
      svgElement.appendChild(path);

      // Linha horizontal
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', catX); line.setAttribute('y1', catY);
      line.setAttribute('x2', appX); line.setAttribute('y2', catY);
      line.setAttribute('stroke', 'rgba(74,222,128,0.3)'); line.setAttribute('stroke-width', '1');
      svgElement.appendChild(line);

      // Ponto de junção
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', catX); dot.setAttribute('cy', catY);
      dot.setAttribute('r', '2.5'); dot.setAttribute('fill', '#4ade80');
      svgElement.appendChild(dot);

      // Pílula categoria
      const pillOffset = Math.max(32, 48 * scaleFactor);
      const catNode    = document.createElement('div');
      catNode.className = 'branch-node category-pill';
      catNode.style.left = `${catX + (isRight ? -pillOffset : pillOffset)}px`;
      catNode.style.top  = `${catY}px`;
      catNode.innerHTML  = isRight
        ? `<span class="w-1.5 h-1.5 bg-bailey-green rounded-full shadow-[0_0_5px_#4ade80] flex-shrink-0"></span> ${branch.categoryName}`
        : `${branch.categoryName} <span class="w-1.5 h-1.5 bg-bailey-green rounded-full shadow-[0_0_5px_#4ade80] flex-shrink-0"></span>`;
      container.appendChild(catNode);

      // Pílula app
      const appNode = document.createElement('div');
      appNode.className  = 'branch-node app-pill';
      appNode.style.left = `${appX}px`;
      appNode.style.top  = `${catY}px`;
      container.appendChild(appNode);
      startAppCycle(appNode, branch.apps);

      gsap.to([catNode, appNode], {
        y: '+=6', duration: 2.5 + Math.random() * 1.5,
        repeat: -1, yoyo: true, ease: 'sine.inOut'
      });

      // Bolinha roxa percorrendo a linha
      setTimeout(() => {
        const ball = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        ball.setAttribute('r', '3.5');
        ball.setAttribute('fill', '#a855f7');
        ball.setAttribute('style', 'filter: url(#purplePulseGlow);');
        svgElement.appendChild(ball);

        gsap.timeline({ repeat: -1, delay: index * 0.6 })
          .fromTo(ball, { opacity: 0 }, { opacity: 1, duration: 0.2 })
          .to(ball, {
            duration: 2.2 + Math.random() * 0.8, ease: 'power1.inOut',
            motionPath: { path: `#${pathId}`, align: `#${pathId}`, alignOrigin: [0.5, 0.5] }
          })
          .to(ball, { opacity: 0, duration: 0.2 });
      }, 100);
    });
  }

  function startAppCycle(node, apps) {
    let idx = 0;
    function render() {
      const app = apps[idx];
      gsap.to(node, { opacity: 0, duration: 0.3, onComplete: () => {
        node.style.backgroundColor = app.bg;
        node.style.color           = app.color;
        node.style.boxShadow       = `0 0 20px ${app.bg}40`;
        const icon = app.isImage
          ? `<div class="app-icon-box"><img src="${app.icon}" alt="${app.name}"></div>`
          : `<div class="app-icon-box" style="color:${app.color}"><i class="${app.icon}"></i></div>`;
        node.innerHTML = `${icon}<span>${app.name}</span>`;
        gsap.to(node, { opacity: 1, duration: 0.3 });
        idx = (idx + 1) % apps.length;
      }});
    }
    render();
    if (apps.length > 1) setInterval(render, CYCLE_TIME);
  }

  // ─── HUB CANVAS ─────────────────────────────────────────────────
  function initHubCanvas() {
    const bgCanvas   = document.getElementById('hub-bg-canvas');
    const auraCanvas = document.getElementById('hub-aura-canvas');
    const viewport   = document.getElementById('ecosystem-viewport');
    if (!bgCanvas || !auraCanvas || !viewport) return;

    const bgCtx   = bgCanvas.getContext('2d');
    bgCanvas.width = bgCanvas.height = 120;
    const auraCtx = auraCanvas.getContext('2d');
    auraCanvas.width = auraCanvas.height = 260;

    let tMX = 0, tMY = 0, sMX = 0, sMY = 0;
    viewport.addEventListener('mousemove', e => {
      const r = viewport.getBoundingClientRect();
      tMX = (e.clientX - r.left - r.width / 2)  / (r.width  / 2);
      tMY = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
    });
    viewport.addEventListener('mouseleave', () => { tMX = tMY = 0; });

    const rings = [
      { r:72,  speed: 0.003,  phase:0,   dashLen:18, gap:10, opacity:0.55, width:1.2 },
      { r:88,  speed:-0.002,  phase:1.2, dashLen:28, gap:14, opacity:0.35, width:0.8 },
      { r:105, speed: 0.0015, phase:2.5, dashLen:40, gap:20, opacity:0.22, width:0.7 },
    ];
    const particles = Array.from({ length: 12 }, () => ({
      angle:   Math.random() * Math.PI * 2,
      radius:  18 + Math.random() * 38,
      speed:   (Math.random() - 0.5) * 0.012,
      size:    1 + Math.random() * 1.5,
      opacity: 0.3 + Math.random() * 0.5,
    }));
    let time = 0;

    function drawBg() {
      bgCtx.clearRect(0, 0, 120, 120);
      const g = bgCtx.createRadialGradient(60+sMX*14, 60+sMY*14, 2, 60, 60, 62);
      g.addColorStop(0,   'rgba(124,58,237,0.45)');
      g.addColorStop(0.4, 'rgba(90,30,180,0.22)');
      g.addColorStop(1,   'rgba(5,8,6,0)');
      bgCtx.fillStyle = g;
      bgCtx.beginPath(); bgCtx.arc(60, 60, 60, 0, Math.PI * 2); bgCtx.fill();
      particles.forEach(p => {
        p.angle += p.speed;
        bgCtx.beginPath();
        bgCtx.arc(60 + Math.cos(p.angle)*p.radius + sMX*6, 60 + Math.sin(p.angle)*p.radius + sMY*6, p.size, 0, Math.PI*2);
        bgCtx.fillStyle = `rgba(168,85,247,${p.opacity})`; bgCtx.fill();
      });
    }

    function drawAura() {
      auraCtx.clearRect(0, 0, 260, 260);
      const ox = sMX * 10, oy = sMY * 10;
      rings.forEach(ring => {
        ring.phase += ring.speed;
        auraCtx.save();
        auraCtx.translate(130 + ox*0.4, 130 + oy*0.4);
        auraCtx.scale(1 + sMX*0.18, 1 + sMY*0.18);
        auraCtx.rotate(ring.phase);
        auraCtx.beginPath(); auraCtx.arc(0, 0, ring.r, 0, Math.PI*2);
        auraCtx.setLineDash([ring.dashLen, ring.gap]);
        auraCtx.strokeStyle = `rgba(124,58,237,${ring.opacity})`;
        auraCtx.lineWidth   = ring.width; auraCtx.stroke();
        auraCtx.setLineDash([]); auraCtx.restore();
      });
      const ga = time*0.8 + sMX*1.5;
      const gx = 130 + Math.cos(ga)*72 + ox*0.3;
      const gy = 130 + Math.sin(ga)*72 + oy*0.3;
      const gg = auraCtx.createRadialGradient(gx, gy, 0, gx, gy, 7);
      gg.addColorStop(0, 'rgba(168,85,247,0.9)');
      gg.addColorStop(1, 'rgba(124,58,237,0)');
      auraCtx.beginPath(); auraCtx.arc(gx, gy, 7, 0, Math.PI*2);
      auraCtx.fillStyle = gg; auraCtx.fill();
    }

    (function loop() {
      time += 0.016; sMX += (tMX-sMX)*0.06; sMY += (tMY-sMY)*0.06;
      drawBg(); drawAura(); requestAnimationFrame(loop);
    })();
  }

  // ─── SISTEMA SOLAR ──────────────────────────────────────────────
  function initSolarSystem() {
    const canvas = document.getElementById('solar-system-canvas');
    const hero   = document.getElementById('hero-section');
    if (!canvas || !hero) return;

    const ctx = canvas.getContext('2d');
    let W, H, cx, cy;

    function resize() {
      W = canvas.width  = hero.offsetWidth;
      H = canvas.height = hero.offsetHeight;
      cx = W / 2; cy = H / 2;
    }
    resize();

    const stars = Array.from({ length: 160 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.3 + 0.2,
      base:  Math.random() * 0.45 + 0.08,
      phase: Math.random() * Math.PI * 2,
      spd:   Math.random() * 0.012 + 0.004,
    }));

    const orbits = [
      { rxR:0.18, ryR:0.09, tilt:0.25,  rotSpd: 0.0006, dash:[22,12], rgb:'74,222,128',  opacity:0.13, lw:1.3 },
      { rxR:0.30, ryR:0.15, tilt:-0.18, rotSpd:-0.0004, dash:[38,20], rgb:'124,58,237',  opacity:0.10, lw:1.0 },
      { rxR:0.43, ryR:0.21, tilt:0.12,  rotSpd: 0.0003, dash:[60,30], rgb:'74,222,128',  opacity:0.07, lw:0.8 },
      { rxR:0.58, ryR:0.28, tilt:-0.08, rotSpd:-0.0002, dash:[90,45], rgb:'168,85,247',  opacity:0.05, lw:0.6 },
    ];

    const planets = [
      { oi:0, angle:0.3,      spd: 0.009, r:2.8, rgb:'74,222,128', gr:9  },
      { oi:0, angle:Math.PI,  spd: 0.009, r:2.0, rgb:'168,85,247', gr:7  },
      { oi:1, angle:1.1,      spd:-0.006, r:3.8, rgb:'124,58,237', gr:12 },
      { oi:1, angle:3.8,      spd:-0.006, r:2.2, rgb:'74,222,128', gr:8  },
      { oi:2, angle:2.4,      spd: 0.004, r:3.2, rgb:'168,85,247', gr:10 },
      { oi:2, angle:5.1,      spd: 0.004, r:1.8, rgb:'74,222,128', gr:6  },
      { oi:3, angle:0.8,      spd:-0.003, r:2.5, rgb:'124,58,237', gr:8  },
      { oi:3, angle:4.2,      spd:-0.003, r:1.5, rgb:'168,85,247', gr:5  },
    ];

    let animId;

    function draw() {
      ctx.clearRect(0, 0, W, H);
      // Nebulosa central
      const nb = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W,H)*0.38);
      nb.addColorStop(0,    'rgba(124,58,237,0.07)');
      nb.addColorStop(0.35, 'rgba(74,222,128,0.04)');
      nb.addColorStop(1,    'rgba(0,0,0,0)');
      ctx.fillStyle = nb;
      ctx.beginPath(); ctx.arc(cx, cy, Math.min(W,H)*0.38, 0, Math.PI*2); ctx.fill();

      // Estrelas
      stars.forEach(s => {
        s.phase += s.spd;
        ctx.beginPath(); ctx.arc(s.x*W, s.y*H, s.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255,255,255,${(s.base*(0.5+0.5*Math.sin(s.phase))).toFixed(3)})`;
        ctx.fill();
      });

      // Anéis e planetas
      const base = Math.min(W, H);
      orbits.forEach((o, oi) => {
        o.tilt += o.rotSpd;
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(o.tilt);
        ctx.beginPath(); ctx.ellipse(0, 0, o.rxR*base, o.ryR*base, 0, 0, Math.PI*2);
        ctx.setLineDash(o.dash);
        ctx.strokeStyle = `rgba(${o.rgb},${o.opacity})`;
        ctx.lineWidth   = o.lw; ctx.stroke();
        ctx.setLineDash([]); ctx.restore();

        planets.filter(p => p.oi === oi).forEach(p => {
          p.angle += p.spd;
          const rx = o.rxR*base, ry = o.ryR*base;
          const ex = rx * Math.cos(p.angle), ey = ry * Math.sin(p.angle);
          const px = cx + ex*Math.cos(o.tilt) - ey*Math.sin(o.tilt);
          const py = cy + ex*Math.sin(o.tilt) + ey*Math.cos(o.tilt);
          const gGrad = ctx.createRadialGradient(px, py, 0, px, py, p.gr);
          gGrad.addColorStop(0, `rgba(${p.rgb},0.75)`);
          gGrad.addColorStop(1, `rgba(${p.rgb},0)`);
          ctx.beginPath(); ctx.arc(px, py, p.gr, 0, Math.PI*2);
          ctx.fillStyle = gGrad; ctx.fill();
          ctx.beginPath(); ctx.arc(px, py, p.r, 0, Math.PI*2);
          ctx.fillStyle = `rgb(${p.rgb})`; ctx.fill();
        });
      });

      animId = requestAnimationFrame(draw);
    }

    draw();

    window.addEventListener('resize', () => {
      cancelAnimationFrame(animId);
      resize();
      stars.forEach(s => { s.x = Math.random(); s.y = Math.random(); });
      draw();
    });
  }

});