// =======================================================
// Catalog — production version (FINAL, WORKING)
// Single source of truth: catalog.js
// =======================================================

document.addEventListener('DOMContentLoaded', () => {

  const BODY_TYPES = {
    DUMP: 'Самосвал',
    TRACTOR: 'Тягач',
    SPECIAL: 'Спец. техника',
    TRAILER: 'Прицепы',
    SEMI: 'Полуприцепы',
    CRANE: 'Кран'
  };

  const PAGE_TYPE_MAP = {
    dump: BODY_TYPES.DUMP,
    tractor: BODY_TYPES.TRACTOR,
    special: BODY_TYPES.SPECIAL,
    trailer: BODY_TYPES.TRAILER,
    semitrailer: BODY_TYPES.SEMI,
    crane: BODY_TYPES.CRANE
  };

  const pageParams = new URLSearchParams(location.search);
  const pageTypeKey = pageParams.get('type');
  const pageFixedBody = PAGE_TYPE_MAP[pageTypeKey] || null;

  const isFile = location.protocol === 'file:';
  const isLocalhost = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  const metaBase = document.querySelector('meta[name="api-base"]')?.content?.trim();

  let API_BASE = metaBase || (isFile || isLocalhost
    ? 'http://127.0.0.1:8000'
    : location.origin);

  API_BASE = API_BASE.replace(/\/+$/, '');

  const grid     = document.getElementById('grid');
  const bodyEl   = document.getElementById('body');
  const sortEl   = document.getElementById('sort');
  const searchEl = document.getElementById('search');

  const gModal  = document.getElementById('gallery');
  const gTitle  = document.getElementById('gTitle');
  const gMain   = document.getElementById('gMain');
  const gThumbs = document.getElementById('gThumbs');
  const gClose  = document.getElementById('gClose');

  function canonBody(rawTitle, rawBody) {
    const s = `${rawTitle} ${rawBody}`.toLowerCase();
    if (s.includes('тягач')) return BODY_TYPES.TRACTOR;
    if (s.includes('прицеп')) return BODY_TYPES.TRAILER;
    if (s.includes('полуприцеп')) return BODY_TYPES.SEMI;
    if (s.includes('самосвал')) return BODY_TYPES.DUMP;
    return BODY_TYPES.SPECIAL;
  }

  function normalize(v) {
    if (!v || !v.id) return null;

    const title = [v.brand, v.model, v.name].filter(Boolean).join(' ').trim();
    const bodyRaw = v.body_type ?? v.body ?? '';
    const bodyType = canonBody(title, bodyRaw);
    const images = v.image_url ? [v.image_url] : [];

    return {
      id: v.id,
      title,
      price: Number(v.price_usd) || null,
      year: v.year || null,
      bodyRaw,
      bodyType,
      images,
      mainImg: images[0] || ''
    };
  }

  function cardHTML(item) {
    const params =
      `calculator.html?name=${encodeURIComponent(item.title)}` +
      `&price=${encodeURIComponent(item.price ?? '')}` +
      `&year=${encodeURIComponent(item.year ?? '')}` +
      `&body=${encodeURIComponent(item.bodyType)}` +
      `&body_raw=${encodeURIComponent(item.bodyRaw)}`;

    return `
      <div class="feature-card" data-id="${item.id}">
        <img src="${item.mainImg}" alt="${item.title}">
        <h3>${item.title}</h3>
        <p class="muted">Конструкция: ${item.bodyRaw || item.bodyType}</p>
        <div class="price">${item.price ? item.price + '$' : 'Цена по запросу'}</div>
        <div class="card-actions">
          <a href="${params}" class="btn btn--primary">Рассчитать</a>
          <button class="btn btn--ghost js-open-gallery">Фотографии</button>
        </div>
      </div>`;
  }

  let all = [];
  let current = [];

  function render(list) {
    grid.innerHTML = list.map(cardHTML).join('');

    grid.querySelectorAll('.js-open-gallery').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const card = e.currentTarget.closest('.feature-card');
        const item = current.find(v => String(v.id) === card.dataset.id);
        if (!item || !item.images.length) return;
        gTitle.textContent = item.title;
        gMain.src = item.images[0];
        gThumbs.innerHTML = '';
        gModal.classList.add('open');
      });
    });
  }

  gClose?.addEventListener('click', () => {
    gModal.classList.remove('open');
    gMain.removeAttribute('src');
  });

  function refilter() {
    const b = pageFixedBody || bodyEl?.value || '';
    const q = (searchEl?.value || '').toLowerCase();

    current = all.filter(x =>
      (!b || x.bodyType === b) &&
      (!q || x.title.toLowerCase().includes(q))
    );

    render(current);
  }

  bodyEl?.addEventListener('change', refilter);
  sortEl?.addEventListener('change', refilter);
  searchEl?.addEventListener('input', refilter);

  async function load() {
    const r = await fetch(`${API_BASE}/api/vehicles/`);
    const data = await r.json();
    const list = Array.isArray(data) ? data : data.results || [];
    all = list.map(normalize).filter(Boolean);
    refilter();
  }

  load();
});
