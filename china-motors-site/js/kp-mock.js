// =======================================================
// Моковое КП — временная заглушка вместо /api/kp/<id>/
// =======================================================
//
// Мгновенной генерации КП на бэкенде пока нет: она делается отдельной
// задачей. Чтобы страница kp.html была готова к её появлению, этот файл
// отдаёт объект РОВНО той формы, которую вернёт эндпоинт. Когда эндпоинт
// появится, из kp.html убирается один <script>, из kp.js — одно ветвление
// в loadKP(), и больше ничего не меняется.
//
// Форма ответа выведена из существующего PDF-шаблона компании
// (BackChinaMotors, core/kp.py → build_kp_pdf + core/kp_defaults.py), чтобы
// веб-версия и вложение в письме показывали одно и то же:
//
//   {
//     number:            строка в шапке        (extras["number"])
//     date:              ISO-дата              (date.today() в шаблоне)
//     buyer_name:        покупатель, может быть пустым   (extras["buyer_name"])
//     seller: { name, address, bank, bank_address, account, swift }
//                                              (_seller_from → KPSettings)
//     vehicle: {
//       id, title,                             (_vehicle_title)
//       photo_url,                             (vehicle.image_url / images[0])
//       extra_info,                            (vehicle.extra_info)
//       specs: [ { label, value }, … ]         (_vehicle_specs)
//     }
//     quantity:          число единиц          (extras["quantity"])
//     price: { usd, cny, kzt_total }           (строка таблицы в шаблоне)
//                                              ⚠ см. «ОГОВОРКА» ниже
//     availability_note: строка о наличии      (extras["availability_note"])
//     breakdown: {                             (_render_breakdown)
//       currency: { usd_kzt, cny_kzt },
//       groups: [ { title, rows: [ [label, amount], … ] }, … ],
//       total
//     }
//     delivery_terms:    строка                (_delivery_terms)
//     timeline:          массив строк          (_timeline)
//     service_center:    строка                (_service_center)
//     kp_pdf_url:        ссылка на ОФИЦИАЛЬНЫЙ подписанный PDF или null
//                                              ⚠ мок всегда null, см. ниже
//   }
//
// breakdown — это в точности LAST_CALC_BREAKDOWN из js/calculator.js: те же
// четыре группы, те же подписи строк, тот же порядок. Иначе КП и калькулятор
// показывали бы одну сумму разными словами.
//
// ============================================================================
// ⚠ ОГОВОРКА, КОТОРУЮ НЕЛЬЗЯ ПОТЕРЯТЬ ПРИ ПОДКЛЮЧЕНИИ РЕАЛЬНОГО API
// ============================================================================
//
// СУТЬ: на странице КП цена под ключ показывается ДВАЖДЫ, и эти два числа
// обязаны совпадать. Мок этого добивается тем, что берёт одно число на оба
// места. Настоящий бэкенд обязан обеспечить то же самое САМ — страница их
// не сверяет и не будет.
//
// Где именно:
//   1. price.kzt_total    → ячейка «Сумма, ₸» в таблице количество/цена
//   2. breakdown.total    → строка «ПОД КЛЮЧ В АЛМАТЫ» под разбивкой
//
// Оба видны в одном документе, часто в одном экране. Разойдись они хоть на
// тенге — КП противоречит само себе, и дальше не важно, какое из чисел
// верное: доверия нет ни к одному. Это документ, по которому человек
// принимает решение на десятки миллионов тенге.
//
// ПОЧЕМУ ЭТО НЕ ДАНО АВТОМАТИЧЕСКИ. В PDF-шаблоне (core/kp.py) эти два
// числа приходят из РАЗНЫХ мест:
//
//   ячейка «Сумма, ₸»  ←  vehicle.price_kzt × quantity   (карточка техники)
//   разбивка и итог    ←  deal.calc_breakdown / DealCalcRow  (сделка)
//
// Первое — цена, проставленная в каталоге руками. Второе — расчёт по
// сделке. Совпадают они ровно настолько, насколько их свёл менеджер. В
// бумажном КП это сходило с рук: его собирал человек и он же отвечал за
// сведение. В мгновенной генерации свести их некому.
//
// ЧТО ДОЛЖЕН СДЕЛАТЬ ЭНДПОИНТ /api/kp/<id>/ — одно из двух:
//
//   а) считать price.kzt_total и breakdown.total из ОДНОГО расчёта, а
//      vehicle.price_kzt использовать как вход в этот расчёт, а не как
//      готовый ответ.  ← предпочтительно
//   б) если по бизнесу «Сумма, ₸» обязана оставаться прайсовой ценой из
//      карточки и может отличаться от расчёта — это меняет ДОКУМЕНТ, а не
//      только данные: странице нужны две разные подписи, чтобы человек
//      понимал, почему чисел два и чем они отличаются. Тогда возвращайтесь
//      с этим к вёрстке kp.html, а не подставляйте разные числа под
//      нынешние подписи.
//
// Чего делать НЕ НАДО: молча прислать два разных числа в надежде, что
// «примерно сойдётся». Ни kp.js, ни вёрстка расхождение не поймают.
//
// Проверка при приёмке: открыть /kp/<id> на технике, у которой price_kzt в
// каталоге заведомо не равен сумме расчёта, и убедиться, что «Сумма, ₸» и
// «ПОД КЛЮЧ В АЛМАТЫ» показывают одно и то же.
// ============================================================================
//
// ============================================================================
// ⚠ ВТОРОЕ: kp_pdf_url — ЕДИНСТВЕННОЕ ПОЛЕ КОНТРАКТА, КОТОРОГО В МОКЕ НЕТ
// ============================================================================
//
// На странице две кнопки скачивания, и они дают РАЗНЫЕ документы:
//
//   «СКАЧАТЬ С ПОДПИСЬЮ»    → официальный PDF: реквизиты продавца в шапке,
//                             печать и подпись компании внизу. Ровно тот
//                             файл, который сейчас собирает core/kp.py
//                             (build_kp_pdf) и который уходит письмом.
//   «СКАЧАТЬ КАК НА САЙТЕ»  → печать этой HTML-страницы средствами браузера.
//                             Без печати и подписи. Работает уже сейчас.
//
// Первую кнопку наполняет kp_pdf_url. Мок возвращает по нему null ВСЕГДА и
// намеренно: подписанный документ — это файл, который может выпустить
// только бэкенд. Подставить сюда печать страницы значило бы отдать
// неподписанную бумагу под видом подписанной, а по ней люди платят деньги.
// Пока поле null, kp.js держит кнопку выключенной с пометкой «скоро».
//
// ЧТО НУЖНО ОТ БЭКЕНДА. Заметьте: это НЕ часть JSON с данными КП, а
// отдельный файловый ресурс. JSON только указывает на него:
//
//   GET /api/kp/<id>/         → JSON (эта структура), где
//                               kp_pdf_url = "/api/kp/<id>/pdf/" | null
//   GET /api/kp/<id>/pdf/     → сам PDF (application/pdf), собранный
//                               build_kp_pdf() — байты, а не JSON
//
// null допустим и после появления эндпоинта: если для конкретной техники
// подписанный документ выпустить нельзя, поле остаётся пустым и страница
// сама покажет кнопку выключенной. Отдельного флага «недоступно» не нужно.
//
// Когда url начнёт приходить, kp.js сам передаст ему заливку primary, а
// печать страницы переведёт в обводку: официальный документ становится
// предпочтительным действием. Править для этого ничего не надо.
// ============================================================================

