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

  const AVAIL_LABELS = {
    in_stock: 'В наличии',
    out_of_stock: 'Нет в наличии',
    on_order: 'На заказ'
  };

  function fmtPrice(v) {
    if (v.price_kzt) return `${Number(v.price_kzt).toLocaleString('ru-RU')} ₸`;
    if (v.price_cny) return `${Number(v.price_cny).toLocaleString('ru-RU')} ¥`;
    return 'Цена уточняется';
  }

  function cardHTML(v) {
    const title = [v.brand, v.model, v.body_type].filter(Boolean).join(' ').trim() || `Техника #${v.id}`;
    const img = v.image_url || (Array.isArray(v.images) && v.images[0]) || '/img/no-photo.png';
    const availability = v.availability || 'in_stock';
    return `
      <div class="cm-card fav-card" data-vehicle-id="${v.id}">
        <div class="cm-card__image">
          <img src="${img}" alt="${title}">
          <span class="cm-badge cm-badge--${availability}">${AVAIL_LABELS[availability] || ''}</span>
          <button type="button" class="cm-card__fav-btn active" data-fav-id="${v.id}" title="${window.t ? window.t('fav_remove_title') : 'Убрать из избранного'}">
            <i class="fa-solid fa-bookmark"></i>
          </button>
        </div>
        <div class="cm-card__body">
          <h3 class="cm-card__title">${title}${v.year ? `, ${v.year}` : ''}</h3>
          <div class="cm-card__specs">
            ${v.category || v.body_type ? `<div class="spec"><span data-i18n="card_body_label">Тип транспорта</span><strong>${v.category || v.body_type}</strong></div>` : ''}
            ${v.wheel_formula ? `<div class="spec"><span data-i18n="card_wheel_formula_label">Колёсная формула</span><strong>${v.wheel_formula}</strong></div>` : ''}
            ${v.gearbox ? `<div class="spec"><span data-i18n="card_gearbox_label">КПП</span><strong>${v.gearbox}</strong></div>` : ''}
          </div>
          <div class="fav-card__price">${fmtPrice(v)}</div>
          <div class="fav-card__actions">
            <a href="product.html?id=${v.id}" class="fav-card__btn fav-card__btn--dark" data-i18n="btn_calculate_catalog">Подробнее и расчёт</a>
            <a href="contacts.html?product_id=${v.id}&message=${encodeURIComponent(`Запрос по технике:\n${title}\nЦена: ${fmtPrice(v)}`)}" class="fav-card__btn fav-card__btn--outline" data-i18n="fav_request_btn">Получить КП</a>
          </div>
        </div>
      </div>`;
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
    const btn = e.target.closest('.cm-card__fav-btn');
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

    if (gridEl) gridEl.innerHTML = '<p class="empty-note">Загрузка…</p>';

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
      ? '<p class="empty-note" style="color:#e74c3c">Не удалось загрузить часть техники из избранного — попробуйте обновить страницу.</p>'
      : '';
    if (gridEl) gridEl.innerHTML = errorNote + vehicles.map(cardHTML).join('');
    updateChrome(favIds.filter(id => !stale.includes(id)), vehicles);
  }

  render();
});
