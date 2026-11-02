/* ==========================================================================
   PandoSoft India — behaviour
   All numbers on this page are a simulated snapshot for demonstration.
   ========================================================================== */
(() => {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ── market snapshot ───────────────────────────────────────────────────── */
  const COINS = {
    BTC:  { name: 'Bitcoin',   sym: '₿', price: 7436770, chg:  0.76, vol: 4182, dp: 0 },
    ETH:  { name: 'Ethereum',  sym: 'Ξ', price: 217384,  chg:  1.05, vol: 2140, dp: 2 },
    SOL:  { name: 'Solana',    sym: '◎', price: 8998,    chg: -0.73, vol: 986,  dp: 2 },
    BNB:  { name: 'BNB',       sym: 'B', price: 67439,   chg:  0.82, vol: 512,  dp: 2 },
    XRP:  { name: 'XRP',       sym: 'X', price: 118.86,  chg:  0.12, vol: 743,  dp: 2 },
    ADA:  { name: 'Cardano',   sym: 'A', price: 18.26,   chg: -0.34, vol: 188,  dp: 2 },
    DOGE: { name: 'Dogecoin',  sym: 'Ð', price: 7.19,    chg:  0.14, vol: 421,  dp: 2 },
    LINK: { name: 'Chainlink', sym: '⬡', price: 1075.80, chg: -2.38, vol: 163,  dp: 2 },
    AVAX: { name: 'Avalanche', sym: '▲', price: 820.10,  chg: -1.52, vol: 131,  dp: 2 },
    DOT:  { name: 'Polkadot',  sym: '●', price: 90.60,   chg:  0.77, vol: 78,   dp: 2 },
    SUI:  { name: 'Sui',       sym: 'S', price: 85.26,   chg: -0.54, vol: 96,   dp: 2 },
    HBAR: { name: 'Hedera',    sym: 'ℏ', price: 6.78,    chg: -0.96, vol: 54,   dp: 2 },
    APT:  { name: 'Aptos',     sym: 'A', price: 60.06,   chg: -0.88, vol: 41,   dp: 2 },
    POL:  { name: 'Polygon',   sym: 'P', price: 8.56,    chg: -2.58, vol: 63,   dp: 2 },
  };
  const KEYS = Object.keys(COINS);
  Object.entries(COINS).forEach(([k, c]) => { c.key = k; });

  const nf = (dp) => new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: dp, maximumFractionDigits: dp,
  });
  const inr   = (v, dp = 2) => nf(dp).format(v);
  const rupee = (v, dp = 2) => '\u20B9' + nf(dp).format(v);
  const pct   = (v) => (v >= 0 ? '+' : '\u2212') + Math.abs(v).toFixed(2) + '%';
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const round = (v, dp) => Number(v.toFixed(dp));
  /* rupee amounts compressed into Indian short form: ₹33.51L, ₹1.20Cr */
  const compactINR = (v) => {
    if (v >= 1e7) return '\u20B9' + (v / 1e7).toFixed(2) + 'Cr';
    if (v >= 1e5) return '\u20B9' + (v / 1e5).toFixed(2) + 'L';
    if (v >= 1000) return '\u20B9' + (v / 1000).toFixed(1) + 'K';
    return '\u20B9' + v.toFixed(0);
  };

  /* deterministic pseudo-random so charts look identical on every load */
  const rng = (seed) => () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };

  /* ── coin roundels ─────────────────────────────────────────────────────── */
  $$('.asset__ico').forEach((el) => {
    const k = el.dataset.coin;
    if (!COINS[k]) return;
    el.dataset.v = k.toLowerCase();
    el.textContent = COINS[k].sym;
  });

  /* ── toast ─────────────────────────────────────────────────────────────── */
  const toasts = $('#toasts');
  function toast(msg, kind = 'ok', ms = 3600) {
    if (!toasts) return;
    const el = document.createElement('div');
    el.className = 'toast' + (kind === 'warn' ? ' toast--warn' : '');
    el.innerHTML = `<b>${kind === 'warn' ? '!' : '✓'}</b><span></span>`;
    el.lastElementChild.textContent = msg;
    toasts.append(el);
    requestAnimationFrame(() => el.classList.add('is-visible'));
    setTimeout(() => {
      el.classList.remove('is-visible');
      setTimeout(() => el.remove(), 400);
    }, ms);
  }

  /* ── ripple / press feedback ───────────────────────────────────────────── */
  on(document, 'pointerdown', (e) => {
    const el = e.target.closest('.btn, .mrow__cta, .chipbtn, .totop, .badge');
    if (!el || reduceMotion) return;
    const r = el.getBoundingClientRect();
    const size = Math.max(r.width, r.height);
    const s = document.createElement('span');
    s.className = 'ripple';
    s.style.width = s.style.height = size + 'px';
    s.style.left = (e.clientX - r.left - size / 2) + 'px';
    s.style.top  = (e.clientY - r.top  - size / 2) + 'px';
    el.append(s);
    setTimeout(() => s.remove(), 640);
  });

  /* ── header, drawer, progress ──────────────────────────────────────────── */
  const header = $('#header');
  const progress = $('#progress');
  const mobileBar = $('#mobileBar');
  const heroSentinel = $('#top');

  let ticking = false;
  function onScroll() {
    const y = window.scrollY;
    header?.classList.toggle('is-stuck', y > 8);

    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (max > 0 ? clamp(y / max, 0, 1) * 100 : 0) + '%';

    if (mobileBar) {
      const heroH = heroSentinel ? heroSentinel.offsetHeight * 0.6 : 400;
      const nearEnd = y + window.innerHeight > document.documentElement.scrollHeight - 140;
      mobileBar.classList.toggle('is-on', y > heroH && !nearEnd);
    }
    ticking = false;
  }
  on(window, 'scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(onScroll);
  }, { passive: true });
  onScroll();

  const burger = $('#burger');
  const drawer = $('#drawer');
  if (burger && drawer) {
    drawer.hidden = true;
    const setDrawer = (open) => {
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      drawer.hidden = !open;
    };
    on(burger, 'click', () => setDrawer(drawer.hidden));
    $$('.drawer__link, .drawer__cta .btn', drawer).forEach((a) => on(a, 'click', () => setDrawer(false)));
    window.addEventListener('resize', () => { if (window.innerWidth > 980) setDrawer(false); });
  }

  /* nav dropdown */
  $$('.nav__item').forEach((item) => {
    const trigger = $('.nav__link', item);
    let timer;
    const open = (v) => {
      item.classList.toggle('is-open', v);
      trigger?.setAttribute('aria-expanded', String(v));
    };
    on(item, 'mouseenter', () => { clearTimeout(timer); open(true); });
    on(item, 'mouseleave', () => { timer = setTimeout(() => open(false), 140); });
    on(trigger, 'click', (e) => { e.preventDefault(); open(!item.classList.contains('is-open')); });
    on(document, 'click', (e) => { if (!item.contains(e.target)) open(false); });
    on(document, 'keydown', (e) => { if (e.key === 'Escape') open(false); });
  });

  /* ── generic segmented controls ────────────────────────────────────────── */
  function buildThumb(seg) {
    let thumb = $('.seg__thumb', seg);
    if (!thumb) {
      thumb = document.createElement('span');
      thumb.className = 'seg__thumb';
      seg.prepend(thumb);
    }
    return thumb;
  }
  function moveThumb(seg) {
    const thumb = buildThumb(seg);
    const active = $('button.is-active', seg);
    if (!active || !active.offsetWidth) return;
    const s = seg.getBoundingClientRect();
    const b = active.getBoundingClientRect();
    thumb.style.setProperty('--x', (b.left - s.left - seg.clientLeft) + 'px');
    thumb.style.width = b.width + 'px';
  }
  function segmented(seg, onPick) {
    const buttons = $$('button', seg);
    buttons.forEach((b) => on(b, 'click', () => {
      buttons.forEach((o) => { o.classList.remove('is-active'); o.setAttribute('aria-selected', 'false'); });
      b.classList.add('is-active');
      b.setAttribute('aria-selected', 'true');
      moveThumb(seg);
      onPick?.(b);
    }));
    const sync = () => moveThumb(seg);
    sync();
    if (document.fonts?.ready) document.fonts.ready.then(sync);
    on(window, 'resize', sync);
  }
  $$('.seg').forEach((seg) => { if (!$('.seg__thumb', seg)) moveThumb(seg); });

  /* ── reveal on scroll ──────────────────────────────────────────────────── */
  const revealables = $$('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach((el) => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    revealables.forEach((el) => io.observe(el));
  }

  /* ── animated counters ─────────────────────────────────────────────────── */
  const counters = $$('[data-count]');
  if (counters.length) {
    const run = (el) => {
      const target = parseFloat(el.dataset.count);
      const dp = parseInt(el.dataset.decimals || '0', 10);
      const isLakh = el.dataset.format === 'lakh';
      const dur = reduceMotion ? 0 : 1200;
      const start = performance.now();
      const tick = (now) => {
        const p = dur ? clamp((now - start) / dur, 0, 1) : 1;
        const eased = 1 - Math.pow(1 - p, 3);
        const val = target * eased;
        el.textContent = isLakh
          ? (val / 100000).toFixed(1) + ' L+'
          : inr(val, dp);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = isLakh ? (target / 100000).toFixed(1) + ' L+' : inr(target, dp);
      };
      requestAnimationFrame(tick);
    };
    const cio = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { run(e.target); cio.unobserve(e.target); }
    }), { threshold: 0.5 });
    counters.forEach((c) => cio.observe(c));
  }

  /* ── line chart (hero + terminal) ──────────────────────────────────────── */
  const RANGES = { '1H': [60, .012], '1D': [96, .035], '1W': [84, .07], '1M': [90, .12], '1Y': [120, .38] };

  function makeSeries(key, range) {
    const [n, amp] = RANGES[range] || RANGES['1D'];
    const r = rng(key.length * 977 + n * 31 + (COINS[key]?.price || 1));
    const coin = COINS[key];
    const drift = (coin.chg / 100) * amp * 12;
    const pts = [];
    let v = coin.price * (1 - drift);
    for (let i = 0; i < n; i++) {
      v += (r() - .48) * coin.price * amp * .35 + (coin.price * drift) / n;
      pts.push(v);
    }
    pts[pts.length - 1] = coin.price;
    return pts;
  }

  function lineChart(canvas, opts) {
    const ctx = canvas.getContext('2d');
    const PAD = { l: opts.labels ? 54 : 6, r: 8, t: 12, b: opts.labels ? 22 : 6 };
    const state = { data: [], hover: -1, key: opts.key, range: opts.range, up: true };
    const fmtLab = (v) => {
      if (v >= 1e7) return (v / 1e7).toFixed(2) + 'Cr';
      if (v >= 1e5) return (v / 1e5).toFixed(2) + 'L';
      if (v >= 1000) return (v / 1000).toFixed(1) + 'K';
      return v.toFixed(0);
    };

    function resize() {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      state.w = rect.width;
      state.h = rect.height;
      draw();
    }

    function xy(i) {
      const iw = state.w - PAD.l - PAD.r;
      const ih = state.h - PAD.t - PAD.b;
      const v = state.data[i];
      return [
        PAD.l + (i / Math.max(1, state.data.length - 1)) * iw,
        PAD.t + (1 - (v - state.min) / Math.max(1e-9, state.max - state.min)) * ih,
      ];
    }

    function draw() {
      if (!state.data.length || !state.w) return;
      const { w, h } = state;
      ctx.clearRect(0, 0, w, h);

      const gridCol = opts.dark ? 'rgba(255,255,255,.07)' : 'rgba(10,25,48,.07)';
      const labCol  = opts.dark ? 'rgba(138,160,192,.75)' : 'rgba(132,151,176,.95)';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = labCol;
      ctx.textBaseline = 'middle';

      const steps = 4;
      for (let i = 0; i <= steps; i++) {
        const y = PAD.t + (i / steps) * (h - PAD.t - PAD.b);
        ctx.strokeStyle = gridCol;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(PAD.l, y);
        ctx.lineTo(w - PAD.r, y);
        ctx.stroke();
        if (opts.labels) {
          const v = state.max - (i / steps) * (state.max - state.min);
          ctx.fillText(fmtLab(v), 6, y);
        }
      }

      const accent = state.up ? '#00B87C' : '#1355F5';

      /* area */
      const g = ctx.createLinearGradient(0, PAD.t, 0, h - PAD.b);
      g.addColorStop(0, state.up ? 'rgba(0,184,124,.28)' : 'rgba(19,85,245,.26)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      state.data.forEach((_, i) => { const [x, y] = xy(i); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
      ctx.lineTo(w - PAD.r, h - PAD.b);
      ctx.lineTo(PAD.l, h - PAD.b);
      ctx.closePath();
      ctx.fillStyle = g;
      ctx.fill();

      /* line */
      ctx.beginPath();
      state.data.forEach((_, i) => { const [x, y] = xy(i); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
      ctx.strokeStyle = accent;
      ctx.lineWidth = opts.dark ? 2 : 1.8;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.stroke();

      /* last point */
      const [lx, ly] = xy(state.data.length - 1);
      ctx.beginPath(); ctx.arc(lx, ly, 9, 0, Math.PI * 2);
      ctx.fillStyle = state.up ? 'rgba(0,184,124,.18)' : 'rgba(19,85,245,.18)';
      ctx.fill();
      ctx.beginPath(); ctx.arc(lx, ly, 3.6, 0, Math.PI * 2);
      ctx.fillStyle = accent; ctx.fill();

      /* crosshair */
      if (state.hover >= 0 && state.hover < state.data.length) {
        const [hx, hy] = xy(state.hover);
        ctx.strokeStyle = opts.dark ? 'rgba(255,255,255,.22)' : 'rgba(10,25,48,.18)';
        ctx.setLineDash([3, 3]);
        ctx.beginPath(); ctx.moveTo(hx, PAD.t); ctx.lineTo(hx, h - PAD.b); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(PAD.l, hy); ctx.lineTo(w - PAD.r, hy); ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath(); ctx.arc(hx, hy, 5.5, 0, Math.PI * 2);
        ctx.fillStyle = opts.dark ? '#0A1930' : '#fff'; ctx.fill();
        ctx.lineWidth = 2.4; ctx.strokeStyle = accent; ctx.stroke();
      }
    }

    function setSeries(key, range) {
      state.key = key;
      state.range = range || state.range;
      state.data = makeSeries(key, state.range);
      const coin = COINS[key];
      state.up = coin.chg >= 0;
      state.min = Math.min(...state.data) * 0.995;
      state.max = Math.max(...state.data) * 1.005;
      draw();
    }

    /* pointer interaction */
    const toIndex = (clientX) => {
      const rect = canvas.getBoundingClientRect();
      const f = clamp((clientX - rect.left - PAD.l) / Math.max(1, rect.width - PAD.l - PAD.r), 0, 1);
      return Math.round(f * (state.data.length - 1));
    };
    on(canvas, 'pointermove', (e) => {
      state.hover = toIndex(e.clientX);
      draw();
      opts.onHover?.(state.hover, state.data[state.hover], canvas.getBoundingClientRect(), state.range, state.data.length);
    });
    on(canvas, 'pointerleave', () => {
      state.hover = -1;
      draw();
      opts.onHover?.(-1);
    });
    on(window, 'resize', resize);
    if (document.fonts?.ready) document.fonts.ready.then(resize);
    resize();
    setSeries(opts.key, opts.range);
    return { setSeries, resize };
  }

  /* hero chart */
  const heroCanvas = $('#heroCanvas');
  const chartTip = $('#chartTip');
  const heroPrice = $('.chart__price');
  let heroChart = null;

  /* what a given point index means in wall-clock terms for each range */
  const STEP_MINUTES = { '1H': 1, '1D': 15, '1W': 120, '1M': 480, '1Y': 4320 };
  function pointLabel(i, range, total) {
    const minutesAgo = (total - 1 - i) * (STEP_MINUTES[range] || 15);
    const d = new Date(Date.now() - minutesAgo * 60000);
    const hhmm = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
    if (range === '1H' || range === '1D') return `${hhmm} IST`;
    if (range === '1W') return d.toLocaleDateString('en-IN', { weekday: 'short' }) + ' ' + hhmm;
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  }

  if (heroCanvas) {
    heroChart = lineChart(heroCanvas, {
      key: 'BTC', range: '1D', labels: true,
      onHover: (i, val, rect, range, total) => {
        if (!chartTip) return;
        if (i < 0 || val == null) { chartTip.style.display = 'none'; return; }
        chartTip.style.display = 'flex';
        $('#tipPrice').textContent = rupee(val, 0);
        $('#tipTime').textContent = pointLabel(i, range, total);
        const maxLeft = Math.max(0, rect.width - 156);
        const px = clamp(((i / Math.max(1, total - 1)) * (rect.width - 62)) + 6, 0, maxLeft);
        chartTip.style.left = px + 'px';
        chartTip.style.top = '6px';
      },
    });
  }
  const rangeSeg = $('#rangeSeg');
  if (rangeSeg && heroChart) {
    segmented(rangeSeg, (b) => {
      heroChart.setSeries('BTC', b.dataset.range);
      if (chartTip) chartTip.style.display = 'none';
    });
  }

  /* terminal chart */
  const ticketCanvas = $('#ticketCanvas');
  let ticketChart = null;
  if (ticketCanvas) {
    ticketChart = lineChart(ticketCanvas, { key: 'BTC', range: '1D', labels: false, dark: false });
  }

  /* ── market table ──────────────────────────────────────────────────────── */
  const rowsHost = $('#marketRows');
  const ROW_ORDER = ['BTC', 'ETH', 'SOL', 'DOGE', 'XRP', 'LINK', 'BNB', 'SUI', 'AVAX', 'ADA', 'DOT', 'HBAR', 'APT', 'POL'];

  function sparkFor(canvas, key) {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    const c = canvas.getContext('2d');
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    const w = rect.width, h = rect.height;
    const data = makeSeries(key, '1D').slice(-34);
    const min = Math.min(...data), max = Math.max(...data);
    const up = COINS[key].chg >= 0;
    const accent = up ? '#00B87C' : '#1355F5';
    const x = (i) => (i / (data.length - 1)) * w;
    const y = (v) => h - 4 - ((v - min) / Math.max(1e-9, max - min)) * (h - 8);

    c.beginPath();
    data.forEach((v, i) => { i ? c.lineTo(x(i), y(v)) : c.moveTo(x(i), y(v)); });
    c.strokeStyle = accent; c.lineWidth = 1.5; c.lineJoin = 'round'; c.stroke();
    c.lineTo(w, h); c.lineTo(0, h); c.closePath();
    const g = c.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, up ? 'rgba(0,184,124,.22)' : 'rgba(19,85,245,.22)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = g; c.fill();
  }

  function buildRows() {
    if (!rowsHost) return;
    rowsHost.innerHTML = ROW_ORDER.map((k) => {
      const c = COINS[k];
      const up = c.chg >= 0;
      const lo = c.price * 0.978, hi = c.price * 1.021;
      const pos = clamp((c.price - lo) / Math.max(1e-9, hi - lo), .06, .94) * 100;
      return `
        <div class="mrow" data-key="${k}" tabindex="0" role="row">
          <span class="mrow__asset">
            <span class="asset__ico asset__ico--xs" data-coin="${k}" data-v="${k.toLowerCase()}" aria-hidden="true">${c.sym}</span>
            <span class="mrow__name"><b>${c.name}</b><small>${k}/INR</small></span>
          </span>
          <span class="mrow__price" data-price="${k}">${rupee(c.price, c.dp)}</span>
          <span class="ta-r"><span class="chg ${up ? 'up' : 'down'}" data-chg-pill="${k}">${pct(c.chg)}</span></span>
          <span class="mrow__vol hide-md">${inr(c.vol, 0)} Cr</span>
          <span class="mrow__spark hide-sm"><canvas data-spark="${k}" aria-hidden="true"></canvas></span>
          <span class="mrow__cta">Trade</span>
          <span class="mrow__range">
            <small>24h low ${rupee(lo, 0)}</small>
            <span class="mrow__track"><span class="mrow__fill" style="width:${pos}%"></span><span class="mrow__knob" style="left:${pos}%"></span></span>
            <small>24h high ${rupee(hi, 0)}</small>
          </span>
        </div>`;
    }).join('');

    $$('[data-spark]').forEach((cv) => sparkFor(cv, cv.dataset.spark));

    const rows = $$('.mrow');
    rows.forEach((row, i) => {
      row.classList.add('reveal');
      on(row, 'pointerenter', () => row.classList.add('is-hover'));
      on(row, 'pointerleave', () => row.classList.remove('is-hover'));
      on(row, 'focus', () => row.classList.add('is-hover'));
      on(row, 'blur', () => row.classList.remove('is-hover'));
      on(row, 'click', () => {
        const key = row.dataset.key;
        selectPair(key);
        $('#terminal')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        toast(`${COINS[key].name} loaded into the demo ticket`);
      });
      on(row, 'keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); row.click(); }
      });
    });
    if (reduceMotion) rows.forEach((r) => r.classList.add('is-in'));
    else rows.forEach((r, i) => setTimeout(() => r.classList.add('is-in'), 30 + i * 40));
  }
  buildRows();

  /* market filter */
  const marketSeg = $('[data-seg="market"]');
  if (marketSeg) {
    segmented(marketSeg, (b) => {
      const f = b.dataset.filter;
      $$('.mrow').forEach((row) => {
        const c = COINS[row.dataset.key];
        let show = true;
        if (f === 'gainers') show = c.chg > 1;
        if (f === 'futures') show = ['BTC', 'ETH', 'SOL', 'XRP', 'DOGE'].includes(c.key);
        if (f === 'inr') show = true;
        row.style.display = show ? '' : 'none';
      });
      const count = $$('.mrow').filter((r) => r.style.display !== 'none').length;
      toast(f === 'all' ? 'Showing every listed pair' : `${count} pairs match this filter`, 'ok', 2200);
    });
  }

  /* ── converter ─────────────────────────────────────────────────────────── */
  const convFrom = $('#convFrom');
  const convTo = $('#convTo');
  const convFromBox = $('#convFromBox');
  const convToBox = $('#convToBox');
  const convRate = $('#convertRate');
  const convSwap = $('#convSwap');

  const unitINR = document.createElement('span');
  unitINR.className = 'field__unit field__unit--static';
  unitINR.textContent = 'INR';

  const conv = { dir: 'inr2coin', coin: 'BTC' };

  /* the coin button moves to whichever side holds the coin */
  function coinUnitBtn() {
    let btn = $('#convCoinBtn');
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.id = 'convCoinBtn';
      btn.className = 'field__unit';
      btn.setAttribute('aria-label', 'Choose a coin');
      btn.innerHTML = `<span data-coin-code>BTC</span><svg viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`;
      on(btn, 'click', openCoinSheet);
    }
    return btn;
  }

  function paintUnits() {
    const btn = coinUnitBtn();
    const code = $('[data-coin-code]', btn);
    if (code) code.textContent = conv.coin;
    const coinOnLeft = conv.dir === 'coin2inr';
    (coinOnLeft ? convFromBox : convToBox).append(btn);
    (coinOnLeft ? convToBox : convFromBox).append(unitINR);
    $$('#convChips .chipbtn').forEach((c) => c.classList.toggle('is-active', c.dataset.coin === conv.coin));
    if (convRate) convRate.textContent = `1 ${conv.coin} = ${rupee(COINS[conv.coin].price, COINS[conv.coin].dp)}`;
  }

  function convCalc(source) {
    const price = COINS[conv.coin].price;
    const leftIsCoin = conv.dir === 'coin2inr';
    const readNum = (el) => parseFloat(String(el.value).replace(/[^\d.]/g, '')) || 0;
    if (source === 'from') {
      const v = readNum(convFrom);
      const out = leftIsCoin ? v * price : v / price;
      convTo.value = leftIsCoin ? inr(out, 2) : trimNum(out);
    } else {
      const v = readNum(convTo);
      const out = leftIsCoin ? v / price : v * price;
      convFrom.value = leftIsCoin ? trimNum(out) : inr(out, 2);
    }
  }
  const trimNum = (v) => {
    if (!isFinite(v)) return '0';
    const s = v >= 1 ? v.toFixed(2) : v.toPrecision(8);
    return String(parseFloat(s));
  };

  /* money input with caret preservation; getDp decides grouping + decimal depth */
  function moneyInput(el, onInput, getDp) {
    on(el, 'input', () => {
      const maxDp = typeof getDp === 'function' ? getDp() : (getDp || 2);
      const caret = el.selectionStart ?? el.value.length;
      const digitsBefore = el.value.slice(0, caret).replace(/[^\d.]/g, '').length;
      const raw = el.value.replace(/[^\d.]/g, '');
      if (!raw) { el.value = ''; onInput?.(); return; }
      const parts = raw.split('.');
      const intPart = parts[0].replace(/^0+(?=\d)/, '');
      const decPart = parts[1] !== undefined ? '.' + parts[1].slice(0, maxDp) : '';
      const formatted = maxDp > 2
        ? (intPart || '0') + decPart
        : (intPart ? inr(parseFloat(intPart), 0) + decPart : '0' + decPart);
      el.value = formatted;
      let count = 0, pos = formatted.length;
      for (let i = 0; i < formatted.length; i++) {
        if (/[\d.]/.test(formatted[i])) count++;
        if (count === digitsBefore) { pos = i + 1; break; }
      }
      try { el.setSelectionRange(pos, pos); } catch { /* ignore */ }
      onInput?.();
    });
  }

  /* which side of the converter holds the coin decides how many decimals we allow */
  const convDp = (el) => {
    const coinIsLeft = conv.dir === 'coin2inr';
    const isCoinSide = (el === convFrom) === coinIsLeft;
    return isCoinSide ? 8 : 2;
  };
  moneyInput(convFrom, () => convCalc('from'), () => convDp(convFrom));
  moneyInput(convTo, () => convCalc('to'), () => convDp(convTo));

  on(convSwap, 'click', () => {
    conv.dir = conv.dir === 'inr2coin' ? 'coin2inr' : 'inr2coin';
    const a = convFrom.value, b = convTo.value;
    convFrom.value = b;
    convTo.value = a;
    paintUnits();
    convCalc('from');
  });

  $$('#convChips .chipbtn').forEach((chip) => on(chip, 'click', () => {
    conv.coin = chip.dataset.coin;
    paintUnits();
    convCalc('from');
  }));

  paintUnits();
  convCalc('from');

  /* coin sheet */
  const coinSheet = $('#coinSheet');
  const coinList = $('#coinList');
  let lastFocus = null;

  function closeSheet() {
    if (!coinSheet) return;
    coinSheet.hidden = true;
    document.body.style.overflow = '';
    lastFocus?.focus?.();
  }
  function openCoinSheet() {
    if (!coinSheet || !coinList) return;
    if (!coinList.childElementCount) {
      coinList.innerHTML = KEYS.map((k) => {
        const c = COINS[k];
        return `<button class="sheet__row" type="button" data-pick="${k}">
          <span class="asset__ico asset__ico--xs" data-v="${k.toLowerCase()}" aria-hidden="true">${c.sym}</span>
          <span><b>${c.name}</b><small>${k}/INR · ${pct(c.chg)}</small></span>
          <em>${rupee(c.price, c.dp)}</em>
        </button>`;
      }).join('');
      $$('[data-pick]', coinList).forEach((row) => on(row, 'click', () => {
        conv.coin = row.dataset.pick;
        paintUnits();
        convCalc('from');
        closeSheet();
        toast(`${COINS[conv.coin].name} selected`);
      }));
    }
    lastFocus = document.activeElement;
    coinSheet.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => $('.sheet__row', coinList)?.focus());
  }
  $$('[data-close]', coinSheet).forEach((el) => on(el, 'click', closeSheet));
  on(document, 'keydown', (e) => { if (e.key === 'Escape' && coinSheet && !coinSheet.hidden) closeSheet(); });

  /* ── order ticket ──────────────────────────────────────────────────────── */
  const FEE = { spot: 0.001, futures: 0.0003 };
  const TDS = 0.01;

  const orderForm = $('#orderForm');
  const amountInput = $('#amountInput');
  const amountSlider = $('#amountSlider');
  const qtyOut = $('#qtyOut');
  const qtyUnit = $('#qtyUnit');
  const qtyLabel = $('label[for="qtyOut"]');
  const feeVal = $('#feeVal');
  const tdsVal = $('#tdsVal');
  const totalVal = $('#totalVal');
  const orderBtn = $('#orderBtn');
  const availNote = $('#availNote');
  const pairSelect = $('#pairSelect');
  const limitRow = $('#limitRow');
  const limitInput = $('#limitInput');
  const ticketPair = $('#ticketPair');
  const ticketIco = $('[data-ticket-ico]');
  const sideWrap = $('.side');

  const state = { side: 'buy', type: 'market', coin: 'BTC', amount: 25000, limit: COINS.BTC.price };
  const BALANCE = 250000;

  const fmtQty = (v) => {
    if (v >= 1) return v.toFixed(6);
    return v.toFixed(8);
  };

  function recalc() {
    const coin = COINS[state.coin];
    const amt = Math.max(0, state.amount || 0);
    const rate = state.type === 'limit' && state.limit > 0 ? state.limit : coin.price;
    const qty = amt / rate;
    const fee = amt * FEE.spot;
    const tds = state.side === 'sell' ? amt * TDS : 0;

    if (feeVal) feeVal.textContent = rupee(fee);
    if (tdsVal) {
      tdsVal.textContent = rupee(tds);
      tdsVal.classList.toggle('is-zero', tds === 0);
    }

    if (state.side === 'buy') {
      if (qtyLabel) qtyLabel.textContent = 'You receive';
      if (qtyOut) qtyOut.value = fmtQty(qty);
      if (qtyUnit) qtyUnit.textContent = state.coin;
      if (totalVal) totalVal.textContent = rupee(amt + fee);
    } else {
      if (qtyLabel) qtyLabel.textContent = 'You receive';
      if (qtyOut) qtyOut.value = rupee(Math.max(0, amt - fee - tds));
      if (qtyUnit) qtyUnit.textContent = 'INR';
      if (totalVal) totalVal.textContent = rupee(fee + tds) + ' in charges';
    }

    if (orderBtn) {
      orderBtn.firstChild.textContent = `Review ${state.side} order `;
    }
    if (availNote) availNote.textContent = `Balance ${rupee(BALANCE)}`;
  }

  function selectPair(key) {
    if (!COINS[key]) return;
    state.coin = key;
    state.limit = COINS[key].price;
    if (pairSelect) pairSelect.value = key;
    if (limitInput) limitInput.value = inr(COINS[key].price, 0);
    if (ticketPair) ticketPair.textContent = `${key} / INR`;
    if (ticketIco) {
      ticketIco.dataset.coin = key;
      ticketIco.dataset.v = key.toLowerCase();
      ticketIco.textContent = COINS[key].sym;
    }
    ticketChart?.setSeries(key, '1D');
    $$('[data-price]').forEach((el) => {
      const c = COINS[el.dataset.price];
      if (c) el.textContent = rupee(c.price, c.dp);
    });
    recalc();
  }

  /* amount ↔ slider */
  function setAmount(v, fromSlider) {
    state.amount = clamp(Math.round(v / 500) * 500, 500, BALANCE);
    if (!fromSlider && amountSlider) amountSlider.value = state.amount;
    if (!fromSlider && amountInput) amountInput.value = inr(state.amount, 0);
    if (amountSlider) amountSlider.style.setProperty('--fill', ((state.amount - 500) / (BALANCE - 500) * 100) + '%');
    $$('#quickRow button').forEach((b) => b.classList.toggle('is-active', Number(b.dataset.amt) === state.amount));
    recalc();
  }
  moneyInput(amountInput, () => {
    let v = parseFloat(String(amountInput.value).replace(/[^\d.]/g, '')) || 0;
    if (v > BALANCE) {
      v = BALANCE;
      amountInput.value = inr(BALANCE, 0);
      toast(`Available balance is ${rupee(BALANCE)}`, 'warn', 2400);
    }
    state.amount = clamp(v, 0, BALANCE);
    const sliderVal = clamp(v, 500, BALANCE);
    if (amountSlider) {
      amountSlider.value = sliderVal;
      amountSlider.style.setProperty('--fill', ((sliderVal - 500) / (BALANCE - 500) * 100) + '%');
    }
    $$('#quickRow button').forEach((b) => b.classList.toggle('is-active', Number(b.dataset.amt) === state.amount));
    recalc();
  });
  on(amountSlider, 'input', () => {
    setAmount(Number(amountSlider.value), true);
    if (amountInput) amountInput.value = inr(state.amount, 0);
  });
  $$('#quickRow button').forEach((b) => on(b, 'click', () => setAmount(Number(b.dataset.amt))));
  moneyInput(limitInput, () => {
    state.limit = parseFloat(String(limitInput.value).replace(/[^\d.]/g, '')) || 0;
    recalc();
  });

  /* side */
  if (sideWrap) {
    const sideBtns = $$('button', sideWrap);
    sideBtns.forEach((b) => on(b, 'click', () => {
      state.side = b.dataset.side;
      sideBtns.forEach((o) => {
        const active = o === b;
        o.classList.toggle('is-active', active);
        o.setAttribute('aria-selected', String(active));
      });
      sideWrap.classList.toggle('is-sell', state.side === 'sell');
      recalc();
    }));
  }

  /* order type */
  const typeSeg = $('[data-type="market"]')?.closest('.seg');
  if (typeSeg) {
    segmented(typeSeg, (b) => {
      state.type = b.dataset.type;
      if (limitRow) limitRow.hidden = state.type !== 'limit';
      recalc();
    });
  }

  on(pairSelect, 'change', () => selectPair(pairSelect.value));

  /* confirm modal */
  const orderModal = $('#orderModal');
  const modalList = $('#modalList');
  const modalConfirm = $('#modalConfirm');
  const modalWarn = $('#modalWarn');
  let modalFocus = null;

  function closeModal() {
    if (!orderModal) return;
    orderModal.hidden = true;
    document.body.style.overflow = '';
    modalFocus?.focus?.();
  }
  function openModal() {
    if (!orderModal || !modalList) return;
    const coin = COINS[state.coin];
    const amt = state.amount;
    const rate = state.type === 'limit' && state.limit > 0 ? state.limit : coin.price;
    const qty = amt / rate;
    const fee = amt * FEE.spot;
    const tds = state.side === 'sell' ? amt * TDS : 0;
    const rows = [
      ['Pair', `${state.coin} / INR`],
      ['Side', state.side === 'buy' ? 'Buy' : 'Sell'],
      ['Order type', state.type === 'limit' ? 'Limit' : 'Market'],
      ['Reference price', rupee(rate, coin.dp)],
      ['Quantity', fmtQty(qty) + ' ' + state.coin],
      ['Notional', rupee(amt)],
      ['Trading fee (0.10%)', rupee(fee)],
      ['TDS (1% on sell)', rupee(tds)],
      [state.side === 'buy' ? 'Total debit' : 'Net credit',
        rupee(state.side === 'buy' ? amt + fee : Math.max(0, amt - fee - tds))],
    ];
    modalList.innerHTML = rows.map(([k, v], i) => {
      const cls = i === rows.length - 1 ? ' class="is-total"' : '';
      return `<div${cls}><dt>${k}</dt><dd>${v}</dd></div>`;
    }).join('');
    if (modalWarn) {
      modalWarn.hidden = state.side !== 'sell';
      if (state.side === 'sell') {
        modalWarn.textContent = `The 1% TDS of ${rupee(tds)} is deducted at source and reported to the Income Tax Department against your PAN.`;
      }
    }
    if (modalConfirm) modalConfirm.textContent = state.side === 'buy' ? 'Place demo buy' : 'Place demo sell';
    modalFocus = document.activeElement;
    orderModal.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => modalConfirm?.focus());
  }
  $$('[data-close]', orderModal).forEach((el) => on(el, 'click', closeModal));
  on(document, 'keydown', (e) => { if (e.key === 'Escape' && orderModal && !orderModal.hidden) closeModal(); });

  on(orderForm, 'submit', (e) => {
    e.preventDefault();
    if (!state.amount || state.amount < 500) {
      toast('Minimum order size is ₹500', 'warn');
      amountInput?.focus();
      return;
    }
    openModal();
  });

  on(modalConfirm, 'click', () => {
    const coin = COINS[state.coin];
    const qty = state.amount / (state.type === 'limit' && state.limit ? state.limit : coin.price);
    closeModal();
    toast(`Demo ${state.side} filled — ${fmtQty(qty)} ${state.coin} at ${rupee(coin.price, coin.dp)}`);
    /* flash the fee line to acknowledge the action */
    document.querySelector('.fees')?.animate?.(
      [{ background: 'rgba(0,184,124,.22)' }, { background: 'rgba(255,255,255,.04)' }],
      { duration: 900, easing: 'ease-out' }
    );
  });

  /* ── order book ────────────────────────────────────────────────────────── */
  const bookAsks = $('#bookAsks');
  const bookBids = $('#bookBids');
  const bookSpread = $('#bookSpread');

  function renderBook() {
    if (!bookAsks || !bookBids) return;
    const coin = COINS[state.coin];
    const step = coin.price * 0.00017;
    const mock = (n) => {
      const r = rng(n * 7 + Math.round(coin.price));
      return r();
    };
    const asks = [], bids = [];
    for (let i = 0; i < 6; i++) {
      asks.push({
        price: coin.price + step * (i + 1),
        qty: 0.004 + mock(i * 3 + 1) * 0.9,
        depth: 18 + mock(i * 5 + 2) * 74,
      });
      bids.push({
        price: coin.price - step * (i + 1),
        qty: 0.004 + mock(i * 4 + 3) * 0.9,
        depth: 18 + mock(i * 6 + 4) * 74,
      });
    }
    const row = (r, dp) => `<div class="brow" style="--d:${r.depth.toFixed(0)}%">
        <span>${inr(r.price, dp)}</span>
        <span>${r.qty.toFixed(4)}</span>
        <span>${compactINR(r.qty * r.price)}</span>
        <span>${r.depth.toFixed(0)}%</span>
      </div>`;
    bookAsks.innerHTML = asks.reverse().map((r) => row(r, coin.dp)).join('');
    bookBids.innerHTML = bids.map((r) => row(r, coin.dp)).join('');
    if (bookSpread) bookSpread.textContent = rupee(step * 2, coin.dp);
  }
  renderBook();

  /* ── ticker build ──────────────────────────────────────────────────────── */
  const tickerTrack = $('#tickerTrack');
  if (tickerTrack) {
    const order = ['BTC', 'ETH', 'SOL', 'XRP', 'DOGE', 'LINK', 'BNB', 'SUI', 'AVAX', 'ADA', 'DOT', 'HBAR'];
    const item = (k) => {
      const c = COINS[k];
      return `<span class="tk"><b>${k}</b><small>/INR</small><span data-tk="${k}" data-kind="price">${rupee(c.price, c.dp)}</span><span class="${c.chg >= 0 ? 'up' : 'down'}" data-tk="${k}" data-kind="chg">${pct(c.chg)}</span><i class="d"></i></span>`;
    };
    tickerTrack.innerHTML = order.map(item).join('') + order.map(item).join('');
  }

  /* ── real-time live price sync ─────────────────────────────────────────── */
  const GECKO_IDS = {
    BTC: 'bitcoin',
    ETH: 'ethereum',
    SOL: 'solana',
    BNB: 'binancecoin',
    XRP: 'ripple',
    ADA: 'cardano',
    DOGE: 'dogecoin',
    LINK: 'chainlink',
    AVAX: 'avalanche-2',
    DOT: 'polkadot',
    SUI: 'sui',
    HBAR: 'hedera-hashgraph',
    APT: 'aptos',
    POL: 'polygon-ecosystem-token',
  };

  const BINANCE_SYMBOLS = {
    BTC: 'BTCUSDT',
    ETH: 'ETHUSDT',
    SOL: 'SOLUSDT',
    BNB: 'BNBUSDT',
    XRP: 'XRPUSDT',
    ADA: 'ADAUSDT',
    DOGE: 'DOGEUSDT',
    LINK: 'LINKUSDT',
    AVAX: 'AVAXUSDT',
    DOT: 'DOTUSDT',
    SUI: 'SUIUSDT',
    HBAR: 'HBARUSDT',
    APT: 'APTUSDT',
    POL: 'POLUSDT',
  };
  const SYMBOL_TO_KEY = Object.fromEntries(
    Object.entries(BINANCE_SYMBOLS).map(([k, sym]) => [sym, k])
  );

  let usdtInrRate = 89.5; // live dynamic exchange rate

  function updateCoinData(k, newPrice, newChg, isLive = true) {
    const c = COINS[k];
    if (!c) return;
    const oldPrice = c.price;
    if (newPrice != null && !isNaN(newPrice) && newPrice > 0) {
      c.price = newPrice;
    }
    if (newChg != null && !isNaN(newChg)) {
      c.chg = round(newChg, 2);
    }

    // Ticker
    $$(`[data-tk="${k}"]`).forEach((el) => {
      const kind = el.dataset.kind;
      if (kind === 'price') el.textContent = rupee(c.price, c.dp);
      if (kind === 'chg') {
        el.textContent = pct(c.chg);
        el.className = c.chg >= 0 ? 'up' : 'down';
      }
    });

    // Prices in tables / cards
    $$(`[data-price="${k}"]`).forEach((el) => {
      const next = rupee(c.price, c.dp);
      if (el.textContent === next) return;
      el.textContent = next;
      el.animate?.(
        [{ backgroundColor: c.chg >= 0 ? 'rgba(0,184,124,.22)' : 'rgba(235,59,90,.22)' }, { backgroundColor: 'transparent' }],
        { duration: 800, easing: 'ease-out' }
      );
    });

    // Change pills & percentages
    $$(`[data-chg-pill="${k}"]`).forEach((el) => {
      el.textContent = pct(c.chg);
      el.className = 'chg ' + (c.chg >= 0 ? 'up' : 'down');
    });
    $$(`[data-chg="${k}"]`).forEach((el) => {
      el.textContent = pct(c.chg);
      el.className = 'chg ' + (c.chg >= 0 ? 'up' : 'down');
    });

    // Market table row range track
    const row = $(`.mrow[data-key="${k}"]`);
    if (row) {
      const rangeEl = $('.mrow__range', row);
      if (rangeEl) {
        const lo = c.price * (1 - Math.max(0.012, Math.abs(c.chg) / 100 * 0.7));
        const hi = c.price * (1 + Math.max(0.012, Math.abs(c.chg) / 100 * 0.7));
        const pos = clamp((c.price - lo) / Math.max(1e-9, hi - lo), .06, .94) * 100;
        const smalls = $$('small', rangeEl);
        if (smalls[0]) smalls[0].textContent = `24h low ${rupee(lo, 0)}`;
        if (smalls[1]) smalls[1].textContent = `24h high ${rupee(hi, 0)}`;
        const fill = $('.mrow__fill', rangeEl);
        const knob = $('.mrow__knob', rangeEl);
        if (fill) fill.style.width = pos + '%';
        if (knob) knob.style.left = pos + '%';
      }
    }

    // Hero specific updates (BTC)
    if (k === 'BTC') {
      if (heroPrice) {
        heroPrice.classList.remove('flash-up', 'flash-down');
        void heroPrice.offsetWidth;
        heroPrice.classList.add(c.chg >= 0 ? 'flash-up' : 'flash-down');
        clearTimeout(heroPrice._flash);
        heroPrice._flash = setTimeout(() => heroPrice.classList.remove('flash-up', 'flash-down'), 700);
      }
      const stamp = $('#chartStamp');
      if (stamp) {
        stamp.textContent = (isLive ? 'Live · ' : 'Updated ') + new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
        }) + ' IST';
      }
      $$('[data-hl]').forEach((el) => {
        const h = c.price * (el.dataset.hl === 'high' ? 1.006 : 0.994);
        el.textContent = rupee(h, 0);
      });
      if (heroChart && Math.abs(c.price - oldPrice) / oldPrice > 0.005) {
        heroChart.setSeries('BTC', '1D');
      }
    }

    // Converter
    if (conv && k === conv.coin) {
      if (convRate) convRate.textContent = `1 ${conv.coin} = ${rupee(c.price, c.dp)}`;
      if (convTo && document.activeElement !== convTo) convCalc('from');
    }

    // Demo terminal
    if (state && k === state.coin) {
      if (limitInput && document.activeElement !== limitInput && state.type === 'market') {
        state.limit = c.price;
        limitInput.value = inr(c.price, 0);
      }
      renderBook();
      if (document.activeElement !== amountInput) recalc();
    }
  }

  /* CoinGecko live fetch */
  async function fetchLiveCoinGecko() {
    try {
      const ids = Object.values(GECKO_IDS).join(',');
      const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=inr,usd&include_24hr_change=true`);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();

      if (data.bitcoin?.inr && data.bitcoin?.usd) {
        usdtInrRate = data.bitcoin.inr / data.bitcoin.usd;
      }

      KEYS.forEach((k) => {
        const id = GECKO_IDS[k];
        if (data[id] && data[id].inr != null) {
          updateCoinData(k, data[id].inr, data[id].inr_24h_change, true);
        }
      });
    } catch (err) {
      console.warn('CoinGecko fetch failed, trying Binance fallback...', err);
      fetchBinanceFallback();
    }
  }

  /* Binance REST fallback */
  async function fetchBinanceFallback() {
    try {
      const symbols = encodeURIComponent(JSON.stringify(Object.values(BINANCE_SYMBOLS)));
      const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbols=${symbols}`);
      if (!res.ok) return;
      const list = await res.json();
      if (!Array.isArray(list)) return;
      list.forEach((t) => {
        const k = SYMBOL_TO_KEY[t.symbol];
        if (!k) return;
        const usdtPrice = parseFloat(t.lastPrice);
        const chg = parseFloat(t.priceChangePercent);
        if (!isNaN(usdtPrice) && usdtPrice > 0) {
          updateCoinData(k, usdtPrice * usdtInrRate, chg, true);
        }
      });
    } catch (e) {
      console.warn('Binance fallback failed:', e);
    }
  }

  /* Binance real-time WebSocket */
  let wsActive = false;
  function connectBinanceWs() {
    try {
      const ws = new WebSocket('wss://stream.binance.com:9443/ws/!miniTicker@arr');
      ws.onopen = () => {
        wsActive = true;
      };
      ws.onmessage = (event) => {
        try {
          const list = JSON.parse(event.data);
          if (!Array.isArray(list)) return;
          list.forEach((item) => {
            const k = SYMBOL_TO_KEY[item.s];
            if (!k) return;
            const currentUSDT = parseFloat(item.c);
            const openUSDT = parseFloat(item.o);
            if (isNaN(currentUSDT) || currentUSDT <= 0) return;
            const inrPrice = currentUSDT * usdtInrRate;
            const chg = (openUSDT && !isNaN(openUSDT)) ? ((currentUSDT - openUSDT) / openUSDT) * 100 : COINS[k].chg;
            updateCoinData(k, inrPrice, chg, true);
          });
        } catch (e) {}
      };
      ws.onerror = () => { ws.close(); };
      ws.onclose = () => {
        wsActive = false;
        setTimeout(connectBinanceWs, 5000);
      };
    } catch (e) {
      console.warn('WebSocket init error:', e);
    }
  }

  /* Small simulated drift only if WebSocket is not streaming */
  function simulatedJitter() {
    if (wsActive) return;
    KEYS.forEach((k) => {
      const c = COINS[k];
      const drift = (Math.random() - 0.5) * 0.0008;
      const nextPrice = Math.max(0.01, c.price * (1 + drift));
      const nextChg = round(clamp(c.chg + drift * 100 * 0.4, -25, 25), 2);
      updateCoinData(k, nextPrice, nextChg, false);
    });
  }

  // Start live pricing engine
  fetchLiveCoinGecko();
  connectBinanceWs();
  setInterval(fetchLiveCoinGecko, 20000);

  if (!reduceMotion) {
    setInterval(simulatedJitter, 2400);
  }

  /* ── fee calculator ────────────────────────────────────────────────────── */
  const volSlider = $('#volSlider');
  const volOut = $('#volOut');
  const feeMonth = $('#feeMonth');
  const feeRate = $('#feeRate');
  const feeSave = $('#feeSave');
  const feeState = { market: 'spot' };

  function calcFees() {
    if (!volSlider) return;
    const vol = Number(volSlider.value);
    const rate = feeState.market === 'spot' ? 0.001 : 0.0003;
    const fee = vol * rate;
    if (volOut) volOut.textContent = vol >= 1e7 ? '₹' + (vol / 1e7).toFixed(2) + ' Cr' : rupee(vol, 0);
    if (feeMonth) feeMonth.textContent = rupee(fee);
    if (feeRate) feeRate.textContent = (rate * 100).toFixed(2) + '%';
    if (feeSave) feeSave.textContent = rupee(vol * 0.005 - fee, 0) + ' saved';
    volSlider.style.setProperty('--fill', ((vol - 10000) / (1e7 - 10000) * 100) + '%');
  }
  on(volSlider, 'input', calcFees);
  const feeSeg = $('[data-fee="spot"]')?.closest('.seg');
  if (feeSeg) segmented(feeSeg, (b) => { feeState.market = b.dataset.fee; calcFees(); });
  calcFees();

  /* ── products ──────────────────────────────────────────────────────────── */
  const prodSeg = $('[data-seg="product"]');
  if (prodSeg) {
    segmented(prodSeg, (b) => {
      const id = b.dataset.prod;
      $$('.prod').forEach((p) => {
        const active = p.dataset.panel === id;
        p.hidden = !active;
        p.classList.toggle('is-active', active);
      });
    });
  }

  /* ── FAQ: one open at a time ───────────────────────────────────────────── */
  $$('.faq__list details').forEach((d) => {
    on(d, 'toggle', () => {
      if (!d.open) return;
      $$('.faq__list details').forEach((o) => { if (o !== d) o.open = false; });
    });
  });

  /* ── sign-up form ──────────────────────────────────────────────────────── */
  const signupForm = $('#signupForm');
  const signupInput = $('#signupInput');
  const signupBtn = $('#signupBtn');
  const signupMsg = $('#signupMsg');

  on(signupForm, 'submit', (e) => {
    e.preventDefault();
    const raw = (signupInput?.value || '').trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(raw);
    const isPhone = /^(\+?91[\s-]?)?[6-9]\d{9}$/.test(raw.replace(/\s|-/g, ''));
    signupInput?.classList.toggle('is-invalid', !(isEmail || isPhone));
    if (!isEmail && !isPhone) {
      if (signupMsg) { signupMsg.className = 'signup__msg'; signupMsg.textContent = 'Enter a valid Indian mobile number or email address.'; }
      signupInput?.focus();
      return;
    }
    if (signupMsg) {
      signupMsg.className = 'signup__msg is-ok';
      signupMsg.textContent = 'Check your messages — the install link is on its way.';
    }
    if (signupBtn) {
      const original = signupBtn.firstChild.textContent;
      signupBtn.classList.add('btn--done');
      signupBtn.firstChild.textContent = 'Link sent ✓ ';
      setTimeout(() => {
        signupBtn.classList.remove('btn--done');
        signupBtn.firstChild.textContent = original;
      }, 3200);
    }
    toast('Install link sent. Finish KYC in the app in about two minutes.');
  });
  on(signupInput, 'input', () => {
    signupInput.classList.remove('is-invalid');
    if (signupMsg) { signupMsg.textContent = ''; signupMsg.className = 'signup__msg'; }
  });

  /* ── decorative QR ─────────────────────────────────────────────────────── */
  const qr = $('#qr');
  if (qr) {
    const N = 21;
    const isFinder = (x, y) => {
      const inBox = (ox, oy) => x >= ox && x < ox + 7 && y >= oy && y < oy + 7;
      return inBox(0, 0) || inBox(N - 7, 0) || inBox(0, N - 7);
    };
    const finderOn = (x, y) => {
      const rel = (ox, oy) => {
        const dx = x - ox, dy = y - oy;
        if (dx < 0 || dy < 0 || dx > 6 || dy > 6) return null;
        const ring = dx === 0 || dx === 6 || dy === 0 || dy === 6;
        const core = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4;
        return ring || core;
      };
      return rel(0, 0) ?? rel(N - 7, 0) ?? rel(0, N - 7) ?? false;
    };
    const r = rng(20261016);
    let html = '';
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        let dark;
        if (isFinder(x, y)) dark = finderOn(x, y);
        else if (x === 6 || y === 6) dark = (x + y) % 2 === 0;
        else dark = r() > 0.52;
        html += `<i style="background:${dark ? '#04122A' : '#fff'}"></i>`;
      }
    }
    qr.innerHTML = html;
    qr.style.background = '#fff';
    qr.style.padding = '8px';
  }

  /* ── back to top + magnetic buttons + card tilt ────────────────────────── */
  on($('#toTop'), 'click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  if (canHover && !reduceMotion) {
    $$('[data-magnetic]').forEach((btn) => {
      on(btn, 'pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
        const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        btn.style.transform = `translate(${dx * 4}px, ${dy * 4 - 2}px)`;
      });
      /* clear the inline transform so the :active press state can show through */
      on(btn, 'pointerdown', () => { btn.style.transform = ''; });
      on(btn, 'pointerleave', () => { btn.style.transform = ''; });
    });

    const card = $('#chartCard');
    if (card) {
      on(card, 'pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const dx = (e.clientX - r.left) / r.width - .5;
        const dy = (e.clientY - r.top) / r.height - .5;
        card.style.transform = `perspective(1200px) rotateY(${dx * 5}deg) rotateX(${-dy * 5}deg) translateY(-4px)`;
      });
      on(card, 'pointerleave', () => { card.style.transform = ''; });
    }
  }

  /* ── smooth in-page links (respects reduced motion) ────────────────────── */
  $$('a[href^="#"]').forEach((a) => {
    on(a, 'click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      if (history.replaceState) history.replaceState(null, '', id);
    });
  });

  /* ── initial paint ─────────────────────────────────────────────────────── */
  selectPair('BTC');
  setAmount(25000);
  if (window.innerWidth <= 700) $$('.mrow__range').forEach((r) => { r.style.display = 'none'; });
})();
