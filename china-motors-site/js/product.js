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
  const btnFav = document.getElementById('btnFav');

  function syncFavBtn() {
    if (!btnFav) return;
    const isFav = window.CMFavorites?.isFavorite(id);
    btnFav.classList.toggle('active', isFav);
    const icon = btnFav.querySelector('i');
    if (icon) icon.className = `fa-${isFav ? 'solid' : 'regular'} fa-bookmark`;
  }
  syncFavBtn();
  btnFav?.addEventListener('click', () => {
    window.CMFavorites?.toggleFavorite(id);
    syncFavBtn();
  });
  const extraCardEl = document.getElementById('extraInfo');
  const extraEl = document.getElementById('extraInfoText');
  const videoEl = document.getElementById('videoReview');
  const breadcrumbTitleEl = document.getElementById('breadcrumbTitle');
  const productSubtitleEl = document.getElementById('productSubtitle');
  const availabilityBadgeEl = document.getElementById('availabilityBadge');
  const cityBadgeEl = document.getElementById('cityBadge');

  // Сделки создаёт менеджер из заявки — прямое создание сделки клиентом убрано.

  function buildTikTokEmbed(url) {
    if (!videoEl || !url) return;

    const idMatch = url.match(/\/video\/(\d+)/);
    const videoId = idMatch ? idMatch[1] : '';

    videoEl.innerHTML = `
      <blockquote class="tiktok-embed" cite="${url}"${videoId ? ` data-video-id="${videoId}"` : ''} style="max-width:605px;min-width:325px;">
        <section></section>
      </blockquote>
    `;
    videoEl.style.display = '';

    // embed.js сам находит все .tiktok-embed на странице и рендерит их —
    // достаточно подключить один раз.
    if (!document.getElementById('tiktokEmbedScript')) {
      const script = document.createElement('script');
      script.id = 'tiktokEmbedScript';
      script.async = true;
      script.src = 'https://www.tiktok.com/embed.js';
      document.body.appendChild(script);
    } else if (window.tiktokEmbed?.lib?.render) {
      window.tiktokEmbed.lib.render([videoEl.querySelector('.tiktok-embed')]);
    }
  }

  // === LIGHTBOX ===
  const lightbox     = document.getElementById('lightbox');
  const lightboxImg  = document.getElementById('lightboxImg');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxClose = document.getElementById('lightboxClose');

  let galleryImages = [];
  let lightboxIndex = 0;

  function showLightboxImage(i) {
    if (!galleryImages.length) return;
    lightboxIndex = (i + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[lightboxIndex];
  }

  function openLightbox(i) {
    if (!galleryImages.length) return;
    showLightboxImage(i);
    lightbox.classList.add('open');
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
  }

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxPrev?.addEventListener('click', () => showLightboxImage(lightboxIndex - 1));
  lightboxNext?.addEventListener('click', () => showLightboxImage(lightboxIndex + 1));
  lightboxImg?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showLightboxImage(lightboxIndex - 1);
    if (e.key === 'ArrowRight') showLightboxImage(lightboxIndex + 1);
  });

  // === helpers (вынесено из catalog.js логики) ===
  const nf = new Intl.NumberFormat('ru-RU');
  // Пробел перед знаком валюты обязателен: в v2 цена набрана моноширинным
  // и стоит крупно — «33 200 000₸» без пробела читается как одно слово.
  const fmtPrice = (n, currency = 'cny') =>
    (n === 0 || n) ? `${nf.format(Number(n))} ${currency === 'kzt' ? '₸' : '¥'}` : 'Цена по запросу';

  function pickImages(v) {
    if (Array.isArray(v.images) && v.images.length) return v.images;
    if (v.image_url) return [v.image_url];
    if (v.photo_url) return [v.photo_url];
    return [];
  }

  function pickPrice(v) {
    if (v.price_kzt) return { amount: v.price_kzt, currency: 'kzt' };
    if (v.price_cny ?? v.priceCNY) return { amount: v.price_cny ?? v.priceCNY, currency: 'cny' };
    return { amount: null, currency: 'cny' };
  }

  const AVAIL_LABELS = {
    in_stock: 'В наличии',
    out_of_stock: 'Нет в наличии',
    on_order: 'На заказ'
  };

  // Только для автоподстановки в калькулятор (тот считает в USD).
  function pickPriceUsd(v) {
    return v.price_usd ?? v.usd_price ?? v.priceUSD ?? null;
  }

  function pickBodyRaw(v) {
    return (
      v.category ?? v.body_type ?? v.bodyType ?? v.body ?? v.body_name ??
      v.configuration ?? v.config ?? v.spec ?? v.specs ?? ''
    );
  }

  const SCHEMA_AVAILABILITY = {
    in_stock: 'https://schema.org/InStock',
    out_of_stock: 'https://schema.org/OutOfStock',
    on_order: 'https://schema.org/PreOrder'
  };

  function applySeo(v, title, price, images) {
    const canonicalUrl = `https://chinamotors.kz/product.html?id=${v.id}`;
    const description =
      (v.extra_info && v.extra_info.slice(0, 160)) ||
      `${title} — купить в China Motors. Доставка из Китая, полное сопровождение сделки.`;
    const image = images[0] || 'https://chinamotors.kz/icons/china_motors_logo.jpg';

    document.getElementById('seoDescription')?.setAttribute('content', description);
    document.getElementById('seoCanonical')?.setAttribute('href', canonicalUrl);
    document.getElementById('seoOgTitle')?.setAttribute('content', `${title} — China Motors`);
    document.getElementById('seoOgDescription')?.setAttribute('content', description);
    document.getElementById('seoOgImage')?.setAttribute('content', image);
    document.getElementById('seoOgUrl')?.setAttribute('content', canonicalUrl);

    const productLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: title,
      image: images.length ? images : [image],
      description,
      sku: String(v.id),
      brand: { '@type': 'Brand', name: v.brand || 'China Motors' }
    };
    if (price.amount) {
      productLd.offers = {
        '@type': 'Offer',
        url: canonicalUrl,
        priceCurrency: price.currency === 'kzt' ? 'KZT' : 'CNY',
        price: price.amount,
        availability: SCHEMA_AVAILABILITY[v.availability] || 'https://schema.org/InStock'
      };
    }
    const productLdEl = document.getElementById('seoProductLd');
    if (productLdEl) productLdEl.textContent = JSON.stringify(productLd);

    const breadcrumbLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://chinamotors.kz/' },
        { '@type': 'ListItem', position: 2, name: 'Каталог', item: 'https://chinamotors.kz/catalog.html' },
        { '@type': 'ListItem', position: 3, name: title, item: canonicalUrl }
      ]
    };
    const breadcrumbLdEl = document.getElementById('seoBreadcrumbLd');
    if (breadcrumbLdEl) breadcrumbLdEl.textContent = JSON.stringify(breadcrumbLd);
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

    const price = pickPrice(v);

    // Ряды данных v2: моно-ярлык слева, табличное значение справа. Иконок нет —
    // единицы измерения вынесены в ярлык, а значения выравниваются в колонку.
    // Цена, наличие и город здесь не дублируются: цена стоит отдельным блоком,
    // наличие и город — тегами по нижней кромке фото.
    const rows = [
      ['spec_brand', 'БРЕНД', v.brand],
      ['spec_model', 'МОДЕЛЬ', v.model],
      ['spec_year', 'ГОД ВЫПУСКА', v.year],
      ['spec_category', 'КАТЕГОРИЯ', v.category],
      ['vp_row_wheel', 'КОЛЁСНАЯ ФОРМУЛА', v.wheel_formula],
      ['vp_row_gearbox', 'КПП', v.gearbox],
      ['vp_row_power', 'ДВИГАТЕЛЬ, Л.С.', v.engine_power_hp],
      ['vp_row_payload', 'ГРУЗОПОДЪЁМНОСТЬ, Т', v.load_capacity_t],
      ['vp_row_mass', 'ПОЛНАЯ МАССА, Т', v.weight_t],
      ['spec_mileage', 'ПРОБЕГ, КМ', v.mileage_km],
    ];

    const tr = (key, fallback) => (window.t ? window.t(key) : fallback) || fallback;
    rows.forEach(([key, fallback, value]) => {
      if (value === null || value === undefined || value === '') return;
      const row = document.createElement('div');
      row.className = 'vp__row';
      row.innerHTML =
        `<span class="vp__row-label" data-i18n="${key}">${tr(key, fallback)}</span>` +
        `<span class="vp__row-value">${value}</span>`;
      specsEl.appendChild(row);
    });
  }


  function optimize(src, width) {
    return window.cmOptimizeImage?.(src, { width }) || src;
  }

  function buildGallery(images) {
    if (!images.length) return;
    // Полное разрешение — для лайтбокса (там смотрят детали крупно).
    galleryImages = images.map(src => optimize(src, 1200));

    mainImg.src = optimize(images[0], 800);
    mainImg.alt = titleEl.textContent;
    mainImg.addEventListener('click', () => {
      const activeIdx = Math.max(0, [...thumbsEl.querySelectorAll('img')].findIndex(t => t.classList.contains('active')));
      openLightbox(activeIdx);
    });

    thumbsEl.innerHTML = '';
    images.forEach((src, i) => {
      const img = document.createElement('img');
      img.src = optimize(src, 150);
      img.loading = 'lazy';
      img.decoding = 'async';
      if (i === 0) img.classList.add('active');
      img.addEventListener('click', () => {
        mainImg.src = optimize(src, 800);
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

      // Полное имя — для SEO, alt и заголовка вкладки.
      const title =
        [v.brand, v.model, v.body_type].filter(Boolean).join(' ').trim() || 'Без названия';

      // Имя на экране — то же, что в карточке каталога: body_type уже содержит
      // «Тягач SHACMAN X3000», а категория, бренд и год стоят строкой выше,
      // поэтому полное имя в H1 повторяло бы себя.
      const displayTitle = v.body_type || title;

      const price = pickPrice(v);
      const priceUsdForCalc = pickPriceUsd(v);
      const images = pickImages(v);
      const bodyRaw = pickBodyRaw(v);
      const bodyCanon = canonBody(title, bodyRaw);
      const weight = v.weight_t ?? '';


      // === fill page ===
      titleEl.textContent = displayTitle;
      priceEl.textContent = fmtPrice(price.amount, price.currency);

      const userListingBadge = document.getElementById('userListingBadge');
      if (userListingBadge && v.is_user_listing) {
        const prefix = window.t ? window.t('badge_user_listing_prefix') : 'Объявление от';
        userListingBadge.textContent = `${prefix} ${v.owner_role_label || 'клиента'}`;
        userListingBadge.style.display = 'inline-block';
      }

      document.title = `${title} — China Motors`;
      if (breadcrumbTitleEl) breadcrumbTitleEl.textContent = displayTitle;
      if (productSubtitleEl) {
        // Строка над заголовком: категория · бренд · год — моно капсом
        productSubtitleEl.textContent =
          [v.category, v.brand, v.year].filter(Boolean).join(' · ');
      }

      applySeo(v, title, price, images);

      if (availabilityBadgeEl && AVAIL_LABELS[v.availability]) {
        // Подпись капсом и цвет по состоянию: «в наличии» — clear,
        // «под заказ» — hazard. Красный здесь не участвует.
        const availKey = 'vp_avail_' + v.availability;
        const availLabel = window.t ? window.t(availKey) : AVAIL_LABELS[v.availability];
        availabilityBadgeEl.textContent = availLabel || AVAIL_LABELS[v.availability];
        availabilityBadgeEl.setAttribute('data-i18n', availKey);
        availabilityBadgeEl.classList.add('vp__tag--' + v.availability);
        availabilityBadgeEl.style.display = '';
      }
      if (cityBadgeEl && v.city) {
        cityBadgeEl.textContent = v.city;
        cityBadgeEl.style.display = '';
      }

      buildGallery(images);
      buildSpecsTable(v);
      buildTikTokEmbed(v.tiktok_url);

      if (v.extra_info && extraEl && extraCardEl) {
        extraEl.textContent = v.extra_info;
        extraCardEl.style.display = '';
      }

      // === buttons ===
      const calcHref =
        `calculator.html?` +
        `id=${encodeURIComponent(v.id ?? '')}` +
        `&title=${encodeURIComponent(title)}` +
        `&price=${encodeURIComponent(priceUsdForCalc ?? '')}` +
        `&price_cny=${encodeURIComponent(price.currency === 'cny' ? (price.amount ?? '') : '')}` +
        `&body=${encodeURIComponent(bodyCanon)}` +
        `&body_raw=${encodeURIComponent(bodyRaw || '')}` +
        `&weight=${encodeURIComponent(v.weight_t ?? '')}` +
        `&year=${encodeURIComponent(v.year ?? '')}`;

      if (btnCalc) btnCalc.href = calcHref;

      if (btnReq) {
        btnReq.href =
          `contacts.html?message=${encodeURIComponent(
            `Запрос по технике:\n${title}\nЦена: ${fmtPrice(price.amount, price.currency)}`
          )}`;
      }


    } catch (e) {
      console.error(e);
      // Оставляем человеку способ связаться, а не пустой экран с ошибкой.
      document.body.innerHTML = `
        <div style="padding:40px;text-align:center">
          <h2>Не удалось загрузить технику</h2>
          <p style="font-size:17px;color:#6b7280;margin:12px 0 24px">
            Попробуйте обновить страницу или позвоните — подберём и расскажем всё сами.
          </p>
          <a class="btn btn--primary" href="tel:+77776133731" style="font-size:18px;padding:14px 26px">
            Позвонить: +7 777 613 37 31
          </a>
        </div>`;
      window.cmInitHelpWidget?.();
    }
  }

  load();
});
