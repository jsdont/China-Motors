// =======================================================
// Catalog — CLEAN production version
// Cards → product.html?id=
// NO gallery, NO calculator here
// =======================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ================= API BASE ================= */

  const metaBase = document.querySelector('meta[name="api-base"]')?.content;
  const API_BASE = (metaBase || location.origin).replace(/\/+$/, '');

  /* ================= DOM ================= */

  const grid     = document.getElementById('grid');
  const bodyEl   = document.getElementById('body');
  const sortEl   = document.getElementById('sort');
  const searchEl = document.getElementById('search');

  /* ================= HELPERS ================= */

  const nf = new Intl.NumberFormat('ru-RU');
  const fmtPrice = v => v ? `${nf.format(v)}$` : 'Цена по запросу';

  function canonBody(title = '', raw = '') {
    const s = `${title} ${raw}`.toLowerCase();

    if (s.includes('самосвал')) return 'Самосвал';
    if (s.includes('тягач')) return 'Тягач';
    if (s.includes('полуприцеп')) return 'Полуприцеп';
    if (s.includes('прицеп')) return 'Прицеп';
    if (s.includes('кран')) return 'Кран';

    return 'Спец. техника';
  }

  function normalize(v) {
    if (!v?.id) return null;

    const title =
      [v.brand, v.model, v.name].filter(Boolean).join(' ').trim();

    const bodyRaw =
      v.body_type || v.body || v.configuration || '';

    return {
      id: v.id,
      title,
      price: Number(v.price_usd) || null,
      year: v.year || null,
      bodyType: canonBody(title, bodyRaw),
      bodyRaw,
      image: v.image_url || '/img/no-photo.png'
    };
  }

  /* ================= CARD ================= */

  function cardHTML(item) {
    return `
      <a class="product-card" href="product.html?id=123">
        <div class="product-image">
          <img src="IMAGE_URL" alt="Shacman X6000">
        </div>

        <div class="product-body">
          <h3 class="product-title">Shacman X6000, 2023</h3>

          <div class="product-specs">
            <div class="spec">
              <span>Колесная формула</span>
              <strong>4×2</strong>
            </div>
            <div class="spec">
              <span>Мощность в л.с</span>
              <strong>—</strong>
            </div>
            <div class="spec">
              <span>Коробка передач</span>
              <strong>Автомат</strong>
            </div>
            <div class="spec">
              <span>Тип кабины</span>
              <strong>2-х местная с 1 спальным</strong>
            </div>
          </div>

          <div class="product-footer">
            <div class="price">7 490 000 ₽</div>
            <span class="btn-outline">Оставить заявку</span>
          </div>
        </div>
      </a>
    `;
  }

  /* ================= RENDER ================= */

  function render(list) {
    grid.innerHTML = list.map(cardHTML).join('');
  }

  /* ================= FILTER / SORT ================= */

  let all = [];
  let current = [];

  function applyFilters() {
    const b = bodyEl?.value || '';
    const q = (searchEl?.value || '').toLowerCase();

    current = all.filter(x => {
      const bodyOk = !b || x.bodyType === b;
      const searchOk = !q || x.title.toLowerCase().includes(q);
      return bodyOk && searchOk;
    });
  }

  function applySort() {
    const s = sortEl?.value;
    if (s === 'price_asc') current.sort((a,b)=>(a.price??1e9)-(b.price??1e9));
    if (s === 'price_desc') current.sort((a,b)=>(b.price??0)-(a.price??0));
  }

  function refilter() {
    applyFilters();
    applySort();
    render(current);
  }

  bodyEl?.addEventListener('change', refilter);
  sortEl?.addEventListener('change', refilter);
  searchEl?.addEventListener('input', refilter);

  /* ================= LOAD ================= */

  async function load() {
    try {
      grid.innerHTML = 'Загрузка…';

      const r = await fetch(`${API_BASE}/api/vehicles/`);
      const data = await r.json();
      const list = Array.isArray(data) ? data : data.results || [];

      all = list.map(normalize).filter(Boolean);
      refilter();

    } catch (e) {
      console.error(e);
      grid.innerHTML = 'Ошибка загрузки каталога';
    }
  }

  load();
});
