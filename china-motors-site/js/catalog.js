/* ===== catalog.js v9 ===== */
console.info('catalog.js v9');

const FLY_API = 'https://cm-backend-daniyal.fly.dev/api/vehicles/';
const SAME_ORIGIN_API = new URL('/api/vehicles/', location.origin).toString();

// куда вести на калькулятор (на проде — /calculator, локально можно calculator.html)
const CALC_PATH = location.hostname.endsWith('.com.kz') ? '/calculator' : '/calculator.html';

const $ = s => document.querySelector(s);

// контейнер для карточек
const grid =
  $('#catalog-grid') || $('.catalog-grid') || $('[data-catalog-grid]') ||
  $('#grid') || $('#itemsGrid');

// фильтры
const typeSel =
  $('#typeFilter') || $('[data-filter="type"]') ||
  $('select[name="type"]') || $('select[data-type]');

const sortSel =
  $('#sortSelect') || $('[data-filter="sort"]') ||
  $('select[name="sort"]') || $('select[data-sort]');

let all = [];
let filtered = [];

// ---------- utils ----------
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

function buildCalcUrl(item) {
  const url = new URL(CALC_PATH, location.origin);
  const params = new URLSearchParams({
    name: item.name || `${item.brand} ${item.model}`.trim(),
    title: [item.brand, item.model, item.body].filter(Boolean).join(' '),
    price: item.price_usd ?? '',
    body: item.body || '',
    body_raw: item.body || ''
  });
  url.search = params.toString();
  return url.toString();
}

// ---------- render ----------
function render() {
  if (!grid) return;
  if (!filtered.length) {
    grid.innerHTML = `<div class="muted">Не удалось загрузить каталог</div>`;
    return;
  }
  grid.innerHTML = filtered.map(item => {
    const calcUrl = buildCalcUrl(item);
    const hasImg = Boolean(item.image);
    return `
      <div class="card catalog-card" data-id="${item.id}">
        <a class="thumb ${hasImg ? 'open-photo' : ''}" ${hasImg ? `data-src="${item.image}"` : ''} href="${hasImg ? item.image : '#'}" ${hasImg ? 'target="_blank"' : 'onclick="return false"'} aria-label="Открыть фото">
          ${hasImg ? `<img loading="lazy" src="${item.image}" alt="${item.name}">`
                   : `<div class="no-img">Нет фото</div>`}
        </a>
        <div class="info">
          <div class="title">${item.name}</div>
          <div class="meta">
            ${item.brand ? `<span>${item.brand}</span>` : ''}
            ${item.model ? `<span>${item.model}</span>` : ''}
            ${item.body ? `<span>${item.body}</span>` : ''}
          </div>
          <div class="price">${formatPriceKZT(item.price_usd)}</div>
        </div>
        <div class="actions">
          <button class="btn btn-outline btn-photo" ${hasImg ? `data-src="${item.image}"` : 'disabled'}>Изображение</button>
          <a class="btn btn-primary" href="${calcUrl}">Рассчитать</a>
        </div>
      </div>
    `;
  }).join('');
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
      filtered.sort((a,b)=>(a.price_usd??Infinity)-(b.price_usd??Infinity)); break;
    case 'price_desc':
      filtered.sort((a,b)=>(b.price_usd??-Infinity)-(a.price_usd??-Infinity)); break;
    case 'name_asc':
      filtered.sort((a,b)=>(a.name||'').localeCompare(b.name||'')); break;
    case 'name_desc':
      filtered.sort((a,b)=>(b.name||'').localeCompare(a.name||'')); break;
  }
  render();
}

// ---------- data ----------
async function fetchJson(url) {
  console.info('catalog.js v9 endpoint:', url);
  const r = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

async function load() {
  if (grid) grid.innerHTML = `<div class="loading">Загрузка...</div>`;
  let data;
  try {
    data = await fetchJson(FLY_API);        // сначала Fly
  } catch (e1) {
    console.warn('Fly API недоступен, пробуем same-origin', e1);
    data = await fetchJson(SAME_ORIGIN_API);
  }
  const list = Array.isArray(data) ? data : (data?.results ?? []);
  all = list.map(normalize);
  refilter();
}

// ---------- photo modal ----------
const photoModal = $('#photoModal');
const photoImg   = photoModal ? photoModal.querySelector('.modal__img') : null;
const photoClose = photoModal ? photoModal.querySelector('.modal__close') : null;

function openPhoto(src){
  if (!photoModal || !photoImg || !src) return;
  photoImg.src = src;
  photoModal.classList.add('open');
  photoModal.setAttribute('aria-hidden','false');
}
function closePhoto(){
  if (!photoModal || !photoImg) return;
  photoImg.src = '';
  photoModal.classList.remove('open');
  photoModal.setAttribute('aria-hidden','true');
}

document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-photo');
  const thumb = e.target.closest('.open-photo');
  if (btn && btn.dataset.src){
    e.preventDefault();
    openPhoto(btn.dataset.src);
  } else if (thumb && thumb.dataset.src){
    // открываем модалку, а не новую вкладку
    e.preventDefault();
    openPhoto(thumb.dataset.src);
  } else if (e.target === photoModal || e.target === photoClose){
    closePhoto();
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePhoto();
});

// ---------- bindings ----------
typeSel && typeSel.addEventListener('change', refilter);
sortSel && sortSel.addEventListener('change', refilter);
document.addEventListener('DOMContentLoaded', load);
