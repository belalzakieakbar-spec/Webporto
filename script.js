/* ─────────────────────────────────────────────
   PORTFOLIO — script.js
───────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

  /* ───── NAVBAR: scroll state ───── */
  const navbar = document.getElementById('navbar');

  const handleNavScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();


  /* ───── NAVBAR: active link highlight ───── */
  const navLinks = document.querySelectorAll('.nav__link');
  const sections = document.querySelectorAll('section[id]');

  const setActiveLink = () => {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      const link   = document.querySelector(`.nav__link[href="#${id}"]`);
      if (link) {
        link.style.color = (scrollY >= top && scrollY < top + height)
          ? 'var(--white)'
          : '';
      }
    });
  };

  window.addEventListener('scroll', setActiveLink, { passive: true });


  /* ───── BURGER: mobile menu toggle ───── */
  const burger     = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');

  burger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);

    // Animate burger lines
    const spans = burger.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  });

  // Close mobile menu on link click
  document.querySelectorAll('.nav__mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      const spans = burger.querySelectorAll('span');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  // Close mobile menu on outside click
  document.addEventListener('click', e => {
    if (!navbar.contains(e.target) && mobileMenu.classList.contains('open')) {
      mobileMenu.classList.remove('open');
      const spans = burger.querySelectorAll('span');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });


  /* ───── SMOOTH SCROLL for all anchor links ───── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--nav-h')) || 68;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ───── REVEAL ON SCROLL ───── */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings in the same parent
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.active)')];
        const idx = siblings.indexOf(entry.target);
        const delay = Math.min(idx * 80, 400);
        setTimeout(() => {
          entry.target.classList.add('active');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ───── CONTACT FORM ───── */
  const form        = document.getElementById('contactForm');
  const successMsg  = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;

      btn.textContent = 'Mengirim…';
      btn.disabled    = true;

      // Simulate async send
      setTimeout(() => {
        form.reset();
        btn.textContent = original;
        btn.disabled    = false;

        successMsg.classList.add('visible');
        setTimeout(() => successMsg.classList.remove('visible'), 4000);
      }, 1200);
    });
  }


  /* ───── SKILL CARDS: tilt effect on hover ───── */
  const tiltEls = document.querySelectorAll('.skill-card, .exp-card, .hobby-card');

  tiltEls.forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect   = el.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -5;
      const rotateY = ((x - cx) / cx) *  5;
      el.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });


  /* ───── HERO PARALLAX (subtle) ───── */
  const heroTitle = document.querySelector('.hero__title');
  const heroBlob  = document.querySelector('.hero__blob');

  if (heroTitle && heroBlob) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroTitle.style.transform = `translateY(${y * 0.12}px)`;
        heroBlob.style.transform  = `translate(-50%, calc(-50% + ${y * 0.08}px))`;
      }
    }, { passive: true });
  }


  /* ───── YEAR in footer ───── */
  const yearEls = document.querySelectorAll('.footer__year');
  yearEls.forEach(el => { el.textContent = new Date().getFullYear(); });


  /* ───── Cursor glow (desktop only) ───── */
  if (window.matchMedia('(pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.style.cssText = `
      position: fixed; pointer-events: none; z-index: 9999;
      width: 280px; height: 280px; border-radius: 50%;
      background: radial-gradient(circle, rgba(181,113,58,.08) 0%, transparent 70%);
      transform: translate(-50%, -50%);
      transition: opacity 0.3s;
      top: 0; left: 0;
    `;
    document.body.appendChild(glow);

    document.addEventListener('mousemove', e => {
      glow.style.top  = e.clientY + 'px';
      glow.style.left = e.clientX + 'px';
    });

    document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { glow.style.opacity = '1'; });
  }

});
