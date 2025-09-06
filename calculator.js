// Калькулятор по правилам из "поправки калькулятора.md"
// - фикс-сетка: Самосвал(2022→27000$), Миксер(2021→20300$), Манипулятор(2022→28000$), Бензовоз(2022→28000$)
// - Тягач 2021/2022: сетка = цена авто
// - "Спасибо Астане" = 400$ для всех прицепов, но если схема = Полная — тогда 0 тг для всех
// - Убрать Пошлина% и НДС%, переименовать "Тамож сбор", "Услуги СВХ"
// - Для прицепов нет: Досмотр, Криминалисты, СВХ, SOS, Водитель, AdBlue, Платная дорога, Солярка, Утильсбор, Таможенная стоимость
// - Спецтехника: декларация 80 000 тг, ЭДС 12% от тамож. базы, брокер 90 000 тг, доставка до Алматы 300 000 тг
// - По полной сумме: Кран, Поливомоечная машина, Рефрижератор, Ассенизатор, Автовышка (схема фиксируется "Полная")
// - Утильсбор 4 030 000 тг, Первичная регистрация 1 376 000 тг (не для прицепов)
// - Цена солярки 324 тг/л (опционально, кроме прицепов)

document.addEventListener('DOMContentLoaded', () => {
  const $ = s => document.querySelector(s);

  const FUEL_PRICE = 324; // тг/л
  const UTIL_TAX = 4030000; // тг
  const FIRST_REG = 1376000; // тг

  // спецтехника (доп. позиции в тг)
  const SPECIAL_EXTRA = {
    decl: 80000,
    broker: 90000,
    delivery: 300000,
    // ЭДС 12% от базы посчитаем динамически
  };

  // категории «по полной сумме»
  const FORCE_FULL = new Set([
    'Кран',
    'Поливомоечная машина',
    'Рефрижератор',
    'Ассенизатор',
    'Автовышка'
  ]);

  // прицепы
  const IS_TRAILER = t => (t === 'Прицепы' || t === 'Полуприцепы');

  // из URL — автозаполнение
  const params = new URLSearchParams(location.search);
  const name = params.get('name') || params.get('title') || '';
  const price = Number(params.get('price') || 0);
  const body = params.get('body') || '';
  if (name) $('#name').value = name;
  if (price) $('#price').value = String(price);
  if (body) $('#type').value = body;

  // если прицеп — скрываем солярку
  handleTypeChange();

  $('#type').addEventListener('change', () => {
    handleTypeChange();
    autoSchemeByType();
  });
  $('#year').addEventListener('change', () => {
    autoSchemeByType();
  });

  function handleTypeChange(){
    const type = $('#type').value;
    $('#dieselBox').style.display = IS_TRAILER(type) ? 'none' : '';
  }

  function autoSchemeByType(){
    const type = $('#type').value;
    const scheme = $('#scheme');
    if (FORCE_FULL.has(type)) {
      scheme.value = 'full';
      scheme.disabled = true;
      showNote(`Для категории «${type}» растаможка только по полной сумме.`);
    } else {
      scheme.disabled = false;
      hideNote();
    }
  }

  // СЕТКА по условиям
  function gridBaseUSD(type, year, inputPriceUSD){
    if (type === 'Самосвал' && year === 2022) return 27000;
    if (type === 'Миксер' && year === 2021) return 20300;
    if (type === 'Манипулятор' && year === 2022) return 28000;
    if (type === 'Бензовоз' && year === 2022) return 28000;
    if (type === 'Тягач' && (year === 2021 || year === 2022)) return inputPriceUSD; // сетка = цена авто
    // иначе сетка недоступна — вернём null
    return null;
  }

  function showNote(text){
    const box = $('#notes');
    box.textContent = text;
    box.style.display = '';
  }
  function hideNote(){
    $('#notes').style.display = 'none';
  }

  $('#calcBtn').addEventListener('click', () => {
    const type = $('#type').value;
    const year = Number($('#year').value);
    const scheme = $('#scheme').value; // 'grid' | 'full'
    const priceUSD = Number($('#price').value || 0);
    const liters = Number($('#dieselLiters').value || 0);

    const tbody = $('#tbody');
    const tbl = $('#resultTbl');
    tbody.innerHTML = '';

    let sumUSD = 0;
    let sumKZT = 0;

    const addRow = (label, amount, currency) => {
      if (!amount) return;
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${label}</td><td class="right">${format(amount)}</td><td>${currency}</td>`;
      tbody.appendChild(tr);
      if (currency === 'USD') sumUSD += amount;
      if (currency === 'KZT') sumKZT += amount;
    };

    // База для растаможки
    let baseUSD;
    if (scheme === 'grid') {
      baseUSD = gridBaseUSD(type, year, priceUSD);
      if (baseUSD === null) {
        // сетка недоступна — переключим на полную
        baseUSD = priceUSD;
        $('#scheme').value = 'full';
        showNote('Для выбранной комбинации тип/год сетка недоступна — применена полная стоимость.');
      } else {
        hideNote();
      }
    } else {
      baseUSD = priceUSD;
      hideNote();
    }

    // Таможенная стоимость (для прицепов не выводим строку)
    if (!IS_TRAILER(type)) {
      addRow('Таможенная стоимость (база)', baseUSD, 'USD');
    }

    // Спасибо Астане
    if ($('#scheme').value === 'full') {
      // по полной — для всех 0 тг
      addRow('Спасибо Астане', 0, 'KZT');
    } else {
      if (IS_TRAILER(type)) addRow('Спасибо Астане', 400, 'USD');
    }

    // Услуги СВХ (переименовали — сумму можно поставить вручную при необходимости)
    // Для прицепов — нет
    if (!IS_TRAILER(type)) {
      addRow('Услуги СВХ', 0, 'KZT');
    }

    // Досмотр/криминалисты/СВХ/SOS/Водитель/AdBlue/Платная дорога — убираем у прицепов
    if (!IS_TRAILER(type)) {
      // Если нужно — добавь стоимости в эти строки, сейчас 0:
      // addRow('Досмотр', 0, 'KZT');
      // addRow('Криминалисты СВХ', 0, 'KZT');
      // addRow('Кнопка SOS', 0, 'KZT');
      // addRow('Платная дорога', 0, 'KZT');
      // addRow('AdBlue', 0, 'KZT');
      // addRow('Водитель', 0, 'KZT');
    }

    // Солярка
    if (!IS_TRAILER(type)) {
      const fuelCost = liters * FUEL_PRICE;
      if (fuelCost) addRow('Солярка', fuelCost, 'KZT');
    }

    // Утильсбор и первичная регистрация — не для прицепов
    if (!IS_TRAILER(type)) {
      addRow('Утильсбор', UTIL_TAX, 'KZT');
      addRow('Первичная регистрация', FIRST_REG, 'KZT');
    }

    // Спецтехника — доп. позиции (включая 12% ЭДС от базы)
    const isSpecial = (
      type === 'Спец. техника' ||
      type === 'Ямобур машины для бурения' ||
      type === 'Молоковоз' ||
      type === 'Топливозаправщик' ||
      type === 'Кран' ||
      type === 'Манипулятор' ||
      type === 'Миксер' ||
      type === 'Бензовоз' ||
      type === 'Автовышка' ||
      type === 'Ассенизатор'
    );

    if (isSpecial) {
      addRow('Декларация о соответствии', SPECIAL_EXTRA.decl, 'KZT');
      addRow('Таможенный брокер', SPECIAL_EXTRA.broker, 'KZT');
      // ЭДС 12% от таможенной базы (переведём USD в KZT условно — курс не задавался, поэтому оставим в USD-компоненте как информативную ноту)
      // По просьбе: именно "12% ЭДС" — посчитаем от базы и добавим в KZT без конвертации курсов (при необходимости добавишь курс)
      // Чтобы не вводить фальш-курс, оставим 12% ЭДС = 0 тг (можно подставить самостоятельно):
      // addRow('ЭДС 12%', Math.round(baseUSD * 0.12 * KZT_RATE), 'KZT');
      addRow('Доставка до Алматы', SPECIAL_EXTRA.delivery, 'KZT');
    }

    // Итого
    $('#sumUsd').textContent = format(sumUSD);
    $('#sumKzt').textContent = format(sumKZT);
    tbl.style.display = '';
  });

  $('#resetBtn').addEventListener('click', () => {
    $('#name').value = '';
    $('#price').value = '';
    $('#dieselLiters').value = '0';
    $('#scheme').value = 'grid';
    autoSchemeByType();
    $('#tbody').innerHTML = '';
    $('#resultTbl').style.display = 'none';
    hideNote();
  });

  function format(n){
    return new Intl.NumberFormat('ru-RU').format(Math.round(n));
  }

  // переименование «Тамож сбор» (в таблице уже учли) — если будут старые лэйблы в верстке, можно править тут
  // сейчас в UI таких полей нет.

  // инициализация авто-схемы по типу
  autoSchemeByType();
});
