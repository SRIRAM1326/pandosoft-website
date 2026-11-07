/**
 * PANDOSOFT INDIA ΓÇö Public Corporate OTC Website
 * Vanilla JavaScript (ES6+) for interactive UI elements and contact form handling
 */

(() => {
  'use strict';

  /* ΓöÇΓöÇ DOM utilities ΓöÇΓöÇ */
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));
  const on = (element, event, handler, options) => {
    if (element) element.addEventListener(event, handler, options);
  };

  /* ΓöÇΓöÇ Toast Notifications ΓöÇΓöÇ */
  const toastContainer = $('#toasts');
  function toast(message, type = 'info', duration = 4000) {
    if (!toastContainer) return;
    const toastEl = document.createElement('div');
    toastEl.className = `toast toast--${type}`;
    toastEl.setAttribute('role', 'status');
    toastEl.innerHTML = `
      <span class="toast__icon" aria-hidden="true">${type === 'success' ? 'Γ£ô' : 'Γä╣'}</span>
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

  /* ── Disabled Buttons Guard ── */
  document.addEventListener('click', function(e) {
    const disabledBtn = e.target.closest('.is-disabled, [disabled], [aria-disabled="true"]');
    if (disabledBtn) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);

  /* ΓöÇΓöÇ Reading Progress Bar ΓöÇΓöÇ */
  const progressBar = $('#progress');
  function updateProgress() {
    if (!progressBar) return;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }
  window.addEventListener('scroll', updateProgress, { passive: true });

  /* ΓöÇΓöÇ Header elevation & Active Navigation ΓöÇΓöÇ */
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

  /* ΓöÇΓöÇ Mobile Drawer Navigation ΓöÇΓöÇ */
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

  /* ΓöÇΓöÇ Back to Top Button ΓöÇΓöÇ */
  const toTopBtn = $('#toTop');
  if (toTopBtn) {
    on(toTopBtn, 'click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

    /* ── Active link highlight on scroll & page ── */
  const sections = $$('section[id], header[id]');
  const navLinks = $$('.nav__link');

  function updateActiveNavLink() {
    if (!navLinks.length) return;
    const pathName = window.location.pathname.split('/').pop() || 'index.html';
    const isHowItWorks = pathName.includes('how-it-works') || pathName.includes('faq');
    const isAbout = pathName.includes('about');
    const isContact = pathName.includes('contact');
    const isReferral = pathName.includes('referral');

    if (isHowItWorks) {
      const faqSec = $('#faq');
      const isFaqScrolled = faqSec && (window.scrollY + 140 >= faqSec.offsetTop);
      navLinks.forEach((link) => {
        const href = link.getAttribute('href') || '';
        if (isFaqScrolled) {
          if (href.includes('#faq')) link.classList.add('is-active');
          else link.classList.remove('is-active');
        } else {
          if (href.includes('how-it-works.html') && !href.includes('#faq')) link.classList.add('is-active');
          else link.classList.remove('is-active');
        }
      });
      return;
    }

    if (isAbout) {
      navLinks.forEach((link) => {
        const href = link.getAttribute('href') || '';
        if (href.includes('about')) link.classList.add('is-active');
        else link.classList.remove('is-active');
      });
      return;
    }

    if (isContact) {
      navLinks.forEach((link) => {
        const href = link.getAttribute('href') || '';
        if (href.includes('contact')) link.classList.add('is-active');
        else link.classList.remove('is-active');
      });
      return;
    }

    if (isReferral) {
      navLinks.forEach((link) => {
        const href = link.getAttribute('href') || '';
        if (href.includes('referral')) link.classList.add('is-active');
        else link.classList.remove('is-active');
      });
      return;
    }

    if (!sections.length) return;
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
        const href = link.getAttribute('href') || '';
        if (href === `#${currentSectionId}` || href === `index.html#${currentSectionId}`) {
          link.classList.add('is-active');
        } else {
          link.classList.remove('is-active');
        }
      });
    }
  }
  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  window.addEventListener('DOMContentLoaded', updateActiveNavLink);
  updateActiveNavLink();

  /* ── Smooth Anchor Scrolling with Header Offset ── */
  $$('a[href^="#"], a[href*="#"]').forEach((anchor) => {
    on(anchor, 'click', (e) => {
      const rawHref = anchor.getAttribute('href');
      if (!rawHref) return;

      // Handle pure hash or same-page anchor
      if (rawHref.startsWith('#')) {
        const targetId = rawHref;
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
      } else if (rawHref.includes('#')) {
        try {
          const url = new URL(rawHref, window.location.href);
          if (url.origin === window.location.origin && url.pathname === window.location.pathname && url.hash) {
            const targetId = url.hash;
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
          }
        } catch (err) {}
      }
    });
  });

  // Handle hash scroll on initial load (e.g. how-it-works.html#faq)
  if (window.location.hash) {
    window.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        try {
          const targetEl = $(window.location.hash);
          if (targetEl) {
            const headerOffset = 80;
            const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - headerOffset;
            window.scrollTo({ top: targetPos, behavior: 'smooth' });
          }
        } catch (err) {}
      }, 100);
    });
  }

  /* ΓöÇΓöÇ Scroll Reveal Animations ΓöÇΓöÇ */
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

  /* ΓöÇΓöÇ Subtle Magnetic Buttons (Desktop) ΓöÇΓöÇ */
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

  /* ΓöÇΓöÇ Contact / OTC Enquiry Form Handling ΓöÇΓöÇ */
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

      const phoneVal = ($('#eqPhone') && $('#eqPhone').value.trim()) || 'Not provided';
      const rangeVal = ($('#eqRange') && $('#eqRange').value) || 'Not specified';

      const payload = {
        name: name,
        email: email,
        phone: phoneVal,
        enquiry_type: eqType,
        company: company,
        transaction_range: rangeVal,
        message: message,
        _subject: 'New OTC Service Enquiry: ' + company + ' (' + eqType + ')',
        _template: 'table',
        _captcha: 'false'
      };

      fetch('https://formsubmit.co/ajax/Info@pandosoftindia.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      .then((res) => {
        if (!res.ok) throw new Error('Submission failed');
        return res.json();
      })
      .then((data) => {
        if (eqAlert) {
          eqAlert.className = 'form-alert form-alert--success';
          eqAlert.hidden = false;
          eqAlert.textContent = 'Your enquiry has been received. Please check your email for further communication. This enquiry does not create a trade or lock a price.';
        }
        toast('Your enquiry has been sent to Info@pandosoftindia.com.', 'success', 5000);
        enquiryForm.reset();
      })
      .catch((err) => {
        console.error('FormSubmit Error:', err);
        if (eqAlert) {
          eqAlert.className = 'form-alert form-alert--error';
          eqAlert.hidden = false;
          eqAlert.textContent = 'We could not submit your enquiry. Please try again or email Info@pandosoftindia.com directly.';
        }
        toast('Could not send enquiry. Please try again.', 'error', 5000);
      })
      .finally(() => {
        if (eqSubmitBtn) {
          eqSubmitBtn.disabled = false;
          eqSubmitBtn.innerHTML = eqSubmitBtn.dataset.originalHtml || 'Send Enquiry';
        }
        if (eqAlert) {
          eqAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    });
  }

  /* ΓöÇΓöÇ Dedicated Referral Partner Application Form Handling ΓöÇΓöÇ */
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

      const profileVal = ($('#refProfile') && $('#refProfile').value.trim()) || 'Not provided';
      const volumeVal = ($('#refVolume') && $('#refVolume').value) || 'Not specified';
      const messageVal = ($('#refMessage') && $('#refMessage').value.trim()) || 'None';
      const marketingVal = ($('#refMarketing') && $('#refMarketing').checked) ? 'Yes' : 'No';

      const payload = {
        full_name: name,
        email: email,
        phone: phone,
        city_and_country: location,
        occupation: occupation,
        professional_profile: profileVal,
        expected_business_types: bizTypes,
        expected_volume: volumeVal,
        introduction_plan: introPlan,
        additional_message: messageVal,
        marketing_opt_in: marketingVal,
        _subject: 'New Referral Partner Application: ' + name + ' (' + location + ')',
        _template: 'table',
        _captcha: 'false'
      };

      fetch('https://formsubmit.co/ajax/Info@pandosoftindia.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      .then((res) => {
        if (!res.ok) throw new Error('Submission failed');
        return res.json();
      })
      .then((data) => {
        if (refAlert) {
          refAlert.className = 'form-alert form-alert--success';
          refAlert.hidden = false;
          refAlert.textContent = 'Thank you. Your Referral Partner application has been received. Our team will contact you after review. Submitting an application does not activate a partnership or commission entitlement.';
        }
        toast('Your partner application has been sent to Info@pandosoftindia.com.', 'success', 5000);
        referralForm.reset();
      })
      .catch((err) => {
        console.error('FormSubmit Error:', err);
        if (refAlert) {
          refAlert.className = 'form-alert form-alert--error';
          refAlert.hidden = false;
          refAlert.textContent = 'We could not submit your application. Please try again or email Info@pandosoftindia.com.';
        }
        toast('Could not send application. Please try again.', 'error', 5000);
      })
      .finally(() => {
        if (refSubmitBtn) {
          refSubmitBtn.disabled = false;
          refSubmitBtn.innerHTML = refSubmitBtn.dataset.originalHtml || 'Submit Partner Application';
        }
        if (refAlert) {
          refAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    });
  }

    /* ── Live Reference Rates & Indicative OTC Order Book ── */
  let setTerminalAsset = null;
  let updateTerminalLivePrices = null;
  const ratesTableBody = $('#ratesTableBody');
  const ratesCountdownEl = $('#ratesCountdown');
  const ratesRefreshBtn = $('#ratesRefreshBtn');
  const currencyBtns = $$('.currency-btn');
  const orderbookTitle = $('#orderbookTitle');
  const orderbookPairTag = $('#orderbookPairTag');
  const orderbookSpread = $('#orderbookSpread');
  const orderbookMidPrice = $('#orderbookMidPrice');
  const orderbookAsks = $('#orderbookAsks');
  const orderbookBids = $('#orderbookBids');
  const orderbookCurrLabels = $$('.orderbook-curr-label');

  if (ratesTableBody) {
    let currentCurrency = 'inr';
    let selectedCoinId = 'tether';
    let countdownSeconds = 60;
    let timerId = null;
    let ratesData = [];

    // Fallback baseline data if API is offline or rate limited
    const fallbackData = {
      inr: [
        { id: 'tether', name: 'Tether', symbol: 'usdt', current_price: 91.48, price_change_percentage_24h: 0.12, market_cap: 12450000000000, image: 'https://assets.coingecko.com/coins/images/325/large/Tether.png' },
        { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', current_price: 8845000, price_change_percentage_24h: 2.34, market_cap: 174500000000000, image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
        { id: 'ethereum', name: 'Ethereum', symbol: 'eth', current_price: 254800, price_change_percentage_24h: 1.58, market_cap: 30650000000000, image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' },
        { id: 'solana', name: 'Solana', symbol: 'sol', current_price: 17350, price_change_percentage_24h: 4.12, market_cap: 8190000000000, image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png' },
        { id: 'ripple', name: 'XRP', symbol: 'xrp', current_price: 219.20, price_change_percentage_24h: -0.84, market_cap: 12580000000000, image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png' }
      ],
      usd: [
        { id: 'tether', name: 'Tether', symbol: 'usdt', current_price: 1.000, price_change_percentage_24h: 0.05, market_cap: 136200000000, image: 'https://assets.coingecko.com/coins/images/325/large/Tether.png' },
        { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', current_price: 96520.00, price_change_percentage_24h: 2.34, market_cap: 1905000000000, image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
        { id: 'ethereum', name: 'Ethereum', symbol: 'eth', current_price: 2785.40, price_change_percentage_24h: 1.58, market_cap: 334800000000, image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' },
        { id: 'solana', name: 'Solana', symbol: 'sol', current_price: 189.60, price_change_percentage_24h: 4.12, market_cap: 89500000000, image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png' },
        { id: 'ripple', name: 'XRP', symbol: 'xrp', current_price: 2.395, price_change_percentage_24h: -0.84, market_cap: 137400000000, image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png' }
      ]
    };

    function formatCurrency(val, currency) {
      if (typeof val !== 'number' || isNaN(val)) return '-';
      const prefix = currency === 'inr' ? '₹' : (currency === 'usd' ? '$' : '₮');
      if (val >= 1000) {
        return prefix + Number(val).toLocaleString(currency === 'inr' ? 'en-IN' : 'en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        });
      } else if (val >= 1) {
        return prefix + Number(val).toLocaleString(currency === 'inr' ? 'en-IN' : 'en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 3
        });
      } else {
        return prefix + Number(val).toFixed(4);
      }
    }

    function formatMarketCap(val, currency) {
      if (typeof val !== 'number' || isNaN(val)) return '-';
      const prefix = currency === 'inr' ? '₹' : '$';
      if (currency === 'inr') {
        if (val >= 1e12) return prefix + (val / 1e12).toFixed(2) + ' Lakh Cr';
        if (val >= 1e7) return prefix + (val / 1e7).toFixed(2) + ' Cr';
        return prefix + val.toLocaleString('en-IN');
      } else {
        if (val >= 1e12) return prefix + (val / 1e12).toFixed(2) + 'T';
        if (val >= 1e9) return prefix + (val / 1e9).toFixed(2) + 'B';
        if (val >= 1e6) return prefix + (val / 1e6).toFixed(2) + 'M';
        return prefix + val.toLocaleString('en-US');
      }
    }

    function renderRatesTable() {
      if (!ratesTableBody) return;
      ratesTableBody.innerHTML = ratesData.map(function(coin) {
        const isSelected = coin.id === selectedCoinId;
        const change = coin.price_change_percentage_24h != null ? coin.price_change_percentage_24h : 0;
        const isPos = change >= 0;
        return (
          '<tr class="' + (isSelected ? 'is-selected' : '') + '" data-coin-id="' + coin.id + '" tabindex="0" role="button" aria-pressed="' + isSelected + '">' +
            '<td>' +
              '<div class="asset-col">' +
                '<img class="asset-img" src="' + coin.image + '" alt="' + coin.name + ' logo" loading="lazy" onerror="this.style.display=\'none\'" />' +
                '<div class="asset-meta">' +
                  '<span class="asset-name">' + coin.name + '</span>' +
                  '<span class="asset-symbol">' + (coin.symbol || '').toUpperCase() + '</span>' +
                '</div>' +
              '</div>' +
            '</td>' +
            '<td class="text-right">' +
              '<span class="asset-price">' + formatCurrency(coin.current_price, currentCurrency) + '</span>' +
            '</td>' +
            '<td class="text-right">' +
              '<span class="change-pill ' + (isPos ? 'change-pill--up' : 'change-pill--down') + '">' +
                (isPos ? '▲ +' : '▼ ') + Math.abs(change).toFixed(2) + '%' +
              '</span>' +
            '</td>' +
            '<td class="text-right">' +
              '<span class="asset-mcap">' + formatMarketCap(coin.market_cap, currentCurrency) + '</span>' +
            '</td>' +
          '</tr>'
        );
      }).join('');

      // Wire row clicks
      ratesTableBody.querySelectorAll('tr').forEach(function(row) {
        row.addEventListener('click', function() {
          const coinId = row.dataset.coinId;
          if (coinId && coinId !== selectedCoinId) {
            selectedCoinId = coinId;
            renderRatesTable();
            renderOrderBook();
            if (typeof setTerminalAsset === 'function') {
              setTerminalAsset(coinId);
            }
          }
        });
      });
    }

    function renderOrderBook() {
      const activeCoin = ratesData.find(function(c) { return c.id === selectedCoinId; }) || ratesData[0];
      if (!activeCoin) return;

      const symbol = (activeCoin.symbol || 'USDT').toUpperCase();
      const currLabel = currentCurrency.toUpperCase();
      const mid = Number(activeCoin.current_price) || (currentCurrency === 'inr' ? 91.48 : 1.0);

      // Update header details
      if (orderbookTitle) orderbookTitle.textContent = 'Indicative ' + symbol + ' OTC Order Book';
      if (orderbookPairTag) orderbookPairTag.textContent = symbol + ' / ' + currLabel;
      if (orderbookSpread) orderbookSpread.textContent = 'Spread: ~0.10%';
      if (orderbookMidPrice) orderbookMidPrice.textContent = formatCurrency(mid, currentCurrency);
      orderbookCurrLabels.forEach(function(el) { el.textContent = currLabel; });

      // Generate 5 asks (above mid) and 5 bids (below mid)
      const askMultipliers = [1.0028, 1.0020, 1.0014, 1.0009, 1.0005];
      const bidMultipliers = [0.9995, 0.9991, 0.9985, 0.9978, 0.9970];

      const baseSize = symbol === 'BTC' ? 0.85 : symbol === 'ETH' ? 12.5 : symbol === 'SOL' ? 140 : symbol === 'XRP' ? 12500 : 25000;

      let askTotal = 0;
      const asks = askMultipliers.map(function(m, idx) {
        const price = mid * m;
        const size = +(baseSize * (1 + idx * 0.42 + Math.sin(idx * 2) * 0.15)).toFixed(symbol === 'BTC' ? 4 : symbol === 'ETH' ? 2 : 0);
        askTotal += size;
        return { price: price, size: size, total: askTotal };
      });

      let bidTotal = 0;
      const bids = bidMultipliers.map(function(m, idx) {
        const price = mid * m;
        const size = +(baseSize * (1.1 + idx * 0.38 + Math.cos(idx * 2) * 0.18)).toFixed(symbol === 'BTC' ? 4 : symbol === 'ETH' ? 2 : 0);
        bidTotal += size;
        return { price: price, size: size, total: bidTotal };
      });

      const maxTotal = Math.max(askTotal, bidTotal) || 1;

      // Render Asks
      if (orderbookAsks) {
        orderbookAsks.innerHTML = asks.map(function(item) {
          const depthPct = Math.min(100, Math.round((item.total / maxTotal) * 100));
          return (
            '<div class="orderbook-row orderbook-row--ask">' +
              '<span class="orderbook-price">' + formatCurrency(item.price, currentCurrency) + '</span>' +
              '<span class="orderbook-size text-right">' + item.size.toLocaleString() + '</span>' +
              '<span class="orderbook-total text-right">' + item.total.toLocaleString() + '</span>' +
              '<div class="orderbook-row__depth-bar" style="width: ' + depthPct + '%;"></div>' +
            '</div>'
          );
        }).join('');
      }

      // Render Bids
      if (orderbookBids) {
        orderbookBids.innerHTML = bids.map(function(item) {
          const depthPct = Math.min(100, Math.round((item.total / maxTotal) * 100));
          return (
            '<div class="orderbook-row orderbook-row--bid">' +
              '<span class="orderbook-price">' + formatCurrency(item.price, currentCurrency) + '</span>' +
              '<span class="orderbook-size text-right">' + item.size.toLocaleString() + '</span>' +
              '<span class="orderbook-total text-right">' + item.total.toLocaleString() + '</span>' +
              '<div class="orderbook-row__depth-bar" style="width: ' + depthPct + '%;"></div>' +
            '</div>'
          );
        }).join('');
      }
    }

    async function fetchLiveRates() {
      if (ratesRefreshBtn) ratesRefreshBtn.classList.add('is-spinning');
      const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=' + currentCurrency + '&ids=tether,bitcoin,ethereum,solana,ripple&order=market_cap_desc&sparkline=false&price_change_percentage=24h';

      try {
        const controller = new AbortController();
        const timeout = setTimeout(function() { controller.abort(); }, 6000);
        const res = await fetch(url, { signal: controller.signal, headers: { 'Accept': 'application/json' } });
        clearTimeout(timeout);

        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          ratesData = data;
        } else {
          throw new Error('Empty API response');
        }
      } catch (err) {
        // Fallback baseline data if offline or rate limited
        ratesData = (fallbackData[currentCurrency] || fallbackData.inr).map(function(c) {
          const fluctuation = 1 + (Math.random() * 0.0016 - 0.0008);
          return Object.assign({}, c, {
            current_price: +(c.current_price * fluctuation).toFixed(c.current_price < 5 ? 4 : 2)
          });
        });
      } finally {
        renderRatesTable();
        renderOrderBook();
        if (typeof updateTerminalLivePrices === 'function') {
          updateTerminalLivePrices(ratesData);
        }
        if (ratesRefreshBtn) {
          setTimeout(function() { ratesRefreshBtn.classList.remove('is-spinning'); }, 400);
        }
      }
    }

    function resetCountdown() {
      countdownSeconds = 60;
      if (ratesCountdownEl) ratesCountdownEl.textContent = countdownSeconds + 's';
    }

    function startRatesTimer() {
      if (timerId) clearInterval(timerId);
      resetCountdown();
      timerId = setInterval(function() {
        countdownSeconds--;
        if (ratesCountdownEl) ratesCountdownEl.textContent = countdownSeconds + 's';
        if (countdownSeconds <= 0) {
          fetchLiveRates();
          resetCountdown();
        }
      }, 1000);
    }

    // Currency toggle buttons
    currencyBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        const newCurr = btn.dataset.currency;
        if (newCurr && newCurr !== currentCurrency) {
          currencyBtns.forEach(function(b) { b.classList.remove('is-active'); });
          btn.classList.add('is-active');
          currentCurrency = newCurr;
          fetchLiveRates();
          resetCountdown();
        }
      });
    });

    // Manual Refresh button
    if (ratesRefreshBtn) {
      ratesRefreshBtn.addEventListener('click', function() {
        fetchLiveRates();
        resetCountdown();
      });
    }

    // Initial load
    fetchLiveRates();
    startRatesTimer();
  }

      /* ════════════════════════════════════════════════════════════════
     LIVE ASSET / INR TERMINAL (CANDLESTICK CHART, ORDER BOOK & TRADE DESK)
     ════════════════════════════════════════════════════════════════ */
  const terminalCanvas = $('#usdtTerminalChart');
  const tMidRateEl = $('#tMidRate');
  const tRateChangeEl = $('#tRateChange');
  const tHighRateEl = $('#tHighRate');
  const tLowRateEl = $('#tLowRate');
  const chartHoverPriceEl = $('#chartHoverPrice');
  const chartHoverTooltip = $('#chartHoverTooltip');
  const tfBtns = $$('.tf-btn');
  const modeBtns = $$('.mode-btn');
  const chartSyncTimeEl = $('#chartSyncTime');
  const ohlcOEl = $('#ohlcO');
  const ohlcHEl = $('#ohlcH');
  const ohlcLEl = $('#ohlcL');
  const ohlcCEl = $('#ohlcC');

  const graphAssetSelect = $('#graphAssetSelect');
  const terminalAssetLogo = $('#terminalAssetLogo');
  const terminalMainTitle = $('#terminalMainTitle');
  const terminalChainBadge = $('#terminalChainBadge');
  const terminalSubTitle = $('#terminalSubTitle');
  const chartMarketTitle = $('#chartMarketTitle');
  const deskBookSizeHead = $('#deskBookSizeHead');

  const deskAsksList = $('#deskAsksList');
  const deskBidsList = $('#deskBidsList');
  const deskMidDisplay = $('#deskMidDisplay');
  const terminalSpreadBadge = $('#terminalSpreadBadge');

  const btnSideBuy = $('#btnSideBuy');
  const txtBtnBuy = $('#txtBtnBuy');
  const btnSideSell = $('#btnSideSell');
  const btnSideIndSell = $('#btnSideIndSell');
  const tradeInpPay = $('#tradeInpPay');
  const tradeInpRec = $('#tradeInpRec');
  const lblTradePay = $('#lblTradePay');
  const lblTradeRec = $('#lblTradeRec');
  const symTradePay = $('#symTradePay');
  const symTradeRec = $('#symTradeRec');
  const codeTradePay = $('#codeTradePay');
  const codeTradeRec = $('#codeTradeRec');
  const tagTradeMin = $('#tagTradeMin');
  const btnTradeSwap = $('#btnTradeSwap');
  const deskSummaryRate = $('#deskSummaryRate');
  const deskSummaryRoute = $('#deskSummaryRoute');
  const deskSummaryType = $('#deskSummaryType');
  const deskComplianceNote = $('#deskComplianceNote');
  const btnSubmitDeskTrade = $('#btnSubmitDeskTrade');
  const txtDeskTradeAction = $('#txtDeskTradeAction');

  if (terminalCanvas) {
    const TERMINAL_ASSETS = {
      tether: {
        id: 'tether',
        name: 'Tether',
        symbol: 'USDT',
        pair: 'USDT / INR',
        logo: 'https://assets.coingecko.com/coins/images/325/large/Tether.png',
        chains: 'TRC20 &bull; ERC20 &bull; BEP20',
        basePrice: 91.48,
        change24h: 0.12,
        volatility: 0.0016,
        decimals: 2,
        amountDecimals: 2,
        defaultPayInr: 500000,
        defaultSellAsset: 5000,
        currencySymbol: '₮',
        baseOrderSize: 25000
      },
      bitcoin: {
        id: 'bitcoin',
        name: 'Bitcoin',
        symbol: 'BTC',
        pair: 'BTC / INR',
        logo: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
        chains: 'Bitcoin &bull; SegWit &bull; Lightning',
        basePrice: 8845000,
        change24h: 2.34,
        volatility: 0.012,
        decimals: 0,
        amountDecimals: 5,
        defaultPayInr: 500000,
        defaultSellAsset: 0.06,
        currencySymbol: '₿',
        baseOrderSize: 0.85
      },
      ethereum: {
        id: 'ethereum',
        name: 'Ethereum',
        symbol: 'ETH',
        pair: 'ETH / INR',
        logo: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
        chains: 'ERC20 &bull; Arbitrum &bull; Optimism',
        basePrice: 254800,
        change24h: 1.58,
        volatility: 0.015,
        decimals: 0,
        amountDecimals: 4,
        defaultPayInr: 500000,
        defaultSellAsset: 2.0,
        currencySymbol: 'Ξ',
        baseOrderSize: 12.0
      },
      ripple: {
        id: 'ripple',
        name: 'XRP',
        symbol: 'XRP',
        pair: 'XRP / INR',
        logo: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
        chains: 'XRP Ledger &bull; XRPL &bull; RippleNet',
        basePrice: 219.20,
        change24h: -0.84,
        volatility: 0.018,
        decimals: 2,
        amountDecimals: 2,
        defaultPayInr: 500000,
        defaultSellAsset: 2200,
        currencySymbol: '✕',
        baseOrderSize: 15000
      },
      solana: {
        id: 'solana',
        name: 'Solana',
        symbol: 'SOL',
        pair: 'SOL / INR',
        logo: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
        chains: 'Solana Mainnet &bull; SPL',
        basePrice: 17350,
        change24h: 4.12,
        volatility: 0.020,
        decimals: 2,
        amountDecimals: 3,
        defaultPayInr: 500000,
        defaultSellAsset: 28,
        currencySymbol: '◎',
        baseOrderSize: 140
      }
    };

    let selectedAssetId = (graphAssetSelect && graphAssetSelect.value) || 'tether';
    let currentAsset = TERMINAL_ASSETS[selectedAssetId] || TERMINAL_ASSETS.tether;
    let activeSide = 'buy'; // 'buy', 'sell' (corporate), or 'ind_sell' (individual)
    let activeTimeframe = '24h';
    let chartMode = 'candles'; // 'candles' or 'line'
    let hoverIndex = null;

    function formatInrPrice(val, decimals) {
      if (typeof val !== 'number' || isNaN(val)) return '₹0.00';
      if (val >= 100000) {
        return '₹' + Number(val).toLocaleString('en-IN', {
          minimumFractionDigits: decimals != null ? decimals : 0,
          maximumFractionDigits: decimals != null ? decimals : 0
        });
      }
      return '₹' + Number(val).toLocaleString('en-IN', {
        minimumFractionDigits: decimals != null ? decimals : 2,
        maximumFractionDigits: decimals != null ? decimals : 2
      });
    }

    // Generate realistic OHLC Candlestick series
    function generateCandles(timeframe, currentBase, baseVol) {
      const candles = [];
      const now = Date.now();
      let count = 30;
      let intervalMs = 3600 * 1000;
      let volFactor = baseVol || 0.01;

      if (timeframe === '1h') {
        count = 30;
        intervalMs = 2 * 60 * 1000;
        volFactor *= 0.35;
      } else if (timeframe === '24h') {
        count = 28;
        intervalMs = 50 * 60 * 1000;
        volFactor *= 0.85;
      } else if (timeframe === '7d') {
        count = 28;
        intervalMs = 6 * 3600 * 1000;
        volFactor *= 1.8;
      } else if (timeframe === '1m') {
        count = 30;
        intervalMs = 24 * 3600 * 1000;
        volFactor *= 3.0;
      }

      const volatility = currentBase * volFactor;
      let runningPrice = currentBase - (volatility * 0.8 * (Math.random() > 0.5 ? 1 : -1));

      for (let i = 0; i < count; i++) {
        const time = new Date(now - (count - 1 - i) * intervalMs);
        const wave = Math.sin(i * 0.5) * volatility * 0.8 + Math.cos(i * 1.4) * (volatility * 0.4);
        const rand = (Math.random() - 0.48) * volatility;
        const change = wave * 0.3 + rand;

        const open = +(runningPrice).toFixed(currentBase < 1000 ? 2 : 0);
        runningPrice = Math.max(currentBase * 0.7, +(open + change).toFixed(currentBase < 1000 ? 2 : 0));
        const close = runningPrice;

        const wickHigh = +(Math.random() * volatility * 0.7).toFixed(currentBase < 1000 ? 2 : 0);
        const wickLow = +(Math.random() * volatility * 0.7).toFixed(currentBase < 1000 ? 2 : 0);

        const high = +(Math.max(open, close) + wickHigh).toFixed(currentBase < 1000 ? 2 : 0);
        const low = +(Math.min(open, close) - wickLow).toFixed(currentBase < 1000 ? 2 : 0);
        const volume = Math.round((currentAsset.baseOrderSize * 10) * (0.6 + Math.random() * 0.8));

        candles.push({
          time: time,
          open: open,
          high: high,
          low: low,
          close: close,
          volume: volume
        });
      }

      // Ensure last candle closes at currentBase
      const last = candles[candles.length - 1];
      last.close = currentBase;
      last.high = Math.max(last.high, currentBase);
      last.low = Math.min(last.low, currentBase);

      return candles;
    }

    let candleData = generateCandles(activeTimeframe, currentAsset.basePrice, currentAsset.volatility);

    // Update OHLC Header
    function updateOhlcDisplay(candle) {
      if (!candle) candle = candleData[candleData.length - 1];
      if (!candle) return;

      if (ohlcOEl) ohlcOEl.textContent = formatInrPrice(candle.open, currentAsset.decimals);
      if (ohlcHEl) ohlcHEl.textContent = formatInrPrice(candle.high, currentAsset.decimals);
      if (ohlcLEl) ohlcLEl.textContent = formatInrPrice(candle.low, currentAsset.decimals);
      if (ohlcCEl) {
        ohlcCEl.textContent = formatInrPrice(candle.close, currentAsset.decimals);
        ohlcCEl.style.color = candle.close >= candle.open ? '#047857' : '#DC2626';
      }
      if (chartHoverPriceEl) {
        chartHoverPriceEl.textContent = formatInrPrice(candle.close, currentAsset.decimals);
        chartHoverPriceEl.style.color = candle.close >= candle.open ? '#047857' : '#DC2626';
      }
    }

    // Canvas rendering engine
    function renderTerminalChart() {
      if (!terminalCanvas) return;
      const ctx = terminalCanvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = terminalCanvas.getBoundingClientRect();
      const width = rect.width || 560;
      const height = rect.height || 250;

      terminalCanvas.width = width * dpr;
      terminalCanvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, width, height);

      if (!candleData || candleData.length === 0) return;

      const paddingLeft = 14;
      const paddingRight = currentAsset.basePrice >= 100000 ? 76 : 58;
      const paddingTop = 22;
      const paddingBottom = 26;
      const chartW = width - paddingLeft - paddingRight;
      const chartH = height - paddingTop - paddingBottom;

      // Calculate price ranges
      let minP = Infinity;
      let maxP = -Infinity;
      let maxVol = 0;

      for (let i = 0; i < candleData.length; i++) {
        const c = candleData[i];
        if (c.low < minP) minP = c.low;
        if (c.high > maxP) maxP = c.high;
        if (c.volume > maxVol) maxVol = c.volume;
      }

      const pPadding = (maxP - minP) * 0.1 || (currentAsset.basePrice * 0.005);
      minP -= pPadding;
      maxP += pPadding;
      const range = maxP - minP;

      const getY = function(price) {
        return paddingTop + chartH - ((price - minP) / (range || 1)) * chartH;
      };

      // 1. Grid Lines and Price Axis
      const gridSteps = 4;
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(226, 232, 240, 0.65)';
      ctx.fillStyle = '#94A3B8';
      ctx.font = '10px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif';
      ctx.textAlign = 'left';

      for (let s = 0; s <= gridSteps; s++) {
        const gY = paddingTop + (s / gridSteps) * chartH;
        const pVal = maxP - (s / gridSteps) * range;

        ctx.beginPath();
        ctx.setLineDash([3, 4]);
        ctx.moveTo(paddingLeft, gY);
        ctx.lineTo(width - paddingRight, gY);
        ctx.stroke();
        ctx.setLineDash([]);

        const pText = formatInrPrice(pVal, currentAsset.decimals);
        ctx.fillText(pText, width - paddingRight + 6, gY + 3.5);
      }

      const count = candleData.length;
      const stepX = chartW / count;
      const candleWidth = Math.max(3, Math.min(14, stepX * 0.68));

      // 2. Render Candlesticks or Line
      if (chartMode === 'candles') {
        for (let i = 0; i < count; i++) {
          const c = candleData[i];
          const x = paddingLeft + (i + 0.5) * stepX;
          const isBullish = c.close >= c.open;

          const candleColor = isBullish ? '#10B981' : '#EF4444';
          const wickColor = isBullish ? '#059669' : '#DC2626';

          // Volume Bar
          const volH = (c.volume / (maxVol || 1)) * (chartH * 0.18);
          ctx.fillStyle = isBullish ? 'rgba(16, 185, 129, 0.22)' : 'rgba(239, 68, 68, 0.22)';
          ctx.fillRect(x - candleWidth / 2, paddingTop + chartH - volH, candleWidth, volH);

          // Wick (High to Low)
          ctx.beginPath();
          ctx.strokeStyle = wickColor;
          ctx.lineWidth = 1.3;
          ctx.moveTo(x, getY(c.high));
          ctx.lineTo(x, getY(c.low));
          ctx.stroke();

          // Candle Body (Open to Close)
          const openY = getY(c.open);
          const closeY = getY(c.close);
          const bodyY = Math.min(openY, closeY);
          const bodyH = Math.max(1.8, Math.abs(closeY - openY));

          ctx.fillStyle = candleColor;
          ctx.fillRect(x - candleWidth / 2, bodyY, candleWidth, bodyH);

          // Subtle outline for depth
          ctx.strokeStyle = wickColor;
          ctx.lineWidth = 0.8;
          ctx.strokeRect(x - candleWidth / 2, bodyY, candleWidth, bodyH);
        }
      } else {
        // Line chart mode with brand gradient
        ctx.beginPath();
        for (let i = 0; i < count; i++) {
          const x = paddingLeft + (i + 0.5) * stepX;
          const y = getY(candleData[i].close);
          if (i === 0) ctx.moveTo(x, y);
          else {
            const prevX = paddingLeft + (i - 0.5) * stepX;
            const prevY = getY(candleData[i - 1].close);
            const cX = (prevX + x) / 2;
            ctx.bezierCurveTo(cX, prevY, cX, y, x, y);
          }
        }
        ctx.strokeStyle = '#C21891';
        ctx.lineWidth = 2.2;
        ctx.stroke();

        const lastX = paddingLeft + (count - 0.5) * stepX;
        const firstX = paddingLeft + 0.5 * stepX;
        ctx.lineTo(lastX, paddingTop + chartH);
        ctx.lineTo(firstX, paddingTop + chartH);
        ctx.closePath();
        const fillGrad = ctx.createLinearGradient(0, paddingTop, 0, paddingTop + chartH);
        fillGrad.addColorStop(0, 'rgba(194, 24, 145, 0.2)');
        fillGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = fillGrad;
        ctx.fill();
      }

      // 3. Current Live Price Reference Line
      const lastCandle = candleData[candleData.length - 1];
      const curY = getY(lastCandle.close);
      const isCurUp = lastCandle.close >= lastCandle.open;
      const curColor = isCurUp ? '#10B981' : '#EF4444';

      ctx.beginPath();
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = curColor;
      ctx.lineWidth = 1;
      ctx.moveTo(paddingLeft, curY);
      ctx.lineTo(width - paddingRight, curY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Current Price pill on right axis
      const pillText = formatInrPrice(lastCandle.close, currentAsset.decimals);
      ctx.font = 'bold 9.5px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif';
      const pillW = Math.max(54, ctx.measureText(pillText).width + 12);
      ctx.fillStyle = curColor;
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(width - paddingRight + 2, curY - 9, pillW, 18, 4) : ctx.rect(width - paddingRight + 2, curY - 9, pillW, 18);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.fillText(pillText, width - paddingRight + 2 + pillW / 2, curY + 3.5);

      // 4. Hover Crosshair & Selection
      if (hoverIndex !== null && hoverIndex >= 0 && hoverIndex < count) {
        const hc = candleData[hoverIndex];
        const hx = paddingLeft + (hoverIndex + 0.5) * stepX;
        const hy = getY(hc.close);

        // Vertical line
        ctx.beginPath();
        ctx.setLineDash([2, 2]);
        ctx.strokeStyle = 'rgba(100, 116, 139, 0.6)';
        ctx.lineWidth = 1;
        ctx.moveTo(hx, paddingTop);
        ctx.lineTo(hx, paddingTop + chartH);
        ctx.stroke();

        // Horizontal line
        ctx.beginPath();
        ctx.moveTo(paddingLeft, hy);
        ctx.lineTo(width - paddingRight, hy);
        ctx.stroke();
        ctx.setLineDash([]);

        // Highlight ring on close
        ctx.beginPath();
        ctx.arc(hx, hy, 4, 0, Math.PI * 2);
        ctx.fillStyle = hc.close >= hc.open ? '#10B981' : '#EF4444';
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    // Mouse Move Hover
    terminalCanvas.addEventListener('mousemove', function(e) {
      const rect = terminalCanvas.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const paddingLeft = 14;
      const paddingRight = currentAsset.basePrice >= 100000 ? 76 : 58;
      const chartW = rect.width - paddingLeft - paddingRight;

      const normX = clientX - paddingLeft;
      const count = candleData.length;
      const idx = Math.floor((normX / chartW) * count);

      if (idx >= 0 && idx < count) {
        hoverIndex = idx;
        renderTerminalChart();

        const c = candleData[idx];
        updateOhlcDisplay(c);

        if (chartHoverTooltip) {
          chartHoverTooltip.hidden = false;
          const timeStr = c.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const dateStr = c.time.toLocaleDateString([], { month: 'short', day: 'numeric' });
          const isUp = c.close >= c.open;
          chartHoverTooltip.innerHTML =
            '<div style="font-weight:700; margin-bottom:2px;">' + dateStr + ' ' + timeStr + '</div>' +
            '<div style="color:' + (isUp ? '#34D399' : '#F87171') + '; font-weight:800; font-size:12px;">' +
              (isUp ? '▲ +' : '▼ ') + formatInrPrice(Math.abs(c.close - c.open), currentAsset.decimals) + ' (' + ((Math.abs(c.close - c.open) / (c.open || 1)) * 100).toFixed(2) + '%)' +
            '</div>' +
            '<div style="font-size:10px; opacity:0.85; margin-top:2px;">Vol: ' + c.volume.toLocaleString() + ' ' + currentAsset.symbol + '</div>';

          const stepX = chartW / count;
          chartHoverTooltip.style.left = (paddingLeft + (idx + 0.5) * stepX) + 'px';
          chartHoverTooltip.style.top = '44px';
        }
      }
    });

    terminalCanvas.addEventListener('mouseleave', function() {
      hoverIndex = null;
      renderTerminalChart();
      if (chartHoverTooltip) chartHoverTooltip.hidden = true;
      updateOhlcDisplay(candleData[candleData.length - 1]);
    });

    window.addEventListener('resize', function() {
      renderTerminalChart();
    });

    // Timeframe selector buttons
    tfBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        const tf = btn.dataset.tf;
        if (tf && tf !== activeTimeframe) {
          tfBtns.forEach(function(b) { b.classList.remove('is-active'); });
          btn.classList.add('is-active');
          activeTimeframe = tf;
          candleData = generateCandles(activeTimeframe, currentAsset.basePrice, currentAsset.volatility);
          renderTerminalChart();
          updateOhlcDisplay(candleData[candleData.length - 1]);
        }
      });
    });

    // Chart Mode selector buttons (Candles / Line)
    modeBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        const mode = btn.dataset.mode;
        if (mode && mode !== chartMode) {
          modeBtns.forEach(function(b) { b.classList.remove('is-active'); });
          btn.classList.add('is-active');
          chartMode = mode;
          renderTerminalChart();
        }
      });
    });

    // Render Order Book
    function renderDeskOrderBook() {
      if (!deskAsksList || !deskBidsList) return;

      const mid = currentAsset.basePrice;
      const askMultipliers = [1.0022, 1.0016, 1.0011, 1.0007, 1.0004];
      const bidMultipliers = [0.9996, 0.9992, 0.9987, 0.9981, 0.9975];
      const unit = currentAsset.symbol;
      const baseSize = currentAsset.baseOrderSize;
      const dec = currentAsset.amountDecimals;

      let askTotal = 0;
      const asks = askMultipliers.map(function(m, idx) {
        const price = mid * m;
        const size = +(baseSize * (1 + idx * 0.45 + Math.sin(idx * 2) * 0.2)).toFixed(dec);
        askTotal += size;
        return { price: price, size: size, total: +askTotal.toFixed(dec) };
      });

      let bidTotal = 0;
      const bids = bidMultipliers.map(function(m, idx) {
        const price = mid * m;
        const size = +(baseSize * (1 + idx * 0.42 + Math.cos(idx * 2) * 0.22)).toFixed(dec);
        bidTotal += size;
        return { price: price, size: size, total: +bidTotal.toFixed(dec) };
      });

      const maxTotal = Math.max(askTotal, bidTotal) || 1;

      deskAsksList.innerHTML = asks.map(function(item) {
        const depthPct = Math.min(100, Math.round((item.total / maxTotal) * 100));
        return (
          '<div class="desk-book-row desk-book-row--ask">' +
            '<span class="desk-price">' + formatInrPrice(item.price, currentAsset.decimals) + '</span>' +
            '<span class="desk-size text-right">' + Number(item.size).toLocaleString('en-US', { maximumFractionDigits: dec }) + '</span>' +
            '<span class="desk-total text-right">' + Number(item.total).toLocaleString('en-US', { maximumFractionDigits: dec }) + '</span>' +
            '<div class="desk-book-row__fill" style="width:' + depthPct + '%;"></div>' +
          '</div>'
        );
      }).join('');

      deskBidsList.innerHTML = bids.map(function(item) {
        const depthPct = Math.min(100, Math.round((item.total / maxTotal) * 100));
        return (
          '<div class="desk-book-row desk-book-row--bid">' +
            '<span class="desk-price">' + formatInrPrice(item.price, currentAsset.decimals) + '</span>' +
            '<span class="desk-size text-right">' + Number(item.size).toLocaleString('en-US', { maximumFractionDigits: dec }) + '</span>' +
            '<span class="desk-total text-right">' + Number(item.total).toLocaleString('en-US', { maximumFractionDigits: dec }) + '</span>' +
            '<div class="desk-book-row__fill" style="width:' + depthPct + '%;"></div>' +
          '</div>'
        );
      }).join('');

      if (deskMidDisplay) deskMidDisplay.textContent = formatInrPrice(mid, currentAsset.decimals);
      if (tMidRateEl) tMidRateEl.textContent = formatInrPrice(mid, currentAsset.decimals);
      if (tRateChangeEl) {
        const chg = currentAsset.change24h || 0.12;
        tRateChangeEl.textContent = (chg >= 0 ? '+' : '') + chg.toFixed(2) + '%';
        tRateChangeEl.className = 'term-metric__val ' + (chg >= 0 ? 'term-metric__val--green' : 'term-metric__val--red');
      }
      if (tHighRateEl) tHighRateEl.textContent = formatInrPrice(mid * 1.018, currentAsset.decimals);
      if (tLowRateEl) tLowRateEl.textContent = formatInrPrice(mid * 0.982, currentAsset.decimals);
      if (deskSummaryRate) deskSummaryRate.textContent = '1 ' + unit + ' ≈ ' + formatInrPrice(mid, currentAsset.decimals);
    }

    // Trade Desk Calculator
    function updateTradeCalculator() {
      if (!tradeInpPay || !tradeInpRec) return;
      const payVal = parseFloat(tradeInpPay.value) || 0;
      const rate = currentAsset.basePrice;

      if (activeSide === 'buy') {
        const recAsset = payVal > 0 ? (payVal / rate) : 0;
        tradeInpRec.value = Number(recAsset).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: currentAsset.amountDecimals
        });
      } else {
        const recInr = payVal > 0 ? (payVal * rate) : 0;
        tradeInpRec.value = '₹' + Number(recInr).toLocaleString('en-IN', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        });
      }
    }

    function setTradeSide(side) {
      activeSide = side; // 'buy', 'sell' (corporate), 'ind_sell' (individual)
      const sym = currentAsset.symbol;
      const cs = currentAsset.currencySymbol;

      if (side === 'buy') {
        if (btnSideBuy) btnSideBuy.classList.add('is-active');
        if (btnSideSell) btnSideSell.classList.remove('is-active');
        if (btnSideIndSell) btnSideIndSell.classList.remove('is-active');

        if (lblTradePay) lblTradePay.textContent = 'You Pay (INR)';
        if (symTradePay) symTradePay.textContent = '₹';
        if (codeTradePay) codeTradePay.textContent = 'INR';

        if (lblTradeRec) lblTradeRec.textContent = 'You Receive (' + sym + ')';
        if (symTradeRec) symTradeRec.textContent = cs;
        if (codeTradeRec) codeTradeRec.textContent = sym;

        if (tagTradeMin) tagTradeMin.textContent = 'Min: ₹1 Lakh';
        if (btnSubmitDeskTrade) {
          btnSubmitDeskTrade.className = 'btn btn--trade-main btn--trade-main-buy';
        }
        if (txtDeskTradeAction) txtDeskTradeAction.textContent = 'Buy ' + sym + ' with INR';
        if (deskSummaryRoute) deskSummaryRoute.textContent = 'Same-Day NEFT / RTGS';
        if (deskSummaryType) deskSummaryType.textContent = 'Corporate / Institutional Assisted OTC';
        if (deskComplianceNote) {
          deskComplianceNote.textContent = '*Eligible for registered Indian corporate entities & verified introducers. Final quote locked at execution.';
        }
        if (tradeInpPay && (!tradeInpPay.value || tradeInpPay.value < 50000)) {
          tradeInpPay.value = currentAsset.defaultPayInr;
        }
      } else if (side === 'ind_sell') {
        if (btnSideIndSell) btnSideIndSell.classList.add('is-active');
        if (btnSideBuy) btnSideBuy.classList.remove('is-active');
        if (btnSideSell) btnSideSell.classList.remove('is-active');

        if (lblTradePay) lblTradePay.textContent = 'You Sell (' + sym + ') [Individual]';
        if (symTradePay) symTradePay.textContent = cs;
        if (codeTradePay) codeTradePay.textContent = sym;

        if (lblTradeRec) lblTradeRec.textContent = 'You Receive (INR)';
        if (symTradeRec) symTradeRec.textContent = '₹';
        if (codeTradeRec) codeTradeRec.textContent = 'INR';

        if (tagTradeMin) tagTradeMin.textContent = 'Min: ₹25,000';
        if (btnSubmitDeskTrade) {
          btnSubmitDeskTrade.className = 'btn btn--trade-main btn--trade-main-ind-sell';
        }
        if (txtDeskTradeAction) txtDeskTradeAction.textContent = 'Request Individual Sell (' + sym + ')';
        if (deskSummaryRoute) deskSummaryRoute.textContent = 'Direct IMPS / NEFT to Personal Account';
        if (deskSummaryType) deskSummaryType.textContent = 'Individual OTC Desk (1% TDS Compliant)';
        if (deskComplianceNote) {
          deskComplianceNote.textContent = '*Available for Indian individual tax residents (PAN & personal bank account verified). 1% TDS deducted and filed per IT Section 194S.';
        }
        if (tradeInpPay && (!tradeInpPay.value || tradeInpPay.value > 10000)) {
          tradeInpPay.value = currentAsset.defaultSellAsset;
        }
      } else { // Corporate Sell
        if (btnSideSell) btnSideSell.classList.add('is-active');
        if (btnSideBuy) btnSideBuy.classList.remove('is-active');
        if (btnSideIndSell) btnSideIndSell.classList.remove('is-active');

        if (lblTradePay) lblTradePay.textContent = 'You Sell (' + sym + ') [Corporate]';
        if (symTradePay) symTradePay.textContent = cs;
        if (codeTradePay) codeTradePay.textContent = sym;

        if (lblTradeRec) lblTradeRec.textContent = 'You Receive (INR)';
        if (symTradeRec) symTradeRec.textContent = '₹';
        if (codeTradeRec) codeTradeRec.textContent = 'INR';

        if (tagTradeMin) tagTradeMin.textContent = 'Min: ₹1 Lakh';
        if (btnSubmitDeskTrade) {
          btnSubmitDeskTrade.className = 'btn btn--trade-main btn--trade-main-sell';
        }
        if (txtDeskTradeAction) txtDeskTradeAction.textContent = 'Corporate Sell ' + sym + ' for INR';
        if (deskSummaryRoute) deskSummaryRoute.textContent = 'Corporate RTGS / Direct Bank Transfer';
        if (deskSummaryType) deskSummaryType.textContent = 'Corporate Non-Custodial OTC (Entity Verified)';
        if (deskComplianceNote) {
          deskComplianceNote.textContent = '*Eligible for registered Indian corporate entities & verified introducers. Final quote locked at execution.';
        }
        if (tradeInpPay && (!tradeInpPay.value || tradeInpPay.value > 10000)) {
          tradeInpPay.value = currentAsset.defaultSellAsset;
        }
      }
      if (txtBtnBuy) txtBtnBuy.textContent = 'Buy ' + sym;
      updateTradeCalculator();
    }

    // Function to switch selected asset across Terminal
    setTerminalAsset = function(assetId) {
      if (!TERMINAL_ASSETS[assetId]) return;
      selectedAssetId = assetId;
      currentAsset = TERMINAL_ASSETS[assetId];

      if (graphAssetSelect && graphAssetSelect.value !== assetId) {
        graphAssetSelect.value = assetId;
      }

      // Update Header details
      if (terminalAssetLogo) terminalAssetLogo.src = currentAsset.logo;
      if (terminalMainTitle) terminalMainTitle.textContent = currentAsset.symbol + ' / INR Live';
      if (terminalChainBadge) terminalChainBadge.innerHTML = currentAsset.chains;
      if (chartMarketTitle) chartMarketTitle.textContent = currentAsset.symbol + ' / INR';
      if (deskBookSizeHead) deskBookSizeHead.textContent = 'Size (' + currentAsset.symbol + ')';

      // Regenerate candles & update views
      candleData = generateCandles(activeTimeframe, currentAsset.basePrice, currentAsset.volatility);
      renderTerminalChart();
      renderDeskOrderBook();
      setTradeSide(activeSide);
      updateOhlcDisplay(candleData[candleData.length - 1]);
    };

    if (graphAssetSelect) {
      graphAssetSelect.addEventListener('change', function(e) {
        setTerminalAsset(e.target.value);
      });
    }

    if (btnSideBuy) btnSideBuy.addEventListener('click', function() { setTradeSide('buy'); });
    if (btnSideSell) btnSideSell.addEventListener('click', function() { setTradeSide('sell'); });
    if (btnSideIndSell) btnSideIndSell.addEventListener('click', function() { setTradeSide('ind_sell'); });
    if (btnTradeSwap) btnTradeSwap.addEventListener('click', function() {
      if (activeSide === 'buy') {
        setTradeSide('ind_sell');
      } else {
        setTradeSide('buy');
      }
    });

    if (tradeInpPay) {
      tradeInpPay.addEventListener('input', updateTradeCalculator);
    }

    // Connect Action Button to Enquiry Form
    if (btnSubmitDeskTrade) {
      btnSubmitDeskTrade.addEventListener('click', function() {
        const contactSection = $('#contact');
        const eqType = $('#eqType');
        const eqMsg = $('#eqMessage');
        const amount = tradeInpPay ? tradeInpPay.value : '';
        const rec = tradeInpRec ? tradeInpRec.value : '';
        const sym = currentAsset.symbol;

        if (eqType) {
          if (activeSide === 'ind_sell') {
            eqType.value = 'Individual Sell enquiry';
          } else if (activeSide === 'sell') {
            eqType.value = 'Corporate OTC enquiry';
          } else {
            eqType.value = 'OTC service enquiry';
          }
        }

        if (eqMsg) {
          if (activeSide === 'buy') {
            eqMsg.value = 'I would like to request an assisted OTC purchase of ' + rec + ' ' + sym + ' for approx. ₹' + Number(amount).toLocaleString('en-IN') + ' INR with same-day settlement.';
          } else if (activeSide === 'ind_sell') {
            eqMsg.value = 'I would like to request an assisted OTC Individual Sale of ' + Number(amount).toLocaleString('en-US') + ' ' + sym + ' for approx. ' + rec + ' with direct personal bank transfer (1% TDS compliant).';
          } else {
            eqMsg.value = 'I would like to request an assisted corporate OTC sale of ' + Number(amount).toLocaleString('en-US') + ' ' + sym + ' for approx. ' + rec + ' with corporate bank settlement.';
          }
        }

        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.location.href = 'contact.html';
        }

        const enquiryCard = $('.enquiry-card');
        if (enquiryCard) {
          enquiryCard.style.outline = '3px solid var(--magenta)';
          enquiryCard.style.transition = 'outline 0.3s ease';
          setTimeout(function() {
            enquiryCard.style.outline = 'none';
          }, 2400);
        }

        const sideName = activeSide === 'ind_sell' ? 'Individual Sell' : (activeSide === 'sell' ? 'Corporate Sell' : 'Buy');
        toast(sideName + ' ' + sym + ' trade inquiry loaded. Please complete your contact details.', 'info', 5000);
      });
    }

    // Micro-ticker simulation to keep live candle updating smoothly
    setInterval(function() {
      const delta = (Math.random() * 0.04 - 0.02) * currentAsset.volatility * currentAsset.basePrice * 8;
      currentAsset.basePrice = +(currentAsset.basePrice + delta).toFixed(currentAsset.decimals);

      if (candleData && candleData.length > 0) {
        const last = candleData[candleData.length - 1];
        last.close = currentAsset.basePrice;
        if (currentAsset.basePrice > last.high) last.high = currentAsset.basePrice;
        if (currentAsset.basePrice < last.low) last.low = currentAsset.basePrice;
        last.volume += Math.round(Math.random() * (currentAsset.baseOrderSize * 0.1));
      }

      renderTerminalChart();
      renderDeskOrderBook();
      updateTradeCalculator();
      if (hoverIndex === null) {
        updateOhlcDisplay(candleData[candleData.length - 1]);
      }

      if (chartSyncTimeEl) {
        chartSyncTimeEl.textContent = 'Last tick: just now';
      }
    }, 4500);

    updateTerminalLivePrices = function(data) {
      if (!Array.isArray(data)) return;
      data.forEach(function(coin) {
        if (TERMINAL_ASSETS[coin.id] && coin.current_price) {
          TERMINAL_ASSETS[coin.id].basePrice = Number(coin.current_price);
          if (coin.price_change_percentage_24h != null) {
            TERMINAL_ASSETS[coin.id].change24h = Number(coin.price_change_percentage_24h);
          }
        }
      });
      renderDeskOrderBook();
      updateTradeCalculator();
      if (hoverIndex === null && candleData && candleData.length > 0) {
        candleData[candleData.length - 1].close = currentAsset.basePrice;
        renderTerminalChart();
        updateOhlcDisplay(candleData[candleData.length - 1]);
      }
    };

    // Initial render
    setTerminalAsset(selectedAssetId);
    setTradeSide(activeSide);
  }

  console.log('PANDOSOFT INDIA ΓÇö OTC website client initialized.');
})();
