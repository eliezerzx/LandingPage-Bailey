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

    // Cores Bailey: verde, roxo + neutros
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
        p.vy += 0.45; // gravidade
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
      entries.forEach((entry, _) => {
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

      // Reset scroll & button state
      const body   = modal.querySelector('.js-modal-body');
      const accept = modal.querySelector('.js-modal-accept');
      const hint   = modal.querySelector('.js-modal-hint');
      body.scrollTop = 0;
      accept.disabled = true;
      hint && hint.classList.remove('is-hidden');

      // Scroll detection
      const onScroll = () => {
        const atBottom = body.scrollTop + body.clientHeight >= body.scrollHeight - 6;
        if (atBottom) {
          accept.disabled = false;
          hint && hint.classList.add('is-hidden');
          body.removeEventListener('scroll', onScroll);
        }
      };
      body.addEventListener('scroll', onScroll, { passive: true });

      // Focus the close button for accessibility
      modal.querySelector('.legal-modal__close')?.focus();
    };

    const closeModal = () => {
      if (!activeModal) return;
      activeModal.setAttribute('hidden', '');
      document.body.style.overflow = '';
      activeModal = null;
    };

    // Triggers in footer
    document.querySelectorAll('.js-modal-trigger').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const id = 'modal-' + link.dataset.modal;
        openModal(id);
      });
    });

    // Close via overlay / close button / accept button
    document.querySelectorAll('.legal-modal').forEach(modal => {
      modal.querySelectorAll('.js-modal-close').forEach(el => {
        el.addEventListener('click', closeModal);
      });
      modal.querySelector('.js-modal-accept')?.addEventListener('click', closeModal);
    });

    // ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && activeModal) closeModal();
    });
  })();


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
