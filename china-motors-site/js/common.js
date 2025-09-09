// /js/common.js — i18n (RU/KZ/中文/EN) + тема + сервисный код (burger, SW, Tawk.to, lazy)
(() => {
  const LS_LANG = 'lang';
  const LS_THEME = 'theme';

  // ---------- СЛОВАРИ ----------
  const translations = {
    ru: {
      // NAV
      nav_home: 'Главная',
      nav_catalog: 'Каталог',
      nav_services: 'Услуги',
      nav_contacts: 'Контакты',
      nav_calculator: 'Калькулятор',

      // COMMON
      brand_title: 'China Motors',
      hero_title_main: 'China Motors',
      hero_tagline: 'Спецтехника и авто из Китая — надежность и качество',
      footer_col1_text: 'Надежная техника из Китая под заказ и в наличии.',
      footer_col2_title: 'Навигация',
      footer_col3_title: 'Контакты',
      footer_copy: '© 2025 China Motors. Все права защищены.',
      footer_devnote: 'Сайт в стадии разработки — обновления будут.',
      btn_photos: 'Фотографии',
      btn_calculate: 'Рассчитать',
      btn_send: 'Отправить',
      btn_refresh_rate: 'Обновить курс',
      search_placeholder: 'Поиск...',

      // INDEX
      about_title: 'О нас',
      about_p1: 'China Motors — ваш надежный партнер в поставке автомобилей и спецтехники из Китая города Хоргос. С 2024 года мы предлагаем качественные машины и профессиональные услуги по доставке и таможенному оформлению.',
      about_p2: 'Наша миссия — обеспечить клиентов современной техникой по доступным ценам с гарантией качества.',
      about_card1_t: 'Широкий выбор техники',
      about_card1_d: 'От легковых авто до тяжелой спецтехники.',
      about_card2_t: 'Индивидуальный подход',
      about_card2_d: 'Учитываем все пожелания клиентов.',
      about_card3_t: 'Надежная доставка',
      about_card3_d: 'С Хоргоса до города Алматы.',
      about_card4_t: 'Прозрачное оформление',
      about_card4_d: 'Полное сопровождение документов.',
      about_card5_t: 'Цена',
      about_card5_d: 'Низкая наценка.',
      gallery_title: 'Галерея',
      gallery_cap1: 'Прицепы',
      gallery_cap2: 'Полуприцепы',
      gallery_cap3: 'Тралы',
      gallery_cap4: 'Самосвалы',
      gallery_cap5: 'Тягачи',
      gallery_cap6: 'Спецтехника',
      gallery_cap7: 'Другие машины под заказ',
      reviews_title: 'Отзывы',
      reviews_title1: 'Техника у клиента',
      reviews_title2: 'Клиент с новым автомобилем',
      reviews_title3: 'Отзыв клиента о доставке тягача',

      // CATALOG
      title_catalog: 'China Motors - Каталог',
      catalog_hero: 'Актуальные предложения из базы',
      filter_body_label: 'Тип транспорта',
      filter_sort_label: 'Сортировка',
      sort_none: 'Без сортировки',
      sort_price_asc: 'Цена ↑',
      sort_price_desc: 'Цена ↓',
      card_body_label: 'Конструкция:',
      price_on_request: 'Цена по запросу',

      // SERVICES
      title_services: 'China Motors - Услуги',
      services_hero: 'Наши услуги',
      services_tagline: 'Комплексные решения для поставки и обслуживания техники',
      services_title: 'Услуги',
      service_1_t: 'Заказ и поставка',
      service_1_d: 'Автомобили и спецтехника из Китая под ваши нужды.',
      service_2_t: 'Таможенное оформление',
      service_2_d: 'Помощь с таможенной очисткой.',
      service_3_t: 'Доставка',
      service_3_d: 'Доставка с Хоргоса в Алматы (Платные водители).',
      service_4_t: 'Гос. номер',
      service_4_d: 'Помощь с получением Гос. номера.',

      // CALCULATOR
      title_calculator: 'China Motors - Калькулятор',
      calculator_hero: 'Калькулятор',
      calculator_tagline: 'Прозрачный расчёт: видно «за что платим» без лишних деталей.',
      calc_page_title: 'Калькулятор стоимости',
      calc_in_title: 'Входные данные',
      calc_in_name_label: 'Модель / комплектация',
      calc_in_name_ph: 'Например: Тягач 2022 года',
      calc_in_price_label: 'Цена авто, $',
      calc_in_price_ph: '59165',
      calc_in_type_label: 'Тип транспорта',
      calc_in_rate_label: 'Курс $ → ₸',
      calc_rate_info: 'Курс НБ РК: —',
      calc_real_title: '1) Реальная стоимость',
      calc_real_hint: 'Цена авто в тенге = Цена($) × Курс',
      calc_ts_title: '2) Таможенная стоимость',
      calc_ts_mode: 'Способ расчёта ТС',
      calc_mode_byprice: 'По полной цене',
      calc_mode_grid: 'Сетка (год)',
      calc_mode_fixed: 'Фиксированная сетка',
      calc_ts_usd_manual: 'ТС, $ (для «Фиксированной сетки»)',
      calc_ts_year_label: 'Год (для «Сетка (год)»)',
      calc_ts_year_usd: 'Фиксированная сумма ТС, $',
      calc_ts_bill_title: 'Таможенные платежи',
      calc_ts_bill_ts: 'ТС в тенге',
      calc_ts_bill_duty: 'Пошлина',
      calc_ts_bill_vat: 'НДС',
      calc_mand_title: '3) Дополнительные расходы',
      calc_mand_note: 'Фиксируется по типу транспорта и выбранному режиму ТС.',
      calc_mand_list_title: 'За что платим',
      calc_ship_title: '4) Доставка и граница',
      calc_ship_list_title: 'Состав доставки',
      calc_util_title: '5) Утилизационный сбор и регистрация',
      calc_util_list_title: 'Государственные платежи',
      aside_title: 'Итоговая стоимость',
      aside_base: 'База для расчёта:',
      aside_customs: 'Таможенные платежи:',
      aside_mand: 'Дополнительные расходы:',
      aside_border: 'Доставка и граница:',
      aside_util: 'Утиль/регистрация:',
      aside_total: 'ИТОГО:',
      aside_usd: '≈ — USD',
      aside_btn_calc: 'Рассчитать',
      aside_btn_apply: 'Оформить заявку',

      // CONTACTS
      title_contacts: 'China Motors - Контакты',
      contacts_hero: 'Контакты',
      contacts_tagline: 'Свяжитесь с нами удобным способом',
      contact_title: 'Оставьте заявку',
      contact_name_label: 'Ваше имя',
      contact_name_ph: 'Введите имя',
      contact_phone_label: 'Телефон',
      contact_phone_ph: '+7 (___) ___-__-__',
      contact_msg_label: 'Сообщение',
      contact_msg_ph: 'Ваше сообщение',
      contact_note: 'После нажатия «Отправить» заявка сразу попадёт нам в Telegram',

      // JS messages
      js_price_on_request: 'Цена по запросу',
      js_form_err_phone: 'Укажите корректный телефон',
      js_form_err_msg: 'Добавьте сообщение',
      js_form_sending: 'Отправляем...',
      js_form_sent_ok: 'Заявка отправлена! Свяжемся с вами.',
      js_form_sent_fail: 'Ошибка отправки. Попробуйте позже.',
    },

    kk: {
      reviews_title1: 'Клиент орнындағы жабдық',
      reviews_title2: 'Жаңа көлігі бар тұтынушы',
      reviews_title3: 'Жүк көлігін жеткізу туралы тұтынушылардың кері байланысы',
      nav_home: 'Басты бет',
      nav_catalog: 'Каталог',
      nav_services: 'Қызметтер',
      nav_contacts: 'Байланыс',
      nav_calculator: 'Калькулятор',

      brand_title: 'China Motors',
      hero_title_main: 'China Motors',
      hero_tagline: 'Қытайдан арнайы техника мен автомобильдер — сенімділік пен сапа',
      footer_col1_text: 'Қытайдан тапсырыспен және қолжетімді техника.',
      footer_col2_title: 'Навигация',
      footer_col3_title: 'Байланыс',
      footer_copy: '© 2025 China Motors. Барлық құқықтар қорғалған.',
      footer_devnote: 'Сайт әзірлену үстінде — жаңартулар болады.',
      btn_photos: 'Фотосуреттер',
      btn_calculate: 'Есептеу',
      btn_send: 'Жіберу',
      btn_refresh_rate: 'Курсты жаңарту',
      search_placeholder: 'Іздеу...',

      about_title: 'Біз туралы',
      about_p1: 'China Motors — Қорғас қаласынан Қытай техникасын жеткізетін сенімді серіктес. 2024 жылдан бері сапалы көліктер мен кедендік рәсімдеуге көмектесеміз.',
      about_p2: 'Миссиямыз — клиенттерді қолжетімді бағамен сапалы техникамен қамтамасыз ету.',
      about_card1_t: 'Кең таңдау',
      about_card1_d: 'Жеңіл автодан ауыр техникаға дейін.',
      about_card2_t: 'Жеке тәсіл',
      about_card2_d: 'Клиент қалауы ескеріледі.',
      about_card3_t: 'Сенімді жеткізу',
      about_card3_d: 'Қорғастан Алматыға дейін.',
      about_card4_t: 'Мөлдір рәсімдеу',
      about_card4_d: 'Құжаттарды толық сүйемелдеу.',
      about_card5_t: 'Баға',
      about_card5_d: 'Төмен үстеме.',
      gallery_title: 'Галерея',
      gallery_cap1: 'Тіркемелер',
      gallery_cap2: 'Жартылай тіркемелер',
      gallery_cap3: 'Тралдар',
      gallery_cap4: 'Самосвалдар',
      gallery_cap5: 'Тягачтар',
      gallery_cap6: 'Арнайы техника',
      gallery_cap7: 'Тапсырыспен басқа көліктер',

      title_catalog: 'China Motors - Каталог',
      catalog_hero: 'Деректер базасындағы өзекті ұсыныстар',
      filter_body_label: 'Көлік түрі',
      filter_sort_label: 'Сұрыптау',
      sort_none: 'Сұрыптаусыз',
      sort_price_asc: 'Баға ↑',
      sort_price_desc: 'Баға ↓',
      card_body_label: 'Құрылымы:',
      price_on_request: 'Баға сұраныс бойынша',

      title_services: 'China Motors - Қызметтер',
      services_hero: 'Біздің қызметтер',
      services_tagline: 'Жеткізу және қызмет көрсетуге кешенді шешімдер',
      services_title: 'Қызметтер',
      service_1_t: 'Тапсырыс және жеткізу',
      service_1_d: 'Қажетіңізге сай Қытайдан техника.',
      service_2_t: 'Кедендік рәсімдеу',
      service_2_d: 'Кедендік рәсімдеуге көмек.',
      service_3_t: 'Жеткізу',
      service_3_d: 'Қорғастан Алматыға (ақылы жүргізушілер).',
      service_4_t: 'Мем. нөмір',
      service_4_d: 'Мемлекеттік нөмір алуға көмек.',

      title_calculator: 'China Motors - Калькулятор',
      calculator_hero: 'Калькулятор',
      calculator_tagline: 'Артық мәліметсіз төлем құрамы көрінеді.',
      calc_page_title: 'Құн калькуляторы',
      calc_in_title: 'Енгізу деректері',
      calc_in_name_label: 'Модель / жабдықталымы',
      calc_in_name_ph: 'Мысалы: Тягач 2022',
      calc_in_price_label: 'Көлік бағасы, $',
      calc_in_price_ph: '59165',
      calc_in_type_label: 'Көлік түрі',
      calc_in_rate_label: 'Курс $ → ₸',
      calc_rate_info: 'ҰБК курсы: —',
      calc_real_title: '1) Нақты құн',
      calc_real_hint: 'Теңгедегі баға = $ × курс',
      calc_ts_title: '2) Кедендік құн',
      calc_ts_mode: 'Кеден әдісі',
      calc_mode_byprice: 'Толық бағамен',
      calc_mode_grid: 'Тор (жыл)',
      calc_mode_fixed: 'Бекітілген тор',
      calc_ts_usd_manual: 'Кеден $, «Бекітілген тор» үшін',
      calc_ts_year_label: 'Жыл (Тор үшін)',
      calc_ts_year_usd: 'Бекітілген сома, $',
      calc_ts_bill_title: 'Кеден төлемдері',
      calc_ts_bill_ts: 'Кедендік құн (₸)',
      calc_ts_bill_duty: 'Баж',
      calc_ts_bill_vat: 'ҚҚС',
      calc_mand_title: '3) Қосымша шығындар',
      calc_mand_note: 'Көлік түрі және әдіске тәуелді.',
      calc_mand_list_title: 'Төлем құрамы',
      calc_ship_title: '4) Жеткізу және шекара',
      calc_ship_list_title: 'Құрамы',
      calc_util_title: '5) Утильалым және тіркеу',
      calc_util_list_title: 'Мемлекеттік төлемдер',
      aside_title: 'Жалпы құн',
      aside_base: 'Есеп негізі:',
      aside_customs: 'Кеден төлемдері:',
      aside_mand: 'Қосымша шығындар:',
      aside_border: 'Жеткізу және шекара:',
      aside_util: 'Утиль/тіркеу:',
      aside_total: 'ЖИЫНТЫҚ:',
      aside_usd: '≈ — USD',
      aside_btn_calc: 'Есептеу',
      aside_btn_apply: 'Өтінім беру',

      title_contacts: 'China Motors - Байланыс',
      contacts_hero: 'Байланыс',
      contacts_tagline: 'Бізбен ыңғайлы тәсілмен байланысыңыз',
      contact_title: 'Өтінім қалдырыңыз',
      contact_name_label: 'Атыңыз',
      contact_name_ph: 'Атыңызды енгізіңіз',
      contact_phone_label: 'Телефон',
      contact_phone_ph: '+7 (___) ___-__-__',
      contact_msg_label: 'Хабарлама',
      contact_msg_ph: 'Сіздің хабарламаңыз',
      contact_note: '«Жіберу» батырмасынан кейін өтінім Telegram-ға түседі',

      js_price_on_request: 'Баға сұраныс бойынша',
      js_form_err_phone: 'Дұрыс телефон нөмірін көрсетіңіз',
      js_form_err_msg: 'Хабарлама қосыңыз',
      js_form_sending: 'Жіберілуде...',
      js_form_sent_ok: 'Өтінім жіберілді! Байланысамыз.',
      js_form_sent_fail: 'Жіберу қатесі. Кейінірек көріңіз.',
    },

    zh: {
      reviews_title1: '客户处设备',
      reviews_title2: '新车客户',
      reviews_title3: '客户对卡车送货的反馈',
      nav_home: '首页',
      nav_catalog: '目录',
      nav_services: '服务',
      nav_contacts: '联系',
      nav_calculator: '计算器',

      brand_title: 'China Motors',
      hero_title_main: 'China Motors',
      hero_tagline: '来自中国的专用设备和汽车——可靠与质量',
      footer_col1_text: '来自中国的可靠设备，可现货或订购。',
      footer_col2_title: '导航',
      footer_col3_title: '联系方式',
      footer_copy: '© 2025 China Motors. 保留所有权利。',
      footer_devnote: '网站建设中——将持续更新。',
      btn_photos: '照片',
      btn_calculate: '计算',
      btn_send: '发送',
      btn_refresh_rate: '刷新汇率',
      search_placeholder: '搜索…',

      about_title: '关于我们',
      about_p1: 'China Motors——来自中国霍尔果斯的车辆与专用设备供应商。自2024年起，我们提供高质量车辆并协助清关与运输。',
      about_p2: '我们的使命是以合理价格为客户提供高品质设备并保证质量。',
      about_card1_t: '选择丰富',
      about_card1_d: '从乘用车到重型设备。',
      about_card2_t: '个性化服务',
      about_card2_d: '充分考虑客户需求。',
      about_card3_t: '可靠运输',
      about_card3_d: '从霍尔果斯到阿拉木图。',
      about_card4_t: '透明办理',
      about_card4_d: '全流程文件支持。',
      about_card5_t: '价格',
      about_card5_d: '较低加价。',
      gallery_title: '画廊',
      gallery_cap1: '挂车',
      gallery_cap2: '半挂车',
      gallery_cap3: '拖车',
      gallery_cap4: '自卸车',
      gallery_cap5: '牵引车',
      gallery_cap6: '专用设备',
      gallery_cap7: '其他订制车辆',

      title_catalog: 'China Motors - 目录',
      catalog_hero: '数据库中的最新优惠',
      filter_body_label: '车型',
      filter_sort_label: '排序',
      sort_none: '无排序',
      sort_price_asc: '价格 ↑',
      sort_price_desc: '价格 ↓',
      card_body_label: '车身：',
      price_on_request: '价格面议',

      title_services: 'China Motors - 服务',
      services_hero: '我们的服务',
      services_tagline: '设备供应与维护一体化方案',
      services_title: '服务',
      service_1_t: '订购与供应',
      service_1_d: '按需从中国采购车辆与设备。',
      service_2_t: '清关',
      service_2_d: '协助海关手续。',
      service_3_t: '运输',
      service_3_d: '从霍尔果斯到阿拉木图（付费司机）。',
      service_4_t: '车牌',
      service_4_d: '协助办理车牌。',

      title_calculator: 'China Motors - 计算器',
      calculator_hero: '计算器',
      calculator_tagline: '透明计算：清晰展示费用结构。',
      calc_page_title: '成本计算器',
      calc_in_title: '输入数据',
      calc_in_name_label: '车型 / 配置',
      calc_in_name_ph: '例如：2022年牵引车',
      calc_in_price_label: '车辆价格, $',
      calc_in_price_ph: '59165',
      calc_in_type_label: '车型',
      calc_in_rate_label: '汇率 $ → ₸',
      calc_rate_info: '哈萨克国家银行汇率：—',
      calc_real_title: '1) 实际成本',
      calc_real_hint: '以坚戈计价 = 美元 × 汇率',
      calc_ts_title: '2) 海关计价',
      calc_ts_mode: '计价方式',
      calc_mode_byprice: '按全价',
      calc_mode_grid: '按年网格',
      calc_mode_fixed: '固定网格',
      calc_ts_usd_manual: '固定网格的计价, $',
      calc_ts_year_label: '年份（网格）',
      calc_ts_year_usd: '固定金额, $',
      calc_ts_bill_title: '关税费用',
      calc_ts_bill_ts: '海关计价(₸)',
      calc_ts_bill_duty: '关税',
      calc_ts_bill_vat: '增值税',
      calc_mand_title: '3) 额外费用',
      calc_mand_note: '取决于车型与计价模式。',
      calc_mand_list_title: '费用构成',
      calc_ship_title: '4) 运输与边境',
      calc_ship_list_title: '组成',
      calc_util_title: '5) 回收费与注册',
      calc_util_list_title: '政府费用',
      aside_title: '总计',
      aside_base: '计算基数：',
      aside_customs: '关税费用：',
      aside_mand: '额外费用：',
      aside_border: '运输与边境：',
      aside_util: '回收费/注册：',
      aside_total: '合计：',
      aside_usd: '≈ — USD',
      aside_btn_calc: '计算',
      aside_btn_apply: '提交申请',

      title_contacts: 'China Motors - 联系',
      contacts_hero: '联系',
      contacts_tagline: '以便捷方式与我们联系',
      contact_title: '提交申请',
      contact_name_label: '您的姓名',
      contact_name_ph: '请输入姓名',
      contact_phone_label: '电话',
      contact_phone_ph: '+7 (___) ___-__-__',
      contact_msg_label: '信息',
      contact_msg_ph: '您的信息',
      contact_note: '点击“发送”后，申请会直接到我们的Telegram',

      js_price_on_request: '价格面议',
      js_form_err_phone: '请输入正确的电话号码',
      js_form_err_msg: '请填写消息',
      js_form_sending: '发送中...',
      js_form_sent_ok: '已发送！我们会联系您。',
      js_form_sent_fail: '发送失败，请稍后再试。',
    },

    en: {
      reviews_title1: 'Equipment at the clients place',
      reviews_title2: 'Customer with a new car',
      reviews_title3: 'Customer feedback on truck delivery',
      nav_home: 'Home',
      nav_catalog: 'Catalog',
      nav_services: 'Services',
      nav_contacts: 'Contacts',
      nav_calculator: 'Calculator',

      brand_title: 'China Motors',
      hero_title_main: 'China Motors',
      hero_tagline: 'Equipment and cars from China — reliable and high-quality',
      footer_col1_text: 'Reliable vehicles from China — in stock and on order.',
      footer_col2_title: 'Navigation',
      footer_col3_title: 'Contacts',
      footer_copy: '© 2025 China Motors. All rights reserved.',
      footer_devnote: 'Website under development — updates coming.',
      btn_photos: 'Photos',
      btn_calculate: 'Calculate',
      btn_send: 'Send',
      btn_refresh_rate: 'Refresh rate',
      search_placeholder: 'Search...',

      about_title: 'About us',
      about_p1: 'China Motors is your reliable partner for sourcing cars and special equipment from Khorgos, China. Since 2024 we provide quality vehicles and professional logistics & customs support.',
      about_p2: 'Our mission is to deliver modern equipment at fair prices with guaranteed quality.',
      about_card1_t: 'Wide selection',
      about_card1_d: 'From passenger cars to heavy equipment.',
      about_card2_t: 'Personal approach',
      about_card2_d: 'We consider all client requirements.',
      about_card3_t: 'Reliable delivery',
      about_card3_d: 'From Khorgos to Almaty.',
      about_card4_t: 'Transparent paperwork',
      about_card4_d: 'Full document support.',
      about_card5_t: 'Price',
      about_card5_d: 'Low markup.',
      gallery_title: 'Gallery',
      gallery_cap1: 'Trailers',
      gallery_cap2: 'Semi-trailers',
      gallery_cap3: 'Lowboys',
      gallery_cap4: 'Dump trucks',
      gallery_cap5: 'Tractors',
      gallery_cap6: 'Special equipment',
      gallery_cap7: 'Other vehicles on request',
      reviews_title: 'Reviews',

      title_catalog: 'China Motors - Catalog',
      catalog_hero: 'Latest offers from the database',
      filter_body_label: 'Vehicle type',
      filter_sort_label: 'Sort',
      sort_none: 'No sorting',
      sort_price_asc: 'Price ↑',
      sort_price_desc: 'Price ↓',
      card_body_label: 'Body:',
      price_on_request: 'Price on request',

      title_services: 'China Motors - Services',
      services_hero: 'Our services',
      services_tagline: 'End-to-end solutions for supply and maintenance',
      services_title: 'Services',
      service_1_t: 'Ordering & supply',
      service_1_d: 'Vehicles and equipment from China for your needs.',
      service_2_t: 'Customs clearance',
      service_2_d: 'Assistance with customs procedures.',
      service_3_t: 'Delivery',
      service_3_d: 'From Khorgos to Almaty (paid drivers).',
      service_4_t: 'License plate',
      service_4_d: 'Assistance with plate issuance.',

      title_calculator: 'China Motors - Calculator',
      calculator_hero: 'Calculator',
      calculator_tagline: 'Transparent breakdown: see what you pay for.',
      calc_page_title: 'Cost calculator',
      calc_in_title: 'Input data',
      calc_in_name_label: 'Model / configuration',
      calc_in_name_ph: 'e.g., Tractor 2022',
      calc_in_price_label: 'Vehicle price, $',
      calc_in_price_ph: '59165',
      calc_in_type_label: 'Vehicle type',
      calc_in_rate_label: 'Rate $ → ₸',
      calc_rate_info: 'NBK official rate: —',
      calc_real_title: '1) Actual cost',
      calc_real_hint: 'Price in KZT = USD × Rate',
      calc_ts_title: '2) Customs value',
      calc_ts_mode: 'Customs mode',
      calc_mode_byprice: 'By full price',
      calc_mode_grid: 'Grid (year)',
      calc_mode_fixed: 'Fixed grid',
      calc_ts_usd_manual: 'Customs, $ (for Fixed grid)',
      calc_ts_year_label: 'Year (for Grid)',
      calc_ts_year_usd: 'Fixed amount, $',
      calc_ts_bill_title: 'Customs charges',
      calc_ts_bill_ts: 'Customs value (₸)',
      calc_ts_bill_duty: 'Duty',
      calc_ts_bill_vat: 'VAT',
      calc_mand_title: '3) Additional expenses',
      calc_mand_note: 'Depends on vehicle type and chosen mode.',
      calc_mand_list_title: 'Breakdown',
      calc_ship_title: '4) Delivery & border',
      calc_ship_list_title: 'Delivery includes',
      calc_util_title: '5) Recycling fee & registration',
      calc_util_list_title: 'Government payments',
      aside_title: 'Total cost',
      aside_base: 'Base:',
      aside_customs: 'Customs:',
      aside_mand: 'Additional:',
      aside_border: 'Delivery & border:',
      aside_util: 'Recycling/registration:',
      aside_total: 'TOTAL:',
      aside_usd: '≈ — USD',
      aside_btn_calc: 'Calculate',
      aside_btn_apply: 'Submit request',

      title_contacts: 'China Motors - Contacts',
      contacts_hero: 'Contacts',
      contacts_tagline: 'Contact us in a convenient way',
      contact_title: 'Leave a request',
      contact_name_label: 'Your name',
      contact_name_ph: 'Enter your name',
      contact_phone_label: 'Phone',
      contact_phone_ph: '+7 (___) ___-__-__',
      contact_msg_label: 'Message',
      contact_msg_ph: 'Your message',
      contact_note: 'After clicking “Send”, your request goes to our Telegram',

      js_price_on_request: 'Price on request',
      js_form_err_phone: 'Enter a valid phone number',
      js_form_err_msg: 'Add a message',
      js_form_sending: 'Sending...',
      js_form_sent_ok: 'Request sent! We will contact you.',
      js_form_sent_fail: 'Sending failed. Try again later.',
    },
  };

  // доступ к словарю из других файлов
  function getDict(lang) {
    return translations[lang] || translations.ru;
  }
  function getLang() {
    return localStorage.getItem(LS_LANG) || (navigator.language || 'ru').slice(0,2) || 'ru';
  }
  function setText(el, text) {
    if (!el) return;
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.value = text;
    else el.textContent = text;
  }

  // ---------- I18N ПРИМЕНЕНИЕ ----------
  function applyLang(lang) {
    const dict = getDict(lang);
    document.documentElement.lang = lang;

    // обычные тексты
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key && dict[key]) setText(el, dict[key]);
    });

    // плейсхолдеры
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key && dict[key]) el.setAttribute('placeholder', dict[key]);
    });

    // <title data-i18n="">
    const titleEl = document.querySelector('title[data-i18n]');
    if (titleEl) {
      const key = titleEl.getAttribute('data-i18n');
      if (key && dict[key]) titleEl.textContent = dict[key];
    }

    // специфичные элементы
    const search = document.getElementById('search');
    if (search && dict.search_placeholder) search.setAttribute('placeholder', dict.search_placeholder);

    const btnRate = document.getElementById('btnRefreshRate');
    if (btnRate && dict.btn_refresh_rate) btnRate.innerHTML = `<i class="fa-solid fa-rotate"></i> ${dict.btn_refresh_rate}`;

    const btnCalcAside = document.getElementById('btnRecalcAside');
    if (btnCalcAside && dict.aside_btn_calc) btnCalcAside.innerHTML = `<i class="fa-solid fa-calculator"></i> ${dict.aside_btn_calc}`;

    const toContactsAside = document.getElementById('toContactsAside');
    if (toContactsAside && dict.aside_btn_apply) toContactsAside.innerHTML = `<i class="fa-solid fa-paper-plane"></i> ${dict.aside_btn_apply}`;

    const langSwitch = document.getElementById('langSwitch');
    if (langSwitch) langSwitch.value = lang;

    localStorage.setItem(LS_LANG, lang);
  }

  // даём глобальный помощник для скриптов
  window.__t = (key) => {
    const lang = getLang();
    const dict = getDict(lang);
    return dict[key] || translations.ru[key] || key;
  };

  // ---------- ТЕМА ----------
  function applyTheme(isDark) {
    // ВАЖНО: класс ставим на <html>, т.к. в style.css тёмная тема — через html.dark { ... }
    // (раньше ставили на body, поэтому не работало) :contentReference[oaicite:1]{index=1}
    const root = document.documentElement;
    root.classList.toggle('dark', isDark);
    const btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem(LS_THEME, isDark ? 'dark' : 'light');
  }

  // ---------- INIT ----------
  function onReady() {
    // Service Worker (офлайн)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('js/service-worker.js').catch(()=>{});
    }

    // Бургер
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
      menuToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
    }

    // Тема
    const savedTheme = localStorage.getItem(LS_THEME);
    applyTheme(savedTheme ? savedTheme === 'dark' : false);
    const themeToggle = document.getElementById('themeToggle');
    themeToggle?.addEventListener('click', () => {
      const nowDark = !document.documentElement.classList.contains('dark');
      applyTheme(nowDark);
    });

    // Язык
    const savedLang = localStorage.getItem(LS_LANG) || (['ru','kk','zh','en'].includes((navigator.language||'ru').slice(0,2)) ? (navigator.language||'ru').slice(0,2) : 'ru');
    applyLang(savedLang);
    const langSwitch = document.getElementById('langSwitch');
    langSwitch?.addEventListener('change', () => applyLang(langSwitch.value));

    // Кнопка "Наверх"
    const toTopBtn = document.getElementById('toTopBtn');
    const updateToTop = () => {
      if (!toTopBtn) return;
      toTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
    };
    if (toTopBtn) {
      window.addEventListener('scroll', updateToTop, { passive: true });
      toTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
      updateToTop();
    }

    // Tawk.to — единая инициализация на всех страницах
    if (!document.getElementById('tawk_script')) {
      const s1 = document.createElement('script');
      s1.id = 'tawk_script';
      s1.async = true;
      s1.src = 'https://embed.tawk.to/68480dddb0d263190ae16f29/1itcncalg';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      document.body.appendChild(s1);
    }

    // Lazy для картинок/видео
    document.querySelectorAll('img:not([loading])').forEach(img => {
      img.setAttribute('loading', 'lazy');
      img.setAttribute('decoding', 'async');
    });
    document.querySelectorAll('video[preload="auto"]').forEach(v => v.setAttribute('preload', 'metadata'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();
