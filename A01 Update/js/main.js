/* ============================================================
   BAILEY A01 — JS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const navbar       = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu   = document.getElementById('mobileMenu');


  // ---- Navbar scroll ----------------------------------------
  const onScroll = () => {
    navbar.classList.toggle('is-scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  // ---- Mobile Menu ------------------------------------------
  mobileToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('is-open');
    mobileToggle.classList.toggle('is-open', isOpen);
    mobileToggle.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    document.body.classList.toggle('menu-open', isOpen);
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('is-open');
      mobileToggle.classList.remove('is-open');
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('menu-open');
    });
  });


  // ---- Dropdown Menus (desktop) -----------------------------
  const navItems  = document.querySelectorAll('.nav-item[data-nav]');
  let closeTimer  = null;

  navItems.forEach(item => {
    const trigger = item.querySelector('.nav-trigger');

    const openDD = () => {
      clearTimeout(closeTimer);
      navItems.forEach(o => {
        if (o !== item) {
          o.classList.remove('is-open');
          o.querySelector('.nav-trigger')?.setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
    };

    const closeDD = () => {
      closeTimer = setTimeout(() => {
        item.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      }, 120);
    };

    item.addEventListener('mouseenter', openDD);
    item.addEventListener('mouseleave', closeDD);

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const wasOpen = item.classList.contains('is-open');
      navItems.forEach(n => {
        n.classList.remove('is-open');
        n.querySelector('.nav-trigger')?.setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) openDD();
    });
  });

  document.addEventListener('click', () => {
    navItems.forEach(item => {
      item.classList.remove('is-open');
      item.querySelector('.nav-trigger')?.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    navItems.forEach(item => {
      item.classList.remove('is-open');
      item.querySelector('.nav-trigger')?.setAttribute('aria-expanded', 'false');
    });
  });


  // ---- Confetti ao clicar no CTA WhatsApp ------------------
  const waBtn        = document.getElementById('heroWaBtn');
  const confettiCanvas = document.getElementById('confettiCanvas');

  if (waBtn && confettiCanvas) {
    waBtn.addEventListener('click', () => {
      fireConfetti(confettiCanvas);
    });
  }

  function fireConfetti(canvas) {
    const ctx    = canvas.getContext('2d');
    const W      = canvas.offsetWidth  || 700;
    const H      = canvas.offsetHeight || 700;
    canvas.width  = W;
    canvas.height = H;

    const colors = ['#22c55e', '#4ade80', '#a855f7', '#c084fc', '#ffffff', '#fbbf24'];
    const particles = [];

    for (let i = 0; i < 70; i++) {
      particles.push({
        x:    W / 2,
        y:    H / 2,
        vx:   (Math.random() - 0.5) * 14,
        vy:   (Math.random() - 2.2) * 10,
        life: 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        size:  Math.random() * 5 + 2,
        shape: Math.random() > 0.5 ? 'circle' : 'rect',
      });
    }

    const animate = () => {
      if (particles.length === 0) {
        ctx.clearRect(0, 0, W, H);
        return;
      }
      ctx.clearRect(0, 0, W, H);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x  += p.vx;
        p.y  += p.vy;
        p.vy += 0.45;
        p.life -= 2;

        ctx.globalAlpha = Math.max(0, p.life / 100);
        ctx.fillStyle   = p.color;

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size * 0.6);
        }

        if (p.life <= 0) particles.splice(i, 1);
      }

      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    };

    animate();
  }


  // ---- Scroll reveal (seção serviços) -----------------------
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(el => revealObs.observe(el));
  }

  // ---- Integration cards staggered reveal -------------------
  const intCards = document.querySelectorAll('.int-card');
  if (intCards.length) {
    const intObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const card = entry.target;
          const idx  = Array.from(intCards).indexOf(card);
          setTimeout(() => card.classList.add('is-visible'), idx * 45);
          intObs.unobserve(card);
        }
      });
    }, { threshold: 0.08 });
    intCards.forEach(c => intObs.observe(c));
  }


  // ---- Mentor tabs (iFood / 99Food / Keeta) -----------------
  const mentorTabs   = document.querySelectorAll('.mentor-tab');
  const mentorPanels = document.querySelectorAll('.mentor-panel');

  mentorTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      mentorTabs.forEach(t => t.classList.remove('is-active'));
      mentorPanels.forEach(p => p.classList.remove('is-active'));
      tab.classList.add('is-active');
      const target = document.getElementById(tab.dataset.target);
      if (target) target.classList.add('is-active');
    });
  });



  // ---- Stats counter animation ------------------------------
  const statsEls = document.querySelectorAll('.stats-count');
  if (statsEls.length) {
    const statsObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el      = entry.target;
        const target  = parseFloat(el.dataset.target);
        const suffix  = el.dataset.suffix || '';
        const isDecimal = el.dataset.dec === '1';
        const usePtFmt  = el.dataset.fmt === 'pt';
        const duration  = 1800;
        const startTime = performance.now();

        const tick = (now) => {
          const p      = Math.min((now - startTime) / duration, 1);
          const eased  = 1 - Math.pow(1 - p, 3);
          const val    = eased * target;
          if (isDecimal) {
            el.textContent = val.toFixed(1) + suffix;
          } else if (usePtFmt) {
            el.textContent = Math.floor(val).toLocaleString('pt-BR') + suffix;
          } else {
            el.textContent = Math.floor(val) + suffix;
          }
          if (p < 1) requestAnimationFrame(tick);
          else {
            if (isDecimal)   el.textContent = target.toFixed(1) + suffix;
            else if (usePtFmt) el.textContent = target.toLocaleString('pt-BR') + suffix;
            else             el.textContent = target + suffix;
          }
        };
        requestAnimationFrame(tick);
        statsObs.unobserve(el);
      });
    }, { threshold: 0.4 });

    statsEls.forEach(el => statsObs.observe(el));
  }


  // ---- Legal Modals (Termos / Privacidade) -----------------
  (function () {
    let activeModal = null;

    const openModal = (id) => {
      const modal = document.getElementById(id);
      if (!modal) return;
      activeModal = modal;
      modal.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';

      const body   = modal.querySelector('.js-modal-body');
      const accept = modal.querySelector('.js-modal-accept');
      const hint   = modal.querySelector('.js-modal-hint');
      body.scrollTop = 0;
      accept.disabled = true;
      hint && hint.classList.remove('is-hidden');

      const onScroll = () => {
        const atBottom = body.scrollTop + body.clientHeight >= body.scrollHeight - 6;
        if (atBottom) {
          accept.disabled = false;
          hint && hint.classList.add('is-hidden');
          body.removeEventListener('scroll', onScroll);
        }
      };
      body.addEventListener('scroll', onScroll, { passive: true });

      modal.querySelector('.legal-modal__close')?.focus();
    };

    const closeModal = () => {
      if (!activeModal) return;
      activeModal.setAttribute('hidden', '');
      document.body.style.overflow = '';
      activeModal = null;
    };

    document.querySelectorAll('.js-modal-trigger').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const id = 'modal-' + link.dataset.modal;
        openModal(id);
      });
    });

    document.querySelectorAll('.legal-modal').forEach(modal => {
      modal.querySelectorAll('.js-modal-close').forEach(el => {
        el.addEventListener('click', closeModal);
      });
      modal.querySelector('.js-modal-accept')?.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && activeModal) closeModal();
    });
  })();



  // ---- Ecossistema — Sistema Solar (hero) -------------------

  const CYCLE_TIME = 4000;

  const branches = [
    {
      id: 'delivery', categoryName: "App Deliverys", angle: 190, distance: 290,
      apps: [
        { name: 'iFood',  icon: 'img/icons/ifood.png',  isImage: true, bg: '#EA1D2C', color: '#FFF' },
        { name: '99Food', icon: 'img/icons/99food.png', isImage: true, bg: '#FFC400', color: '#000' },
        { name: 'Keeta',  icon: 'img/icons/keeta.png',  isImage: true, bg: '#FF7A00', color: '#FFF' }
      ]
    },
    {
      id: 'automacoes', categoryName: "Automações", angle: 220, distance: 270,
      apps: [
        { name: 'Python',    icon: 'img/icons/python.png',    isImage: true, bg: '#c8a22a', color: '#FFF' },
        { name: 'Oracle VM', icon: 'img/icons/oracle-vm.png', isImage: true, bg: '#00758F', color: '#FFF' }
      ]
    },
    {
      id: 'ferramentas', categoryName: "Ferramentas", angle: 320, distance: 270,
      apps: [
        { name: 'Canva',   icon: 'img/icons/canva.png',   isImage: true, bg: '#4828b4', color: '#FFF' },
        { name: 'AnyDesk', icon: 'img/icons/anydesk.png', isImage: true, bg: '#bf2f28', color: '#FFF' }
      ]
    },
    {
      id: 'inteligencia', categoryName: "Inteligência Artificial", angle: 160, distance: 270,
      apps: [
        { name: 'ChatGPT', icon: 'img/icons/chatgpt.png', isImage: true, bg: '#10A37F', color: '#FFF' },
        { name: 'Gemini',  icon: 'img/icons/gemini.png',  isImage: true, bg: '#00758F', color: '#FFF' }
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
      id: 'sistemas', categoryName: "Softwares", angle: 360, distance: 280,
      apps: [
        { name: 'Bailey PDV',    icon: 'fas fa-desktop',  bg: '#7c3aed', color: '#FFF' },
        { name: 'Cardápio Dig.', icon: 'fas fa-utensils', bg: '#4ade80', color: '#000' },
        { name: 'Premier',        icon: 'img/icons/premier.png',          isImage: true, bg: '#5f570f', color: '#FFF' },
        { name: 'Brendi',         icon: 'img/icons/brendi.png',           isImage: true, bg: '#8d8d8d', color: '#FFF' },
        { name: 'Anota AI',       icon: 'img/icons/anotaAI.png',          isImage: true, bg: '#05101d', color: '#FFF' },
        { name: 'Pedidu',         icon: 'img/icons/pedidu.png',           isImage: true, bg: '#6d0c0c', color: '#FFF' },
        { name: 'Saipos',         icon: 'img/icons/saipos.png',           isImage: true, bg: '#9e5a00', color: '#FFF' },
        { name: 'Premio Sistemas', icon: 'img/icons/premio=sistemas.png', isImage: true, bg: '#007185', color: '#FFF' }
      ]
    }
  ];

  // Init ecosistema (requer GSAP + MotionPathPlugin no <head>)
  if (typeof gsap !== 'undefined' && typeof MotionPathPlugin !== 'undefined') {
    gsap.registerPlugin(MotionPathPlugin);
  }

  const ecoContainer  = document.getElementById('branches-container');
  const ecoSvg        = document.getElementById('network-svg');

  if (ecoContainer && ecoSvg) {
    buildEcosystem();
    initHubCanvas();
    window.addEventListener('resize', () => {
      ecoSvg.innerHTML        = '';
      ecoContainer.innerHTML  = '';
      buildEcosystem();
    }, { passive: true });
  }

  initSolarSystem();

  // ─── Glow filter SVG ──────────────────────────────────────
  function createGlowFilter() {
    const defs   = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', 'purplePulseGlow');
    filter.setAttribute('x', '-50%'); filter.setAttribute('y', '-50%');
    filter.setAttribute('width', '200%'); filter.setAttribute('height', '200%');
    const blur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
    blur.setAttribute('stdDeviation', '3'); blur.setAttribute('result', 'coloredBlur');
    const merge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
    const mn1   = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode'); mn1.setAttribute('in', 'coloredBlur');
    const mn2   = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode'); mn2.setAttribute('in', 'SourceGraphic');
    merge.appendChild(mn1); merge.appendChild(mn2);
    filter.appendChild(blur); filter.appendChild(merge);
    defs.appendChild(filter); ecoSvg.appendChild(defs);
  }

  // ─── Build ecosystem ───────────────────────────────────────
  function buildEcosystem() {
    const centerX     = ecoContainer.offsetWidth  / 2;
    const centerY     = ecoContainer.offsetHeight / 2;
    const scaleFactor = Math.min(1, ecoContainer.offsetWidth / 1000);

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
      const pathId = 'route-' + branch.id;
      const path   = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('id', pathId);
      path.setAttribute('d', 'M ' + centerX + ' ' + centerY + ' C ' + (centerX+(catX-centerX)/2) + ' ' + centerY + ', ' + (centerX+(catX-centerX)/2) + ' ' + catY + ', ' + catX + ' ' + catY);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', 'rgba(74,222,128,0.15)');
      path.setAttribute('stroke-width', '1.5');
      ecoSvg.appendChild(path);

      // Linha horizontal
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', catX); line.setAttribute('y1', catY);
      line.setAttribute('x2', appX); line.setAttribute('y2', catY);
      line.setAttribute('stroke', 'rgba(74,222,128,0.3)'); line.setAttribute('stroke-width', '1');
      ecoSvg.appendChild(line);

      // Ponto de junção
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', catX); dot.setAttribute('cy', catY);
      dot.setAttribute('r', '2.5'); dot.setAttribute('fill', '#4ade80');
      ecoSvg.appendChild(dot);

      // Pílula categoria
      const pillOffset = Math.max(32, 48 * scaleFactor);
      const catNode    = document.createElement('div');
      catNode.className = 'branch-node category-pill';
      catNode.style.left = (catX + (isRight ? -pillOffset : pillOffset)) + 'px';
      catNode.style.top  = catY + 'px';
      catNode.innerHTML  = isRight
        ? '<span style="width:6px;height:6px;background:#4ade80;border-radius:50%;box-shadow:0 0 5px #4ade80;flex-shrink:0;display:inline-block;"></span> ' + branch.categoryName
        : branch.categoryName + ' <span style="width:6px;height:6px;background:#4ade80;border-radius:50%;box-shadow:0 0 5px #4ade80;flex-shrink:0;display:inline-block;"></span>';
      ecoContainer.appendChild(catNode);

      // Pílula app
      const appNode = document.createElement('div');
      appNode.className  = 'branch-node app-pill';
      appNode.style.left = appX + 'px';
      appNode.style.top  = catY + 'px';
      ecoContainer.appendChild(appNode);
      startAppCycle(appNode, branch.apps);

      if (typeof gsap !== 'undefined') {
        gsap.to([catNode, appNode], {
          y: '+=6', duration: 2.5 + Math.random() * 1.5,
          repeat: -1, yoyo: true, ease: 'sine.inOut'
        });
      }

      // Bolinha roxa percorrendo a linha
      setTimeout(() => {
        const ball = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        ball.setAttribute('r', '3.5');
        ball.setAttribute('fill', '#a855f7');
        ball.setAttribute('style', 'filter: url(#purplePulseGlow);');
        ecoSvg.appendChild(ball);

        if (typeof gsap !== 'undefined') {
          gsap.timeline({ repeat: -1, delay: index * 0.6 })
            .fromTo(ball, { opacity: 0 }, { opacity: 1, duration: 0.2 })
            .to(ball, {
              duration: 2.2 + Math.random() * 0.8, ease: 'power1.inOut',
              motionPath: { path: '#' + pathId, align: '#' + pathId, alignOrigin: [0.5, 0.5] }
            })
            .to(ball, { opacity: 0, duration: 0.2 });
        }
      }, 100);
    });
  }

  function startAppCycle(node, apps) {
    let idx = 0;
    function render() {
      const app = apps[idx];
      if (typeof gsap !== 'undefined') {
        gsap.to(node, { opacity: 0, duration: 0.3, onComplete: () => {
          node.style.backgroundColor = app.bg;
          node.style.color           = app.color;
          node.style.boxShadow       = '0 0 20px ' + app.bg + '40';
          const icon = app.isImage
            ? '<div class="app-icon-box"><img src="' + app.icon + '" alt="' + app.name + '"></div>'
            : '<div class="app-icon-box" style="color:' + app.color + '"><i class="' + app.icon + '"></i></div>';
          node.innerHTML = icon + '<span>' + app.name + '</span>';
          gsap.to(node, { opacity: 1, duration: 0.3 });
          idx = (idx + 1) % apps.length;
        }});
      } else {
        node.style.backgroundColor = app.bg;
        node.style.color           = app.color;
        const icon = app.isImage
          ? '<div class="app-icon-box"><img src="' + app.icon + '" alt="' + app.name + '"></div>'
          : '<div class="app-icon-box" style="color:' + app.color + '"><i class="' + app.icon + '"></i></div>';
        node.innerHTML = icon + '<span>' + app.name + '</span>';
        idx = (idx + 1) % apps.length;
      }
    }
    render();
    if (apps.length > 1) setInterval(render, CYCLE_TIME);
  }

  // ─── Hub Canvas ───────────────────────────────────────────
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
        bgCtx.fillStyle = 'rgba(168,85,247,' + p.opacity + ')'; bgCtx.fill();
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
        auraCtx.strokeStyle = 'rgba(124,58,237,' + ring.opacity + ')';
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

  // ─── Sistema Solar (canvas de fundo) ─────────────────────
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
        ctx.fillStyle = 'rgba(255,255,255,' + (s.base*(0.5+0.5*Math.sin(s.phase))).toFixed(3) + ')';
        ctx.fill();
      });

      // Anéis e planetas
      const base = Math.min(W, H);
      orbits.forEach((o, oi) => {
        o.tilt += o.rotSpd;
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(o.tilt);
        ctx.beginPath(); ctx.ellipse(0, 0, o.rxR*base, o.ryR*base, 0, 0, Math.PI*2);
        ctx.setLineDash(o.dash);
        ctx.strokeStyle = 'rgba(' + o.rgb + ',' + o.opacity + ')';
        ctx.lineWidth   = o.lw; ctx.stroke();
        ctx.setLineDash([]); ctx.restore();

        planets.filter(p => p.oi === oi).forEach(p => {
          p.angle += p.spd;
          const rx = o.rxR*base, ry = o.ryR*base;
          const ex = rx * Math.cos(p.angle), ey = ry * Math.sin(p.angle);
          const px = cx + ex*Math.cos(o.tilt) - ey*Math.sin(o.tilt);
          const py = cy + ex*Math.sin(o.tilt) + ey*Math.cos(o.tilt);
          const gGrad = ctx.createRadialGradient(px, py, 0, px, py, p.gr);
          gGrad.addColorStop(0, 'rgba(' + p.rgb + ',0.75)');
          gGrad.addColorStop(1, 'rgba(' + p.rgb + ',0)');
          ctx.beginPath(); ctx.arc(px, py, p.gr, 0, Math.PI*2);
          ctx.fillStyle = gGrad; ctx.fill();
          ctx.beginPath(); ctx.arc(px, py, p.r, 0, Math.PI*2);
          ctx.fillStyle = 'rgb(' + p.rgb + ')'; ctx.fill();
        });
      });

      animId = requestAnimationFrame(draw);
    }

    draw();

    window.addEventListener('resize', () => {
      cancelAnimationFrame(animId);
      resize();
      draw();
    }, { passive: true });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else {
        draw();
      }
    });
  }


  // ---- FAQ accordion ---------------------------------------
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('is-open');
      // fecha todos
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('is-open');
        i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      // abre o clicado (se estava fechado)
      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });


});
