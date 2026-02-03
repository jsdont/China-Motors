// =======================================================
// Catalog — production version
// SEO pages via ?type=
// Single source of truth: catalog.js
// =======================================================

document.addEventListener('DOMContentLoaded', () => {

  // ================= BODY TYPES (CANONICAL) =================

  const BODY_TYPES = {
    DUMP: 'Самосвал',
    TRACTOR: 'Тягач',
    SPECIAL: 'Спец. техника',
    TRAILER: 'Прицепы',
    SEMI: 'Полуприцепы',
    CRANE: 'Кран'
  };

  // ================= SEO PAGE TYPE MAP =================

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

  // ================= API BASE =================

  const isFile = location.protocol === 'file:';
  const isLocalhost = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  const metaBase = document.querySelector('meta[name="api-base"]')?.content?.trim();

  let API_BASE = metaBase || (isFile || isLocalhost
    ? 'http://127.0.0.1:8000'
    : location.origin);

  API_BASE = API_BASE.replace(/\/+$/, '');

  // ================= DOM =================

  const grid     = document.getElementById('grid');
  const bodyEl   = document.getElementById('body');
  const sortEl   = document.getElementById('sort');
  const searchEl = document.getElementById('search');

  // ================= GALLERY =================

  const gModal  = document.getElementById('gallery');
  const gTitle  = document.getElementById('gTitle');
  const gMain   = document.getElementById('gMain');
  const gThumbs = document.getElementById('gThumbs');
  const gPrev   = document.getElementById('gPrev');
  const gNext   = document.getElementById('gNext');
  const gClose  = document.getElementById('gClose');

  // ================= HELPERS =================

  const nfRU = new Intl.NumberFormat('ru-RU');
  const fmtPrice = n => (n === 0 || n) ? `${nfRU.format(Number(n))}$` : 'Цена по запросу';

  const escapeMap = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  };
  const escHTML = s => String(s ?? '').replace(/[&<>"']/g, m => escapeMap[m]);
  const escAttr = escHTML;

  function canonBody(rawTitle, rawBody) {
    const s = `${rawTitle} ${rawBody}`.toLowerCase();

    // --- узкоспециализированные типы ---

    if (s.includes('рефриж') || s.includes('refriger'))
      return 'Рефрижератор';

    if (
      s.includes('фургон') ||
      s.includes('isoterm') ||
      s.includes('изотерм') ||
      s.includes('van')
    )
      return 'Автофургон';

    if (
      s.includes('ямобур') ||
      s.includes('бкм') ||
      s.includes('бур') ||
      s.includes('drill')
    )
      return 'Ямобур машины для бурения';

    if (s.includes('молоковоз') || s.includes('milk'))
      return 'Молоковоз';

    if (
      s.includes('топлив') ||
      s.includes('fuel') ||
      s.includes('заправ')
    )
      return 'Топливозаправщик';

    // --- спецтехника (подтипы) ---

    if (s.includes('манипулятор') || s.includes('manipulator'))
      return BODY_TYPES.SPECIAL;

    if (s.includes('миксер') || s.includes('concrete'))
      return BODY_TYPES.SPECIAL;

    if (s.includes('автовышка') || s.includes('aerial') || s.includes('lift'))
      return BODY_TYPES.SPECIAL;

    if (s.includes('ассенизатор') || s.includes('sewer'))
      return BODY_TYPES.SPECIAL;

    if (s.includes('полив') || s.includes('sprinkler') || s.includes('washer'))
      return BODY_TYPES.SPECIAL;

    if (
      s.includes('экскаватор') ||
      s.includes('погрузчик') ||
      s.includes('loader') ||
      s.includes('excavator')
    )
      return BODY_TYPES.SPECIAL;

    // --- базовые категории (обязательно ниже спец-проверок) ---

    if (s.includes('полуприцеп') || s.includes('semi'))
      return BODY_TYPES.SEMI;

    if (
      !s.includes('полуприцеп') &&
      (s.includes('прицеп') || s.includes('trailer'))
    )
      return BODY_TYPES.TRAILER;

    if (s.includes('самосвал') || s.includes('dump'))
      return BODY_TYPES.DUMP;

    if (
      s.includes('тягач') ||
      s.includes('седельный') ||
      s.includes('tractor')
    )
      return BODY_TYPES.TRACTOR;

    if (s.includes('кран') || s.includes('crane'))
      return BODY_TYPES.CRANE;

    // --- дефолт ---

    return BODY_TYPES.SPECIAL;


  }

  function pickBodyRaw(v) {
    return (
      v.body_type ?? v.bodyType ?? v.body ?? v.body_name ??
      v.configuration ?? v.config ?? v.spec ?? v.specs ?? ''
    );
  }

  function makeCalcName(v, fallbackTitle) {
    const brand = (v.brand || '').trim();
    const model = (v.model || '').trim();
    if (brand || model) return `${brand} ${model}`.trim();
    return fallbackTitle.split(' ').slice(0, 4).join(' ');
  }

  function normalize(v) {
    const title = [v.brand, v.model, v.name].filter(Boolean).join(' ');
    const bodyRaw = pickBodyRaw(v);

    const mainImg =
      v.image_url ||
      v.photo_url ||
      (Array.isArray(v.images) && v.images[0]) ||
      null;

    if (!mainImg) return null;

    return {
      id: v.id,
      title,
      mainImg,
      priceNum: v.price_usd ?? null,

      // 👇 ВАЖНО
      bodyType: canonBody(title, bodyRaw), // Тягач / Самосвал
      bodyRaw,                             // 6*4 Евро 5 ...

      calcName: makeCalcName(v, title),
      weight_t: v.weight_t ?? null
    };
  }


  // ================= RENDER =================

  function cardHTML(x) {
    return `
      <div class="feature-card" data-id="${x.id}">
        
        <a href="product.html?id=${x.id}" class="card-link">
          <div class="card-image">
            <img src="${x.mainImg}" alt="${x.title}">
          </div>
        </a>

        <div class="card-content">
          <h3>${x.title}</h3>

          <div class="meta-row">
            <span><b>Конструкция:</b> ${x.bodyRaw || '—'}</span>
          </div>


          <div class="price">
            ${x.priceNum ? `${x.priceNum}$` : 'Цена по запросу'}
          </div>

          <div class="card-actions">
            <button class="btn js-open-gallery">Фотографии</button>
            <a class="btn btn-ghost"
              href="calculator.html
              ?name=${encodeURIComponent(x.calcName)}
              &price=${x.priceNum ?? ''}
              &body=${encodeURIComponent(x.bodyType)}
              &weight=${x.weight_t ?? ''}"
            </a>
          </div>
        </div>
      </div>
    `;
  }




  function render(list) {
    grid.innerHTML = list
      .filter(x => x && x.id && x.mainImg) // ⬅️ КРИТИЧНО
      .map(cardHTML)
      .join('');

    grid.querySelectorAll('.js-open-gallery').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const card = e.currentTarget.closest('.feature-card');
        const item = current.find(v => String(v.id) === card.dataset.id);
        if (item) openGallery(item);
      });
    });
  }


  // ================= GALLERY LOGIC =================

  let gIdx = 0;
  let gImgs = [];

  function openGallery(item) {
    gImgs = item.images || [];
    if (!gImgs.length) return;
    gIdx = 0;
    gTitle.textContent = item.title;
    drawGallery();
    gModal.classList.add('open');
  }

  function drawGallery() {
    gMain.src = gImgs[gIdx];
    gThumbs.innerHTML = gImgs.map((src, i) =>
      `<img src="${escAttr(src)}" data-i="${i}" class="${i === gIdx ? 'active' : ''}">`
    ).join('');
    gThumbs.querySelectorAll('img').forEach(img =>
      img.addEventListener('click', () => {
        gIdx = Number(img.dataset.i);
        drawGallery();
      })
    );
  }

  function closeGallery() {
    gModal.classList.remove('open');
    gMain.removeAttribute('src');
    gThumbs.innerHTML = '';
  }

  gPrev?.addEventListener('click', () => {
    gIdx = (gIdx - 1 + gImgs.length) % gImgs.length;
    drawGallery();
  });
  gNext?.addEventListener('click', () => {
    gIdx = (gIdx + 1) % gImgs.length;
    drawGallery();
  });
  gClose?.addEventListener('click', closeGallery);

  // ================= FILTER =================

  let all = [];
  let current = [];

  function applyFilters() {
    const b = pageFixedBody || (bodyEl?.value || '').trim();
    const q = (searchEl?.value || '').toLowerCase();

    current = all
      .filter(x => x && x.id && x.bodyType) // ⬅️
      .filter(x => {
        const bodyOk = !b || x.bodyType === b;
        const searchOk = !q || x.title.toLowerCase().includes(q);
        return bodyOk && searchOk;
      });


  }

  function applySort() {
    const s = sortEl?.value;
    if (s === 'price_asc') current.sort((a, b) => (a.priceNum ?? Infinity) - (b.priceNum ?? Infinity));
    if (s === 'price_desc') current.sort((a, b) => (b.priceNum ?? -Infinity) - (a.priceNum ?? -Infinity));
  }

  function refilter() {
    applyFilters();
    applySort();
    render(current);
  }

  bodyEl?.addEventListener('change', refilter);
  sortEl?.addEventListener('change', refilter);
  searchEl?.addEventListener('input', refilter);

  // ================= LOAD =================

  async function load() {
    try {
      grid.innerHTML = '<div data-i18n="loading" class="loading">Загрузка...</div>';
      const r = await fetch(`${API_BASE}/api/vehicles/`);
      if (!r.ok) throw new Error(r.status);
      const data = await r.json();

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.results) ? data.results : [];

      all = list.map(normalize).filter(Boolean);
      refilter();

      if (pageTypeKey && !pageFixedBody) {
        console.warn('[catalog] unknown page type:', pageTypeKey);
      }


    } catch (e) {
      console.error(e);
      grid.innerHTML = '<div data-i18n="loading_error" class="error">Ошибка загрузки каталога</div>';
    }
  }

  load();
});