(function () {
  'use strict';

  // --- Фиксированная часть КП: значения по умолчанию из core/kp_defaults.py.
  // На бэкенде они правятся в админке (модель KPSettings), поэтому здесь
  // это именно значения по умолчанию, а не константы предметной области.
  const SELLER = {
    name: 'SHAANXI HEAVY DUTY AUTOMOBILE IMPORT AND EXPORT CO., LTD',
    address: 'CHINA, XIAN CITY, PROVINCE SHAANQI, JINGWEI INDUSTRIAL DISTRICT, ' +
             'SHAANQI AVE, ADMINISTRATIVE CENTER BLDG, 1 APT',
    bank: "CHINA ZHESHANG BANK XI'AN BRANCH",
    bank_address: 'TAIHUA JINMAO INTERNATIONAL. NO. 16. FENGHUI SOUTH ROAD, ' +
                  'YANTA DISTRICT, XIAN CITY, SHAANXI PROVINCE',
    account: '7910000011420100067269 (USD)',
    swift: 'ZJCBCN2NXXX'
  };

  const DELIVERY_TERMS = 'DAP, СВХ НУР ЖОЛЫ, КАЗАХСТАН.';

  const TIMELINE = [
    'Экспортная декларация и регистрация документов в таможенном органе Китая — 1 день.',
    'Постановка на электронную очередь для выезда из КПП Хоргос (Китай) — 1 день.',
    'Доставка до СВХ Нур Жолы, Казахстан — 1 день.',
    'Доставка до лаборатории (установка кнопки СОС, СБКТС и ЭПТС) и СВХ Алматы — 1 день.',
    'Регистрация и утверждение СБКТС — 2 дня.',
    'Проверка на соответствие экологическим стандартам ЕАЭС ЕВРО-5 — 3 дня.',
    'Подача пакета документов в ЦЭД, оплата НДС и пошлины — 2 дня.',
    'Подача документов в АО «Жасыл Даму» и оплата утильсбора — 1 день.',
    'Утверждённый ЭПТС — 1 день.',
    'Авто ЦОН — 1 день.'
  ];

  const SERVICE_CENTER =
    'Шахман Центр в Алматы (сервис-центр): ТОО «NOMADCORE», БИН 250440006291. ' +
    'Адрес: Казахстан, Алматинская область, Карасайский район, с.о. Әйтей, ' +
    'село Айтей, КХ АКХ Ленинский, строение 1995, индекс 040900.';

  // ==========================================================================
  // ВРЕМЕННЫЙ РАСЧЁТ. Всё, что ниже, уходит вместе с этим файлом.
  //
  // Считать разбивку на фронте — не решение, это заглушка: без неё страница
  // показывала бы одни и те же суммы для любой техники, и на такой странице
  // нельзя проверить ни вёрстку длинных списков, ни выравнивание табличных
  // цифр, ни поведение итога на узких экранах. Формулы и ставки взяты из
  // kz_calc_config.json и js/calculator.js — тех же, по которым считает
  // калькулятор, — чтобы моковые числа были правдоподобны, а не выдуманы.
  // Источником истины они не становятся: считать КП будет бэкенд.
  // ==========================================================================
  const CFG = {
    currency: { usd_kzt: 493.11, cny_kzt: 68.5 },
    taxes: { vat: 0.16, duty: 0.10 },
    mrp_2026: 4325,
    diesel: { liters: 200, price_kzt_per_l: 335 },
    fees: {
      plate: 16963, eptc: 50000, sbkts: 150000, sos: 100000,
      customs_fee: 25950, broker_service: 115000, red_corridor: 200000,
      adblue: 13500, driver: 65000, insurance: 16000, toll_road: 9000, svh: 91000
    }
  };

  // Сетка утильсбора по массе — getUtilCoefByWeight() из calculator.js.
  function utilCoef(weightT) {
    if (weightT <= 2.5) return 3.5;
    if (weightT <= 3.5) return 7.5;
    if (weightT <= 5) return 7.5;
    if (weightT <= 8) return 8.0;
    if (weightT <= 12) return 9.5;
    if (weightT <= 20) return 10.5;
    return 20.5;
  }

  // Первичная регистрация — getFirstRegRateByAge(), ветка обычного грузовика.
  function firstRegRate(age) {
    if (age <= 1) return 0.25;
    if (age === 2) return 240;
    if (age >= 3 && age <= 4) return 350;
    return 2500;
  }

  function buildBreakdown(v) {
    const rate = CFG.currency.usd_kzt;
    const f = CFG.fees;
    const r = Math.round;

    const priceUsd = Number(v.price_usd) || 0;
    const weightT = Number(v.weight_t) || 0;
    const age = Math.max(0, new Date().getFullYear() - (Number(v.year) || new Date().getFullYear()));

    const base = priceUsd * rate;
    const duty = base * CFG.taxes.duty;
    const vat = (base + duty + f.customs_fee) * CFG.taxes.vat;

    const mandatory = [
      ['ЭПТС', f.eptc],
      ['СБКТС', f.sbkts],
      ['Кнопка SOS', f.sos],
      ['Таможенный сбор', f.customs_fee],
      ['Услуги Брокера на СВХ', f.broker_service],
      ['СВХ', f.svh],
      ['Брокер на границе', 250 * rate],
      ['Коридор', f.red_corridor]
    ];

    const delivery = [
      ['Водитель', f.driver],
      ['Солярка', CFG.diesel.liters * CFG.diesel.price_kzt_per_l],
      ['AdBlue', f.adblue],
      ['Страховка', f.insurance],
      ['Платная дорога', f.toll_road]
    ];

    const util = 50 * CFG.mrp_2026 * utilCoef(weightT);
    const firstReg = firstRegRate(age) * CFG.mrp_2026;

    const utilRows = [
      ['Госномер и техпаспорт', f.plate],
      ['Первичная регистрация', r(firstReg)],
      [`Утилизационный сбор (${weightT} т)`, r(util)]
    ].filter(([, amount]) => amount > 0);

    const groups = [
      { title: 'Таможенная стоимость и платежи', rows: [
        ['ТС в тенге', r(base)],
        [`Пошлина (${Math.round(CFG.taxes.duty * 100)}%)`, r(duty)],
        ['НДС', r(vat)]
      ] },
      { title: 'Дополнительные расходы', rows: mandatory.map(([l, s]) => [l, r(s)]) },
      { title: 'Доставка и граница', rows: delivery.map(([l, s]) => [l, r(s)]) },
      { title: 'Утильсбор и регистрация', rows: utilRows }
    ];

    const total = groups.reduce(
      (sum, g) => sum + g.rows.reduce((s, [, amount]) => s + amount, 0), 0);

    return { currency: { ...CFG.currency }, groups, total };
  }
  // ===================== /ВРЕМЕННЫЙ РАСЧЁТ ==================================

  function vehicleTitle(v) {
    // _vehicle_title() из core/kp.py: body_type, иначе марка + модель;
    // категория впереди, если её ещё нет в названии; год в конце.
    let head = (v.body_type || '').trim();
    if (!head) head = [v.brand, v.model].filter(Boolean).join(' ').trim();
    const parts = [];
    if (v.category && !head.includes(v.category)) parts.push(v.category);
    if (head) parts.push(head);
    if (v.year) parts.push(String(v.year));
    return parts.join(' ').trim() || 'Транспортное средство';
  }

  function vehicleSpecs(v) {
    // _vehicle_specs(): те же поля в том же порядке; пустые не выводятся.
    return [
      ['Марка / модель', [v.brand, v.model].filter(Boolean).join(' ').trim()],
      ['Категория', v.category],
      ['Год выпуска', v.year],
      ['Колёсная формула', v.wheel_formula],
      ['Полная масса, т', v.weight_t],
      ['Грузоподъёмность, т', v.load_capacity_t],
      ['Мощность двигателя, л.с.', v.engine_power_hp],
      ['КПП', v.gearbox]
    ]
      .filter(([, value]) => value !== null && value !== undefined && value !== '' && value !== 0)
      .map(([label, value]) => ({ label, value: String(value) }));
  }

  const AVAIL_NOTE = {
    in_stock: 'Техника в наличии, готова к отгрузке.',
    on_order: 'Под заказ: срок поставки — по срокам ниже.',
    in_transit: 'Техника в пути.',
    out_of_stock: ''
  };

  // Собрать КП из карточки техники (ответ /api/vehicles/<id>/).
  function buildFromVehicle(v) {
    const breakdown = buildBreakdown(v);
    const qty = 1;
    const photo = v.image_url || (Array.isArray(v.images) && v.images[0]) || '';

    return {
      number: `КП-${v.id}`,
      date: new Date().toISOString().slice(0, 10),
      buyer_name: '',
      seller: { ...SELLER },
      vehicle: {
        id: v.id,
        title: vehicleTitle(v),
        photo_url: photo,
        extra_info: v.extra_info || '',
        specs: vehicleSpecs(v)
      },
      quantity: qty,
      price: {
        usd: Number(v.price_usd) || null,
        cny: Number(v.price_cny) || null,
        // ⚠ Одно число на оба места в документе — намеренно, и это НЕ то же
        // самое, что делает core/kp.py (там ячейка берётся из
        // vehicle.price_kzt, а разбивка из сделки). Полностью — в блоке
        // «ОГОВОРКА» в шапке файла; прочитайте его перед тем, как заменять
        // мок реальным ответом.
        kzt_total: breakdown.total * qty
      },
      availability_note: AVAIL_NOTE[v.availability] || '',
      breakdown,
      delivery_terms: DELIVERY_TERMS,
      timeline: TIMELINE.slice(),
      service_center: SERVICE_CENTER,
      // Всегда null — см. «⚠ ВТОРОЕ» в шапке файла. Подписанный PDF мок
      // выдать не может и не должен; кнопка «с подписью» остаётся
      // выключенной, пока это поле не начнёт приходить с бэкенда.
      kp_pdf_url: null
    };
  }

  window.CMKPMock = { buildFromVehicle };
})();
