// ==========================================================
// China Motors — Calculator (clean & stable)
// Architecture: URL → PROFILE → CONFIG → CALC
// ==========================================================

(function () {
  /* =========================================================
   MRP BY YEAR (as in Excel)
   ========================================================= */
  const PLATE_FEE = () => CALC_CONFIG.fees.plate;

  const p = new URLSearchParams(location.search);
  const weight = Number(p.get('weight')) || 0;
  function clearList(selector) {
    const el = document.querySelector(selector);
    if (el) el.innerHTML = '';
  }

  function addRow(selector, labelKey, value) {
    const el = document.querySelector(selector);
    if (!el) return;

    const li = document.createElement('li');
    li.innerHTML = `
      <span>${t(labelKey)}</span>
      <span class="sum">${fmt(value)} ₸</span>
    `;
    el.appendChild(li);
  }

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
    if (URL_PARAMS.title && $('#vehicleName')) {
      $('#vehicleName').value = URL_PARAMS.title;
    }

    if (URL_PARAMS.price && $('#basePrice')) {
      $('#basePrice').value = URL_PARAMS.price;
    }

    if (URL_PARAMS.year && $('#year')) {
      $('#year').value = URL_PARAMS.year;
    }

    // 🔴 ВАЖНО: тип транспорта
    if (URL_PARAMS.body && $('#type')) {
      const typeSelect = $('#type');
      const body = URL_PARAMS.body;

      // пытаемся найти option по value или по text
      const option = [...typeSelect.options].find(
        o => o.value === body || o.textContent.trim() === body
      );

      if (option) {
        typeSelect.value = option.value;
      }
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
    t.includes('спец') ||
    t.includes('кран') ||
    t.includes('манип') ||
    t.includes('миксер') ||
    t.includes('вышка') ||
    t.includes('ассен') ||
    t.includes('ямобур')
  ) return 'SPECIAL';

  return 'TRUCK';
}


  let CURRENT_VEHICLE_PROFILE = 'TRUCK';

  function updateVehicleProfile() {
    const typeEl = $('#type');
    if (!typeEl) return;

    CURRENT_VEHICLE_PROFILE = detectVehicleProfile(
      typeEl.value,
      URL_PARAMS.bodyRaw
    );

    console.log('[PROFILE]', {
      type: typeEl.value,
      bodyRaw: URL_PARAMS.bodyRaw,
      profile: CURRENT_VEHICLE_PROFILE
    });
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

  // SPECIAL — вообще ничего
  if (profile === 'SPECIAL') {
    return { total, items };
  }

  // Госномер — ОДИН РАЗ для всех, кроме SPECIAL
  items.push(['calc_item_plate', plate]);
  total += plate;

  // TRACTOR_N3 — нет первичной регистрации
  if (profile === 'TRACTOR_N3') {
    return { total, items };
  }

  // TRAILER — только номер
  if (profile === 'TRAILER') {
    return { total, items };
  }

  // Остальные — первичная регистрация
  const firstRegSum = firstRegRate * mrp;

  items.push([
    'calc_item_first_reg',
    Math.round(firstRegSum)
  ]);
  total += firstRegSum;

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
          ['calc_item_util_tax', 23592],
          ['calc_item_broker_service', 90000]
        ],
        delivery: [
          ['calc_item_delivery_city', 150000]
        ]
      };
    }

    // Excel / максимум
    return {
      mandatory: [
        ['calc_item_sbkts', 200000],
        ['calc_item_sos', 150000],
        ['calc_item_util_tax', 23592],
        ['calc_item_broker_service', 90000],
        ['calc_item_svh', 80000],
        ['calc_item_broker_svh', 250 * rate],
        ['calc_item_svh', 50000],
        ['calc_item_diesel_pack', 51480],
        ['calc_item_red_corridor', 50000]
      ],
      delivery: [
        ['calc_item_delivery_city', 150000]
      ]
    };
  }

  /* =========================================================
     MAIN CALC
     ========================================================= */
  function recalc() {
    clearList('#list-util');
    updateVehicleProfile();

    const priceUSD = num('#basePrice');
    const rate = num('#rate') || CALC_CONFIG.currency.usd_kzt;


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
          <span>${t(label)}</span>
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
          <span>${t(label)}</span>
          <span class="sum">${fmt(sum)} ₸</span>
        `;
        deliveryList.appendChild(li);
      });
    }




    const reg = calcUtilAndRegistration(
      CURRENT_VEHICLE_PROFILE,
      vehicleAge,
      firstRegRate,
      mrp
    );
    const utilTotal = reg.total;



    // UI
    $('#sBase') && ($('#sBase').textContent = fmt(baseKZT));
    $('#realCostKZT') && ($('#realCostKZT').textContent = fmt(baseKZT) + ' ₸');
    $('#sCustoms') && ($('#sCustoms').textContent = fmt(customsTotal));
    $('#sUtil').textContent = fmt(utilTotal);

    // --- Детализация: Утиль / регистрация ---
    const utilList = document.getElementById('list-util');
    if (utilList) {
      utilList.innerHTML = '';

      /* регистрация */
      reg.items.forEach(([label, sum]) => {
        if (!sum) return;
        const li = document.createElement('li');
        li.innerHTML = `
          <span>${t(label)}</span>
          <span class="sum">${fmt(sum)} ₸</span>
        `;
        utilList.appendChild(li);
      });
    }



    let totalKZT =
      customsTotal 
      mandatoryTotal 
      deliveryTotal 
      utilTotal;

      if (!document.getElementById('flagExcludeBase')?.checked) {
        totalKZT += baseKZT;
      }

    $('#sTotalKZT') && ($('#sTotalKZT').textContent = fmt(totalKZT) + ' ₸');
    $('#sTotalUSD') && ($('#sTotalUSD').textContent = '≈ ' + fmt(totalKZT / rate) + ' USD');
    $('#mandatoryTotal') && ($('#mandatoryTotal').textContent = fmt(mandatoryTotal));
    $('#deliveryTotal') && ($('#deliveryTotal').textContent = fmt(deliveryTotal));
    console.log('EXCEL MODE CHECK:', excelMax);
    console.log('BASE KZT:', baseKZT);


  }
  async function fetchNBKRate() {
    try {
      const res = await fetch('https://nationalbank.kz/rss/get_rates.cfm?fdate=');
      const text = await res.text();

      const match = text.match(/<title>USD<\/title>[\\s\\S]*?<description>([0-9.]+)<\/description>/);
      if (!match) throw new Error('USD rate not found');

      return Number(match[1]);
    } catch (e) {
      console.warn('NBK rate error, using default');
      return CALC_CONFIG.currency.usd_kzt;
    }
  }
  async function updateNBKRate({ updateInput = false, doRecalc = false } = {}) {
    const rateInfoEl = document.getElementById('rateInfo');
    const rateInput  = document.getElementById('rate');

    const rate = await fetchNBKRate();

    if (rateInfoEl) {
      rateInfoEl.textContent = `Курс НБ РК: ${rate.toFixed(2)} ₸`;
    }

    if (updateInput && rateInput) {
      rateInput.value = rate.toFixed(2);
    }

    if (doRecalc) {
      recalc();
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateNBKRate(false); // только показать, НЕ менять input
  });


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
  document.getElementById('btnRefreshRate')
    ?.addEventListener('click', () => {
      updateNBKRate({ updateInput: true, doRecalc: true });
    });


  document.getElementById('btnRecalcAside')
    ?.addEventListener('click', recalc);
  window.recalc = recalc;
  init();
  

})();
