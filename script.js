/**
 * PANDOSOFT INDIA — Public Corporate OTC Website
 * Vanilla JavaScript (ES6+) for interactive UI elements and contact form handling
 */

(() => {
  'use strict';

  /* ── DOM utilities ── */
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));
  const on = (element, event, handler, options) => {
    if (element) element.addEventListener(event, handler, options);
  };

  /* ── Toast Notifications ── */
  const toastContainer = $('#toasts');
  function toast(message, type = 'info', duration = 4000) {
    if (!toastContainer) return;
    const toastEl = document.createElement('div');
    toastEl.className = `toast toast--${type}`;
    toastEl.setAttribute('role', 'status');
    toastEl.innerHTML = `
      <span class="toast__icon" aria-hidden="true">${type === 'success' ? '✓' : 'ℹ'}</span>
      <span class="toast__msg">${message}</span>
    `;
    toastContainer.appendChild(toastEl);

    // Trigger animate-in
    requestAnimationFrame(() => {
      toastEl.classList.add('is-visible');
    });

    setTimeout(() => {
      toastEl.classList.remove('is-visible');
      setTimeout(() => toastEl.remove(), 300);
    }, duration);
  }

  /* ── Reading Progress Bar ── */
  const progressBar = $('#progress');
  function updateProgress() {
    if (!progressBar) return;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }
  window.addEventListener('scroll', updateProgress, { passive: true });

  /* ── Header elevation & Active Navigation ── */
  const header = $('#header');
  function updateHeader() {
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  /* ── Mobile Drawer Navigation ── */
  const burger = $('#burger');
  const drawer = $('#drawer');

  function toggleDrawer(open) {
    if (!burger || !drawer) return;
    const isOpen = open !== undefined ? open : drawer.hasAttribute('hidden');
    if (isOpen) {
      drawer.removeAttribute('hidden');
      burger.setAttribute('aria-expanded', 'true');
      burger.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    } else {
      drawer.setAttribute('hidden', '');
      burger.setAttribute('aria-expanded', 'false');
      burger.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  }

  if (burger) {
    on(burger, 'click', () => toggleDrawer());
  }

  // Close drawer on clicking any link inside it
  if (drawer) {
    $$('.drawer__link, .drawer__cta a', drawer).forEach((link) => {
      on(link, 'click', () => toggleDrawer(false));
    });
  }

  // Close drawer on pressing Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer && !drawer.hasAttribute('hidden')) {
      toggleDrawer(false);
    }
  });

  /* ── Back to Top Button ── */
  const toTopBtn = $('#toTop');
  if (toTopBtn) {
    on(toTopBtn, 'click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Active link highlight on scroll ── */
  const sections = $$('section[id], header[id]');
  const navLinks = $$('.nav__link');

  function updateActiveNavLink() {
    if (!sections.length || !navLinks.length) return;
    const scrollPos = window.scrollY + 140;

    let currentSectionId = '';
    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        if (href === `#${currentSectionId}`) {
          link.classList.add('is-active');
        } else {
          link.classList.remove('is-active');
        }
      });
    }
  }
  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  /* ── Smooth Anchor Scrolling with Header Offset ── */
  $$('a[href^="#"]').forEach((anchor) => {
    on(anchor, 'click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || targetId === '#top') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const targetEl = $(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
        history.pushState(null, '', targetId);
      }
    });
  });

  /* ── Scroll Reveal Animations ── */
  const revealElements = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px 40px 0px' }
    );
    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('is-in'));
  }

  /* ── Subtle Magnetic Buttons (Desktop) ── */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion && window.innerWidth > 900) {
    $$('[data-magnetic]').forEach((btn) => {
      on(btn, 'mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });
      on(btn, 'mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ── Contact / OTC Enquiry Form Handling ── */
  const enquiryForm = $('#enquiryForm');
  const eqAlert = $('#eqFormAlert');
  const eqSubmitBtn = $('#eqSubmitBtn');

  if (enquiryForm) {
    on(enquiryForm, 'submit', (e) => {
      e.preventDefault();

      const name = ($('#eqName') && $('#eqName').value.trim()) || '';
      const email = ($('#eqEmail') && $('#eqEmail').value.trim()) || '';
      const eqType = ($('#eqType') && $('#eqType').value) || '';
      const company = ($('#eqCompany') && $('#eqCompany').value.trim()) || '';
      const message = ($('#eqMessage') && $('#eqMessage').value.trim()) || '';
      const privacy = $('#eqPrivacy') && $('#eqPrivacy').checked;

      // Validate required fields
      if (!name || !email || !eqType || !company || !message || !privacy) {
        if (eqAlert) {
          eqAlert.className = 'form-alert form-alert--error';
          eqAlert.hidden = false;
          eqAlert.textContent = 'Please complete all required fields and confirm the Privacy Notice acknowledgement.';
        }
        return;
      }

      // Basic email pattern check
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        if (eqAlert) {
          eqAlert.className = 'form-alert form-alert--error';
          eqAlert.hidden = false;
          eqAlert.textContent = 'Please provide a valid corporate email address.';
        }
        return;
      }

      // Enter submission state
      if (eqSubmitBtn) {
        eqSubmitBtn.disabled = true;
        eqSubmitBtn.dataset.originalHtml = eqSubmitBtn.innerHTML;
        eqSubmitBtn.textContent = 'Submitting Enquiry...';
      }

      // Simulate secure processing / Supabase dispatch
      setTimeout(() => {
        if (eqAlert) {
          eqAlert.className = 'form-alert form-alert--success';
          eqAlert.hidden = false;
          eqAlert.textContent = 'Your enquiry has been received. Please check your email for further communication. This enquiry does not create a trade or lock a price.';
        }

        toast('Your enquiry has been received. Check your email for further communication.', 'success', 5000);
        enquiryForm.reset();

        if (eqSubmitBtn) {
          eqSubmitBtn.disabled = false;
          eqSubmitBtn.innerHTML = eqSubmitBtn.dataset.originalHtml || 'Send Enquiry';
        }

        // Scroll so alert is clearly visible
        if (eqAlert) {
          eqAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 700);
    });
  }

  /* ── Dedicated Referral Partner Application Form Handling ── */
  const referralForm = $('#referralAppForm');
  const refAlert = $('#refFormAlert');
  const refSubmitBtn = $('#refSubmitBtn');

  if (referralForm) {
    on(referralForm, 'submit', (e) => {
      e.preventDefault();

      const name = ($('#refName') && $('#refName').value.trim()) || '';
      const email = ($('#refEmail') && $('#refEmail').value.trim()) || '';
      const phone = ($('#refPhone') && $('#refPhone').value.trim()) || '';
      const location = ($('#refLocation') && $('#refLocation').value.trim()) || '';
      const occupation = ($('#refOccupation') && $('#refOccupation').value.trim()) || '';
      const bizTypes = ($('#refBizTypes') && $('#refBizTypes').value) || '';
      const introPlan = ($('#refIntroPlan') && $('#refIntroPlan').value.trim()) || '';
      const privacy = $('#refPrivacy') && $('#refPrivacy').checked;
      const terms = $('#refTerms') && $('#refTerms').checked;

      // Validate required fields
      if (!name || !email || !phone || !location || !occupation || !bizTypes || !introPlan || !privacy || !terms) {
        if (refAlert) {
          refAlert.className = 'form-alert form-alert--error';
          refAlert.hidden = false;
          refAlert.textContent = 'Please complete all required fields and confirm the Privacy and Program acknowledgements.';
        }
        return;
      }

      // Email format check
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        if (refAlert) {
          refAlert.className = 'form-alert form-alert--error';
          refAlert.hidden = false;
          refAlert.textContent = 'Please provide a valid professional email address.';
        }
        return;
      }

      // Submission state
      if (refSubmitBtn) {
        refSubmitBtn.disabled = true;
        refSubmitBtn.dataset.originalHtml = refSubmitBtn.innerHTML;
        refSubmitBtn.textContent = 'Submitting Partner Application...';
      }

      // Simulate secure processing / Supabase Edge dispatch
      setTimeout(() => {
        if (refAlert) {
          refAlert.className = 'form-alert form-alert--success';
          refAlert.hidden = false;
          refAlert.textContent = 'Thank you. Your Referral Partner application has been received. Our team will contact you after review. Submitting an application does not activate a partnership or commission entitlement.';
        }

        toast('Thank you. Your Referral Partner application has been received.', 'success', 5000);
        referralForm.reset();

        if (refSubmitBtn) {
          refSubmitBtn.disabled = false;
          refSubmitBtn.innerHTML = refSubmitBtn.dataset.originalHtml || 'Submit Partner Application';
        }

        // Scroll so alert is clearly visible
        if (refAlert) {
          refAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 700);
    });
  }

  console.log('PANDOSOFT INDIA — OTC website client initialized.');
})();
