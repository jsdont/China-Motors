// /js/catalog.js
document.addEventListener('DOMContentLoaded', () => {
  // 1) Куда бить: локалка или прод
  const API_BASE =
    (location.hostname === '127.0.0.1' || location.hostname === 'localhost')
      ? 'http://127.0.0.1:8000'
      : 'https://cm-backend-daniyal.fly.dev';

  const grid = document.getElementById('catalogGrid');
  const items = Array.from(document.querySelectorAll('.catalog-item'));

  // 2) Утилита отправки в телеграм
  async function sendToTelegram(text) {
    const resp = await fetch(`${API_BASE}/api/telegram`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
      mode: 'cors',
    });
    let data = null;
    try { data = await resp.json(); } catch {}
    if (!resp.ok || (data && data.ok === false)) {
      const reason = (data && (data.error || data.description)) || `HTTP ${resp.status}`;
      throw new Error(reason);
    }
    return true;
  }

  // 3) Сборка текста заявки по карточке
  function buildMessageFromCard(card) {
    const title = card.querySelector('h3')?.textContent?.trim() || 'Без названия';
    const price = card.dataset.price || '';
    const availability = card.dataset.availability || '';
    const category = card.dataset.category || '';
    // Берём первые 1–2 абзаца доп-инфо
    const extra = Array.from(card.querySelectorAll('p'))
      .slice(0, 3)
      .map(p => p.textContent.trim())
      .join('\n');

    const url = location.origin + location.pathname;

    return [
      '🛒 Новая заявка из каталога China Motors:',
      `Название: ${title}`,
      category ? `Категория: ${category}` : '',
      availability ? `Наличие: ${availability}` : '',
      price ? `Цена (из data-price): ${price}$` : '',
      extra ? `Детали:\n${extra}` : '',
      `Страница: ${url}`,
      `Время: ${new Date().toLocaleString()}`
    ].filter(Boolean).join('\n');
  }

  // 4) Навешиваем обработчик на все кнопки "Запросить"
  items.forEach(card => {
    const btn = card.querySelector('.btn');
    if (!btn) return;

    btn.addEventListener('click', async (e) => {
      // Если пользователь специально открыл в новой вкладке — не мешаем
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1) return;

      e.preventDefault();

      const originalText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'Отправка...';

      const text = buildMessageFromCard(card);

      try {
        await sendToTelegram(text);
        btn.innerHTML = 'Отправлено ✅';
        setTimeout(() => { btn.innerHTML = originalText; btn.disabled = false; }, 2000);
      } catch (err) {
        // Фоллбек: откроем contacts.html с префиллом
        const q = new URLSearchParams({ message: text }).toString();
        window.location.href = `contacts.html?${q}`;
      }
    });
  });

  // 5) Фильтры
  const selCategory = document.getElementById('category');
  const selAvailability = document.getElementById('availability');
  const selPrice = document.getElementById('price');
  const selSort = document.getElementById('sort');

  function priceInRange(price, filterVal) {
    if (!filterVal || filterVal === 'All') return true;
    const p = Number(price || 0);
    if (filterVal === '0-25000') return p <= 25000;
    if (filterVal === '25000-50000') return p > 25000 && p <= 50000;
    if (filterVal === '50000-100000') return p > 50000 && p <= 100000;
    if (filterVal === '100000+') return p > 100000;
    return true;
  }

  function applyFilters() {
    const cat = selCategory?.value || 'All';
    const avail = selAvailability?.value || 'All';
    const price = selPrice?.value || 'All';

    items.forEach(card => {
      const okCat = (cat === 'All') || (card.dataset.category === cat);
      const okAvail = (avail === 'All') || (card.dataset.availability === avail);
      const okPrice = priceInRange(card.dataset.price, price);
      card.style.display = (okCat && okAvail && okPrice) ? '' : 'none';
    });
  }

  function applySort() {
    if (!selSort || !grid) return;
    const mode = selSort.value; // none | asc | desc
    if (mode === 'none') return;

    const visible = items.filter(it => it.style.display !== 'none');
    visible.sort((a, b) => {
      const pa = Number(a.dataset.price || 0);
      const pb = Number(b.dataset.price || 0);
      return mode === 'asc' ? pa - pb : pb - pa;
    });

    // Вставим видимые в новом порядке, скрытые оставим как есть внизу
    visible.forEach(el => grid.appendChild(el));
  }

  function refilterResort() {
    applyFilters();
    applySort();
  }

  selCategory?.addEventListener('change', refilterResort);
  selAvailability?.addEventListener('change', refilterResort);
  selPrice?.addEventListener('change', refilterResort);
  selSort?.addEventListener('change', applySort);

  // Первичная отрисовка
  refilterResort();
});
