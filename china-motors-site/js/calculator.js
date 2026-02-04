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

  function getFirstRegRateByAge(age, profile, intl) {

    // 🚛 Тягач международник — первичка 0
    if (profile === "TRACTOR_N3" && intl) return 0;

    // 🚚 Грузовые 3–5 лет = 350 МРП
    if (age >= 3 && age <= 5) return 350;

    // До 2 лет
    if (age <= 2) return 0.25;

    // Старше 5 лет
    return 2500;
  }


  function getUtilByWeight2026(weight, profile) {
    if (!weight) return 0;

    // ✅ Берём утиль из конфига
    if (profile === "TRACTOR_N3") {
      return CALC_CONFIG.util_2026.TRACTOR_N3;
    }

    // Для остальных грузовых
    return getUtilByWeightTable(weight);
  }
  function getUtilByWeightTable(weight) {
    if (weight <= 2.5) return 756875;
    if (weight <= 3.5) return 1621875;
    if (weight <= 5)   return 1621875;
    if (weight <= 8)   return 1730000;
    if (weight <= 12)  return 2054375;
    if (weight <= 20)  return 2270625;
    if (weight <= 50)  return 4433125;
    return 0;
  }
  // ===============================
  // ✅ Пошлина по профилю техники
  // ===============================
  function getDutyRate(profile, typeText) {

    const t = (typeText || "").toLowerCase();

    // Спецтехника = 0%
    if (profile === "SPECIAL") return 0;

    // Автокран = 8%
    if (t.includes("кран")) return 0.08;

    // Трал = 9%
    if (t.includes("трал")) return 0.09;

    // Прицепы = 10%
    if (profile === "TRAILER") return 0.10;

    // Самосвал и тягач = 10%
    return 0.10;
  }


  /* =========================================================
   PACKAGES (as in Excel)
   ========================================================= */

  function getExpensePackage(profile, excelMax, rate) {
    // дизель: 220 литров × цена из конфига
    const dieselLiters = 220;
    const dieselPrice = CALC_CONFIG.diesel?.price_kzt_per_l || 360;
    const dieselSum = dieselLiters * dieselPrice;
    // ✅ Декларант на границе: 250$ × курс
    const declarantUSD = 250;
    const declarantSum = declarantUSD * rate;
    // ===============================
    // ✅ СВХ формула как в Excel
    // ===============================

    let svhSum = 0;

    if (profile === "TRACTOR_N3") {
      // 🚛 Тягач: 2500 × 18 + 27000
      svhSum = 2500 * 18 + 27000;
    } else {
      // 🚚 Самосвал/грузовой: 3500 × 16 + 35000
      svhSum = 3500 * 16 + 35000;
    }

    // Пока делаем для грузовых / тягачей
    if (!excelMax) {
      return {
        mandatory: [
          ['calc_item_customs_fee', 29592],
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
        ['calc_item_customs_fee', 29592],
        ['calc_item_broker_service', 90000],

        // ✅ СВХ по формуле
        ['calc_item_svh', svhSum],

        // ✅ Декларант на границе
        ['calc_item_border_broker', declarantSum],

        // ✅ Дизель: 220л × цена
        ['calc_item_diesel_pack', dieselSum],

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
    const DUTY = getDutyRate(
      CURRENT_VEHICLE_PROFILE,
      document.getElementById("type")?.value
    );



    const yearEl = document.getElementById('year');
    const vehicleYear = yearEl ? Number(yearEl.value) : null;

    const vehicleAge = getVehicleAge(vehicleYear);
    const mrp = getMRPByYear(vehicleYear);

    // ✅ правильная ставка первички
    const firstRegRate = getFirstRegRateByAge(
      vehicleAge,
      CURRENT_VEHICLE_PROFILE,
      URL_PARAMS.intl
    );


    // сумма первички
    const firstRegSum = firstRegRate * mrp;



    const baseKZT = priceUSD * rate;
    const dutyKZT = baseKZT * DUTY;
    const customsFee = 29592;

    const vatBase = baseKZT + dutyKZT + customsFee;
    const vatKZT  = vatBase * VAT;

    const customsTotal = dutyKZT + vatKZT;
    // === 2) Таможенная стоимость — вывод в UI ===
    document.getElementById('tsKZT') &&
      (document.getElementById('tsKZT').textContent = fmt(baseKZT) + ' ₸');

    document.getElementById('dutyOutKZT') &&
      (document.getElementById('dutyOutKZT').textContent = fmt(dutyKZT) + ' ₸');
      document.getElementById("dutyPercent") &&
        (document.getElementById("dutyPercent").textContent =
          "Пошлина: " + (DUTY * 100) + "%");


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




    // ✅ Утиль
    const utilByWeight = getUtilByWeight2026(
      weight,
      CURRENT_VEHICLE_PROFILE
    );

    // ✅ Первичка (если ставка не 0)
    let regSum = 0;
    if (firstRegRate > 0) {
      regSum = Math.round(firstRegSum);

    }

    // ✅ Госномер всегда кроме спецтехники
    let plateSum = 0;
    if (CURRENT_VEHICLE_PROFILE !== "SPECIAL") {
      plateSum = CALC_CONFIG.fees.plate;
    }

    // Итог утиль+регистрация
    const utilTotal = utilByWeight + regSum + plateSum;




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
      // Госномер
      if (plateSum > 0) {
        addRow("#list-util", "calc_item_plate", plateSum);
      }

      // Первичка
      if (regSum > 0) {
        addRow("#list-util", "calc_item_first_reg", regSum);
      }

      // Утиль
      if (utilByWeight > 0) {
        const li = document.createElement('li');
        li.innerHTML = `
          <span>Утилизационный сбор (${weight} т)</span>
          <span class="sum">${fmt(utilByWeight)} ₸</span>
        `;
        utilList.appendChild(li);
      }

 
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
