// js/home.js — главная страница: калькулятор-виджет в хиро (популярные
// категории/марки из реальных данных) + превью "Популярная техника".
document.addEventListener('DOMContentLoaded', async () => {
  const metaBase = document.querySelector('meta[name="api-base"]')?.content;
  const API_BASE = (metaBase || location.origin).replace(/\/+$/, '');

  const grid = document.getElementById('hpVehiclesGrid');
  const categorySelect = document.getElementById('hpCalcCategory');
  const brandSelect = document.getElementById('hpCalcBrand');
  const yearSelect = document.getElementById('hpCalcYear');
  const form = document.getElementById('hpCalcWidget');

  function fillYearSelect() {
    if (!yearSelect) return;
    const currentYear = new Date().getFullYear();
    for (let y = currentYear + 1; y >= 2015; y--) {
      const opt = document.createElement('option');
      opt.value = y;
      opt.textContent = y;
      yearSelect.appendChild(opt);
    }
  }

  function fillSelect(select, values, fallback) {
    if (!select) return;
    const list = values.length ? values : fallback;
    select.innerHTML = list.map(v => `<option value="${v}">${v}</option>`).join('');
  }

  function priceLine(v) {
    if (v.price_kzt) return `${Number(v.price_kzt).toLocaleString('ru-RU')} ₸`;
    if (v.price_cny) return `${Number(v.price_cny).toLocaleString('ru-RU')} ¥`;
    return 'Цена по запросу';
  }

  function vehicleCard(v) {
    const title = [v.brand, v.model, v.body_type].filter(Boolean).join(' ').trim() || `Техника #${v.id}`;
    const category = v.category || v.body_type || '';
    const img = v.image_url || (Array.isArray(v.images) && v.images[0]) || '/img/no-photo.png';
    return `
      <a class="hp-vehicle-card" href="product.html?id=${v.id}">
        <img src="${img}" alt="${title}" loading="lazy">
        <div class="hp-vehicle-card__body">
          <div class="hp-vehicle-card__category">${category}</div>
          <div class="hp-vehicle-card__name">${title}</div>
          <div class="hp-vehicle-card__price">${priceLine(v)}</div>
          <div class="hp-vehicle-card__cta" data-i18n="hp_vehicle_cta">Получить КП</div>
        </div>
      </a>`;
  }

  fillYearSelect();

  try {
    const res = await fetch(`${API_BASE}/api/vehicles/`);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const vehicles = await res.json();
    const list = Array.isArray(vehicles) ? vehicles : (vehicles.results || []);

    const categories = [...new Set(list.map(v => v.category || v.body_type).filter(Boolean))];
    const brands = [...new Set(list.map(v => v.brand).filter(Boolean))];
    fillSelect(categorySelect, categories, ['Самосвал', 'Тягач седельный', 'Автобетоносмеситель', 'Манипулятор']);
    fillSelect(brandSelect, brands, ['Shacman']);

    if (grid) {
      const preview = list.slice(0, 4);
      grid.innerHTML = preview.length
        ? preview.map(vehicleCard).join('')
        : '<p class="empty-note">Пока нет доступной техники в каталоге.</p>';
    }
  } catch (e) {
    fillSelect(categorySelect, [], ['Самосвал', 'Тягач седельный', 'Автобетоносмеситель', 'Манипулятор']);
    fillSelect(brandSelect, [], ['Shacman']);
    if (grid) grid.innerHTML = `<p class="empty-note" style="color:#e74c3c">Не удалось загрузить каталог: ${e.message}</p>`;
  }

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (categorySelect?.value) params.set('body', categorySelect.value);
    if (brandSelect?.value) params.set('title', brandSelect.value);
    if (yearSelect?.value) params.set('year', yearSelect.value);
    location.href = `calculator.html?${params.toString()}`;
  });
});
