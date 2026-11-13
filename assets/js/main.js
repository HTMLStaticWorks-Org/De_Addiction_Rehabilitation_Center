/**
 * Revivana Recovery Center — Core Interactive Scripts
 * Handles: Theme Toggle, RTL Toggle, Sticky Header, Mobile Drawer,
 * Scroll Animations, Interactive Timelines, Treatment Tabs, FAQ Accordion,
 * Form Validation (Demo Mode), and Smooth Back-to-Top.
 */

(function () {
  'use strict';

  const THEME_KEY = 'revivana-theme';
  const DIR_KEY = 'revivana-dir';

  // -------------------------------------------------------------------------
  // 1. Theme (Light / Dark) & Direction (LTR / RTL) Persistence
  // -------------------------------------------------------------------------
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
      const isDark = theme === 'dark';
      btn.setAttribute('aria-pressed', String(isDark));
      btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      btn.innerHTML = isDark
        ? '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
        : '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    });
  }

  function applyDirection(dir) {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem(DIR_KEY, dir);
    document.querySelectorAll('[data-rtl-toggle]').forEach((btn) => {
      const isRtl = dir === 'rtl';
      btn.setAttribute('aria-pressed', String(isRtl));
      btn.setAttribute('title', isRtl ? 'Switch to LTR' : 'Switch to RTL');
      btn.setAttribute('aria-label', isRtl ? 'Switch to LTR' : 'Switch to RTL');
      btn.innerHTML = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 4L4 8l4 4"/><path d="M4 8h16"/><path d="M16 20l4-4-4-4"/><path d="M20 16H4"/></svg>';
    });
  }

  const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
  const savedDir = localStorage.getItem(DIR_KEY) || 'ltr';
  applyTheme(savedTheme);
  applyDirection(savedDir);

  document.addEventListener('click', (e) => {
    const themeBtn = e.target.closest('[data-theme-toggle]');
    if (themeBtn) {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    }

    const rtlBtn = e.target.closest('[data-rtl-toggle]');
    if (rtlBtn) {
      const next = document.documentElement.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl';
      applyDirection(next);
    }
  });

  // -------------------------------------------------------------------------
  // 2. Sticky Header & Active Navigation State
  // -------------------------------------------------------------------------
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 24);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Highlight active page link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // -------------------------------------------------------------------------
  // 3. Mobile Hamburger Drawer
  // -------------------------------------------------------------------------
  const menuBtn = document.querySelector('[data-mobile-menu-open]');
  const closeBtn = document.querySelector('[data-mobile-menu-close]');
  const drawer = document.querySelector('.mobile-drawer');
  const backdrop = document.querySelector('.mobile-drawer-backdrop');

  function toggleDrawer(open) {
    if (!drawer || !backdrop) return;
    drawer.classList.toggle('open', open);
    backdrop.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (menuBtn) menuBtn.addEventListener('click', () => toggleDrawer(true));
  if (closeBtn) closeBtn.addEventListener('click', () => toggleDrawer(false));
  if (backdrop) backdrop.addEventListener('click', () => toggleDrawer(false));

  // -------------------------------------------------------------------------
  // 4. Scroll-Triggered Animations (IntersectionObserver)
  // -------------------------------------------------------------------------
  const animatedEls = document.querySelectorAll('[data-animate]');
  if ('IntersectionObserver' in window && animatedEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    animatedEls.forEach((el) => observer.observe(el));
  } else {
    animatedEls.forEach((el) => el.classList.add('in-view'));
  }

  // -------------------------------------------------------------------------
  // 5. Home 1 — Interactive Recovery Journey Timeline
  // -------------------------------------------------------------------------
  const timelineBtns = document.querySelectorAll('[data-timeline-step]');
  const timelineImg = document.getElementById('timeline-display-img');
  const timelineTitle = document.getElementById('timeline-display-title');
  const timelineDesc = document.getElementById('timeline-display-desc');
  const timelineBadge = document.getElementById('timeline-display-badge');

  if (timelineBtns.length && timelineImg && timelineTitle && timelineDesc) {
    timelineBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        timelineBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        timelineBadge.textContent = btn.dataset.stepBadge || '';
        timelineTitle.textContent = btn.dataset.stepTitle || '';
        timelineDesc.textContent = btn.dataset.stepDesc || '';
        if (btn.dataset.stepImg) {
          timelineImg.src = btn.dataset.stepImg;
          timelineImg.alt = btn.dataset.stepAlt || btn.dataset.stepTitle;
        }
      });
    });
  }

  // -------------------------------------------------------------------------
  // 6. Home 2 — Interactive Specialized Treatment Showcase
  // -------------------------------------------------------------------------
  const treatBtns = document.querySelectorAll('[data-treatment-tab]');
  const treatImg = document.getElementById('treatment-panel-img');
  const treatTitle = document.getElementById('treatment-panel-title');
  const treatDesc = document.getElementById('treatment-panel-desc');
  const treatTag = document.getElementById('treatment-panel-tag');

  if (treatBtns.length && treatImg && treatTitle && treatDesc) {
    treatBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        treatBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        treatTag.textContent = btn.dataset.treatTag || '';
        treatTitle.textContent = btn.dataset.treatTitle || '';
        treatDesc.textContent = btn.dataset.treatDesc || '';
        if (btn.dataset.treatImg) {
          treatImg.src = btn.dataset.treatImg;
          treatImg.alt = btn.dataset.treatTitle || '';
        }
      });
    });
  }

  // -------------------------------------------------------------------------
  // 7. Contact Page — FAQ Accordion
  // -------------------------------------------------------------------------
  document.querySelectorAll('.faq-trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.faq-item');
      const panel = item.querySelector('.faq-panel');
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item.open').forEach((openItem) => {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
        openItem.querySelector('.faq-panel').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  // -------------------------------------------------------------------------
  // 8. Password Visibility Eye Toggles (Login & Signup)
  // -------------------------------------------------------------------------
  document.querySelectorAll('[data-password-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = document.getElementById(btn.dataset.passwordToggle);
      if (!input) return;
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    });
  });

  // -------------------------------------------------------------------------
  // 9. Forgot Password Modal (Login)
  // -------------------------------------------------------------------------
  const forgotModal = document.getElementById('forgot-modal');
  document.querySelectorAll('[data-open-forgot]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      if (forgotModal) forgotModal.classList.add('open');
    });
  });
  document.querySelectorAll('[data-close-forgot]').forEach((el) => {
    el.addEventListener('click', () => {
      if (forgotModal) forgotModal.classList.remove('open');
    });
  });

  const forgotForm = document.getElementById('forgot-form');
  if (forgotForm) {
    forgotForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('forgot-email').value.trim();
      const status = document.getElementById('forgot-status');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        status.className = 'form-status-banner error';
        status.textContent = 'Please enter a valid email address.';
        return;
      }
      status.className = 'form-status-banner success';
      status.textContent = 'Demo Preview: In a live deployment, a password reset link would be dispatched to your inbox.';
    });
  }

  // -------------------------------------------------------------------------
  // 10. Newsletter Subscription (Footer Demo)
  // -------------------------------------------------------------------------
  document.querySelectorAll('.newsletter-form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const feedback = form.parentElement.querySelector('.newsletter-feedback');
      const val = input ? input.value.trim() : '';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        if (feedback) feedback.textContent = 'Please enter a valid email address.';
        return;
      }
      if (feedback) {
        feedback.textContent = 'Demo Preview: Thank you for subscribing to Revivana wellness updates.';
      }
      form.reset();
    });
  });

  // -------------------------------------------------------------------------
  // 11. Contact Enquiry Form Validation (Demo Notice)
  // -------------------------------------------------------------------------
  const enquiryForm = document.getElementById('enquiry-form');
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      const setErr = (id, msg) => {
        const el = document.getElementById(id);
        if (el) el.textContent = msg;
        if (msg) valid = false;
      };

      const name = document.getElementById('enq-name').value.trim();
      const email = document.getElementById('enq-email').value.trim();
      const phone = document.getElementById('enq-phone').value.trim();
      const consent = document.getElementById('enq-consent').checked;

      setErr('err-name', name.length >= 2 ? '' : 'Please enter your full name.');
      setErr('err-email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Please enter a valid email address.');
      setErr('err-phone', phone.length >= 7 ? '' : 'Please enter a valid phone number.');
      setErr('err-consent', consent ? '' : 'Please acknowledge the privacy notice before submitting.');

      const status = document.getElementById('enquiry-status');
      if (!valid) {
        status.className = 'form-status-banner error';
        status.textContent = 'Please review the highlighted fields above.';
        return;
      }
      status.className = 'form-status-banner success';
      status.textContent = 'Demo Mode: Form validation succeeded. No data was transmitted—connect a secure backend endpoint before collecting live enquiries.';
      enquiryForm.reset();
    });
  }

  // -------------------------------------------------------------------------
  // 12. Login & Signup Form Validation (Demo Notice)
  // -------------------------------------------------------------------------
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      const email = document.getElementById('login-email').value.trim();
      const pass = document.getElementById('login-password').value;
      const errEmail = document.getElementById('err-login-email');
      const errPass = document.getElementById('err-login-password');

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errEmail.textContent = 'Please enter a valid email address.';
        valid = false;
      } else {
        errEmail.textContent = '';
      }

      if (pass.length < 6) {
        errPass.textContent = 'Password must be at least 6 characters.';
        valid = false;
      } else {
        errPass.textContent = '';
      }

      const status = document.getElementById('login-status');
      if (valid) {
        status.className = 'form-status-banner success';
        status.textContent = 'Demo Mode: Credentials validated locally. Connect your authentication provider for live sign-in.';
      } else {
        status.className = 'form-status-banner error';
        status.textContent = 'Please correct the fields above.';
      }
    });
  }

  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      const setErr = (id, msg) => {
        const el = document.getElementById(id);
        if (el) el.textContent = msg;
        if (msg) valid = false;
      };

      const fname = document.getElementById('su-fname').value.trim();
      const lname = document.getElementById('su-lname').value.trim();
      const email = document.getElementById('su-email').value.trim();
      const phone = document.getElementById('su-phone').value.trim();
      const pass = document.getElementById('su-password').value;
      const confirm = document.getElementById('su-confirm').value;
      const terms = document.getElementById('su-terms').checked;

      setErr('err-su-fname', fname.length >= 2 ? '' : 'First name is required.');
      setErr('err-su-lname', lname.length >= 2 ? '' : 'Last name is required.');
      setErr('err-su-email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Enter a valid email address.');
      setErr('err-su-phone', phone.length >= 7 ? '' : 'Enter a valid phone number.');
      setErr('err-su-password', pass.length >= 8 ? '' : 'Use at least 8 characters.');
      setErr('err-su-confirm', confirm === pass && confirm.length > 0 ? '' : 'Passwords do not match.');
      setErr('err-su-terms', terms ? '' : 'You must agree to the Terms and Privacy Policy.');

      const status = document.getElementById('signup-status');
      if (valid) {
        status.className = 'form-status-banner success';
        status.textContent = 'Demo Mode: Registration fields validated locally. Connect a backend service to create live accounts.';
      } else {
        status.className = 'form-status-banner error';
        status.textContent = 'Please review the highlighted fields.';
      }
    });
  }

  // Social Demo Buttons
  document.querySelectorAll('[data-social-demo]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.socialTarget;
      const status = document.getElementById(targetId);
      if (status) {
        status.className = 'form-status-banner success';
        status.textContent = `Demo Mode: ${btn.dataset.socialDemo} OAuth sign-in is not connected in this static template.`;
      }
    });
  });

  // -------------------------------------------------------------------------
  // 13. Smooth Back to Top
  // -------------------------------------------------------------------------
  document.querySelectorAll('[data-back-to-top]').forEach((btn) => {
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
})();

