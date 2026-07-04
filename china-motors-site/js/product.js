// product.js — страница отдельной техники
document.addEventListener('DOMContentLoaded', () => {
  const qs = new URLSearchParams(location.search);
  const id = qs.get('id');

  if (!id) {
    document.body.innerHTML = '<h2 style="padding:40px">Техника не найдена</h2>';
    return;
  }

  // === API BASE (как в catalog.js) ===
  const metaBase = document.querySelector('meta[name="api-base"]')?.content?.trim();
  const isLocal = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  const API_BASE = (metaBase || (isLocal ? 'http://127.0.0.1:8000' : location.origin))
    .replace(/\/+$/, '');

  // === DOM ===
  const titleEl = document.getElementById('productTitle');
  const priceEl = document.getElementById('productPrice');
  const specsEl = document.getElementById('specsTable');
  const mainImg = document.getElementById('mainImage');
  const thumbsEl = document.getElementById('thumbs');

  const btnCalc = document.getElementById('btnCalc');
  const btnReq  = document.getElementById('btnRequest');

  // === helpers (вынесено из catalog.js логики) ===
  const nf = new Intl.NumberFormat('ru-RU');
  const fmtPrice = n => (n === 0 || n) ? `${nf.format(Number(n))}¥` : 'Цена по запросу';

  function pickImages(v) {
    if (Array.isArray(v.images) && v.images.length) return v.images;
    if (v.image_url) return [v.image_url];
    if (v.photo_url) return [v.photo_url];
    return [];
  }

  function pickPrice(v) {
    return v.price_cny ?? v.priceCNY ?? null;
  }

  // Только для автоподстановки в калькулятор (тот считает в USD).
  function pickPriceUsd(v) {
    return v.price_usd ?? v.usd_price ?? v.priceUSD ?? null;
  }

  function pickBodyRaw(v) {
    return (
      v.body_type ?? v.bodyType ?? v.body ?? v.body_name ??
      v.configuration ?? v.config ?? v.spec ?? v.specs ?? ''
    );
  }

  function canonBody(title, raw) {
    const s = `${title} ${raw}`.toLowerCase();
    if (s.includes('самосвал')) return 'Самосвал';
    if (s.includes('тягач')) return 'Тягач';
    if (s.includes('полуприцеп')) return 'Полуприцепы';
    if (s.includes('прицеп')) return 'Прицепы';
    if (s.includes('манипулятор')) return 'Манипулятор';
    if (s.includes('кран')) return 'Кран';
    if (s.includes('миксер')) return 'Миксер';
    if (s.includes('бензовоз')) return 'Бензовоз';
    if (s.includes('автовышк')) return 'Автовышка';
    if (s.includes('ассенизатор')) return 'Ассенизатор';
    if (s.includes('рефриж')) return 'Рефрижератор';
    if (s.includes('фургон')) return 'Автофургон';
    if (s.includes('поливомо')) return 'Поливомоечная машина';
    if (s.includes('ямобур')) return 'Ямобур машины для бурения';
    if (s.includes('молоковоз')) return 'Молоковоз';
    if (s.includes('топлив')) return 'Топливозаправщик';
    if (s.includes('экскаватор') || s.includes('погрузчик')) return 'Спец. техника';
    return 'Спец. техника';
  }

  function buildSpecsTable(v) {
    specsEl.innerHTML = '';

    const rows = [
      ['Бренд', v.brand],
      ['Модель', v.model],
      ['Год выпуска', v.year],
      ['Конструкция', v.body_type],
      ['Цена', v.price_cny ? `${v.price_cny}¥` : null],
      ['Масса, т', v.weight_t],
      ['Пробег, км', v.mileage_km],
    ];

    rows.forEach(([label, value]) => {
      if (value === null || value === undefined || value === '') return;
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${label}</td><td><strong>${value}</strong></td>`;
      specsEl.appendChild(tr);
    });
  }


  function buildGallery(images) {
    if (!images.length) return;

    mainImg.src = images[0];
    mainImg.alt = titleEl.textContent;

    thumbsEl.innerHTML = '';
    images.forEach((src, i) => {
      const img = document.createElement('img');
      img.src = src;
      if (i === 0) img.classList.add('active');
      img.addEventListener('click', () => {
        mainImg.src = src;
        thumbsEl.querySelectorAll('img').forEach(t => t.classList.remove('active'));
        img.classList.add('active');
      });
      thumbsEl.appendChild(img);
    });
  }

  // === LOAD DATA ===
  async function load() {
    try {
      const res = await fetch(`${API_BASE}/api/vehicles/${id}`, {
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const v = await res.json();

      const title =
        [v.brand, v.model, v.name].filter(Boolean).join(' ').trim() || 'Без названия';

      const priceNum = pickPrice(v);
      const priceUsdForCalc = pickPriceUsd(v);
      const images = pickImages(v);
      const bodyRaw = pickBodyRaw(v);
      const bodyCanon = canonBody(title, bodyRaw);
      const weight = v.weight_t ?? '';


      // === fill page ===
      titleEl.textContent = title;
      priceEl.textContent = fmtPrice(priceNum);

      document.title = `${title} — China Motors`;

      buildGallery(images);
      buildSpecsTable(v);

      // === buttons ===
      if (btnCalc) {
        btnCalc.href =
          `calculator.html?` +
          `title=${encodeURIComponent(title)}` +
          `&price=${encodeURIComponent(priceUsdForCalc ?? '')}` +
          `&price_cny=${encodeURIComponent(priceNum ?? '')}` +
          `&body=${encodeURIComponent(bodyCanon)}` +
          `&body_raw=${encodeURIComponent(bodyRaw || '')}` +
          `&weight=${encodeURIComponent(v.weight_t ?? '')}` +
          `&year=${encodeURIComponent(v.year ?? '')}`;
      }

      if (btnReq) {
        btnReq.href =
          `contacts.html?message=${encodeURIComponent(
            `Запрос по технике:\n${title}\nЦена: ${fmtPrice(priceNum)}`
          )}`;
      }


    } catch (e) {
      console.error(e);
      document.body.innerHTML =
        '<h2 style="padding:40px">Ошибка загрузки техники</h2>';
    }
  }

  load();
});
