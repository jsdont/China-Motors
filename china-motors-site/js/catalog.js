/* ===== catalog.js v8 ===== */
console.info('catalog.js v8');

const FLY_API = 'https://cm-backend-daniyal.fly.dev/api/vehicles/';
const SAME_ORIGIN_API = new URL('/api/vehicles/', location.origin).toString();

const $ = (s) => document.querySelector(s);
const grid =
  $('#catalog-grid') || $('.catalog-grid') || $('[data-catalog-grid]') ||
  $('#grid') || $('#itemsGrid');

const typeSel =
  $('#typeFilter') || $('[data-filter="type"]') ||
  $('select[name="type"]') || $('select[data-type]');

const sortSel =
  $('#sortSelect') || $('[data-filter="sort"]') ||
  $('select[name="sort"]') || $('select[data-sort]');

let all = [];
let filtered = [];

function normalize(v) {
  return {
    id: v.id,
    brand: v.brand || '',
    model: v.model || '',
    name: v.name || [v.brand, v.model].filter(Boolean).join(' '),
    body: v.body_type || v.body || '',
    price_usd: v.price_usd ?? v.price ?? null,
    image: v.image_url || v.image || '',
    kind: (v.body_type || v.body || '').toLowerCase(),
  };
}

function formatPriceKZT(usd) {
  if (usd == null) return 'Цена по запросу';
  const rate = window.KZT_RATE || 505;
  const kzt = Math.round((usd * rate) / 1000) * 1000;
  return kzt.toLocaleString('ru-RU') + ' ₸';
}

function render() {
  if (!grid) return;
  if (!filtered.length) {
    grid.innerHTML = `<div class="muted">Не удалось загрузить каталог</div>`;
    return;
  }
  grid.innerHTML = filtered.map(item => `
    <div class="card catalog-card" data-id="${item.id}">
      <div class="thumb">
        ${item.image ? `<img loading="lazy" src="${item.image}" alt="${item.name}">`
                     : `<div class="no-img">Нет фото</div>`}
      </div>
      <div class="info">
        <div class="title">${item.name}</div>
        <div class="meta">
          ${item.brand ? `<span>${item.brand}</span>` : ''}
          ${item.model ? `<span>${item.model}</span>` : ''}
          ${item.body ? `<span>${item.body}</span>` : ''}
        </div>
        <div class="price">${formatPriceKZT(item.price_usd)}</div>
      </div>
    </div>
  `).join('');
}

function refilter() {
  const typeVal = (typeSel && typeSel.value || '').toLowerCase();
  const sortVal = (sortSel && sortSel.value) || '';

  filtered = all.filter(x => {
    if (!typeVal || ['все','all',''].includes(typeVal)) return true;
    return x.kind.includes(typeVal);
  });

  switch (sortVal) {
    case 'price_asc':
      filtered.sort((a,b)=>(a.price_usd??Infinity)-(b.price_usd??Infinity));
      break;
    case 'price_desc':
      filtered.sort((a,b)=>(b.price_usd??-Infinity)-(a.price_usd??-Infinity));
      break;
    case 'name_asc':
      filtered.sort((a,b)=>(a.name||'').localeCompare(b.name||''));
      break;
    case 'name_desc':
      filtered.sort((a,b)=>(b.name||'').localeCompare(a.name||''));
      break;
  }
  render();
}

async function fetchJson(url) {
  console.info('catalog.js v8, endpoint:', url);
  const r = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

async function load() {
  if (grid) grid.innerHTML = `<div class="loading">Загрузка...</div>`;
  let data;
  try {
    // 1) всегда сначала Fly
    data = await fetchJson(FLY_API);
  } catch (e1) {
    console.warn('Fly API недоступен, резервный запрос:', e1);
    // 2) резерв — same-origin (если ты вдруг поднимешь API на своём домене)
    data = await fetchJson(SAME_ORIGIN_API);
  }
  const list = Array.isArray(data) ? data : (data?.results ?? []);
  all = list.map(normalize);
  refilter();
}

typeSel && typeSel.addEventListener('change', refilter);
sortSel && sortSel.addEventListener('change', refilter);

document.addEventListener('DOMContentLoaded', load);
