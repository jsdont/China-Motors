// ==========================================================
// China Motors — Calculator (clean & stable)
// Architecture: URL → PROFILE → CONFIG → CALC
// ==========================================================

(function () {
  /* =========================================================
   MRP BY YEAR (as in Excel)
   ========================================================= */

  function getMRPByYear(year) {
    const map = CALC_CONFIG.mrp_by_year;
    if (!year || !map || !map[year]) {
      return map?.[2026] || 4325;
    }
    return map[year];
  }

  /* =========================================================
     CONFIG (fallback)
     ========================================================= */
  const CALC_DEFAULT_CONFIG = {
    currency: { usd_kzt: 540 },
    taxes: { vat: 0.12, duty: 0.10 },
    fees: {
      plate: 16963,
      first_registration: 1376000
    },
    util_2026: {
      TRACTOR_N3: 2162600,
      DEFAULT: 4030000
    }
  };

  let CALC_CONFIG = structuredClone(CALC_DEFAULT_CONFIG);

  async function loadCalcConfig() {
    try {
      const res = await fetch('/kz_calc_config.json', { cache: 'no-store' });
      if (!res.ok) throw new Error();
      const data = await res.json();

      CALC_CONFIG = {
        ...CALC_DEFAULT_CONFIG,
        ...data,
        currency: { ...CALC_DEFAULT_CONFIG.currency, ...data.currency },
        taxes: { ...CALC_DEFAULT_CONFIG.taxes, ...data.taxes },
        fees: { ...CALC_DEFAULT_CONFIG.fees, ...data.fees },
        util_2026: { ...CALC_DEFAULT_CONFIG.util_2026, ...data.util_2026 }
      };

      console.log('[CALC] config loaded');
    } catch {
      console.warn('[CALC] using default config');
    }
  }

  /* =========================================================
     HELPERS
     ========================================================= */
  const $  = (s, r = document) => r.querySelector(s);
  const nf = new Intl.NumberFormat(
    localStorage.getItem('lang') === 'en' ? 'en-US' : 'ru-RU'
  );

  const fmt = (v) => nf.format(Math.round(v || 0));
  const num = (sel) => {
    const el = $(sel);
    const n = Number((el?.value ?? '0').toString().replace(/\s/g,'').replace(',','.'));
    return Number.isFinite(n) ? n : 0;
  };

  /* =========================================================
     STEP 1 — URL PARAMS
     ========================================================= */
  const URL_PARAMS = (() => {
    const p = new URLSearchParams(location.search);
    return {
      title: p.get('title') || p.get('name') || '',
      price: p.get('price') ? Number(p.get('price')) : null,
      body: p.get('body') || '',
      bodyRaw: p.get('body_raw') || '',
      profile: p.get('profile') || '',
      intl: p.get('intl') === '1',
      year: p.get('year') ? Number(p.get('year')) : null
    };
  })();

  function prefillFromURL() {
    if (URL_PARAMS.title && $('#vehicleName')) $('#vehicleName').value = URL_PARAMS.title;
    if (URL_PARAMS.price && $('#basePrice'))  $('#basePrice').value = URL_PARAMS.price;
    if (URL_PARAMS.body  && $('#type'))       $('#type').value = URL_PARAMS.body;
    if (URL_PARAMS.year && $('#year')) {
      $('#year').value = URL_PARAMS.year;
    }

  }

  /* =========================================================
     STEP 2 — VEHICLE PROFILE
     ========================================================= */
  function detectVehicleProfile(type, bodyRaw) {
    if (URL_PARAMS.profile) return URL_PARAMS.profile;

    const t = (type || '').toLowerCase();
    const b = (bodyRaw || '').toLowerCase();

    if (t.includes('прицеп')) return 'TRAILER';
    if (t.includes('тягач') || t.includes('седель')) return 'TRACTOR_N3';
    if (t.includes('самосвал') || t.includes('груз')) return 'TRUCK';
    if (
      t.includes('спец') || t.includes('кран') || t.includes('манип') ||
      t.includes('миксер') || t.includes('вышка') || t.includes('ассен') ||
      t.includes('ямобур')
    ) return 'SPECIAL';

    return 'TRUCK';
  }

  let CURRENT_VEHICLE_PROFILE = 'TRUCK';

  function updateVehicleProfile() {
    const typeEl = $('#type');
    if (!typeEl) return;
    CURRENT_VEHICLE_PROFILE = detectVehicleProfile(typeEl.value, URL_PARAMS.bodyRaw);
  }

  /* =========================================================
   YEAR → AGE → FIRST REGISTRATION RATE
   ========================================================= */

  function getVehicleAge(year) {
    const currentYear = new Date().getFullYear();
    if (!year || isNaN(year)) return 0;
    return Math.max(0, currentYear - Number(year));
  }

  function getFirstRegRateByAge(age) {
    // Логика как у папы
    // До 2 лет, включая год выпуска
    if (age <= 2) return 0.25;

    // Заготовка на будущее (можно расширить)
    // if (age <= 5) return 0.5;
    // if (age <= 10) return 1.0;

    return 0.25; // пока оставляем так же
  }

  /* =========================================================
     STEP 3 — UTIL & REGISTRATION (2026)
     ========================================================= */
  function calcUtilAndRegistration(profile, vehicleAge, firstRegRate, mrp) {
    const items = [];
    let total = 0;

    const plate = CALC_CONFIG.fees.plate;

    // TRACTOR_N3 — нет первичной регистрации
    if (profile === 'TRACTOR_N3') {
      firstRegRate = 0;
    }

    // SPECIAL — ничего
    if (profile === 'SPECIAL') {
      return { total: 0, items };
    }

    // TRAILER — только номер
    if (profile === 'TRAILER') {
      items.push(['Госномер и техпаспорт', plate]);
      total += plate;
      return { total, items };
    }

    // TRACTOR
    if (profile === 'TRACTOR_N3') {
      items.push(['Утилизационный сбор', CALC_CONFIG.util_2026.TRACTOR_N3]);
      total += CALC_CONFIG.util_2026.TRACTOR_N3;

      items.push(['Госномер и техпаспорт', plate]);
      total += plate;
      return { total, items };
    }

    // TRUCK (default)
    items.push(['Утилизационный сбор', CALC_CONFIG.util_2026.DEFAULT]);
    total += CALC_CONFIG.util_2026.DEFAULT;

    // Первичная регистрация — зависит от возраста
    const firstRegSum = firstRegRate * mrp;

    items.push([
      `Первичная регистрация (${firstRegRate} МРП, возраст: ${vehicleAge} г.)`,
      Math.round(firstRegSum)
    ]);
    total += firstRegSum;


    items.push(['Госномер и техпаспорт', plate]);
    total += plate;

    return { total, items };
  }

  /* =========================================================
   PACKAGES (as in Excel)
   ========================================================= */

  function getExpensePackage(profile, excelMax, rate) {
    // Пока делаем для грузовых / тягачей
    if (!excelMax) {
      return {
        mandatory: [
          ['Таможенный сбор', 23592],
          ['Услуги брокера на СВХ', 90000]
        ],
        delivery: [
          ['Доставка до Алматы / СВХ', 150000]
        ]
      };
    }

    // Excel / максимум
    return {
      mandatory: [
        ['СБКТС', 200000],
        ['Кнопка SOS', 150000],
        ['Таможенный сбор', 23592],
        ['Услуги брокера на СВХ', 90000],
        ['СВХ', 80000],
        ['Брокер на границе ($250)', 250 * rate],
        ['ЭПТС', 50000],
        ['Солярка + AdBlue пакет', 51480],
        ['Красный коридор', 50000]
      ],
      delivery: [
        ['Доставка до Алматы / СВХ', 150000]
      ]
    };
  }

  /* =========================================================
     MAIN CALC
     ========================================================= */
  function recalc() {
    updateVehicleProfile();

    const priceUSD = num('#basePrice');
    const rate = Math.max(num('#rate'), 0) || CALC_CONFIG.currency.usd_kzt;


    const VAT  = CALC_CONFIG.taxes.vat;
    const DUTY = CALC_CONFIG.taxes.duty;

    const yearEl = document.getElementById('year');
    const vehicleYear = yearEl ? Number(yearEl.value) : null;

    const vehicleAge = getVehicleAge(vehicleYear);
    const firstRegRate = getFirstRegRateByAge(vehicleAge);
    const mrp = getMRPByYear(vehicleYear);


    const baseKZT = priceUSD * rate;
    const dutyKZT = baseKZT * DUTY;
    const vatKZT  = (baseKZT + dutyKZT) * VAT;
    const customsTotal = dutyKZT + vatKZT;
    // === 2) Таможенная стоимость — вывод в UI ===
    document.getElementById('tsKZT') &&
      (document.getElementById('tsKZT').textContent = fmt(baseKZT) + ' ₸');

    document.getElementById('dutyOutKZT') &&
      (document.getElementById('dutyOutKZT').textContent = fmt(dutyKZT) + ' ₸');

    document.getElementById('vatOutKZT') &&
      (document.getElementById('vatOutKZT').textContent = fmt(vatKZT) + ' ₸');

    const excelMax = document.getElementById('flagExcelMax')?.checked;

    const pkg = getExpensePackage(
      CURRENT_VEHICLE_PROFILE,
      excelMax,
      rate
    );

    // --- 3) Дополнительные расходы ---
    const mandatoryList = document.getElementById('list-mandatory');
    let mandatoryTotal = 0;

    if (mandatoryList) {
      mandatoryList.innerHTML = '';

      pkg.mandatory.forEach(([label, sum]) => {
        mandatoryTotal += sum;

        const li = document.createElement('li');
        li.innerHTML = `
          <span>${label}</span>
          <span class="sum">${fmt(sum)} ₸</span>
        `;
        mandatoryList.appendChild(li);
      });
    }

    // --- 4) Доставка ---
    const deliveryList = document.getElementById('list-delivery');
    let deliveryTotal = 0;

    if (deliveryList) {
      deliveryList.innerHTML = '';

      pkg.delivery.forEach(([label, sum]) => {
        deliveryTotal += sum;

        const li = document.createElement('li');
        li.innerHTML = `
          <span>${label}</span>
          <span class="sum">${fmt(sum)} ₸</span>
        `;
        deliveryList.appendChild(li);
      });
    }



    const util = calcUtilAndRegistration(
      CURRENT_VEHICLE_PROFILE,
      vehicleAge,
      firstRegRate,
      mrp
    );


    // UI
    $('#sBase') && ($('#sBase').textContent = fmt(baseKZT));
    $('#realCostKZT') && ($('#realCostKZT').textContent = fmt(baseKZT) + ' ₸');
    $('#sCustoms') && ($('#sCustoms').textContent = fmt(customsTotal));
    $('#sUtil') && ($('#sUtil').textContent = fmt(util.total));
    // --- Детализация: Утиль / регистрация ---
    const utilList = document.getElementById('list-util');
    if (utilList) {
      utilList.innerHTML = '';

      util.items.forEach(([label, sum]) => {
        if (!sum) return;

        const li = document.createElement('li');
        li.innerHTML = `
          <span>${label}</span>
          <span class="sum">${fmt(sum)} ₸</span>
        `;
        utilList.appendChild(li);
      });
    }


    let totalKZT =
      customsTotal +
      mandatoryTotal +
      deliveryTotal +
      util.total;
    // Excel-режим: добавляем цену авто в итог (как у папы)
    if (excelMax) {
      totalKZT += baseKZT;
    }


    // === FINAL TOTAL FIX (Excel = full price like Excel) ===
    if (excelMax) {
      totalKZT += baseKZT;
    }

    $('#sTotalKZT') && ($('#sTotalKZT').textContent = fmt(totalKZT) + ' ₸');
    $('#sTotalUSD') && ($('#sTotalUSD').textContent = '≈ ' + fmt(totalKZT / rate) + ' USD');
    $('#mandatoryTotal') && ($('#mandatoryTotal').textContent = fmt(mandatoryTotal));
    $('#deliveryTotal') && ($('#deliveryTotal').textContent = fmt(deliveryTotal));
    console.log('EXCEL MODE CHECK:', excelMax);
    console.log('BASE KZT:', baseKZT);


  }

  /* =========================================================
     INIT
     ========================================================= */
  async function init() {
    await loadCalcConfig();
    prefillFromURL();
    updateVehicleProfile();
    recalc();

    $('#year')?.addEventListener('input', recalc);
    
    $('#type')?.addEventListener('change', recalc);
    $('#calcForm')?.addEventListener('input', recalc);
  }
  document.getElementById('flagExcelMax')?.addEventListener('change', recalc);

  init();

})();
