// js/home.js — главная страница: живые числа в hero (количество техники и
// курс) + превью «Популярная техника» карточками VehiclePassport.
//
// Виджет-калькулятор из hero снят на шаге 4 переноса дизайн-системы v2
// (redesign-plan §4.1: «Никакого белого виджета-калькулятора, парящего на
// фото»), вместе с ним ушёл и код, который наполнял его селекты.
document.addEventListener('DOMContentLoaded', async () => {
  const metaBase = document.querySelector('meta[name="api-base"]')?.content;
  const API_BASE = (metaBase || location.origin).replace(/\/+$/, '');

  const grid = document.getElementById('hpVehiclesGrid');

  const tr = (key, fallback) => (window.t ? window.t(key) : null) || fallback;

  const AVAIL_LABELS = { in_stock: 'В НАЛИЧИИ', on_order: 'ПОД ЗАКАЗ', out_of_stock: 'НЕТ' };

  /* ---------- Живые числа в hero -------------------------------------- */
  // Показываем только то, что реально пришло с бэкенда: пустой блок честнее
  // выдуманного «47 единиц».
  function showMeta(wrapId, valueId, value, opts) {
    const wrap = document.getElementById(wrapId);
    const el = document.getElementById(valueId);
    if (!wrap || !el || value === null || value === undefined) return;
    // Снимаем hidden ДО счётчика: пока элемент display:none,
    // IntersectionObserver за ним не следит и число не побежит.
    wrap.hidden = false;
    const decimals = opts?.decimals || 0;
    if (window.cmCountUp) window.cmCountUp(el, value, opts);
    else el.textContent = Number(value).toLocaleString('ru-RU', {
      minimumFractionDigits: decimals, maximumFractionDigits: decimals,
    });
  }

  async function fillRate() {
    try {
      const res = await fetch(`${API_BASE}/api/rates/`);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      const usd = Number(data.usd_kzt);
      if (!usd) return;
      showMeta('heroRate', 'heroRateN', usd, { decimals: 2 });
    } catch (e) {
      /* курс не отдался — строка просто не появляется */
    }
  }

  /* ---------- Карточка техники — тот же паспорт, что в каталоге -------- */
  function passportRows(v) {
    return [
      ['vp_row_wheel', 'КОЛЁСНАЯ ФОРМУЛА', v.wheel_formula],
      ['vp_row_mass', 'ПОЛНАЯ МАССА, Т', v.weight_t],
      ['vp_row_payload', 'ГРУЗОПОДЪЁМНОСТЬ, Т', v.load_capacity_t],
      ['vp_row_power', 'ДВИГАТЕЛЬ, Л.С.', v.engine_power_hp],
      ['vp_row_gearbox', 'КПП', v.gearbox],
    ].filter(([, , value]) => value !== null && value !== undefined && value !== '');
  }

  function priceLine(v) {
    if (v.price_kzt) return `${Number(v.price_kzt).toLocaleString('ru-RU')} ₸`;
    if (v.price_cny) return `${Number(v.price_cny).toLocaleString('ru-RU')} ¥`;
    return tr('vp_price_on_request', '— по запросу');
  }

  // Ссылка в калькулятор с подставленной техникой — те же параметры, что
  // строят catalog.js и product.js. Держать их одинаковыми важнее, чем
  // вынести в общий модуль: калькулятор читает строку запроса напрямую.
  function calcHref(v) {
    const title = [v.brand, v.model, v.body_type].filter(Boolean).join(' ').trim();
    const p = new URLSearchParams();
    p.set('id', v.id ?? '');
    p.set('title', title);
    p.set('price', v.price_usd ?? '');
    p.set('price_cny', v.price_cny ?? '');
    p.set('body', v.category || v.body_type || '');
    p.set('body_raw', v.body_type || '');
    p.set('weight', v.weight_t ?? '');
    p.set('year', v.year ?? '');
    return `calculator.html?${p.toString()}`;
  }

  // Карточка — тот же паспорт, что в каталоге, включая обе кнопки подвала.
  // «ПОЛУЧИТЬ КП» залита сигнальным красным на каждой карточке: намеренное
  // исключение из правила «один сигнальный красный в кадре» ради конверсии,
  // записано в redesign-plan §1.1. На главной это значит, что в кадре
  // «Популярной техники» четыре заливки, и hero со своим CTA сюда не
  // попадает — они на разных экранах прокрутки.
  //
  // Корень — <article>, а не <a>: две настоящие кнопки не живут внутри
  // ссылки. Переход на страницу техники даёт растянутая ссылка заголовка,
  // как в каталоге.
  function vehicleCard(v) {
    const fullTitle = [v.brand, v.model, v.body_type].filter(Boolean).join(' ').trim()
      || tr('card_no_name', 'Техника');
    const title = v.body_type || fullTitle;
    const sub = [v.category, v.year].filter(Boolean).join(' · ');
    const availability = v.availability || 'in_stock';
    const availLabel = tr('vp_avail_' + availability, AVAIL_LABELS[availability] || '');
    // Файла /img/no-photo.png в репозитории нет — отсутствие фото рисует
    // сама система (.vp__noimg), а не битый <img>.
    const rawImg = v.image_url || (Array.isArray(v.images) && v.images[0]) || '';
    const img = rawImg ? (window.cmOptimizeImage?.(rawImg, { width: 400 }) || rawImg) : '';
    const isFav = window.CMFavorites?.isFavorite(v.id);

    return `
      <article class="vp">
        <div class="vp__media">
          ${img
            ? `<img src="${img}" alt="${fullTitle}" loading="lazy" decoding="async">`
            : `<div class="vp__noimg"><span data-i18n="vp_no_photo">${tr('vp_no_photo', 'НЕТ ФОТО')}</span></div>`}
          ${v.city ? `<span class="vp__tag vp__tag--place">${v.city}</span>` : ''}
          ${availLabel ? `<span class="vp__tag vp__tag--avail vp__tag--${availability}" data-i18n="vp_avail_${availability}">${availLabel}</span>` : ''}
          <button type="button" class="vp__fav${isFav ? ' active' : ''}" data-fav-id="${v.id}" title="${tr('fav_remove_title', 'Избранное')}">
            <i class="fa-${isFav ? 'solid' : 'regular'} fa-bookmark"></i>
          </button>
        </div>

        <div class="vp__head">
          <h3 class="vp__title"><a class="vp__link" href="product.html?id=${v.id}">${title}</a></h3>
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
          <div class="vp__price">${priceLine(v)}</div>
          <div class="vp__actions">
            <a class="vp__cta vp__cta--kp" href="kp.html?id=${v.id}" data-i18n="vp_cta_kp">${tr('vp_cta_kp', 'ПОЛУЧИТЬ КП')}</a>
            <a class="vp__cta" href="${calcHref(v)}" data-i18n="vp_cta">${tr('vp_cta', 'РАСЧЁТ ПОД КЛЮЧ')}</a>
          </div>
        </div>
      </article>`;
  }

  grid?.addEventListener('click', (e) => {
    const btn = e.target.closest('.vp__fav, .cm-card__fav-btn');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    const nowFav = window.CMFavorites?.toggleFavorite(btn.dataset.favId);
    btn.classList.toggle('active', nowFav);
    const icon = btn.querySelector('i');
    if (icon) icon.className = `fa-${nowFav ? 'solid' : 'regular'} fa-bookmark`;
  });

  fillRate();

  try {
    const res = await fetch(`${API_BASE}/api/vehicles/`);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const vehicles = await res.json();
    const list = Array.isArray(vehicles) ? vehicles : (vehicles.results || []);

    if (list.length) showMeta('heroUnits', 'heroUnitsN', list.length);

    if (grid) {
      const preview = list.slice(0, 4);
      grid.innerHTML = preview.length
        ? preview.map(vehicleCard).join('')
        : `<div class="v2-empty"><p>${tr('hp_vehicles_empty', 'Пока нет доступной техники в каталоге.')}</p></div>`;
    }
  } catch (e) {
    if (grid) {
      grid.innerHTML = `<div class="v2-empty"><p>${tr('hp_vehicles_error', 'Не удалось загрузить каталог')}: ${e.message}</p></div>`;
    }
  }
});
