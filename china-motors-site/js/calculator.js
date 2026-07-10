// ==========================================================
// China Motors — Calculator (clean & stable)
// Architecture: URL → PROFILE → CONFIG → CALC
// ==========================================================

(function () {
  /* =========================================================
   MRP BY YEAR (as in Excel)
   ========================================================= */

  const p = new URLSearchParams(location.search);

  const metaBase = document.querySelector('meta[name="api-base"]')?.content?.trim();
  const isLocal = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  const API_BASE = (metaBase || (isLocal ? 'http://127.0.0.1:8000' : 'https://cm-backend-daniyal.fly.dev'))
    .replace(/\/+$/, '');

  function getWeight() {
    const raw =
      document.getElementById("weightInput")?.value ||
      p.get("weight") ||
      "0";

    return Number(raw.toString().replace(",", "."));
  }

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

  // МРП для расчёта сборов — всегда МРП ТЕКУЩЕГО года (когда оформляется
  // растаможка), а не года выпуска техники. getMRPByYear(vehicleYear) годится
  // только для получения возраста техники, не суммы сбора.
  function getCurrentMRP() {
    const map = CALC_CONFIG.mrp_by_year;
    const year = CALC_CONFIG.current_year || new Date().getFullYear();
    return map?.[year] || 4325;
  }
  
  /* =========================================================
     CONFIG (fallback)
     ========================================================= */
  const CALC_DEFAULT_CONFIG = {
    currency: { usd_kzt: 540, cny_kzt: 68.5 },
    diesel: { price_kzt_per_l: 335, liters: 200 },
    taxes: { vat: 0.12, duty: 0.10 },
    fees: {
      plate: 16963,
      first_registration: 1376000,
      srtc: 17516,
      eptc: 50000,
      sbkts: 150000,
      sos: 200000,
      customs_fee: 25950,
      broker_service: 90000,
      red_corridor: 450000,
      adblue: 13500,
      driver: 65000,
      insurance: 5000,
      toll_road: 9000,
      svh: 91000
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
        diesel: { ...CALC_DEFAULT_CONFIG.diesel, ...data.diesel },
        taxes: { ...CALC_DEFAULT_CONFIG.taxes, ...data.taxes },
        fees: { ...CALC_DEFAULT_CONFIG.fees, ...data.fees }
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
      priceCny: p.get('price_cny') ? Number(p.get('price_cny')) : null,
      body: p.get('body') || '',
      bodyRaw: p.get('body_raw') || '',
      profile: p.get('profile') || '',
      intl: p.get('intl') === '1',
      year: p.get('year') ? Number(p.get('year')) : null
    };
  })();

  function prefillFromURL() {
    // ✅ Вес из URL
    if (p.get("weight") && document.getElementById("weightInput")) {
      document.getElementById("weightInput").value = p.get("weight");
    }

    if (URL_PARAMS.title && $('#vehicleName')) {
      $('#vehicleName').value = URL_PARAMS.title;
    }

    if (URL_PARAMS.priceCny && $('#basePrice')) {
      // Живой курс уже подтянут к этому моменту (см. init()) — переводим
      // цену техники из юаней в доллары по курсу НБ РК минус запас.
      const cnyUsdRate = getCnyUsdRate(LIVE_USD_KZT_RATE, LIVE_CNY_KZT_RATE);
      $('#basePrice').value = (URL_PARAMS.priceCny / cnyUsdRate).toFixed(2);
    } else if (URL_PARAMS.price && $('#basePrice')) {
      $('#basePrice').value = URL_PARAMS.price;
    }

    if ($('#year')) {
      $('#year').value = URL_PARAMS.year || '';
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

  function detectVehicleProfile(type) {

    // ✅ теперь type = value из select
    if (type === "CAR") return "CAR";
    if (type === "SEMITRAILER") return "TRAILER";
    if (type === "TRACTOR_N3") return "TRACTOR_N3";
    if (type === "SPECIAL") return "SPECIAL";

    return "TRUCK";
  }


  let CURRENT_VEHICLE_PROFILE = 'TRUCK';

  function updateVehicleProfile() {
    const typeEl = $('#type');
    if (!typeEl) return;

    CURRENT_VEHICLE_PROFILE = detectVehicleProfile(typeEl.value);

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
    const currentYear =
      CALC_CONFIG.current_year || new Date().getFullYear();

    if (!year || isNaN(year)) return 0;
    return Math.max(0, currentYear - Number(year));
  }

  function getFirstRegRateByAge(age, profile, intl) {
    // ✅ Прицепы не платят первичную регистрацию
    if (profile === "TRAILER") return 0;

    // 🚛 Международник (N3) до 7 лет — первичка 0 (льгота до 1 января 2028,
    // ст. 830 Налогового кодекса РК)
    if (profile === "TRACTOR_N3" && intl && age <= 7) return 0;

    // До 2 лет включительно (год выпуска = текущий или предыдущий)
    if (age <= 1) return 0.25;

    // Ровно 2 года
    if (age === 2) return 240;

    // 🚛 Седельные тягачи (N3): расширенная вилка 3–7 лет / от 7 лет
    if (profile === "TRACTOR_N3") {
      if (age >= 3 && age <= 6) return 350;
      return 2500;
    }

    // Остальные грузовики/автобусы (M2/M3/N1/N2/N3 кроме тягачей): 3–5 лет / от 5 лет
    if (age >= 3 && age <= 4) return 350;
    return 2500;
  }



  // Утильсбор = 50 × МРП(текущий год) × коэффициент по весу/категории
  function getUtilCoefByWeight(weight, profile) {
    // 🚛 Седельный тягач — всегда считается по классу автопоезда 20–50 т,
    // независимо от собственной массы тягача (подтверждено реальными
    // таможенными расчётами: тягач весом 10.35 т получает именно этот
    // коэффициент, а не коэффициент по своему curb weight).
    if (profile === "TRACTOR_N3") return 11.0;

    // 🚚 Остальная тяжёлая техника (самосвалы, манипуляторы и т.д.):
    // во ВСЕХ реальных счетах на растаможку утильсбор посчитан по
    // максимальному разряду (20–50 т) независимо от указанного веса
    // техники "по паспорту" (собственная масса 10–18 т в этих примерах) —
    // сбор считается по полной/разрешённой массе, а не по массе тары.
    // Весь наш каталог — тяжёлые грузовики этого класса, поэтому берём
    // максимальный коэффициент всегда, а не по весовой сетке.
    return 20.5;
  }

  function getUtilByWeight2026(weight, profile) {
    if (!weight) return 0;
    // ✅ Прицепы и полуприцепы — утильсбор не применяется
    if (profile === "TRAILER") {
      return 0;
    }

    const coef = getUtilCoefByWeight(weight, profile);
    return 50 * getCurrentMRP() * coef;
  }
  // ===============================
  // ✅ Пошлина по профилю техники
  // ===============================
  function getCarDuty(engineCC) {
    if (engineCC <= 1000) return 0.15;
    if (engineCC <= 1500) return 0.17;
    if (engineCC <= 3000) return 0.20;
    return 0.25;
  }

  function getDutyRate(profile, typeText) {
    const t = (typeText || "").toLowerCase();

    // ✅ Экскаватор гусеничный = 0%
    if (t.includes("экскаватор") && t.includes("гусен")) {
      return 0;
    }

    // ✅ Фронтальный погрузчик = 0%
    if (t.includes("погрузчик") && t.includes("фронт")) {
      return 0;
    }

    // ⚠️ Остальная "спецтехника" (манипулятор, автовышка, миксер и т.д.) —
    // по факту это грузовик с надстройкой, таможня облагает пошлиной как
    // обычный грузовой (ТНВЭД 8704, не спецмашина) — подтверждено реальным
    // счётом на манипулятор (10% пошлины, не 0%). Раньше здесь стояло
    // ошибочное освобождение всего профиля SPECIAL от пошлины.

    if (t.includes("кран")) {
      return CALC_CONFIG.duty_rules?.CRANE || 0.08;
    }

    if (t.includes("трал")) {
      return CALC_CONFIG.duty_rules?.TRAL || 0.09;
    }


    // ✅ Прицепы = 10%
    if (profile === "TRAILER") {
      return 0.10;
    }

    // ✅ Всё остальное грузовое = 10%
    return CALC_CONFIG.duty_rules?.DEFAULT || 0.10;
  }



  /* =========================================================
   PACKAGES (as in Excel)
   ========================================================= */

  function getExpensePackage(profile, rate) {
    const fees = CALC_CONFIG.fees;

    // Дизель и AdBlue — отдельные строки (как в реальных счетах на растаможку)
    const dieselLiters = CALC_CONFIG.diesel?.liters || 200;
    const dieselPrice = CALC_CONFIG.diesel?.price_kzt_per_l || 335;
    const dieselSum = dieselLiters * dieselPrice;
    const adblueSum = fees.adblue || 0;

    // ✅ Декларант на границе: 250$ × курс
    const declarantUSD = 250;
    const declarantSum = declarantUSD * rate;

    // ✅ Услуги СВХ — фиксированная сумма, одинаковая для грузовых и тягачей
    // (прицепы отдельно не учитываются, для них своей формулы пока нет)
    const svhSum = (profile === "TRAILER") ? 0 : (fees.svh || 91000);

    return {
      mandatory: [
        ['calc_item_epts', fees.eptc],
        ['calc_item_sbkts', fees.sbkts],
        ['calc_item_sos', fees.sos],
        ['calc_item_customs_fee', fees.customs_fee],
        ['calc_item_broker_service', fees.broker_service],

        // ✅ СВХ
        ['calc_item_svh', svhSum],

        // ✅ Декларант на границе
        ['calc_item_border_broker', declarantSum],

        ['calc_item_red_corridor', fees.red_corridor]
      ],
      // ✅ Реальная "доставка" — это водитель, топливо, страховка, платная
      // дорога (ровно так эти статьи сгруппированы в v32fix_work и в реальных
      // счетах на растаможку). Раньше здесь стояла ОТДЕЛЬНАЯ фиктивная строка
      // "Доставка до Алматы/лаборатории/СВХ" 150 000 ₸ — в реальных счетах
      // такой отдельной строки нет, её сумма нигде не встречается: итог
      // расходов там полностью и без остатка складывается именно из этих
      // пяти статей. Оставляли бы её — клиент платил бы дважды за доставку.
      delivery: [
        ['calc_item_driver', fees.driver],
        ['calc_item_diesel', dieselSum],
        ['calc_item_adblue', adblueSum],
        ['calc_item_insurance', fees.insurance],
        ['calc_item_toll_road', fees.toll_road]
      ]
    };
  }
  function getCarUtil(engineCC) {
    if (engineCC <= 1000) return 300000;
    if (engineCC <= 2000) return 600000;
    if (engineCC <= 3000) return 1000000;
    return 2000000;
  }

  /* =========================================================
     MAIN CALC
     ========================================================= */
  function isHybridWTO() {

    // ✅ только для легковых
    if (CURRENT_VEHICLE_PROFILE !== "CAR") return false;

    const flag = document.getElementById("flagHybridWTO")?.checked;
    if (!flag) return false;

    const engineKW = Number(document.getElementById("engineKW")?.value || 0);
    const motorKW  = Number(document.getElementById("motorKW")?.value || 0);

    return motorKW > engineKW;
  }

  function getExcise(engineCC) {
    if (engineCC <= 2000) return 0;
    if (engineCC <= 3000) return 100000;
    return 300000;
  }
 
  function recalc() {
    clearList('#list-util');
    updateVehicleProfile();

    const priceUSD = num('#basePrice');
    const rate = num('#rate') || CALC_CONFIG.currency.usd_kzt;


    const VAT  = CALC_CONFIG.taxes.vat;
    let DUTY = getDutyRate(
      CURRENT_VEHICLE_PROFILE,
      document.getElementById("type")?.selectedOptions[0]?.textContent

    );
    // ✅ Легковые авто — отдельная пошлина
    if (CURRENT_VEHICLE_PROFILE === "CAR") {
      const cc = Number(document.getElementById("engineCC")?.value || 0);
      DUTY = getCarDuty(cc);
    }

    // ✅ Гибрид ВТО (только легковые)
    if (isHybridWTO()) {
      DUTY = 0;
    }



    const yearEl = document.getElementById('year');
    const vehicleYear = yearEl ? Number(yearEl.value) : null;

    const vehicleAge = getVehicleAge(vehicleYear);
    const mrp = getCurrentMRP();

    // ✅ правильная ставка первички
    const firstRegRate = getFirstRegRateByAge(
      vehicleAge,
      CURRENT_VEHICLE_PROFILE,
      URL_PARAMS.intl
    );


    // сумма первичной регистрации
    const firstRegSum = firstRegRate * mrp;



    const baseKZT = priceUSD * rate;
    const dutyKZT = baseKZT * DUTY;
    const customsFee = CALC_CONFIG.fees?.customs_fee || 25950;
    // ✅ Акциз (только легковые)
    let exciseKZT = 0;
    if (CURRENT_VEHICLE_PROFILE === "CAR") {
      const cc = Number(document.getElementById("engineCC")?.value || 0);
      exciseKZT = getExcise(cc);
    }

    const vatBase = baseKZT + dutyKZT + customsFee + exciseKZT;

    const vatKZT  = vatBase * VAT;

    const customsTotal = dutyKZT + vatKZT;
    // === 2) Таможенная стоимость — вывод в UI ===
    document.getElementById('tsKZT') &&
      (document.getElementById('tsKZT').textContent = fmt(baseKZT) + ' ₸');

    document.getElementById('dutyOutKZT') &&
      (document.getElementById('dutyOutKZT').textContent = fmt(dutyKZT) + ' ₸');
      document.getElementById("dutyPercent") &&
        (document.getElementById("dutyPercent").textContent =
          (DUTY * 100) + "%");



    document.getElementById('vatOutKZT') &&
      (document.getElementById('vatOutKZT').textContent = fmt(vatKZT) + ' ₸');

    const pkg = getExpensePackage(CURRENT_VEHICLE_PROFILE, rate);

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
      // ✅ Акциз отдельно (легковые)
      if (exciseKZT > 0) {
        mandatoryTotal += exciseKZT;

        const li = document.createElement("li");
        li.innerHTML = `
          <span>Акциз</span>
          <span class="sum">${fmt(exciseKZT)} ₸</span>
        `;
        mandatoryList.appendChild(li);
      }

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
    let utilByWeight = getUtilByWeight2026(getWeight(), CURRENT_VEHICLE_PROFILE);

    if (CURRENT_VEHICLE_PROFILE === "CAR") {
      const cc = Number(document.getElementById("engineCC")?.value || 0);
      utilByWeight = getCarUtil(cc);
    }


    // ✅ Первичка (если ставка не 0)
    let regSum = 0;
    if (firstRegRate > 0) {
      regSum = Math.round(firstRegSum);

    }

    // ✅ Госномер: все, кроме прицепов
    let plateSum = 0;
    if (CURRENT_VEHICLE_PROFILE !== "TRAILER") {
      plateSum = CALC_CONFIG.fees.plate;
    }

    // ✅ СРТС: все, кроме прицепов
    let srtcSum = 0;
    if (CURRENT_VEHICLE_PROFILE !== "TRAILER") {
      srtcSum = CALC_CONFIG.fees.srtc || 0;
    }


    // Итог утиль+регистрация
    const utilTotal = utilByWeight + regSum + plateSum + srtcSum;




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
      // СРТС
      if (srtcSum > 0) {
        addRow("#list-util", "calc_item_srtc", srtcSum);
      }

      // Первичка
      if (regSum > 0) {
        addRow("#list-util", "calc_item_first_reg", regSum);
      }

      // Утиль
      if (utilByWeight > 0) {
        const li = document.createElement('li');
        li.innerHTML = `
          <span>
            Утилизационный сбор ${
              CURRENT_VEHICLE_PROFILE === "CAR"
                ? "(по объёму двигателя)"
                : `(${getWeight()} т)`

            }
          </span>

          <span class="sum">${fmt(utilByWeight)} ₸</span>
        `;
        utilList.appendChild(li);
      }

 
    }



    // === FINAL TOTAL (ПОСЛЕ ВСЕХ РАСЧЁТОВ) ===
    let totalKZT =
      baseKZT +
      customsTotal +
      mandatoryTotal +
      deliveryTotal +
      utilTotal;

    $('#sTotalKZT').textContent = fmt(totalKZT) + ' ₸';
    $('#sTotalUSD').textContent = '≈ ' + fmt(totalKZT / rate) + ' USD';
    if ($('#sTotalCNY')) {
      $('#sTotalCNY').textContent = '≈ ' + fmt(totalKZT / LIVE_CNY_KZT_RATE) + ' ¥';
    }

    $('#mandatoryTotal') && ($('#mandatoryTotal').textContent = fmt(mandatoryTotal));
    $('#deliveryTotal') && ($('#deliveryTotal').textContent = fmt(deliveryTotal));
  }
  // nationalbank.kz не отдаёт CORS-заголовки, поэтому браузер не может
  // сходить туда напрямую — курсы берём через бэкенд, который проксирует
  // тот же фид сервер-к-серверу (там же и небольшой кэш на 10 минут).
  async function fetchNBKRates() {
    try {
      const res = await fetch(`${API_BASE}/api/rates/`);
      const data = await res.json();

      const usd = Number(data.usd_kzt);
      const cny = Number(data.cny_kzt);

      if (!usd || !cny) throw new Error('rates missing in response');

      return { usd, cny };
    } catch (e) {
      console.warn('Rates fetch error, using defaults', e);
      return {
        usd: CALC_CONFIG.currency.usd_kzt,
        cny: CALC_CONFIG.currency.cny_kzt
      };
    }
  }

  // Курс живёт здесь, чтобы recalc() и переводы цены из юаней могли им пользоваться
  // без повторного похода в сеть.
  let LIVE_CNY_KZT_RATE = CALC_DEFAULT_CONFIG.currency.cny_kzt;
  let LIVE_USD_KZT_RATE = CALC_DEFAULT_CONFIG.currency.usd_kzt;

  // Кросс-курс юань→доллар из двух официальных курсов НБ РК (к тенге), минус
  // небольшой запас на колебания курса при подтверждении цены.
  const CNY_USD_MARGIN = 0.02;
  function getCnyUsdRate(usdKztRate, cnyKztRate) {
    return (usdKztRate / cnyKztRate) - CNY_USD_MARGIN;
  }

  async function updateNBKRate({ updateInput = false, doRecalc = false } = {}) {
    const rateInfoEl = document.getElementById('rateInfo');
    const rateInput  = document.getElementById('rate');

    const { usd: rate, cny: cnyRate } = await fetchNBKRates();
    LIVE_CNY_KZT_RATE = cnyRate;
    LIVE_USD_KZT_RATE = rate;

    if (rateInfoEl) {
      rateInfoEl.textContent =
        `Курс НБ РК: ${rate.toFixed(2)} ₸ за $, ${cnyRate.toFixed(2)} ₸ за ¥`;
    }

    if (updateInput && rateInput) {
      rateInput.value = rate.toFixed(2);
    }

    if (doRecalc) {
      recalc();
    }
  }

  document.addEventListener('langchange', recalc);

  function generateCalcId() {
    const d = new Date();
    const date =
      d.getFullYear().toString() +
      String(d.getMonth() + 1).padStart(2, '0') +
      String(d.getDate()).padStart(2, '0');

    const rnd = Math.floor(1000 + Math.random() * 9000);
    return `CM-${date}-${rnd}`;
  }

  let CURRENT_CALC_ID = generateCalcId();

  function buildContactsMessage() {
    const name = document.getElementById('vehicleName')?.value || '';
    const year = document.getElementById('year')?.value || '';
    const price = document.getElementById('basePrice')?.value || '';
    const total = document.getElementById('sTotalKZT')?.textContent || '';

    return `
  🧮 Запрос с калькулятора China Motors
  ID расчёта: ${CURRENT_CALC_ID}

  Техника: ${name}
  Год: ${year}
  Цена в Китае: ${price} $
  Итоговая стоимость: ${total}
  `.trim();

  }

  document.getElementById('toContactsAside')?.addEventListener('click', (e) => {
    e.preventDefault();

    const msg = buildContactsMessage();
    const url = `/contacts.html?message=${encodeURIComponent(msg)}`;
    window.location.href = url;
  });

  /* =========================================================
     INIT
     ========================================================= */
  async function init() {
    await loadCalcConfig();
    // Живые курсы нужны до prefillFromURL(), иначе перевод цены из юаней
    // в доллары (если товар пришёл с CNY-ценой) отработает на дефолтном курсе.
    // updateInput:true — сразу подставляем живой курс в поле #rate, а не
    // ждём, пока клиент сам нажмёт «Обновить курс».
    await updateNBKRate({ updateInput: true });
    prefillFromURL();
    updateVehicleProfile();
    recalc(); // уже пересчитает с новым годом и весом
    // ✅ показать hybridBlock сразу при загрузке
    const isCar = document.getElementById("type").value === "CAR";

    document.getElementById("carTitle").style.display =
      isCar ? "block" : "none";

    const carBox = document.getElementById("carFields");
    if (carBox) {
      carBox.style.display = isCar ? "block" : "none";
    }

    const hybridBox = document.getElementById("hybridBlock");
    if (hybridBox) {
      hybridBox.style.display = isCar ? "block" : "none";
    }


    $('#year')?.addEventListener('input', recalc);
    
    // ✅ Автопересчет всех полей
    document.querySelectorAll('#calcForm input, #calcForm select')
      .forEach(el => {
        el.addEventListener('input', recalc);
        el.addEventListener('change', recalc);
      });

    document.getElementById("flagHybridWTO")?.addEventListener("change", () => {
      const box = document.getElementById("hybridFields");
      if (box) box.style.display =
        document.getElementById("flagHybridWTO").checked
          ? "block"
          : "none";

      recalc();
    });

    document.getElementById("type")?.addEventListener("change", () => {

      const isCar = document.getElementById("type").value === "CAR";

      document.getElementById("carTitle").style.display =
        isCar ? "block" : "none";

      const carBox = document.getElementById("carFields");
      if (carBox) {
        carBox.style.display = isCar ? "block" : "none";
      }

      const hybridBlock = document.getElementById("hybridBlock");
      if (hybridBlock) {
        hybridBlock.style.display = isCar ? "block" : "none";
      }

      if (!isCar) {
        document.getElementById("flagHybridWTO").checked = false;
        document.getElementById("hybridFields").style.display = "none";
      }

      recalc();
    });


  }

  document.getElementById('btnRefreshRate')
    ?.addEventListener('click', () => {
      updateNBKRate({ updateInput: true, doRecalc: true });
    });


  document.getElementById('btnRecalcAside')
    ?.addEventListener('click', recalc);
  window.recalc = recalc;
  init();

})();
