/**
 * NEWSTACKTRACE — main.js
 * Vanilla JS — no dependencies
 *
 * Modules:
 * 1. heroSlider()     — Hero section carousel
 * 2. stickyHeader()   — Transparent → dark on scroll
 * 3. mobileMenu()     — Hamburger toggle
 * 4. pricingTabs()    — Pricing section tab switching
 * 5. scrollReveal()   — Intersection Observer animations
 * 6. contactForm()    — Basic form handling (extend as needed)
 */

(function () {
  'use strict';

  /* ============================================================
     1. HERO SLIDER
     ============================================================ */
  function heroSlider() {
    const slides     = Array.from(document.querySelectorAll('.hero-slide'));
    const dots       = Array.from(document.querySelectorAll('.hero-dot'));
    const prevBtn    = document.querySelector('.hero-prev');
    const nextBtn    = document.querySelector('.hero-next');

    if (!slides.length) return;

    let current       = slides.findIndex(s => s.classList.contains('active'));
    if (current < 0) current = 0;

    let autoInterval  = null;
    const INTERVAL_MS = 5500;

    function goTo(index) {
      slides[current].classList.remove('active');
      dots[current]?.classList.remove('active');

      current = ((index % slides.length) + slides.length) % slides.length;

      slides[current].classList.add('active');

      // Update dot appearance
      dots.forEach((dot, i) => {
        if (i === current) {
          dot.classList.remove('w-2', 'bg-white/20');
          dot.classList.add('w-8', 'bg-green-500');
          dot.setAttribute('aria-selected', 'true');
        } else {
          dot.classList.remove('w-8', 'bg-green-500');
          dot.classList.add('w-2', 'bg-white/20');
          dot.setAttribute('aria-selected', 'false');
        }
      });
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAuto() {
      stopAuto();
      autoInterval = setInterval(next, INTERVAL_MS);
    }
    function stopAuto() {
      if (autoInterval) clearInterval(autoInterval);
    }

    // Dot click
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        stopAuto(); goTo(i); startAuto();
      });
    });

    // Arrow buttons
    prevBtn?.addEventListener('click', () => { stopAuto(); prev(); startAuto(); });
    nextBtn?.addEventListener('click', () => { stopAuto(); next(); startAuto(); });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
      const hero = document.getElementById('hero');
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (e.key === 'ArrowLeft')  { stopAuto(); prev(); startAuto(); }
      if (e.key === 'ArrowRight') { stopAuto(); next(); startAuto(); }
    });

    // Touch / swipe
    let touchStartX = 0;
    const heroEl = document.getElementById('hero');
    heroEl?.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    heroEl?.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) {
        stopAuto();
        dx < 0 ? next() : prev();
        startAuto();
      }
    }, { passive: true });

    // Pause on hover
    heroEl?.addEventListener('mouseenter', stopAuto);
    heroEl?.addEventListener('mouseleave', startAuto);

    // Initialize
    goTo(current);
    startAuto();
  }

  /* ============================================================
     2. STICKY HEADER
     ============================================================ */
  function stickyHeader() {
    const header    = document.getElementById('header');
    if (!header) return;

    const logoLight = document.getElementById('logo-light');
    const logoDark  = document.getElementById('logo-dark');
    const THRESHOLD = 80;

    function update() {
      if (window.scrollY > THRESHOLD) {
        header.classList.add('scrolled');
        logoLight?.classList.add('hidden');
        logoDark?.classList.remove('hidden');
      } else {
        header.classList.remove('scrolled');
        logoLight?.classList.remove('hidden');
        logoDark?.classList.add('hidden');
      }
    }

    window.addEventListener('scroll', update, { passive: true });
    update(); // run on init
  }

  /* ============================================================
     3. MOBILE MENU
     ============================================================ */
  function mobileMenu() {
    const btn       = document.getElementById('mobile-menu-btn');
    const menu      = document.getElementById('mobile-menu');
    const iconMenu  = document.getElementById('icon-menu');
    const iconClose = document.getElementById('icon-close');

    if (!btn || !menu) return;

    let isOpen = false;

    function open() {
      isOpen = true;
      menu.classList.remove('hidden');
      iconMenu?.classList.add('hidden');
      iconClose?.classList.remove('hidden');
      btn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden'; // prevent bg scroll
    }

    function close() {
      isOpen = false;
      menu.classList.add('hidden');
      iconMenu?.classList.remove('hidden');
      iconClose?.classList.add('hidden');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    btn.addEventListener('click', () => isOpen ? close() : open());

    // Close on link click
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', close);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (isOpen && !menu.contains(e.target) && !btn.contains(e.target)) {
        close();
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) close();
    });
  }

  /* ============================================================
     4. PRICING TABS
     ============================================================ */
  function pricingTabs() {
    const tabs     = Array.from(document.querySelectorAll('.pricing-tab'));
    const contents = Array.from(document.querySelectorAll('.pricing-tab-content'));

    if (!tabs.length) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.target;

        // Update tab buttons
        tabs.forEach(t => {
          const isActive = t === tab;
          t.classList.toggle('active', isActive);
          t.setAttribute('aria-selected', String(isActive));

          // Tailwind-compatible active styling
          if (isActive) {
            t.classList.add('bg-white', 'text-slate-900', 'shadow-sm');
            t.classList.remove('text-slate-500', 'hover:text-slate-700');
          } else {
            t.classList.remove('bg-white', 'text-slate-900', 'shadow-sm');
            t.classList.add('text-slate-500', 'hover:text-slate-700');
          }
        });

        // Show/hide content
        contents.forEach(content => {
          const id = content.id.replace('pricing-', '');
          content.classList.toggle('hidden', id !== target);
        });

        // Re-trigger reveal for newly visible items
        const panel = document.getElementById(`pricing-${target}`);
        panel?.querySelectorAll('.reveal:not(.revealed)').forEach(el => {
          requestAnimationFrame(() => el.classList.add('revealed'));
        });
      });
    });
  }

  /* ============================================================
     5. SCROLL REVEAL (IntersectionObserver)
     ============================================================ */
  function scrollReveal() {
    const elements = Array.from(document.querySelectorAll('.reveal'));
    if (!elements.length) return;

    // Respect reduced motion preference
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      elements.forEach(el => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px',
    });

    elements.forEach(el => observer.observe(el));
  }

  /* ============================================================
     6. CONTACT FORM (basic — extend with fetch/AJAX as needed)
     ============================================================ */
  function contactForm() {
    const form = document.querySelector('#contact form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;

      // Loading state
      btn.disabled = true;
      btn.innerHTML = `
        <svg class="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        Enviando...
      `;

      const formData = new FormData(form);
      const data = Object.fromEntries(formData);

      try {
        // TODO: Replace with your actual endpoint
        // const response = await fetch('/api/contact', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(data),
        // });

        // Simulated success for template preview
        await new Promise(r => setTimeout(r, 800));

        btn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          Mensagem enviada!
        `;
        btn.classList.remove('bg-green-600', 'hover:bg-green-500');
        btn.classList.add('bg-green-700');

        form.reset();
        setTimeout(() => {
          btn.disabled = false;
          btn.innerHTML = originalText;
          btn.classList.add('bg-green-600', 'hover:bg-green-500');
          btn.classList.remove('bg-green-700');
        }, 3500);

      } catch (err) {
        btn.innerHTML = 'Erro ao enviar. Tente novamente.';
        btn.classList.remove('bg-green-600', 'hover:bg-green-500');
        btn.classList.add('bg-red-600');
        setTimeout(() => {
          btn.disabled = false;
          btn.innerHTML = originalText;
          btn.classList.add('bg-green-600', 'hover:bg-green-500');
          btn.classList.remove('bg-red-600');
        }, 3500);
      }
    });
  }

  /* ============================================================
     7. SMOOTH ANCHOR SCROLL (for internal nav links)
     ============================================================ */
  function smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Update URL without reload
        history.pushState(null, '', id);
      });
    });
  }

  /* ============================================================
     INIT — Run all modules on DOMContentLoaded
     ============================================================ */
  document.addEventListener('DOMContentLoaded', () => {
    heroSlider();
    stickyHeader();
    mobileMenu();
    pricingTabs();
    scrollReveal();
    contactForm();
    smoothScroll();

    // Initialize Lucide icons (must run after DOM is ready)
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    console.log('%c new Stacktrace(); %c ready ', [
      'background:#0a0a0a;color:#16a34a;font-family:monospace;font-size:11px;padding:4px 8px;',
      'background:#16a34a;color:#fff;font-family:monospace;font-size:11px;padding:4px 8px;',
    ].join(''), '');
  });

})();
