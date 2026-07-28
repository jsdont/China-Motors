// js/favorites.js — страница "Избранное": список сохранённых (localStorage)
// ID техники, дотягиваем карточки с реального бэкенда по каждому ID.
document.addEventListener('DOMContentLoaded', () => {

  const metaBase = document.querySelector('meta[name="api-base"]')?.content;
  const API_BASE = (metaBase || location.origin).replace(/\/+$/, '');

  const gridEl = document.getElementById('favGrid');
  const countEl = document.getElementById('favCount');
  const ctaBanner = document.getElementById('favCtaBanner');
  const ctaBtn = document.getElementById('favCtaBtn');
  const emptyEl = document.getElementById('favEmpty');

  const AVAIL_LABELS = { in_stock: 'В НАЛИЧИИ', on_order: 'ПОД ЗАКАЗ', out_of_stock: 'НЕТ' };

  const tr = (key, fallback) => (window.t ? window.t(key) : null) || fallback;

  function fmtPrice(v) {
    if (v.price_kzt) return `${Number(v.price_kzt).toLocaleString('ru-RU')} ₸`;
    if (v.price_cny) return `${Number(v.price_cny).toLocaleString('ru-RU')} ¥`;
    return tr('vp_price_on_request', '— по запросу');
  }

  function passportRows(v) {
    return [
      ['vp_row_wheel', 'КОЛЁСНАЯ ФОРМУЛА', v.wheel_formula],
      ['vp_row_mass', 'ПОЛНАЯ МАССА, Т', v.weight_t],
      ['vp_row_payload', 'ГРУЗОПОДЪЁМНОСТЬ, Т', v.load_capacity_t],
      ['vp_row_power', 'ДВИГАТЕЛЬ, Л.С.', v.engine_power_hp],
      ['vp_row_gearbox', 'КПП', v.gearbox],
    ].filter(([, , value]) => value !== null && value !== undefined && value !== '');
  }

  // Тот же VehiclePassport, что в каталоге и на главной: один компонент
  // живёт в одном месте, иначе три страницы начнут расходиться.
  //
  // Отдельной кнопки «Получить КП» на карточке больше нет, и не по недосмотру:
  // паспорт — это сам по себе <a> на страницу техники, вложить в него вторую
  // ссылку нельзя. Действие не потеряно — на странице техники стоит
  // «ПОЛУЧИТЬ КП ПО ЭТОЙ ТЕХНИКЕ» (шаг 2), а по всему списку сразу работает
  // баннер внизу.
  function cardHTML(v) {
    const fullTitle = [v.brand, v.model, v.body_type].filter(Boolean).join(' ').trim()
      || tr('card_no_name', 'Техника');
    const title = v.body_type || fullTitle;
    const sub = [v.category, v.year].filter(Boolean).join(' · ');
    const availability = v.availability || 'in_stock';
    const availLabel = tr('vp_avail_' + availability, AVAIL_LABELS[availability] || '');
    const rawImg = v.image_url || (Array.isArray(v.images) && v.images[0]) || '/img/no-photo.png';
    const img = rawImg === '/img/no-photo.png'
      ? rawImg
      : (window.cmOptimizeImage?.(rawImg, { width: 400 }) || rawImg);

    return `
      <a class="vp fav-card" data-vehicle-id="${v.id}" href="product.html?id=${v.id}">
        <div class="vp__media">
          <img src="${img}" alt="${fullTitle}" loading="lazy" decoding="async">
          ${v.city ? `<span class="vp__tag vp__tag--place">${v.city}</span>` : ''}
          ${availLabel ? `<span class="vp__tag vp__tag--avail vp__tag--${availability}" data-i18n="vp_avail_${availability}">${availLabel}</span>` : ''}
          <button type="button" class="vp__fav active" data-fav-id="${v.id}" title="${tr('fav_remove_title', 'Убрать из избранного')}">
            <i class="fa-solid fa-bookmark"></i>
          </button>
        </div>

        <div class="vp__head">
          <h3 class="vp__title">${title}</h3>
          ${sub ? `<div class="vp__sub">${sub}</div>` : ''}
        </div>

        <div class="vp__rows">
          ${passportRows(v).map(([key, fallback, value]) => `
            <div class="vp__row">
              <span class="vp__row-label" data-i18n="${key}">${tr(key, fallback)}</span>
              <span class="vp__row-value">${value}</span>
            </div>`).join('')}
        </div>

        <div class="vp__foot">
          <div class="vp__price-label" data-i18n="vp_price_label">ПОД КЛЮЧ В АЛМАТЫ</div>
          <div class="vp__price">${fmtPrice(v)}</div>
          <span class="vp__cta" data-i18n="vp_cta">РАСЧЁТ ПОД КЛЮЧ</span>
        </div>
      </a>`;
  }

  function updateChrome(favIds, vehicles) {
    if (countEl) countEl.textContent = favIds.length;

    const hasItems = vehicles.length > 0;
    if (gridEl) gridEl.style.display = hasItems ? '' : 'none';
    if (ctaBanner) ctaBanner.style.display = hasItems ? '' : 'none';
    if (emptyEl) emptyEl.style.display = favIds.length === 0 ? '' : 'none';

    if (ctaBtn && hasItems) {
      const list = vehicles
        .map(v => `- ${[v.brand, v.model, v.body_type].filter(Boolean).join(' ').trim() || `Техника #${v.id}`}`)
        .join('\n');
      ctaBtn.href = `contacts.html?message=${encodeURIComponent(`Прошу расчёт по избранному списку техники:\n${list}`)}`;
    }
  }

  function removeFavorite(id) {
    window.CMFavorites?.toggleFavorite(id);
    const card = gridEl?.querySelector(`.fav-card[data-vehicle-id="${id}"]`);
    card?.remove();
    render();
  }

  gridEl?.addEventListener('click', (e) => {
    const btn = e.target.closest('.vp__fav, .cm-card__fav-btn');
    if (!btn) return;
    e.preventDefault();
    removeFavorite(btn.dataset.favId);
  });

  async function fetchVehicle(id) {
    const r = await fetch(`${API_BASE}/api/vehicles/${id}/`);
    if (r.status === 404) {
      const err = new Error('Vehicle not found');
      err.isNotFound = true;
      throw err;
    }
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
  }

  async function render() {
    const favIds = window.CMFavorites?.getFavorites() || [];

    if (favIds.length === 0) {
      if (gridEl) gridEl.innerHTML = '';
      updateChrome([], []);
      return;
    }

    if (gridEl) gridEl.innerHTML = `<div class="v2-empty"><p>${tr('fav_loading', 'Загрузка…')}</p></div>`;

    const results = await Promise.allSettled(favIds.map(fetchVehicle));
    const vehicles = [];
    const stale = [];
    let hadTransientError = false;

    results.forEach((res, i) => {
      if (res.status === 'fulfilled') vehicles.push(res.value);
      else if (res.reason?.isNotFound) stale.push(favIds[i]);
      else hadTransientError = true;
    });

    // Технику, которую удалили из каталога (подтверждённый 404), тихо
    // убираем из избранного. Сетевые/серверные сбои — не трогаем список,
    // просто не показываем эту позицию сейчас (иначе временная недоступность
    // backend'а необратимо стёрла бы чьё-то избранное).
    if (stale.length) {
      const kept = favIds.filter(id => !stale.includes(id));
      localStorage.setItem('cm_favorites', JSON.stringify(kept));
      document.dispatchEvent(new CustomEvent('cm:favorites-changed', { detail: { favorites: kept } }));
    }

    const errorNote = hadTransientError
      ? `<div class="v2-empty v2-empty--error"><p>${tr('fav_load_error', 'Не удалось загрузить часть техники из избранного — попробуйте обновить страницу.')}</p></div>`
      : '';
    if (gridEl) gridEl.innerHTML = errorNote + vehicles.map(cardHTML).join('');
    updateChrome(favIds.filter(id => !stale.includes(id)), vehicles);
  }

  render();
});
