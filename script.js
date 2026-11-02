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

  /* ΓöÇΓöÇ Active link highlight on scroll ΓöÇΓöÇ */
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

  /* ΓöÇΓöÇ Smooth Anchor Scrolling with Header Offset ΓöÇΓöÇ */
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

    /* ── CoinGecko Live Rates & Indicative OTC Order Book ── */
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
     USDT/INR DEDICATED LIVE TERMINAL (RED & GREEN CANDLESTICK CHART, ORDER BOOK & TRADE DESK)
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

  const deskAsksList = $('#deskAsksList');
  const deskBidsList = $('#deskBidsList');
  const deskMidDisplay = $('#deskMidDisplay');
  const terminalSpreadBadge = $('#terminalSpreadBadge');

  const btnSideBuy = $('#btnSideBuy');
  const btnSideSell = $('#btnSideSell');
  const tradeInpPay = $('#tradeInpPay');
  const tradeInpRec = $('#tradeInpRec');
  const lblTradePay = $('#lblTradePay');
  const lblTradeRec = $('#lblTradeRec');
  const symTradePay = $('#symTradePay');
  const symTradeRec = $('#symTradeRec');
  const codeTradePay = $('#codeTradePay');
  const codeTradeRec = $('#codeTradeRec');
  const btnTradeSwap = $('#btnTradeSwap');
  const deskSummaryRate = $('#deskSummaryRate');
  const btnSubmitDeskTrade = $('#btnSubmitDeskTrade');
  const txtDeskTradeAction = $('#txtDeskTradeAction');

  if (terminalCanvas) {
    let activeSide = 'buy'; // 'buy' or 'sell'
    let activeTimeframe = '24h';
    let chartMode = 'candles'; // 'candles' or 'line'
    let baseUsdtPrice = 91.48;
    let hoverIndex = null;

    // Generate realistic OHLC Candlestick series
    function generateCandles(timeframe, currentBase) {
      const candles = [];
      const now = Date.now();
      let count = 30;
      let intervalMs = 3600 * 1000;
      let volatility = 0.12;

      if (timeframe === '1h') {
        count = 30;
        intervalMs = 2 * 60 * 1000;
        volatility = 0.04;
      } else if (timeframe === '24h') {
        count = 28;
        intervalMs = 50 * 60 * 1000;
        volatility = 0.10;
      } else if (timeframe === '7d') {
        count = 28;
        intervalMs = 6 * 3600 * 1000;
        volatility = 0.22;
      } else if (timeframe === '1m') {
        count = 30;
        intervalMs = 24 * 3600 * 1000;
        volatility = 0.40;
      }

      // Generate walk ending at currentBase
      let runningPrice = currentBase - (volatility * 0.8 * (Math.random() > 0.5 ? 1 : -1));
      const steps = [];

      for (let i = 0; i < count; i++) {
        const time = new Date(now - (count - 1 - i) * intervalMs);
        const wave = Math.sin(i * 0.5) * volatility * 0.8 + Math.cos(i * 1.4) * (volatility * 0.4);
        const rand = (Math.random() - 0.48) * volatility;
        const change = wave * 0.3 + rand;

        const open = +runningPrice.toFixed(2);
        runningPrice = Math.max(90.2, +(open + change).toFixed(2));
        const close = runningPrice;

        const wickHigh = +(Math.random() * volatility * 0.7).toFixed(2);
        const wickLow = +(Math.random() * volatility * 0.7).toFixed(2);

        const high = +(Math.max(open, close) + wickHigh).toFixed(2);
        const low = +(Math.min(open, close) - wickLow).toFixed(2);
        const volume = Math.round(15000 + Math.random() * 45000 + Math.abs(close - open) * 200000);

        candles.push({
          time: time,
          open: open,
          high: high,
          low: low,
          close: close,
          volume: volume
        });
      }

      // Ensure the very last candle closes at currentBase
      const last = candles[candles.length - 1];
      last.close = currentBase;
      last.high = Math.max(last.high, currentBase);
      last.low = Math.min(last.low, currentBase);

      return candles;
    }

    let candleData = generateCandles(activeTimeframe, baseUsdtPrice);

    // Update OHLC Header
    function updateOhlcDisplay(candle) {
      if (!candle) candle = candleData[candleData.length - 1];
      if (!candle) return;

      if (ohlcOEl) ohlcOEl.textContent = candle.open.toFixed(2);
      if (ohlcHEl) ohlcHEl.textContent = candle.high.toFixed(2);
      if (ohlcLEl) ohlcLEl.textContent = candle.low.toFixed(2);
      if (ohlcCEl) {
        ohlcCEl.textContent = candle.close.toFixed(2);
        ohlcCEl.style.color = candle.close >= candle.open ? '#047857' : '#DC2626';
      }
      if (chartHoverPriceEl) {
        chartHoverPriceEl.textContent = '₹' + candle.close.toFixed(2);
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
      const paddingRight = 54;
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

      const pPadding = (maxP - minP) * 0.1 || 0.15;
      minP -= pPadding;
      maxP += pPadding;
      const range = maxP - minP;

      const getY = function(price) {
        return paddingTop + chartH - ((price - minP) / range) * chartH;
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

        ctx.fillText('₹' + pVal.toFixed(2), width - paddingRight + 8, gY + 3.5);
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

          // Colors: Green for bullish, Red for bearish
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

        // Gradient fill
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
      ctx.fillStyle = curColor;
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(width - paddingRight + 2, curY - 9, 48, 18, 4) : ctx.rect(width - paddingRight + 2, curY - 9, 48, 18);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 9.5px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('₹' + lastCandle.close.toFixed(2), width - paddingRight + 26, curY + 3.5);

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
      const paddingRight = 54;
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
              (isUp ? '▲ +' : '▼ ') + Math.abs(c.close - c.open).toFixed(2) + ' (' + ((Math.abs(c.close - c.open) / c.open) * 100).toFixed(2) + '%)' +
            '</div>' +
            '<div style="font-size:10px; opacity:0.85; margin-top:2px;">Vol: ' + c.volume.toLocaleString() + ' USDT</div>';

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
          candleData = generateCandles(activeTimeframe, baseUsdtPrice);
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

      const mid = baseUsdtPrice;
      const askMultipliers = [1.0022, 1.0016, 1.0011, 1.0007, 1.0004];
      const bidMultipliers = [0.9996, 0.9992, 0.9987, 0.9981, 0.9975];

      let askTotal = 0;
      const asks = askMultipliers.map(function(m, idx) {
        const price = mid * m;
        const size = Math.round(18000 * (1 + idx * 0.45 + Math.sin(idx * 2) * 0.2));
        askTotal += size;
        return { price: price, size: size, total: askTotal };
      });

      let bidTotal = 0;
      const bids = bidMultipliers.map(function(m, idx) {
        const price = mid * m;
        const size = Math.round(20000 * (1 + idx * 0.42 + Math.cos(idx * 2) * 0.22));
        bidTotal += size;
        return { price: price, size: size, total: bidTotal };
      });

      const maxTotal = Math.max(askTotal, bidTotal) || 1;

      deskAsksList.innerHTML = asks.map(function(item) {
        const depthPct = Math.min(100, Math.round((item.total / maxTotal) * 100));
        return (
          '<div class="desk-book-row desk-book-row--ask">' +
            '<span class="desk-price">₹' + item.price.toFixed(2) + '</span>' +
            '<span class="desk-size text-right">' + item.size.toLocaleString() + '</span>' +
            '<span class="desk-total text-right">' + item.total.toLocaleString() + '</span>' +
            '<div class="desk-book-row__fill" style="width:' + depthPct + '%;"></div>' +
          '</div>'
        );
      }).join('');

      deskBidsList.innerHTML = bids.map(function(item) {
        const depthPct = Math.min(100, Math.round((item.total / maxTotal) * 100));
        return (
          '<div class="desk-book-row desk-book-row--bid">' +
            '<span class="desk-price">₹' + item.price.toFixed(2) + '</span>' +
            '<span class="desk-size text-right">' + item.size.toLocaleString() + '</span>' +
            '<span class="desk-total text-right">' + item.total.toLocaleString() + '</span>' +
            '<div class="desk-book-row__fill" style="width:' + depthPct + '%;"></div>' +
          '</div>'
        );
      }).join('');

      if (deskMidDisplay) deskMidDisplay.textContent = '₹' + mid.toFixed(2);
      if (tMidRateEl) tMidRateEl.textContent = '₹' + mid.toFixed(2);
      if (deskSummaryRate) deskSummaryRate.textContent = '1 USDT ≈ ₹' + mid.toFixed(2);
    }

    // Trade Desk Calculator
    function updateTradeCalculator() {
      const payVal = parseFloat(tradeInpPay.value) || 0;
      const rate = baseUsdtPrice;

      if (activeSide === 'buy') {
        const recUsdt = payVal > 0 ? (payVal / rate) : 0;
        tradeInpRec.value = recUsdt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      } else {
        const recInr = payVal > 0 ? (payVal * rate) : 0;
        tradeInpRec.value = '₹' + recInr.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
      }
    }

    function setTradeSide(side) {
      activeSide = side;
      if (side === 'buy') {
        if (btnSideBuy) btnSideBuy.classList.add('is-active');
        if (btnSideSell) btnSideSell.classList.remove('is-active');

        if (lblTradePay) lblTradePay.textContent = 'You Pay (INR)';
        if (symTradePay) symTradePay.textContent = '₹';
        if (codeTradePay) codeTradePay.textContent = 'INR';

        if (lblTradeRec) lblTradeRec.textContent = 'You Receive (USDT)';
        if (symTradeRec) symTradeRec.textContent = '₮';
        if (codeTradeRec) codeTradeRec.textContent = 'USDT';

        if (btnSubmitDeskTrade) {
          btnSubmitDeskTrade.className = 'btn btn--trade-main btn--trade-main-buy';
        }
        if (txtDeskTradeAction) txtDeskTradeAction.textContent = 'Buy USDT with INR';
        if (tradeInpPay && !tradeInpPay.value) tradeInpPay.value = '500000';
      } else {
        if (btnSideSell) btnSideSell.classList.add('is-active');
        if (btnSideBuy) btnSideBuy.classList.remove('is-active');

        if (lblTradePay) lblTradePay.textContent = 'You Sell (USDT)';
        if (symTradePay) symTradePay.textContent = '₮';
        if (codeTradePay) codeTradePay.textContent = 'USDT';

        if (lblTradeRec) lblTradeRec.textContent = 'You Receive (INR)';
        if (symTradeRec) symTradeRec.textContent = '₹';
        if (codeTradeRec) codeTradeRec.textContent = 'INR';

        if (btnSubmitDeskTrade) {
          btnSubmitDeskTrade.className = 'btn btn--trade-main btn--trade-main-sell';
        }
        if (txtDeskTradeAction) txtDeskTradeAction.textContent = 'Sell USDT for INR';
        if (tradeInpPay && !tradeInpPay.value) tradeInpPay.value = '5000';
      }
      updateTradeCalculator();
    }

    if (btnSideBuy) btnSideBuy.addEventListener('click', function() { setTradeSide('buy'); });
    if (btnSideSell) btnSideSell.addEventListener('click', function() { setTradeSide('sell'); });
    if (btnTradeSwap) btnTradeSwap.addEventListener('click', function() {
      setTradeSide(activeSide === 'buy' ? 'sell' : 'buy');
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

        if (eqType) {
          eqType.value = 'OTC service enquiry';
        }

        if (eqMsg) {
          if (activeSide === 'buy') {
            eqMsg.value = 'I would like to request an assisted OTC purchase of ' + rec + ' USDT for approx. ₹' + Number(amount).toLocaleString('en-IN') + ' INR with same-day settlement.';
          } else {
            eqMsg.value = 'I would like to request an assisted OTC sale of ' + Number(amount).toLocaleString('en-US') + ' USDT for approx. ' + rec + ' with same-day bank settlement.';
          }
        }

        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        const enquiryCard = $('.enquiry-card');
        if (enquiryCard) {
          enquiryCard.style.outline = '3px solid var(--magenta)';
          enquiryCard.style.transition = 'outline 0.3s ease';
          setTimeout(function() {
            enquiryCard.style.outline = 'none';
          }, 2400);
        }

        toast((activeSide === 'buy' ? 'Buy' : 'Sell') + ' USDT trade inquiry loaded. Please complete your contact details.', 'info', 5000);
      });
    }

    // Micro-ticker simulation to keep live candle updating smoothly
    setInterval(function() {
      const delta = (Math.random() * 0.04 - 0.02);
      baseUsdtPrice = +(baseUsdtPrice + delta).toFixed(2);
      if (baseUsdtPrice < 90.8) baseUsdtPrice = 90.85;
      if (baseUsdtPrice > 92.2) baseUsdtPrice = 91.95;

      if (candleData && candleData.length > 0) {
        const last = candleData[candleData.length - 1];
        last.close = baseUsdtPrice;
        if (baseUsdtPrice > last.high) last.high = baseUsdtPrice;
        if (baseUsdtPrice < last.low) last.low = baseUsdtPrice;
        last.volume += Math.round(Math.random() * 350);
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

    // Initial render
    renderTerminalChart();
    renderDeskOrderBook();
    updateTradeCalculator();
    updateOhlcDisplay(candleData[candleData.length - 1]);
  }

  console.log('PANDOSOFT INDIA ΓÇö OTC website client initialized.');
})();
