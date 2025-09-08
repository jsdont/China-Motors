// Калькулятор (упрощённый UI + авто-сообщение)
// Обновления:
// 1) Body type читаем также из ?body_raw (если есть).
// 2) Утиль/пер.рег.: утиль 4 030 000 и первичная 1 376 000 для всех,
//    кроме: Спец. техника (0), Тягач (утиль 2 162 600 + госномер), Прицепы/Полуприцепы (только госномер).

(function () {
  const $  = (s, r = document) => r.querySelector(s);
  const qa = (s, r = document) => Array.from(r.querySelectorAll(s));
  const nf = new Intl.NumberFormat('ru-RU');

  // === Константы ===
  const DUTY_RATE  = 0.10;
  const VAT_RATE   = 0.12;

  // Гос. сборы
  const PLATE_FEE        = 16963;     // госномер/техпаспорт
  const UTIL_TAX_TYAGACH = 2162600;   // утиль для тягачей (как раньше)
  const UTIL_TAX_STD     = 4030000;   // утиль для большинства типов (новое)
  const FIRST_REG_STD    = 1376000;   // первичная регистрация (новое)

  // Типы (для распознавания значения ?body как "тип" или "комплектация")
  const TYPES = [
    'Прицепы','Полуприцепы','Самосвал','Тягач','Спец. техника','Кран','Манипулятор',
    'Миксер','Бензовоз','Автовышка','Ассенизатор','Рефрижератор','Автофургон',
    'Поливомоечная машина','Ямобур машины для бурения','Молоковоз','Топливозаправщик'
  ];
  const NO_GRID = new Set(['Кран','Поливомоечная машина','Рефрижератор','Ассенизатор','Автовышка']);
  const IS_TRAILER = (t) => (t === 'Прицепы' || t === 'Полуприцепы');

  // Сетка (год)
  const GRID_YEAR_TABLE = {
    'Тягач':       [{ year: 2021, usd: 22300 }, { year: 2022, usd: 25500 }],
    'Самосвал':    [{ year: 2022, usd: 27000 }],
    'Миксер':      [{ year: 2021, usd: 20300 }],
    'Манипулятор': [{ year: 2022, usd: 28000 }],
    'Бензовоз':    [{ year: 2022, usd: 28000 }],
    'Прицепы':     [{ year: 2021, usd: 13750 }, { year: 2022, usd: 16000 }],
    'Полуприцепы': [{ year: 2021, usd: 13750 }, { year: 2022, usd: 16000 }],
  };

  const fmt    = (v) => nf.format(Math.round(v || 0));
  const fmtUsd = (v) => nf.format(Math.round(v || 0));
  const num = (sel) => {
    const el = $(sel);
    const n = Number((el?.value ?? '0').toString().replace(/\s/g,'').replace(',','.'));
    return Number.isFinite(n) ? n : 0;
  };

  // --------- Автозаполнение из URL ---------
  let qType='', qBrand='', qModel='', qBodyText='', qName='';
  (function prefill(){
    const p = new URLSearchParams(location.search);

    const price = p.get('price') || '';

    // В некоторых случаях в ?body приходит либо "тип", либо "комплектация".
    const bodyParam = p.get('body') || '';
    // Комплектация может приезжать отдельным ключом body_raw.
    const bodyRaw   = p.get('body_raw') || '';

    let typeForSelect = bodyParam;
    let guessedBodyText = '';

    if (bodyParam) {
      const isType = TYPES.includes(bodyParam);
      if (!isType) {
        // это не тип из списка — считаем это Body type (комплектация)
        guessedBodyText = bodyParam;
        typeForSelect = ''; // тип попробуем взять из других ключей ниже
      }
    }
    // если явно передали body_raw — он имеет приоритет как комплектация
    if (bodyRaw) guessedBodyText = bodyRaw;

    // Тип для селекта — берём из множества ключей
    typeForSelect =
      typeForSelect ||
      p.get('type') || p.get('category') || p.get('vehicle') || p.get('kind') || '';

    // Поля для шапки
    qType     = typeForSelect || p.get('type') || p.get('category') || p.get('vehicle') || p.get('kind') || '';
    qBrand    = p.get('brand') || p.get('make') || '';
    qModel    = p.get('model') || '';
    qBodyText = guessedBodyText ||
                p.get('body_type') || p.get('bodyType') || p.get('bodytext') ||
                p.get('spec') || p.get('config') || '';
    qName     = p.get('name') || p.get('title') || '';

    const parts = [];
    if (qType)     parts.push(`Type: ${qType}`);
    if (qBrand)    parts.push(`Brand: ${qBrand}`);
    if (qModel)    parts.push(`Model: ${qModel}`);
    if (qBodyText) parts.push(`Body: ${qBodyText}`);
    if (qName)     parts.push(`Name: ${qName}`);
    const composed = parts.join(' | ');
    if (composed) $('#vehicleName').value = composed;

    if (price && !Number.isNaN(+price)) $('#basePrice').value = String(+price);
    if (typeForSelect) $('#type').value = typeForSelect;
  })();

  // ---- helpers ----
  function putText(sel, v) { const e = $(sel); if (e) e.textContent = v; }
  function addRow(listId, name, sum) {
    const ul = $(listId);
    if (!ul) return;
    const li = document.createElement('li');
    li.innerHTML = `<span>${name}</span><span class="sum">${fmt(sum)}</span>`;
    ul.appendChild(li);
  }
  function clearList(id) { const ul = $(id); if (ul) ul.innerHTML = ''; }

  // UI: режимы ТС
  function refreshModesByType(){
    const t = $('#type').value;
    $('#lblGridYear').style.display = GRID_YEAR_TABLE[t] ? '' : 'none';
    $('#lblFixed').style.display    = NO_GRID.has(t) ? 'none' : '';

    const rBy  = document.querySelector('input[name="ts_mode"][value="byprice"]');
    const rGY  = document.querySelector('input[name="ts_mode"][value="gridYear"]');
    const rFix = document.querySelector('input[name="ts_mode"][value="fixed"]');

    if (NO_GRID.has(t)) { rBy.checked = true; rGY.checked = false; rFix.checked = false; }
    else if (!GRID_YEAR_TABLE[t] && rGY.checked) { rGY.checked = false; rBy.checked = true; }

    buildGridYearOptions();
    toggleTsInputs();
  }
  function buildGridYearOptions(){
    const t = $('#type').value;
    const list = GRID_YEAR_TABLE[t] || [];
    const sel  = $('#gridYear');
    sel.innerHTML = '';
    for (const item of list){
      const opt = document.createElement('option');
      opt.value = String(item.year);
      opt.textContent = item.year;
      opt.dataset.usd = String(item.usd);
      sel.appendChild(opt);
    }
    applyGridYearUSD();
  }
  function applyGridYearUSD(){
    const sel = $('#gridYear');
    const usd = sel?.selectedOptions?.[0]?.dataset?.usd;
    $('#gridYearUSD').value = usd ? usd : '';
  }
  function toggleTsInputs(){
    const mode = document.querySelector('input[name="ts_mode"]:checked')?.value || 'byprice';
    $('#wrap-ts-manual').style.display = (mode === 'fixed') ? '' : 'none';
    $('#wrap-gridYear').style.display  = (mode === 'gridYear') ? '' : 'none';
  }

  // Курс
  async function refreshRate(){
    const info = $('#rateInfo');
    const input = $('#rate');
    const endpoints = [
      'https://api.exchangerate.host/latest?base=USD&symbols=KZT',
      'https://open.er-api.com/v6/latest/USD',
      'https://api.frankfurter.app/latest?from=USD&to=KZT'
    ];
    const controllers = endpoints.map(()=>new AbortController());
    const promises = endpoints.map((url,i)=>
      fetch(url,{cache:'no-store',signal:controllers[i].signal})
        .then(r=>{ if(!r.ok) throw new Error('HTTP'); return r.json(); })
    );
    try{
      const d = await Promise.any(promises);
      controllers.forEach(c=>c.abort());
      let kzt=null;
      if (d?.rates?.KZT) kzt=d.rates.KZT;
      if (!kzt && d?.result==='success' && d?.rates?.KZT) kzt=d.rates.KZT;
      if (kzt){
        input.value=String(kzt.toFixed(2));
        info.textContent=`Курс НБ РК: ~ ${kzt.toFixed(2)} ₸`;
      }
    }catch(_){}
    recalc();
  }
  $('#btnRefreshRate')?.addEventListener('click', (e)=>{ e.preventDefault(); refreshRate(); });

  // Доп.расходы (короткий список)
  function buildMandatory(type, mode, rate){
    const byprice = (mode === 'byprice');
    clearList('#list-mandatory');

    const tBlank   = 23592;
    const brokerSvh= 90000;
    let total = 0;

    if (type === 'Тягач') {
      const items = [
        ['СБКТС', 200000],
        ['Кнопка SOS', 150000],
        ['Таможенный сбор', tBlank],
        ['Услуги брокера на СВХ', brokerSvh],
        ['СВХ', 80000],
        ['Брокер на границе ($250)', 250*rate],
        ['ЭПТС', 50000],
        ['Солярка + AdBlue пакет', 51480],
        ['«Красный коридор»', 50000],
        ['«Спасибо Астане»', byprice ? 0 : 600*rate],
      ];
      items.forEach(([name,sum]) => { if (sum>0){ addRow('#list-mandatory', name, sum); total += sum; }});
      return total;
    }

    if (IS_TRAILER(type)) {
      const items = [
        ['СБКТС', 150000],
        ['Таможенный сбор', tBlank],
        ['Услуги брокера на СВХ', brokerSvh],
        ['СВХ', 70000],
        ['Брокер на границе ($250)', 250*rate],
        ['ЭПТС', 50000],
        ['«Спасибо Астане»', byprice ? 0 : 400*rate],
      ];
      items.forEach(([name,sum]) => { if (sum>0){ addRow('#list-mandatory', name, sum); total += sum; }});
      return total;
    }

    if (type === 'Спец. техника') {
      const items = [
        ['Декларация о соответствии', 80000],
        ['Таможный брокер', 90000],
      ];
      items.forEach(([name,sum]) => { addRow('#list-mandatory', name, sum); total += sum; });
      return total;
    }

    const items = [
      ['СБКТС', 200000],
      ['Кнопка SOS', 150000],
      ['Таможенный сбор', tBlank],
      ['Услуги брокера на СВХ', brokerSvh],
      ['СВХ', 80000],
      ['Брокер на границе ($250)', 250*rate],
      ['ЭПТС', 50000],
      ['«Спасибо Астане»', byprice ? 0 : 600*rate],
    ];
    items.forEach(([name,sum]) => { if (sum>0){ addRow('#list-mandatory', name, sum); total += sum; }});
    return total;
  }

  // Доставка
  function buildDelivery(type, rate){
    clearList('#list-delivery');
    let total = 0;

    if (type === 'Тягач') {
      addRow('#list-delivery', 'Доставка до Алматы/лаборатории/СВХ', 150000);
      total = 150000;
      return total;
    }
    if (IS_TRAILER(type)) {
      return 0;
    }
    if (type === 'Спец. техника') {
      addRow('#list-delivery', 'Доставка до Алматы/лаборатории/СВХ', 300000);
      total = 300000;
      return total;
    }
    const brokerBorder = 250*rate;
    const driver = 75000, adblue = 8000, toll = 9000;
    const diesel = 220*324;
    [['Брокер на границе ($)', brokerBorder],
     ['Водитель', driver],
     ['AdBlue', adblue],
     ['Платная дорога', toll],
     ['Солярка', diesel]
    ].forEach(([name,sum])=>{ addRow('#list-delivery', name, sum); total += sum; });
    return total;
  }

  // Гос. платежи (новые правила)
  function buildUtil(type){
    clearList('#list-util');

    // Спец техника: ничего
    if (type === 'Спец. техника') {
      return 0;
    }

    // Прицепы — только госномер
    if (IS_TRAILER(type)) {
      addRow('#list-util', 'Госномер и техпаспорт', PLATE_FEE);
      return PLATE_FEE;
    }

    // Тягач — прежний утиль + госномер (без первичной)
    if (type === 'Тягач') {
      addRow('#list-util', 'Утилизационный сбор', UTIL_TAX_TYAGACH);
      addRow('#list-util', 'Госномер и техпаспорт', PLATE_FEE);
      return UTIL_TAX_TYAGACH + PLATE_FEE;
    }

    // Остальные типы — новый утиль и первичная + госномер
    addRow('#list-util', 'Утилизационный сбор', UTIL_TAX_STD);
    addRow('#list-util', 'Первичная регистрация', FIRST_REG_STD);
    addRow('#list-util', 'Госномер и техпаспорт', PLATE_FEE);
    return UTIL_TAX_STD + FIRST_REG_STD + PLATE_FEE;
  }

  function tsModeHuman(mode) {
    if (mode === 'gridYear') {
      const y   = $('#gridYear')?.value || '';
      const usd = $('#gridYearUSD')?.value || '';
      return `Сетка (год): ${y}${usd ? `, ТС $${usd}` : ''}`;
    }
    if (mode === 'fixed') {
      const usd = $('#tsValueUSD')?.value || '';
      return `Фиксированная сетка${usd ? `, ТС $${usd}` : ''}`;
    }
    return 'По полной цене';
  }

  // Сообщение
  function buildMessage(ctx) {
    const {
      type, priceUSD, rate, realKZT, tsKZT, dutyKZT, vatKZT,
      customsTotal, mandatoryTotal, deliveryTotal, utilTotal, totalKZT
    } = ctx;

    const head = ($('#vehicleName')?.value || '').trim();

    const lines = [];
    lines.push('🚘 Запрос через калькулятор China Motors');
    if (head) lines.push(head);

    lines.push(`Тип транспорта (селект): ${type}`);
    lines.push(`Способ расчёта ТС: ${tsModeHuman(document.querySelector('input[name="ts_mode"]:checked')?.value || 'byprice')}`);
    lines.push('');
    lines.push(`Цена авто: $${fmtUsd(priceUSD)} × курс ${fmtUsd(rate)} = ${fmt(realKZT)} ₸`);
    lines.push(`Таможенные платежи: ${fmt(customsTotal)} ₸ (Пошлина: ${fmt(dutyKZT)} ₸, НДС: ${fmt(vatKZT)} ₸)`);
    lines.push(`Доп. расходы: ${fmt(mandatoryTotal)} ₸`);
    lines.push(`Доставка и граница: ${fmt(deliveryTotal)} ₸`);
    lines.push(`Утиль/регистрация: ${fmt(utilTotal)} ₸`);
    lines.push('');
    lines.push(`ИТОГО: ${fmt(totalKZT)} ₸ (≈ ${fmt(totalKZT / rate)} USD)`);

    return lines.join('\n');
  }

  function recalc(){
    const type     = $('#type').value;
    const priceUSD = num('#basePrice');
    const rate     = Math.max(num('#rate'), 0) || 540;
    const mode     = document.querySelector('input[name="ts_mode"]:checked')?.value || 'byprice';

    // Реальная стоимость
    const realKZT = priceUSD * rate;
    putText('#realCostKZT', fmt(realKZT));

    // ТС/пошлина/НДС
    let baseUSD = 0;
    if (mode === 'byprice') baseUSD = priceUSD;
    else if (mode === 'gridYear') {
      const usd = $('#gridYear')?.selectedOptions?.[0]?.dataset?.usd;
      baseUSD = usd ? Number(usd) : priceUSD;
    } else { // fixed
      baseUSD = NO_GRID.has(type) ? priceUSD : (num('#tsValueUSD') || priceUSD);
    }

    const tsKZT   = baseUSD * rate;
    const tBlank  = 23592;
    const dutyKZT = tsKZT * DUTY_RATE;
    const vatKZT  = (tsKZT + dutyKZT + tBlank) * VAT_RATE;
    const customsTotal = dutyKZT + vatKZT;

    putText('#tsKZT', fmt(tsKZT));
    putText('#dutyOutKZT', fmt(dutyKZT));
    putText('#vatOutKZT', fmt(vatKZT));

    // Доп. расходы
    const mandatoryTotal = buildMandatory(type, mode, rate);
    // Доставка
    const deliveryTotal = buildDelivery(type, rate);
    // Гос. платежи
    const utilTotal = buildUtil(type);

    // Правая карточка
    putText('#sBase', fmt(priceUSD * rate));
    putText('#sCustoms', fmt(customsTotal));
    putText('#sMandatory', fmt(mandatoryTotal));
    putText('#sBorder', fmt(deliveryTotal));
    putText('#sUtil', fmt(utilTotal));

    const totalKZT = priceUSD * rate + customsTotal + mandatoryTotal + deliveryTotal + utilTotal;
    putText('#sTotalKZT', `${fmt(totalKZT)} тенге`);
    putText('#sTotalUSD', `≈ ${fmt(totalKZT / rate)} USD`);

    // Ссылка "Оформить заявку"
    const msg = buildMessage({
      type, priceUSD, rate, realKZT, tsKZT, dutyKZT, vatKZT,
      customsTotal, mandatoryTotal, deliveryTotal, utilTotal, totalKZT
    });
    const a = $('#toContactsAside');
    if (a) a.href = `contacts.html?message=${encodeURIComponent(msg)}`;
  }

  // Слушатели
  $('#type')?.addEventListener('change', () => { refreshModesByType(); recalc(); });
  qa('input[name="ts_mode"]').forEach(r => r.addEventListener('change', () => { toggleTsInputs(); recalc(); }));
  $('#gridYear')?.addEventListener('change', () => { applyGridYearUSD(); recalc(); });
  $('#calcForm')?.addEventListener('input', recalc);
  $('#calcForm')?.addEventListener('submit', (e)=>{ e.preventDefault(); recalc(); });

  // init
  refreshModesByType();
  recalc();
})();
