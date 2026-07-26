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
  const brandEl  = document.getElementById('brand');
  const wheelEl  = document.getElementById('wheelFormula');
  const sourceEl = document.getElementById('source');

  /* ================= HELPERS ================= */

  const nf = new Intl.NumberFormat('ru-RU');
  const fmtPrice = v => v ? `${nf.format(v)}¥` : 'Цена уточняется';

  const AVAIL_LABELS = {
    in_stock: 'В наличии',
    out_of_stock: 'Нет в наличии',
    on_order: 'На заказ'
  };

  // Приводим "6×4", "6X4", "6х4" (кириллица) к одному виду "6x4",
  // чтобы поиск/фильтр не зависели от того, каким символом набрана "х".
  function normText(s) {
    return (s || '').toLowerCase().replace(/[×х]/g, 'x');
  }

  function extractWheelFormula(text) {
    const m = normText(text).match(/(\d)\s*x\s*(\d)/);
    return m ? `${m[1]}x${m[2]}` : '';
  }

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
      [v.brand, v.model, v.body_type].filter(Boolean).join(' ').trim();

    const bodyRaw =
      v.category || v.body_type || v.body || v.configuration || '';

    const priceKzt = Number(v.price_kzt) || null;
    const priceCny = Number(v.price_cny) || null;

    return {
      id: v.id,
      title,
      price: priceKzt || priceCny,
      priceCurrency: priceKzt ? 'kzt' : 'cny',
      year: v.year || null,
      bodyType: canonBody(title, bodyRaw),
      bodyRaw,
      brand: v.brand || '',
      wheelFormula: normText(v.wheel_formula || '') || extractWheelFormula(`${title} ${bodyRaw}`),
      image: v.image_url ? (window.cmOptimizeImage?.(v.image_url, { width: 400 }) || v.image_url) : '/img/no-photo.png',
      availability: v.availability || 'in_stock',
      isUserListing: Boolean(v.is_user_listing),
      ownerRoleLabel: v.owner_role_label || '',
      raw: v
    };
  }

  /* ================= CARD ================= */

  function cardHTML(item) {
    const isFav = window.CMFavorites?.isFavorite(item.id);
    return `
      <a class="cm-card" href="product.html?id=${item.id}">
        <div class="cm-card__image">
          <img src="${item.image}" alt="${item.title}" loading="lazy" decoding="async">
          <span class="cm-badge cm-badge--${item.availability}">${AVAIL_LABELS[item.availability] || ''}</span>
          ${item.isUserListing ? `<span class="cm-badge cm-badge--user-listing">${window.t ? window.t('badge_user_listing_prefix') : 'Объявление от'} ${item.ownerRoleLabel || 'клиента'}</span>` : ''}
          <button type="button" class="cm-card__fav-btn${isFav ? ' active' : ''}" data-fav-id="${item.id}" title="${window.t ? window.t('fav_remove_title') : 'Избранное'}">
            <i class="fa-${isFav ? 'solid' : 'regular'} fa-bookmark"></i>
          </button>
        </div>

        <div class="cm-card__body">
          <h3 class="cm-card__title">
            ${item.raw.body_type || item.title || (window.t ? window.t('card_no_name') : 'Техника')}
          </h3>

          <div class="cm-card__specs">
            <div class="spec">
              <span data-i18n="card_body_label">Тип транспорта</span>
              <strong>${item.raw.category}</strong>
            </div>
            ${item.raw?.wheel_formula ? `
            <div class="spec">
              <span data-i18n="card_wheel_formula_label">Колёсная формула</span>
              <strong>${item.raw.wheel_formula}</strong>
            </div>` : ''}
            ${item.raw?.gearbox ? `
            <div class="spec">
              <span data-i18n="card_gearbox_label">КПП</span>
              <strong>${item.raw.gearbox}</strong>
            </div>` : ''}
          </div>

          <div class="cm-card__footer">
            <div class="price">
              ${item.price ? `${item.price.toLocaleString('ru-RU')} ${item.priceCurrency === 'kzt' ? '₸' : '¥'}` : 'Цена уточняется'}
            </div>
            <span data-i18n="btn_calculate_catalog" class="btn-outline">Подробнее и расчёт</span>
          </div>
        </div>
      </a>
    `;
  }


  /* ================= RENDER ================= */

  function render(list) {
    if (!list.length) {
      // Пустой список — не тупик: подсказываем, что делать дальше.
      grid.innerHTML = `
        <div class="cat-empty">
          <h3>${window.t ? window.t('cat_empty_t') : 'По этому запросу ничего не нашлось'}</h3>
          <p>${window.t ? window.t('cat_empty_d') : 'Попробуйте выбрать другую задачу или посмотреть всё. Либо позвоните — подберём под вашу задачу и бюджет.'}</p>
          <div class="cat-empty__actions">
            <button type="button" class="btn btn--primary" id="catShowAll">${window.t ? window.t('task_all') : 'Показать всё'}</button>
            <a class="btn" href="tel:+77776133731">${window.t ? window.t('help_call') : 'Позвонить'}: +7 777 613 37 31</a>
          </div>
        </div>`;
      document.getElementById('catShowAll')?.addEventListener('click', () => {
        if (bodyEl) bodyEl.value = '';
        if (searchEl) searchEl.value = '';
        if (brandEl) brandEl.value = '';
        if (wheelEl) wheelEl.value = '';
        document.querySelectorAll('#taskFilter .task-btn')
          .forEach(b => b.classList.toggle('active', !b.dataset.body));
        refilter();
      });
    } else {
      grid.innerHTML = list.map(cardHTML).join('');
    }
    const countEl = document.getElementById('resultsCount');
    if (countEl) countEl.textContent = list.length;
  }

  grid?.addEventListener('click', (e) => {
    const btn = e.target.closest('.cm-card__fav-btn');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    const nowFav = window.CMFavorites?.toggleFavorite(btn.dataset.favId);
    btn.classList.toggle('active', nowFav);
    const icon = btn.querySelector('i');
    if (icon) icon.className = `fa-${nowFav ? 'solid' : 'regular'} fa-bookmark`;
  });

  /* ================= SEO (ItemList) ================= */

  function applyItemListSeo(list) {
    const el = document.getElementById('seoItemListLd');
    if (!el) return;
    const itemListLd = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: list.slice(0, 50).map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `https://chinamotors.kz/product.html?id=${item.id}`,
        name: item.title
      }))
    };
    el.textContent = JSON.stringify(itemListLd);
  }

  /* ================= FILTER / SORT ================= */

  let all = [];
  let current = [];

  function populateSelect(selectEl, values) {
    if (!selectEl) return;
    const current = selectEl.value;
    const placeholder = selectEl.querySelector('option[value=""]');
    selectEl.innerHTML = '';
    if (placeholder) selectEl.appendChild(placeholder);
    values.forEach(v => {
      const opt = document.createElement('option');
      opt.value = v;
      opt.textContent = v;
      selectEl.appendChild(opt);
    });
    if (values.includes(current)) selectEl.value = current;
  }

  function populateQuickFilters() {
    const bodies = [...new Set(all.map(x => x.bodyType).filter(Boolean))].sort();
    const brands = [...new Set(all.map(x => x.brand).filter(Boolean))].sort();
    const wheels = [...new Set(all.map(x => x.wheelFormula).filter(Boolean))].sort();
    populateSelect(bodyEl, bodies);
    populateSelect(brandEl, brands);
    populateSelect(wheelEl, wheels);
  }

  function applyFilters() {
    const b = bodyEl?.value || '';
    const brand = brandEl?.value || '';
    const wheel = wheelEl?.value || '';
    const source = sourceEl?.value || '';
    const q = normText(searchEl?.value || '');

    current = all.filter(x => {
      const bodyOk = !b || x.bodyType === b;
      const brandOk = !brand || x.brand === brand;
      const wheelOk = !wheel || x.wheelFormula === wheel;
      const sourceOk = !source ||
        (source === 'user' && x.isUserListing) ||
        (source === 'official' && !x.isUserListing);
      const searchOk = !q ||
        normText(x.title).includes(q) ||
        normText(x.bodyRaw).includes(q);
      return bodyOk && brandOk && wheelOk && sourceOk && searchOk;
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
  brandEl?.addEventListener('change', refilter);
  wheelEl?.addEventListener('change', refilter);
  sourceEl?.addEventListener('change', refilter);

  // Подбор по задаче — крупные кнопки вместо технического «типа кузова».
  // Каждая кнопка просто выставляет соответствующий тип в обычном фильтре.
  document.getElementById('taskFilter')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.task-btn');
    if (!btn) return;
    document.querySelectorAll('#taskFilter .task-btn')
      .forEach(b => b.classList.toggle('active', b === btn));
    if (bodyEl) bodyEl.value = btn.dataset.body || '';
    refilter();
    document.getElementById('grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Уточняющие фильтры скрыты по умолчанию — не пугаем лишними полями.
  document.getElementById('toggleAdvFilters')?.addEventListener('click', (e) => {
    const adv = document.getElementById('advFilters');
    if (!adv) return;
    const open = adv.style.display === 'none';
    adv.style.display = open ? '' : 'none';
    e.currentTarget.textContent = open
      ? (window.t ? window.t('task_less') : 'Скрыть уточнения')
      : (window.t ? window.t('task_more') : 'Уточнить: марка, колёсная формула, сортировка');
  });

  // Если выбранного типа нет в каталоге — прячем кнопку, чтобы не вести
  // человека в пустой список.
  function syncTaskButtons() {
    const present = new Set(all.map(x => x.bodyType).filter(Boolean));
    document.querySelectorAll('#taskFilter .task-btn').forEach(b => {
      const v = b.dataset.body;
      b.style.display = (!v || present.has(v)) ? '' : 'none';
    });
  }

  /* ================= LOAD ================= */

  async function load() {
    try {
      grid.innerHTML = 'Загрузка…';

      const r = await fetch(`${API_BASE}/api/vehicles/`);
      const data = await r.json();
      const list = Array.isArray(data) ? data : data.results || [];

      all = list.map(normalize).filter(Boolean);
      populateQuickFilters();
      syncTaskButtons();
      refilter();
      applyItemListSeo(all);

    } catch (e) {
      console.error(e);
      // Не оставляем человека с голой ошибкой — даём способ связаться.
      grid.innerHTML = `
        <div class="cat-empty">
          <h3>${window.t ? window.t('cat_error_t') : 'Не удалось загрузить каталог'}</h3>
          <p>${window.t ? window.t('cat_error_d') : 'Обновите страницу или позвоните — расскажем, что есть в наличии.'}</p>
          <div class="cat-empty__actions">
            <a class="btn btn--primary" href="tel:+77776133731">${window.t ? window.t('help_call') : 'Позвонить'}: +7 777 613 37 31</a>
          </div>
        </div>`;
    }
  }

  load();
});
