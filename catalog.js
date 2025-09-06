// catalog.js — простая и надёжная отрисовка каталога из API

document.addEventListener('DOMContentLoaded', () => {
  const API_BASE =
    (location.hostname === '127.0.0.1' || location.hostname === 'localhost')
      ? 'http://127.0.0.1:8000'
      : ''; // на проде бэкенд под тем же доменом

  // Главное: поддерживаем все варианты контейнера
  const grid =
    document.getElementById('grid') ||                   // как в catalog.html
    document.getElementById('catalogGrid') ||
    document.querySelector('.catalog-grid') ||
    document.querySelector('.feature-grid');             // как в catalog.html

  // Поле поиска и кнопка
  const searchInput =
    document.getElementById('q') ||
    document.querySelector('input[type="search"], #search, .search-input');
  const btnSearch = document.getElementById('btnSearch');

  if (!grid) {
    console.warn('catalog.js: не найден контейнер каталога');
    return;
  }

  // Утилиты
  const esc = s => String(s ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const fmt = n => (n || n === 0) ? Intl.NumberFormat('ru-RU').format(n) : '';

  // Рендер карточек
  function render(items) {
    if (!Array.isArray(items) || !items.length) {
      grid.innerHTML = `<div class="empty">Ничего не найдено</div>`;
      return;
    }
    grid.innerHTML = items.map(v => {
      const title = esc([v.brand, v.model, v.name].filter(Boolean).join(' ').trim());
      const img = esc(v.image_url || '');
      const price = v.price_usd != null ? `$${fmt(v.price_usd)}` : 'Цена по запросу';
      const year = v.year ? esc(v.year) : '';
      return `
        <div class="catalog-item">
          <div class="thumb">${img ? `<img src="${img}" alt="${title}">` : `<div class="noimg">Фото будет позже</div>`}</div>
          <div class="info">
            <h3>${title || 'Без названия'}</h3>
            <div class="meta">${year ? `Год: ${year}` : ''}</div>
            <div class="price">${price}</div>
            <button class="btn-request" data-title="${title}">Запросить</button>
          </div>
        </div>`;
    }).join('');

    grid.querySelectorAll('.btn-request').forEach(btn => {
      btn.addEventListener('click', () => {
        const t = btn.getAttribute('data-title') || 'Техника';
        alert(`Заявка отправлена: ${t}`);
      });
    });
  }

  // Загрузка из API
  async function loadAndRender() {
    try {
      const params = new URLSearchParams(location.search);
      const q = (params.get('q') || '').trim();

      const url = new URL(`${API_BASE}/api/vehicles/`);
      if (q) url.searchParams.set('q', q);

      grid.innerHTML = `<div class="loading">Загрузка...</div>`;

      const resp = await fetch(url.toString(), { headers: { 'Accept': 'application/json' } });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      render(data);
    } catch (e) {
      console.error('catalog: загрузка провалилась', e);
      grid.innerHTML = `<div class="error">Не удалось загрузить каталог</div>`;
    }
  }

  // Поиск (Enter и кнопка «Найти»)
  function triggerSearch() {
    if (!searchInput) return loadAndRender();
    const q = searchInput.value.trim();
    const url = new URL(location.href);
    if (q) url.searchParams.set('q', q); else url.searchParams.delete('q');
    history.replaceState(null, '', url); // без перезагрузки
    loadAndRender();
  }
  if (searchInput) {
    searchInput.addEventListener('keydown', e => e.key === 'Enter' && triggerSearch());
  }
  if (btnSearch) {
    btnSearch.addEventListener('click', triggerSearch);
  }

  loadAndRender();
});
