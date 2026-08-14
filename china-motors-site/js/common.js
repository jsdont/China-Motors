(() => {
  const LS_LANG = 'lang';
  const LS_THEME = 'theme';

  /* =====================
     TRANSLATIONS
     ===================== */
  const translations = {
    ru: {
      // ЛИЧНЫЙ КАБИНЕТ (cab_*)
      cab_verified: 'подтверждён', cab_not_verified: 'не подтверждён',
      cab_rolefull_CUSTOMER_PERSON: 'Клиент (физ. лицо)', cab_rolefull_CUSTOMER_COMPANY: 'Клиент (юр. лицо)',
      cab_rolefull_SERVICE_BROKER: 'Брокер (СВХ)', cab_rolefull_SERVICE_SVH: 'СВХ', cab_rolefull_SERVICE_LAB: 'Лаборатория',
      cab_rolefull_SERVICE_LOGISTIC: 'Логист', cab_rolefull_SERVICE_DECLARANT: 'Декларант (граница)', cab_rolefull_BANK: 'Банк',
      cab_rolefull_PARTNER: 'Партнёр-продавец', cab_rolefull_MANAGER: 'Менеджер', cab_rolefull_ADMIN: 'Администратор',
      cab_role_BROKER: 'Брокер (СВХ)', cab_role_SVH: 'СВХ', cab_role_LAB: 'Лаборатория', cab_role_LOGISTIC: 'Логист', cab_role_DECLARANT: 'Декларант', cab_role_BANK: 'Банк',
      cab_astatus_PENDING: 'Ожидает', cab_astatus_IN_PROGRESS: 'В работе', cab_astatus_DONE: 'Завершено',
      cab_stage_AGREEMENT: 'Согласование', cab_stage_CONTRACT: 'Договор', cab_stage_PURCHASE_CHINA: 'Покупка в Китае', cab_stage_DELIVERY_KZ: 'Доставка в КЗ', cab_stage_SVH: 'СВХ', cab_stage_CUSTOMS: 'Таможня', cab_stage_DELIVERY_CLIENT: 'Доставка клиенту', cab_stage_COMPLETED: 'Завершена',
      cab_timeline_head: 'Этапы сделки', cab_plan_head: 'План сделки', cab_payments_head: 'Платежи', cab_docs_head: 'Документы', cab_media_head: 'Фото и видео', cab_expenses_head: 'Расходы', cab_expenses_internal: '(видит только менеджер)', cab_activity_head: 'История изменений', cab_chat_head: 'Чат по сделке',
      cab_loading: 'Загрузка...', cab_payments_empty: 'Платежей пока нет.', cab_docs_empty: 'Документов пока нет.', cab_expenses_empty: 'Расходов пока нет.', cab_media_empty: 'Фото и видео пока не добавлены.', cab_plan_empty: 'План ещё не составлен. Добавьте этапы ниже.', cab_chat_empty: 'Пока нет сообщений', cab_notif_empty: 'Пока нет уведомлений', cab_leads_empty: 'Заявок пока нет.', cab_listings_empty: 'Объявлений пока нет.',
      cab_deals_empty_mgr: 'Сделок пока нет.', cab_deals_empty_customer: 'У вас пока нет сделок. Оформить сделку можно со страницы конкретной техники в каталоге — кнопка «Оформить сделку».', cab_deals_empty_assignee: 'Вам пока не назначили ни одной сделки.', cab_role_wip: 'Личный кабинет для этой роли пока в разработке.',
      cab_load_error: 'Ошибка загрузки', cab_load_error_summary: 'Ошибка загрузки сводки', cab_load_error_finance: 'Ошибка загрузки финансов', cab_load_error_leads: 'Ошибка загрузки заявок', cab_load_error_deals: 'Ошибка загрузки сделок', cab_error: 'Ошибка',
      cab_confirmed: 'Подтверждён', cab_pending: 'Ожидает', cab_paid: 'Оплачено', cab_of: 'из', cab_deal_value: 'Стоимость сделки, ₸:', cab_not_set: 'не указана', cab_save: 'Сохранить', cab_saved: 'Сохранено', cab_sum_ph: 'Сумма, ₸', cab_confirmed_lc: 'подтверждён', cab_add_payment: 'Добавить платёж',
      cab_download: 'Скачать', cab_no_file: 'нет файла', cab_doc_generic: 'Документ', cab_upload: 'Загрузить', cab_doc_CONTRACT: 'Договор', cab_doc_GTD: 'ГТД', cab_doc_CMR: 'CMR', cab_doc_ACCEPTANCE: 'Акт приёма', cab_doc_PHOTO: 'Фото',
      cab_exp_total: 'Итого расходов', cab_exp_note_ph: 'Комментарий (необязательно)', cab_add_expense: 'Добавить расход', cab_del_expense_confirm: 'Удалить этот расход?', cab_exp_PURCHASE: 'Закупка в Китае', cab_exp_LOGISTICS: 'Логистика / доставка', cab_exp_CUSTOMS: 'Растаможка', cab_exp_CERTIFICATION: 'Сертификация (СБКТС/ЭПТС)', cab_exp_SVH: 'СВХ / хранение', cab_exp_OTHER: 'Прочее',
      cab_stage_name_ph: 'Название этапа', cab_add_stage: 'Добавить этап', cab_del_stage_confirm: 'Удалить этап?', cab_up: 'Выше', cab_down: 'Ниже', cab_delete: 'Удалить',
      cab_media_caption_ph: 'Подпись (необязательно)', cab_media_or: 'или ссылка на видео:', cab_add: 'Добавить', cab_video: 'Видео', cab_photo_alt: 'Фото сделки', cab_del_media_confirm: 'Удалить этот файл из галереи?', cab_media_need_one: 'Приложите фото или укажите ссылку на видео.', cab_media_only_one: 'Что-то одно: либо фото, либо ссылка на видео.',
      cab_internal_tag: 'внутр.', cab_system: 'Система', cab_chat_ph: 'Написать сообщение...', cab_send: 'Отправить',
      cab_created: 'Создана', cab_client: 'Клиент', cab_deal_num: 'Сделка', cab_no_assignee: 'Пока никто не назначен', cab_not_assigned: '— не назначен', cab_you: '(вы)', cab_note_ph: 'Заметка',
      cab_tile_total: 'Всего сделок', cab_tile_active: 'Активные', cab_tile_completed: 'Завершённые', cab_tile_leads_open: 'Заявки (открытые)',
      cab_convert_confirm: 'Создать сделку из этой заявки? Клиент будет найден по телефону или создан автоматически.', cab_creating: 'Создаём…', cab_convert_new_client: 'Создан новый клиент по номеру', cab_convert_found_client: 'Клиент найден по номеру', cab_deal_created: 'Сделка создана',
      cab_no_name: 'Без имени', cab_create_deal: 'Создать сделку', cab_lead_deal_num: 'Сделка', cab_lead_new: 'Новая', cab_lead_in_progress: 'В работе', cab_lead_won: 'Выиграна', cab_lead_lost: 'Проиграна',
      cab_assign_head: 'Назначить сервис на этап', cab_assign_btn: 'Назначить', cab_delete_deal: 'Удалить сделку', cab_unassign: 'Снять назначение', cab_no_service_users: 'Нет подходящих аккаунтов', cab_pick_user: 'Выберите исполнителя', cab_confirm_unassign: 'Снять назначение с этого этапа?', cab_confirm_delete_deal: 'Удалить сделку целиком? Действие необратимо.',
      cab_tab_active: 'Активные', cab_tab_done: 'Завершённые', cab_no_done: 'Завершённых сделок пока нет',
      cab_profile_head: 'Мои данные', cab_profile_name: 'Имя / компания', cab_profile_phone: 'Телефон (логин)', cab_profile_email: 'E-mail', cab_profile_pw_head: 'Смена пароля', cab_profile_old_pw: 'Текущий пароль', cab_profile_new_pw: 'Новый пароль', cab_profile_change_pw: 'Сменить пароль', cab_pw_changed: 'Пароль изменён',
      cab_download_kp: 'Скачать КП', cab_send_kp: 'Отправить КП на почту', cab_kp_sent: 'КП отправлено', cab_kp_no_recipient: 'Некуда отправлять: укажите e-mail клиента',
      cab_fin_value: 'Стоимость сделок', cab_fin_received: 'Получено', cab_fin_expenses: 'Расходы', cab_fin_profit: 'Прибыль', cab_fcol_deal: 'Сделка', cab_fcol_stage: 'Этап', cab_fcol_value: 'Стоимость', cab_fcol_received: 'Получено', cab_fcol_balance: 'Остаток', cab_fcol_expenses: 'Расходы', cab_fcol_profit: 'Прибыль', cab_fin_hint: 'Прибыль = стоимость сделки − расходы. Показывается только для сделок с указанной стоимостью.',
      cab_listing_sent: 'Объявление отправлено на модерацию', cab_listing_num: 'Объявление', cab_listing_approved: 'Одобрено, видно в каталоге', cab_listing_pending: 'На модерации',
      cab_summary: 'Сводка', cab_finance_head: 'Финансы по сделкам', cab_leads_head: 'Заявки с сайта',
      cab_partner_intro: 'Партнёр-продавец ведёт не сделки, а свой каталог товаров — управляйте объявлениями в разделе выше. Одобренные товары показываются в общем каталоге.', cab_listing_delete_confirm: 'Удалить это объявление?', cab_lst_total: 'Товаров', cab_lst_approved: 'Одобрено', cab_lst_moderation: 'На модерации', cab_asum_head: 'Мои задачи',
      cab_how_to_pay: 'Как оплатить',

      // NAV
      nav_home: 'Главная',
      nav_catalog: 'Каталог',
      nav_services: 'Услуги',
      nav_contacts: 'Контакты',
      nav_calculator: 'Калькулятор',
      help_call: 'Позвонить', help_whatsapp: 'WhatsApp', help_font_title: 'Увеличить размер текста',
      product_cta_kp: 'ПОЛУЧИТЬ КП ПО ЭТОЙ ТЕХНИКЕ', product_cta_breakdown: 'РАЗОБРАТЬ ЦЕНУ ПО ШАГАМ', product_price_note: 'Включая пошлину, НДС, сертификацию, доставку и учёт.', product_how_head: 'КАК ПРОХОДИТ ПОКУПКА', product_how_media: 'Присылаем на каждом этапе — от завода до выдачи.', spec_brand: 'БРЕНД', spec_model: 'МОДЕЛЬ', spec_year: 'ГОД ВЫПУСКА', spec_category: 'КАТЕГОРИЯ', spec_mileage: 'ПРОБЕГ, КМ',
      help_write: 'Написать',
      vp_row_wheel: 'КОЛЁСНАЯ ФОРМУЛА', vp_row_mass: 'ПОЛНАЯ МАССА, Т', vp_row_payload: 'ГРУЗОПОДЪЁМНОСТЬ, Т', vp_row_power: 'ДВИГАТЕЛЬ, Л.С.', vp_row_gearbox: 'КПП', vp_price_label: 'ПОД КЛЮЧ В АЛМАТЫ', vp_cta: 'РАСЧЁТ ПОД КЛЮЧ', vp_cta_kp: 'ПОЛУЧИТЬ КП', vp_price_on_request: '— по запросу', vp_owner_client: 'клиента', vp_avail_in_stock: 'В НАЛИЧИИ', vp_avail_on_order: 'ПОД ЗАКАЗ', vp_avail_out_of_stock: 'НЕТ', catalog_rule_title: 'Площадка', filter_search_label: 'Поиск', filter_brand_label: 'Марка', filter_wheel_label: 'Колёсная формула', nav_menu: 'МЕНЮ',
      calc_rule_title: 'Расчёт', calc_stage_factory: 'Завод · КНР', calc_stage_border: 'Граница · Хоргос', calc_stage_cert: 'Сертификация и оформление', calc_stage_delivery: 'Доставка', calc_stage_reg: 'Учёт · Регистрация', calc_real_row: 'Цена техники', aside_total_label: 'Итого · под ключ в Алматы',
      hp_hero_h1: 'Спецтехника из Китая с ценой до тенге', hp_hero_sub: 'Считаем полную стоимость до Алматы: техника, пошлина, НДС, доставка, утильсбор, учёт. Без «доплатите потом».', hp_cta_price: 'Показать цену под ключ', hp_meta_units: 'на площадке', hp_meta_rate: 'курс', hp_rule_route: 'Маршрут по сайту', hp_rule_included: 'Что входит', hp_rule_deal: 'Маршрут груза', hp_rule_safe: 'Почему это безопасно', hp_rule_gallery: 'Что возим', hp_rule_reviews: 'Клиенты', hp_trust_title: 'Деньги и документы под договором', hp_led_stage: 'Этап', hp_led_work: 'Работа', hp_led_incl: 'Включено', hp_led_yes: 'включено', hp_led_cert_work: 'Лаборатория, СБКТС и ЭПТС — оформляем сами.', hp_close_t: 'Хотите так же? Подберём технику под вашу задачу и бюджет.', hp_close_cta: 'Оставить заявку', hp_vehicles_empty: 'Пока нет доступной техники в каталоге.', hp_vehicles_error: 'Не удалось загрузить каталог', stage_factory: 'Завод', stage_factory_s: 'КНР', stage_khorgos: 'Хоргос', stage_khorgos_s: 'граница', stage_customs: 'Таможня', stage_customs_s: 'ГТД', stage_cert: 'СБКТС', stage_cert_s: 'лаборатория', stage_almaty: 'Алматы', stage_almaty_s: 'склад', stage_handover: 'Выдача', stage_handover_s: 'документы', stage_delivery: 'Доставка', stage_reg: 'Учёт',
      cab_pending_title: 'Аккаунт ожидает подтверждения', cab_pending_text: 'Администратор проверяет данные компании. После подтверждения здесь появятся назначенные вам сделки — мы сообщим.',
      cab_rule_title: 'Сделка', cab_rail_now: 'сейчас', cab_rail_planned: 'план', cab_rail_late: 'просрочен', cab_rail_now_head: 'Сейчас', cab_rail_late_head: 'Просрочено',
      vp_no_photo: 'НЕТ ФОТО',
      fav_rule_title: 'Сохранённое', fav_loading: 'Загрузка…', fav_load_error: 'Не удалось загрузить часть техники из избранного — попробуйте обновить страницу.',
      contacts_rule_title: 'Связь', blog_rule_title: 'Материалы', contact_cta: 'Перезвоните мне',
      hp_services_h2: 'Полный цикл до постановки на учёт',
      product_cta_request: 'Оставить заявку на эту технику',
      cat_empty_t: 'По этому запросу ничего не нашлось', cat_empty_d: 'Попробуйте выбрать другую задачу или посмотреть всё. Либо позвоните — подберём под вашу задачу и бюджет.', cat_error_t: 'Не удалось загрузить каталог', cat_error_d: 'Обновите страницу или позвоните — расскажем, что есть в наличии.', contact_ok_t: 'Заявка отправлена!', contact_ok_d: 'Менеджер перезвонит в рабочее время и уточнит детали. Если нужно срочно — позвоните сами.', contact_ok_catalog: 'Посмотреть каталог',
      route_title: 'С чего начать — по шагам', route_sub: 'Если впервые на сайте, просто идите по порядку. На любом шаге можно позвонить — поможем.', route1_t: 'Посмотрите технику', route1_d: 'В каталоге выберите, что вам нужно делать — возить песок, грузы или поднимать на стройке. Покажем подходящие машины.', route1_go: 'Открыть каталог →', route2_t: 'Узнайте цену «под ключ»', route2_d: 'Калькулятор покажет итоговую сумму с растаможкой и доставкой. Не хотите считать — ответьте на три вопроса, посчитаем сами.', route2_go: 'Рассчитать стоимость →', route3_t: 'Оставьте заявку', route3_d: 'Достаточно имени и телефона. Менеджер перезвонит, уточнит детали и пришлёт коммерческое предложение.', route3_go: 'Оставить заявку →', route4_t: 'Следите за сделкой', route4_d: 'После заключения договора в личном кабинете видно, где сейчас ваша машина: оплата, доставка, таможня, выдача.', route4_go: 'Личный кабинет →', task_head: 'Что вам нужно делать?', task_all: 'Показать всё', task_dump: 'Возить песок, щебень, грунт', task_tractor: 'Возить грузы на дальние расстояния', task_semi: 'Перевозить технику и длинные грузы', task_trailer: 'Добавить прицеп к тягачу', task_crane: 'Поднимать грузы на стройке', task_more: 'Уточнить: марка, колёсная формула, сортировка', task_less: 'Скрыть уточнения',
      card_no_name: 'Техника',
      trust1_t: 'Официальный договор', trust1_d: 'Все условия и сроки прописаны на бумаге. Никаких скрытых доплат.', trust2_t: 'Оплата через банк', trust2_d: 'Деньги идут на расчётный счёт компании по договору — не на карту частному лицу.', trust3_t: 'Полный пакет документов', trust3_d: 'ЭПТС, СБКТС и таможенные документы оформляем сами — вы получаете технику готовой к учёту.', trust4_t: 'Живой менеджер', trust4_d: 'Не нужно разбираться самому — позвоните, и мы подберём технику и посчитаем стоимость.',
      calc_total_plain: 'Это цена «под ключ» в Алматы — уже включает растаможку, документы, сертификацию и доставку. Доплачивать сверху ничего не нужно.',
      hint_epts: 'ЭПТС — электронный паспорт транспортного средства. Без него машину не поставить на учёт. Оформляем мы.', hint_sbkts: 'СБКТС — свидетельство безопасности конструкции. Подтверждает, что техника соответствует нормам ЕАЭС. Делаем мы.', hint_sos: 'Кнопка ЭРА/СОС — система экстренного вызова. Обязательна для постановки на учёт. Устанавливаем в лаборатории.', hint_customs_fee: 'Таможенный сбор — фиксированный государственный платёж за оформление декларации.', hint_broker: 'Брокер — специалист, который оформляет документы на таможне вместо вас.', hint_svh: 'СВХ — склад временного хранения: где техника стоит, пока идёт растаможка.', hint_red_corridor: 'Красный коридор — углублённый досмотр на таможне. Закладываем в расчёт заранее, чтобы сумма не выросла неожиданно.', hint_declarant: 'Декларант на границе — оформляет въезд техники в Казахстан.', hint_export_decl: 'Экспортная декларация — документ на вывоз техники из Китая.', hint_plate: 'Госномер и техпаспорт — регистрация в Авто ЦОН, после неё можно ездить.', hint_first_reg: 'Первичная регистрация — разовый государственный сбор при постановке на учёт в Казахстане.', hint_adblue: 'AdBlue — жидкость для системы очистки выхлопа двигателей Евро-5.',
      kpb_head: 'Создать КП вручную', kpb_toggle: 'Открыть', kpb_hide: 'Свернуть', kpb_pick: 'Техника из каталога (необязательно)', kpb_search_ph: 'Поиск: shacman, самосвал…', kpb_manual: '— ввести вручную —', kpb_title: 'Наименование техники', kpb_desc: 'Описание / комплектация', kpb_desc_ph: 'Двигатель, мощность, масса, оснащение…', kpb_price_usd: 'Цена, USD', kpb_price_cny: 'Цена, CNY', kpb_price_kzt: 'Сумма, ₸', kpb_qty: 'Кол-во', kpb_buyer: 'Покупатель', kpb_number: 'Номер КП', kpb_avail: 'Наличие', kpb_avail_ph: 'Техника в наличии 15 единиц в городе Хоргос, Китай.', kpb_timeline: 'Сроки поставки (по пункту на строку, пусто — взять из шаблона)', kpb_timeline_ph: 'Экспортная декларация — 2 дня.', kpb_email: 'E-mail получателя (для отправки)', kpb_download: 'Скачать PDF', kpb_send: 'Отправить на почту', kpb_need_email: 'Укажите e-mail получателя',
      scalc_title: 'Не хотите разбираться в расчётах?', scalc_sub: 'Ответьте на три вопроса — мы посчитаем всё сами и перезвоним.', scalc_q1: '1. Какая техника нужна?', scalc_q2: '2. На какую сумму рассчитываете? (необязательно)', scalc_q3: '3. Ваш телефон — перезвоним и всё объясним', scalc_need_tractor: 'Тягач', scalc_need_dump: 'Самосвал', scalc_need_crane: 'Кран', scalc_need_trailer: 'Прицеп / трал', scalc_need_car: 'Легковое авто', scalc_need_unsure: 'Пока не знаю', scalc_budget_ph: 'например, до 35 млн ₸', scalc_name_ph: 'Ваше имя (необязательно)', scalc_send: 'Получить расчёт', scalc_sent: 'Спасибо! Мы перезвоним в ближайшее время.', scalc_need_phone: 'Пожалуйста, укажите телефон — мы перезвоним', scalc_error: 'Ошибка', scalc_show_detailed: 'Показать подробный расчёт', scalc_hide_detailed: 'Скрыть подробный расчёт',
      contact_msg_label_opt: 'Сообщение (необязательно)', contact_need_phone: 'Пожалуйста, укажите телефон — мы перезвоним',
      brand_subtitle: 'СПЕЦТЕХНИКА ИЗ КИТАЯ',
      nav_how_it_works: 'Как это работает',
      nav_favorites: 'Избранное',
      nav_blog: 'Блог',
      nav_login: 'Войти',
      nav_account: 'Личный кабинет',
      nav_not_verified: 'не подтверждён',
      nav_logout_confirm: 'Выйти из аккаунта?',
      title_register: 'China Motors - Регистрация',
      title_login: 'China Motors - Вход',
      register_hero: 'Регистрация',
      register_tagline: 'Создайте аккаунт клиента China Motors',
      register_tab_person: 'Физ. лицо',
      register_tab_company: 'Юр. лицо',
      register_person_note: 'Физ. лицо может приобрести легковой автомобиль. Для коммерческой техники используйте регистрацию юр. лица.',
      register_company_note: 'Юр. лица могут приобретать коммерческую технику разных видов.',
      register_phone_label: 'Телефон',
      register_password_label: 'Пароль',
      register_fullname_label: 'ФИО',
      register_iin_label: 'ИИН (для договора)',
      register_companyname_label: 'Название компании',
      register_bin_label: 'БИН (для договора)',
      register_address_label: 'Юридический адрес',
      register_submit: 'Создать аккаунт',
      register_have_account: 'Уже есть аккаунт? Войти',
      register_err_required: 'Заполните обязательные поля',
      register_success: 'Регистрация завершена! Аккаунт ожидает подтверждения администратором.',
      login_hero: 'Вход',
      login_tagline: 'Войдите в личный кабинет China Motors',
      login_submit: 'Войти',
      login_no_account: 'Нет аккаунта? Зарегистрироваться',
      login_success: 'Вход выполнен!',
      register_tab_service: 'Сервисный партнёр (СВХ)',
      register_tab_bank: 'Банк',
      register_tab_partner: 'Партнёр-продавец (Китай)',
      register_service_note: 'Выберите роль. Аккаунт будет ожидать подтверждения администратора.',
      register_service_role_label: 'Роль',
      register_service_role_placeholder: '— выбрать —',
      register_role_declarant: 'Декларант (граница)',
      register_role_logistic: 'Логист',
      register_role_lab: 'Лаборатория',
      register_role_svh: 'СВХ',
      register_role_broker: 'Брокер (СВХ)',
      register_bank_note: 'Аккаунт банка используется для сопровождения расчётов по сделке.',
      register_bankname_label: 'Название банка',
      register_bik_label: 'БИК',
      register_partner_note: 'Партнёр получает кабинет и загружает объявления техники — они проходят модерацию администратора.',
      register_country_label: 'Страна',
      register_regno_label: 'Регистрационный номер компании (для договора)',
      title_account: 'China Motors - Личный кабинет',
      account_hero: 'Личный кабинет',
      account_logout: 'Выйти',
      account_loading: 'Загрузка...',
      account_my_listings_title: 'Мои объявления',
      account_new_listing: 'Разместить объявление',
      account_listing_brand_label: 'Бренд',
      account_listing_title_label: 'Название / модель',
      account_listing_category_label: 'Категория',
      account_listing_city_label: 'Город',
      account_listing_weight_label: 'Масса, т',
      account_listing_power_label: 'Мощность двигателя, л.с.',
      account_listing_load_capacity_label: 'Грузоподъёмность, т',
      account_listing_price_kzt_label: 'Цена, ₸',
      account_listing_photos_label: 'Фото',
      account_listing_description_label: 'Описание',
      badge_user_listing_prefix: 'Объявление от',
      product_create_deal: 'Оформить сделку',
      product_secure_note: 'Безопасная оплата через банк · полный пакет документов',
      product_extra_title: 'Комплектация и характеристики',
      product_cta_title: 'Хотите приобрести эту технику?',
      product_cta_sub: 'Рассчитаем полную стоимость и оформим сделку по договору.',
      product_cta_ask: 'Задать вопрос',

      // COMMON
      brand_title: 'China Motors',
      hero_title_main: 'Спецтехника и автомобили из Китая под ключ',
      hero_tagline: 'Подбор • расчёт • доставка • таможня • постановка на учёт в РК',
      hp_hero_badge: 'ПРЯМЫЕ ПОСТАВКИ ОТ ЗАВОДОВ КИТАЯ',
      hp_bullet1: 'Официальный договор',
      hp_bullet2: 'Банк защищает деньги',
      hp_bullet3: 'Полный комплект документов',
      hp_bullet4: 'С 2024 года',
      hp_cta_offer: 'Получить КП',
      hp_cta_catalog: 'Смотреть каталог →',

      // --- Страница КП (kp.html) ---
      title_kp: 'China Motors — Коммерческое предложение',
      kp_rule_title: 'Коммерческое предложение',
      kp_meta_number: 'НОМЕР', kp_meta_date: 'ДАТА', kp_meta_buyer: 'ПОКУПАТЕЛЬ',
      kp_meta_valid: 'ДЕЙСТВИТЕЛЬНО ДО',
      kp_rates_t: 'Курс валют временно недоступен',
      kp_rates_d: 'Цена в предложении считается по курсу Нацбанка на день выдачи. Пока курс не пришёл, документ не выпускается — попробуйте позже или позвоните, пришлём КП сами.',
      kp_download_signed: 'СКАЧАТЬ С ПОДПИСЬЮ',
      kp_download_signed_note: 'с печатью компании · скоро',
      kp_download_signed_ready: 'с печатью компании',
      kp_download_page: 'СКАЧАТЬ КАК НА САЙТЕ',
      kp_download_page_note: 'эта страница, без печати',
      kp_share: 'ПОДЕЛИТЬСЯ',
      kp_share_copied: 'Ссылка скопирована',
      kp_share_failed: 'Скопируйте ссылку из адресной строки',
      kp_seller_head: 'ПРОДАВЕЦ',
      kp_seller_address: 'АДРЕС', kp_seller_bank: 'БАНК',
      kp_seller_bank_address: 'АДРЕС БАНКА', kp_seller_account: 'СЧЁТ', kp_seller_swift: 'SWIFT',
      kp_subject_head: 'ПРЕДМЕТ ПРЕДЛОЖЕНИЯ',
      kp_col_qty: 'КОЛ-ВО', kp_col_usd: 'ЦЕНА, USD', kp_col_cny: 'ЦЕНА, CNY', kp_col_kzt: 'СУММА, ₸',
      kp_specs_head: 'ХАРАКТЕРИСТИКИ', kp_on_request: 'по запросу',
      kp_breakdown_head: 'РАСЧЁТ СТОИМОСТИ ПОД КЛЮЧ',
      kp_total_label: 'ПОД КЛЮЧ В АЛМАТЫ',
      kp_total_note: 'Это конечная сумма. Доплачивать сверху нечего.',
      kp_terms_head: 'УСЛОВИЯ ПОСТАВКИ', kp_timeline_head: 'СРОКИ',
      kp_service_head: 'СЕРВИС И ГАРАНТИЯ',
      kp_foot_note: 'Вопросы по предложению — позвоните или напишите, ответим по этому же КП.',
      kp_foot_contacts: 'НАПИСАТЬ МЕНЕДЖЕРУ',
      kp_loading: 'Готовим коммерческое предложение…',
      kp_error_t: 'Не удалось собрать предложение',
      kp_error_d: 'Откройте страницу заново или позвоните — пришлём КП сами.',
      kp_error_catalog: 'В КАТАЛОГ',
      hp_calc_widget_title: 'Рассчитать стоимость',
      hp_calc_category: 'Категория',
      hp_calc_brand: 'Марка',
      hp_calc_submit: 'Рассчитать стоимость',
      hp_calc_widget_note: 'бесплатно и ни к чему не обязывает',
      hp_services_title: 'Наши услуги',
      hp_services_sub: 'Комплексные решения для поставки и обслуживания техники',
      hp_service1_t: 'Заказ и поставка',
      hp_service1_d: 'Автомобили и спецтехника из Китая под ваши нужды.',
      hp_service2_t: 'Таможенное оформление',
      hp_service2_d: 'Помощь с таможенной очисткой.',
      hp_service3_t: 'Доставка',
      hp_service3_d: 'Доставка с Хоргоса в Алматы.',
      hp_service4_t: 'Гос. номер',
      hp_service4_d: 'Помощь с получением гос. номера.',
      hp_process_title: 'Как проходит сделка',
      hp_step1_t: 'Выбор техники',
      hp_step1_d: 'Подбираем модель под задачи и бюджет',
      hp_step2_t: 'Коммерческое предложение',
      hp_step2_d: 'Расчёт стоимости с полной спецификацией',
      hp_step3_t: 'Договор и оплата',
      hp_step3_d: 'Безопасная оплата через банк, полный пакет документов',
      hp_step4_t: 'Поставка и растаможка',
      hp_step4_d: 'Логистика из Китая и таможенное оформление',
      hp_step5_t: 'Получение техники',
      hp_step5_d: 'Передача техники и полный комплект документов',
      hp_vehicles_title: 'Популярная техника',
      hp_vehicles_link: 'Смотреть весь каталог →',
      hp_vehicles_loading: 'Загрузка...',
      hp_vehicle_cta: 'Получить КП',
      hp_stats_label: 'НАМ ДОВЕРЯЮТ',
      hp_stat1: 'клиентов',
      hp_stat2: 'сделок по договору',
      hp_stat3: 'единиц техники',
      hp_stat4: 'на рынке',
      hp_stat4_years: 'года',
      footer_address_khorgos: 'г. Хоргос — склад и отгрузка',
      hp_contact_reach_title: 'Свяжитесь с нами',
      hp_contact_phone_label: 'Телефон',
      hp_contact_address_label: 'Адреса',
      hp_contact_whatsapp: 'Написать в WhatsApp',
      footer_address_almaty: 'г. Алматы — выдача техники',
      footer_col1_text: 'Надежная техника из Китая под заказ и в наличии. Доставка из Хоргоса до Алматы, полное сопровождение сделки. Работаем с 2024 года.',
      footer_col2_title: 'Навигация',
      footer_col3_title: 'Контакты',
      footer_col4_title: 'Соцсети',
      footer_copy: '© 2026 China Motors. Все права защищены.',
      footer_devnote: 'Информация на сайте носит справочный характер и не является публичной офертой',
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
      about_card1_d: 'Много различных моделей спецтехники.',
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
      catalog_subhead: 'Каталог техники China Motors',
      catalog_found: 'Найдено',

      // FAVORITES
      title_favorites: 'China Motors - Избранное',
      fav_subtitle: 'Сохранённая техника — сравните и запросите расчёт',
      fav_saved_count: 'Сохранено',
      fav_cta_title: 'Запросить расчёт по всему списку',
      fav_cta_sub: 'Пришлём КП по каждой позиции из избранного — с доставкой до Алматы.',
      fav_cta_btn: 'Получить КП по списку',
      fav_empty_title: 'В избранном пока пусто',
      fav_empty_sub: 'Нажимайте на закладку на карточках техники в каталоге — они появятся здесь.',
      fav_empty_btn: 'Перейти в каталог',
      fav_remove_title: 'Убрать из избранного',
      fav_request_btn: 'Получить КП',

      // BLOG
      title_blog: 'China Motors - Блог',
      blog_hero: 'Блог',
      blog_subhead: 'Статьи и гайды о технике из Китая, доставке и оформлении сделки',
      blog_read_more: 'Читать →',
      blog1_date: 'Гайд',
      blog1_title: 'Как проходит сделка: от заявки до получения техники',
      blog1_excerpt: 'Пять шагов от выбора модели до передачи техники с полным комплектом документов — что происходит на каждом этапе.',
      blog2_date: 'Гайд',
      blog2_title: 'Как выбрать спецтехнику: самосвал, тягач или манипулятор',
      blog2_excerpt: 'На что смотреть при выборе техники под конкретную задачу — тип груза, расстояния, бюджет и частота использования.',
      blog3_date: 'Гайд',
      blog3_title: 'Доставка техники из Китая: путь от Хоргоса до Алматы',
      blog3_excerpt: 'Как техника попадает со склада в Хоргосе к вам в Алматы — этапы, документы и что мы показываем на каждом шаге.',

      filter_body_label: 'Тип транспорта',
      filter_source_label: 'Источник',
      filter_source_all: 'Все объявления',
      filter_source_official: 'Официальный каталог',
      filter_source_user: 'Объявления клиентов',
      filter_sort_label: 'Сортировка',
      sort_none: 'Без сортировки',
      sort_price_asc: 'Цена ↑',
      sort_price_desc: 'Цена ↓',
      card_body_label: 'Тип транспорта:',
      card_wheel_formula_label: 'Колёсная формула:',
      card_gearbox_label: 'КПП:',
      price_on_request: 'Цена уточняется',

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
      calculator_tagline: 'Подбор, доставка и оформление под ключ — рассчитайте стоимость за 2 минуты',
      calc_page_title: 'Калькулятор стоимости',
      calc_in_title: 'Входные данные',
      calc_in_name_label: 'Модель / комплектация',
      calc_in_name_ph: 'Например: Тягач 2022 года',
      calc_in_price_label: 'Цена авто, $',
      calc_in_price_ph: '59165',
      calc_in_type_label: 'Тип транспорта',
      calc_in_rate_label: 'Курс $ → ₸',
      calc_rate_info: 'Курс НБ РК: —',
      calc_real_title: 'Реальная стоимость',
      calc_real_hint: 'Цена авто в тенге = Цена($) × Курс',
      calc_ts_title: 'Таможенная стоимость',
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
      calc_mand_title: 'Дополнительные расходы',
      calc_mand_note: 'Фиксируется по типу транспорта и выбранному режиму ТС.',
      calc_mand_list_title: 'За что платим',
      calc_ship_title: 'Доставка и граница',
      calc_ship_list_title: 'Состав доставки',
      calc_util_title: 'Утилизационный сбор и регистрация',
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
      contact_note: 'Заявка сразу попадёт нам в Telegram',

      // JS messages
      js_price_on_request: 'Цена по запросу',
      js_form_err_phone: 'Укажите корректный телефон',
      js_form_err_msg: 'Добавьте сообщение',
      js_form_sending: 'Отправляем...',
      js_form_sent_ok: 'Заявка отправлена! Свяжемся с вами.',
      js_form_sent_fail: 'Ошибка отправки. Попробуйте позже.',
      why_title : 'Почему нам доверяют',
      why_card1_t : 'Работа по договору',
      why_card1_d : 'Все поставки оформляются официально. Прозрачные условия без скрытых платежей.',
      why_card2_t : 'Реальные поставки',
      why_card2_d : 'Работаем с реальной техникой. Фото и видео с погрузки, склада и доставки.',
      why_card3_t : 'Прозрачный расчёт',
      why_card3_d : 'Калькулятор показывает, за что вы платите. Без «потом доплатите ещё».',
      why_card4_t : 'Подбор под бюджет',
      why_card4_d : 'Подбираем технику под задачу и бюджет, а не продаём «что есть».',
      why_card5_t : 'Сопровождение до регистрации',
      why_card5_d : 'Помогаем с документами, таможней и постановкой на учёт.',
      footer_terms: 'Пользовательское соглашение',
      footer_privacy: 'Политика конфиденциальности',
      loading: 'Загрузка...',
      loading_error: 'Ошибка загрузки каталога',

      body_all: 'Все типы',
      body_trailer: "Прицепы",
      body_semitrailer: "Полуприцепы",
      body_dumptruck: "Самосвал",
      body_tugboat: "Тягач",

      body_specialequipment: "Спец. техника",
      body_crane: "Кран",
      body_manipulator: "Манипулятор",
      body_mixer: "Миксер",
      body_fuel_tank: "Бензовоз",
      body_aerial_ladder: "Автовышка",
      body_sewer_cleaner: "Ассенизатор",

      body_refrigerator: "Рефрижератор",
      body_van: "Автофургон",
      body_sprinkler: "Поливомоечная машина",

      body_drilling_rig: "Ямобур машины для бурения",
      body_milk_truck: "Молоковоз",
      body_fuel_truck: "Топливозаправщик",

      calc_item_sbkts: 'СБКТС',
      calc_item_sos: 'Кнопка SOS',
      calc_item_customs_fee: 'Таможенный сбор',
      calc_item_broker_svh: 'Услуги брокера на СВХ',
      calc_item_svh: 'СВХ',
      calc_item_border_broker: 'Брокер на границе',
      calc_item_export_decl: 'Экспортная декларация',
      calc_item_transport_almaty: 'Доставка до Алматы',
      calc_item_epts: 'ЭПТС',
      calc_item_diesel_pack: 'Солярка + AdBlue пакет',
      calc_item_red_corridor: 'Коридор',
      calc_item_thanks_astana: '«Спасибо Астане»',
      calc_item_driver: 'Водитель',
      calc_item_insurance: 'Страховка',
      calc_item_toll_road: 'Платная дорога',

      calc_item_declaration: 'Декларация о соответствии',
      calc_item_customs_broker: 'Таможенный брокер',
      calc_item_driver: 'Водитель',
      calc_item_adblue: 'AdBlue',
      calc_item_toll_road: 'Платная дорога',
      calc_item_diesel: 'Солярка',
      calc_item_plate: 'Госномер и техпаспорт',
      calc_item_util_tax: 'Утилизационный сбор',
      calc_item_first_reg: 'Первичная регистрация',
      calc_item_srtc: 'Техпаспорт (СРТС)',
      calc_flag_intl_carrier: 'Есть удостоверение международного перевозчика (первичная регистрация не взимается для тягачей до 7 лет)',


      // TOTAL LABELS
      calc_total_vehicle: 'Стоимость авто',
      calc_total_clearance: 'Стоимость оформления',
      calc_total_turnkey: 'Итого под ключ',
      calc_year_label: 'Год выпуска',
      calc_item_broker_service: 'Услуги Брокера на СВХ',
      calc_disclaimer: '⚠️ Расчёт является предварительным и не является публичной офертой. Итоговая стоимость зависит от курса валют, таможенных платежей и условий поставки. Подробности уточняйте у менеджера.',
      body_car: 'Легковой автомобиль',
      calc_ts_bill_duty_percent: 'Ставка пошлины',
      why_card1_y: '✔ Работа по договору',
      why_card2_y: '✔ Фото и видео с погрузки и доставки',
      why_card3_y: '✔ Прозрачный расчёт без «вдруг доплатите»',
      why_card4_y: '✔ Помощь с таможней и регистрацией',
      btn_calculate_catalog: 'Подробнее и расчёт',
    },

    kk: {
      // ЖЕКЕ КАБИНЕТ (cab_*)
      cab_verified: 'расталған', cab_not_verified: 'расталмаған',
      cab_rolefull_CUSTOMER_PERSON: 'Клиент (жеке тұлға)', cab_rolefull_CUSTOMER_COMPANY: 'Клиент (заңды тұлға)',
      cab_rolefull_SERVICE_BROKER: 'Брокер (УСҚ)', cab_rolefull_SERVICE_SVH: 'УСҚ', cab_rolefull_SERVICE_LAB: 'Зертхана',
      cab_rolefull_SERVICE_LOGISTIC: 'Логист', cab_rolefull_SERVICE_DECLARANT: 'Декларант (шекара)', cab_rolefull_BANK: 'Банк',
      cab_rolefull_PARTNER: 'Серіктес-сатушы', cab_rolefull_MANAGER: 'Менеджер', cab_rolefull_ADMIN: 'Әкімші',
      cab_role_BROKER: 'Брокер (УСҚ)', cab_role_SVH: 'УСҚ', cab_role_LAB: 'Зертхана', cab_role_LOGISTIC: 'Логист', cab_role_DECLARANT: 'Декларант', cab_role_BANK: 'Банк',
      cab_astatus_PENDING: 'Күтуде', cab_astatus_IN_PROGRESS: 'Жұмыста', cab_astatus_DONE: 'Аяқталды',
      cab_stage_AGREEMENT: 'Келісу', cab_stage_CONTRACT: 'Шарт', cab_stage_PURCHASE_CHINA: 'Қытайда сатып алу', cab_stage_DELIVERY_KZ: 'ҚР-ға жеткізу', cab_stage_SVH: 'УСҚ', cab_stage_CUSTOMS: 'Кеден', cab_stage_DELIVERY_CLIENT: 'Клиентке жеткізу', cab_stage_COMPLETED: 'Аяқталды',
      cab_timeline_head: 'Мәміле кезеңдері', cab_plan_head: 'Мәміле жоспары', cab_payments_head: 'Төлемдер', cab_docs_head: 'Құжаттар', cab_media_head: 'Фото және видео', cab_expenses_head: 'Шығыстар', cab_expenses_internal: '(тек менеджер көреді)', cab_activity_head: 'Өзгерістер тарихы', cab_chat_head: 'Мәміле бойынша чат',
      cab_loading: 'Жүктелуде...', cab_payments_empty: 'Әзірге төлемдер жоқ.', cab_docs_empty: 'Әзірге құжаттар жоқ.', cab_expenses_empty: 'Әзірге шығыстар жоқ.', cab_media_empty: 'Фото және видео әлі қосылмаған.', cab_plan_empty: 'Жоспар әлі құрылмаған. Төменнен кезеңдер қосыңыз.', cab_chat_empty: 'Әзірге хабарлама жоқ', cab_notif_empty: 'Әзірге хабарландыру жоқ', cab_leads_empty: 'Әзірге өтінімдер жоқ.', cab_listings_empty: 'Әзірге хабарландырулар жоқ.',
      cab_deals_empty_mgr: 'Әзірге мәмілелер жоқ.', cab_deals_empty_customer: 'Сізде әзірге мәмілелер жоқ. Мәмілені каталогтағы нақты техника бетінен «Мәміле рәсімдеу» батырмасымен рәсімдеуге болады.', cab_deals_empty_assignee: 'Сізге әзірге бірде-бір мәміле тағайындалмаған.', cab_role_wip: 'Бұл рөл үшін жеке кабинет әзірленуде.',
      cab_load_error: 'Жүктеу қатесі', cab_load_error_summary: 'Жиынтықты жүктеу қатесі', cab_load_error_finance: 'Қаржыны жүктеу қатесі', cab_load_error_leads: 'Өтінімдерді жүктеу қатесі', cab_load_error_deals: 'Мәмілелерді жүктеу қатесі', cab_error: 'Қате',
      cab_confirmed: 'Расталды', cab_pending: 'Күтуде', cab_paid: 'Төленді', cab_of: '/', cab_deal_value: 'Мәміле құны, ₸:', cab_not_set: 'көрсетілмеген', cab_save: 'Сақтау', cab_saved: 'Сақталды', cab_sum_ph: 'Сома, ₸', cab_confirmed_lc: 'расталды', cab_add_payment: 'Төлем қосу',
      cab_download: 'Жүктеп алу', cab_no_file: 'файл жоқ', cab_doc_generic: 'Құжат', cab_upload: 'Жүктеу', cab_doc_CONTRACT: 'Шарт', cab_doc_GTD: 'ГТД', cab_doc_CMR: 'CMR', cab_doc_ACCEPTANCE: 'Қабылдау актісі', cab_doc_PHOTO: 'Фото',
      cab_exp_total: 'Шығыстар жиыны', cab_exp_note_ph: 'Түсініктеме (міндетті емес)', cab_add_expense: 'Шығыс қосу', cab_del_expense_confirm: 'Осы шығысты жою керек пе?', cab_exp_PURCHASE: 'Қытайда сатып алу', cab_exp_LOGISTICS: 'Логистика / жеткізу', cab_exp_CUSTOMS: 'Кедендік рәсімдеу', cab_exp_CERTIFICATION: 'Сертификаттау (СБКТС/ЭПТС)', cab_exp_SVH: 'УСҚ / сақтау', cab_exp_OTHER: 'Басқа',
      cab_stage_name_ph: 'Кезең атауы', cab_add_stage: 'Кезең қосу', cab_del_stage_confirm: 'Кезеңді жою керек пе?', cab_up: 'Жоғары', cab_down: 'Төмен', cab_delete: 'Жою',
      cab_media_caption_ph: 'Қолтаңба (міндетті емес)', cab_media_or: 'немесе видео сілтемесі:', cab_add: 'Қосу', cab_video: 'Видео', cab_photo_alt: 'Мәміле фотосы', cab_del_media_confirm: 'Осы файлды галереядан жою керек пе?', cab_media_need_one: 'Фото тіркеңіз немесе видео сілтемесін көрсетіңіз.', cab_media_only_one: 'Біреуін ғана: не фото, не видео сілтемесі.',
      cab_internal_tag: 'ішкі', cab_system: 'Жүйе', cab_chat_ph: 'Хабарлама жазу...', cab_send: 'Жіберу',
      cab_created: 'Құрылды', cab_client: 'Клиент', cab_deal_num: 'Мәміле', cab_no_assignee: 'Әзірге ешкім тағайындалмаған', cab_not_assigned: '— тағайындалмаған', cab_you: '(сіз)', cab_note_ph: 'Ескертпе',
      cab_tile_total: 'Барлық мәмілелер', cab_tile_active: 'Белсенді', cab_tile_completed: 'Аяқталған', cab_tile_leads_open: 'Өтінімдер (ашық)',
      cab_convert_confirm: 'Осы өтінімнен мәміле құру керек пе? Клиент телефон бойынша табылады немесе автоматты түрде құрылады.', cab_creating: 'Құрылуда…', cab_convert_new_client: 'Нөмір бойынша жаңа клиент құрылды:', cab_convert_found_client: 'Нөмір бойынша клиент табылды:', cab_deal_created: 'Мәміле құрылды',
      cab_no_name: 'Атауы жоқ', cab_create_deal: 'Мәміле құру', cab_lead_deal_num: 'Мәміле', cab_lead_new: 'Жаңа', cab_lead_in_progress: 'Жұмыста', cab_lead_won: 'Ұтылды', cab_lead_lost: 'Жеңілді',
      cab_assign_head: 'Кезеңге сервис тағайындау', cab_assign_btn: 'Тағайындау', cab_delete_deal: 'Мәмілені жою', cab_unassign: 'Тағайындауды алып тастау', cab_no_service_users: 'Қолайлы аккаунттар жоқ', cab_pick_user: 'Орындаушыны таңдаңыз', cab_confirm_unassign: 'Осы кезеңнен тағайындауды алып тастау керек пе?', cab_confirm_delete_deal: 'Мәмілені толық жою керек пе? Әрекет қайтарылмайды.',
      cab_tab_active: 'Белсенді', cab_tab_done: 'Аяқталған', cab_no_done: 'Әзірге аяқталған мәмілелер жоқ',
      cab_profile_head: 'Менің деректерім', cab_profile_name: 'Аты / компания', cab_profile_phone: 'Телефон (логин)', cab_profile_email: 'E-mail', cab_profile_pw_head: 'Құпиясөзді ауыстыру', cab_profile_old_pw: 'Ағымдағы құпиясөз', cab_profile_new_pw: 'Жаңа құпиясөз', cab_profile_change_pw: 'Құпиясөзді ауыстыру', cab_pw_changed: 'Құпиясөз өзгертілді',
      cab_download_kp: 'КП жүктеп алу', cab_send_kp: 'КП поштаға жіберу', cab_kp_sent: 'КП жіберілді', cab_kp_no_recipient: 'Алушы жоқ: клиенттің e-mail-ін көрсетіңіз',
      cab_fin_value: 'Мәмілелер құны', cab_fin_received: 'Түсті', cab_fin_expenses: 'Шығыстар', cab_fin_profit: 'Пайда', cab_fcol_deal: 'Мәміле', cab_fcol_stage: 'Кезең', cab_fcol_value: 'Құны', cab_fcol_received: 'Түсті', cab_fcol_balance: 'Қалдық', cab_fcol_expenses: 'Шығыстар', cab_fcol_profit: 'Пайда', cab_fin_hint: 'Пайда = мәміле құны − шығыстар. Тек құны көрсетілген мәмілелер үшін көрсетіледі.',
      cab_listing_sent: 'Хабарландыру модерацияға жіберілді', cab_listing_num: 'Хабарландыру', cab_listing_approved: 'Мақұлданды, каталогта көрінеді', cab_listing_pending: 'Модерацияда',
      cab_summary: 'Жиынтық', cab_finance_head: 'Мәмілелер бойынша қаржы', cab_leads_head: 'Сайттан келген өтінімдер',
      cab_partner_intro: 'Серіктес-сатушы мәміле емес, өз тауар каталогын жүргізеді — хабарландыруларды жоғарыдағы бөлімнен басқарыңыз. Мақұлданған тауарлар жалпы каталогта көрсетіледі.', cab_listing_delete_confirm: 'Осы хабарландыруды жою керек пе?', cab_lst_total: 'Тауарлар', cab_lst_approved: 'Мақұлданған', cab_lst_moderation: 'Модерацияда',
      cab_asum_head: 'Менің тапсырмаларым',
      cab_how_to_pay: 'Қалай төлеу керек',

      reviews_title1: 'Клиент орнындағы жабдық',
      reviews_title2: 'Жаңа көлігі бар тұтынушы',
      reviews_title3: 'Жүк көлігін жеткізу туралы тұтынушылардың кері байланысы',
      nav_home: 'Басты бет',
      nav_catalog: 'Каталог',
      nav_services: 'Қызметтер',
      nav_contacts: 'Байланыс',
      nav_calculator: 'Калькулятор',
      help_call: 'Қоңырау шалу', help_whatsapp: 'WhatsApp', help_font_title: 'Мәтін өлшемін ұлғайту',
      product_cta_kp: 'ОСЫ ТЕХНИКАҒА КП АЛУ', product_cta_breakdown: 'БАҒАНЫ ҚАДАМДАП ТАЛДАУ', product_price_note: 'Баж, ҚҚС, сертификаттау, жеткізу және есепке қою кіреді.', product_how_head: 'САТЫП АЛУ ҚАЛАЙ ӨТЕДІ', product_how_media: 'Әр кезеңде жібереміз — зауыттан бергенге дейін.', spec_brand: 'БРЕНД', spec_model: 'МОДЕЛЬ', spec_year: 'ШЫҒАРЫЛҒАН ЖЫЛЫ', spec_category: 'САНАТ', spec_mileage: 'ЖҮРІСІ, КМ',
      help_write: 'Жазу',
      vp_row_wheel: 'ДӨҢГЕЛЕК ФОРМУЛАСЫ', vp_row_mass: 'ТОЛЫҚ МАССА, Т', vp_row_payload: 'ЖҮК КӨТЕРІМДІЛІГІ, Т', vp_row_power: 'ҚОЗҒАЛТҚЫШ, А.К.', vp_row_gearbox: 'БЕРІЛІС ҚОРАБЫ', vp_price_label: 'АЛМАТЫДА КІЛТТІ БҰРАП', vp_cta: 'КІЛТТІ БАҒАНЫ ЕСЕПТЕУ', vp_cta_kp: 'КП АЛУ', vp_price_on_request: '— сұраныс бойынша', vp_owner_client: 'клиенттен', vp_avail_in_stock: 'ҚОЛДА БАР', vp_avail_on_order: 'ТАПСЫРЫСПЕН', vp_avail_out_of_stock: 'ЖОҚ', catalog_rule_title: 'Алаң', filter_search_label: 'Іздеу', filter_brand_label: 'Марка', filter_wheel_label: 'Дөңгелек формуласы', nav_menu: 'МӘЗІР',
      calc_rule_title: 'Есеп', calc_stage_factory: 'Зауыт · ҚХР', calc_stage_border: 'Шекара · Қорғас', calc_stage_cert: 'Сертификаттау және ресімдеу', calc_stage_delivery: 'Жеткізу', calc_stage_reg: 'Есепке қою · Тіркеу', calc_real_row: 'Техника бағасы', aside_total_label: 'Барлығы · Алматыда кілтті бұрап',
      hp_hero_h1: 'Қытайдан арнайы техника — теңгеге дейінгі бағамен', hp_hero_sub: 'Алматыға дейінгі толық құнды есептейміз: техника, баж, ҚҚС, жеткізу, кәдеге жарату алымы, есепке қою. «Кейін қосымша төлейсіз» дегенсіз.', hp_cta_price: 'Кілтті бағаны көрсету', hp_meta_units: 'алаңда', hp_meta_rate: 'бағам', hp_rule_route: 'Сайт бойынша бағыт', hp_rule_included: 'Не кіреді', hp_rule_deal: 'Жүк бағыты', hp_rule_safe: 'Неліктен бұл қауіпсіз', hp_rule_gallery: 'Не тасимыз', hp_rule_reviews: 'Клиенттер', hp_trust_title: 'Ақша мен құжаттар шарт бойынша', hp_led_stage: 'Кезең', hp_led_work: 'Жұмыс', hp_led_incl: 'Кіреді', hp_led_yes: 'кіреді', hp_led_cert_work: 'Зертхана, СБКТС және ЭПТС — өзіміз ресімдейміз.', hp_close_t: 'Сізде де солай болсын ба? Міндетіңіз бен бюджетіңізге техника таңдаймыз.', hp_close_cta: 'Өтінім қалдыру', hp_vehicles_empty: 'Әзірге каталогта қолжетімді техника жоқ.', hp_vehicles_error: 'Каталогты жүктеу мүмкін болмады', stage_factory: 'Зауыт', stage_factory_s: 'ҚХР', stage_khorgos: 'Қорғас', stage_khorgos_s: 'шекара', stage_customs: 'Кеден', stage_customs_s: 'ЖКД', stage_cert: 'СБКТС', stage_cert_s: 'зертхана', stage_almaty: 'Алматы', stage_almaty_s: 'қойма', stage_handover: 'Беру', stage_handover_s: 'құжаттар', stage_delivery: 'Жеткізу', stage_reg: 'Есепке қою',
      cab_pending_title: 'Аккаунт растауды күтуде', cab_pending_text: 'Әкімші компания деректерін тексеруде. Расталғаннан кейін сізге тағайындалған мәмілелер осы жерде пайда болады — хабарлаймыз.',
      cab_rule_title: 'Мәміле', cab_rail_now: 'қазір', cab_rail_planned: 'жоспар', cab_rail_late: 'мерзімі өтті', cab_rail_now_head: 'Қазір', cab_rail_late_head: 'Мерзімі өтті',
      vp_no_photo: 'ФОТО ЖОҚ',
      fav_rule_title: 'Сақталған', fav_loading: 'Жүктелуде…', fav_load_error: 'Таңдаулылардағы техниканың бір бөлігін жүктеу мүмкін болмады — бетті жаңартып көріңіз.',
      contacts_rule_title: 'Байланыс', blog_rule_title: 'Материалдар', contact_cta: 'Маған қоңырау шалыңыз',
      hp_services_h2: 'Есепке қоюға дейінгі толық цикл',
      product_cta_request: 'Осы техникаға өтінім қалдыру',
      cat_empty_t: 'Бұл сұраныс бойынша ештеңе табылмады', cat_empty_d: 'Басқа тапсырманы таңдап көріңіз немесе барлығын қараңыз. Не қоңырау шалыңыз — тапсырмаңыз бен бюджетіңізге сай таңдаймыз.', cat_error_t: 'Каталогты жүктеу мүмкін болмады', cat_error_d: 'Бетті жаңартыңыз немесе қоңырау шалыңыз — қолда не бар екенін айтамыз.', contact_ok_t: 'Өтінім жіберілді!', contact_ok_d: 'Менеджер жұмыс уақытында қоңырау шалып, толықтырады. Шұғыл болса — өзіңіз қоңырау шалыңыз.', contact_ok_catalog: 'Каталогты қарау',
      route_title: 'Неден бастау керек — қадам-қадаммен', route_sub: 'Сайтта алғаш рет болсаңыз, ретімен жүріңіз. Кез келген қадамда қоңырау шалуға болады — көмектесеміз.', route1_t: 'Техниканы қараңыз', route1_d: 'Каталогта не істеу керегін таңдаңыз — құм, жүк тасу немесе құрылыста көтеру. Қолайлы көліктерді көрсетеміз.', route1_go: 'Каталогты ашу →', route2_t: '«Кілтті бұрап мінетін» бағаны біліңіз', route2_d: 'Калькулятор кедендік рәсімдеу мен жеткізуді қоса қорытынды соманы көрсетеді. Есептегіңіз келмесе — үш сұраққа жауап беріңіз, өзіміз есептейміз.', route2_go: 'Құнын есептеу →', route3_t: 'Өтінім қалдырыңыз', route3_d: 'Аты-жөні мен телефон жеткілікті. Менеджер қоңырау шалып, толықтырып, коммерциялық ұсыныс жібереді.', route3_go: 'Өтінім қалдыру →', route4_t: 'Мәмілені бақылаңыз', route4_d: 'Шарт жасалғаннан кейін жеке кабинетте көлігіңіздің қайда екені көрінеді: төлем, жеткізу, кеден, беру.', route4_go: 'Жеке кабинет →', task_head: 'Сізге не істеу керек?', task_all: 'Барлығын көрсету', task_dump: 'Құм, қиыршықтас, топырақ тасу', task_tractor: 'Алыс қашықтыққа жүк тасу', task_semi: 'Техника мен ұзын жүк тасу', task_trailer: 'Тартқышқа тіркеме қосу', task_crane: 'Құрылыста жүк көтеру', task_more: 'Нақтылау: марка, дөңгелек формуласы, сұрыптау', task_less: 'Нақтылауды жасыру',
      card_no_name: 'Техника',
      trust1_t: 'Ресми шарт', trust1_d: 'Барлық шарттар мен мерзімдер қағазда жазылған. Жасырын қосымша төлемдер жоқ.', trust2_t: 'Банк арқылы төлем', trust2_d: 'Ақша шарт бойынша компанияның есепшотына түседі — жеке тұлғаның картасына емес.', trust3_t: 'Құжаттардың толық топтамасы', trust3_d: 'ЭПТС, СБКТС және кеден құжаттарын өзіміз рәсімдейміз — техниканы есепке қоюға дайын күйде аласыз.', trust4_t: 'Тірі менеджер', trust4_d: 'Өзіңіз түсінудің қажеті жоқ — қоңырау шалыңыз, техниканы таңдап, құнын есептеп береміз.',
      calc_total_plain: 'Бұл — Алматыдағы «кілтті бұрап мінетін» баға: кедендік рәсімдеу, құжаттар, сертификаттау және жеткізу кіреді. Үстіне қосымша төлеудің қажеті жоқ.',
      hint_epts: 'ЭПТС — көліктің электронды паспорты. Онсыз көлікті есепке қою мүмкін емес. Біз рәсімдейміз.', hint_sbkts: 'СБКТС — конструкция қауіпсіздігі туралы куәлік. Техниканың ЕАЭО нормаларына сай екенін растайды.', hint_sos: 'ЭРА/СОС түймесі — шұғыл шақыру жүйесі. Есепке қою үшін міндетті. Зертханада орнатамыз.', hint_customs_fee: 'Кеден алымы — декларацияны рәсімдеу үшін тіркелген мемлекеттік төлем.', hint_broker: 'Брокер — кедендегі құжаттарды сіздің орныңызға рәсімдейтін маман.', hint_svh: 'СВХ — уақытша сақтау қоймасы: кедендік рәсімдеу кезінде техника сонда тұрады.', hint_red_corridor: 'Қызыл дәліз — кедендегі тереңдетілген тексеру. Сома күтпеген жерден өспеуі үшін алдын ала есептейміз.', hint_declarant: 'Шекарадағы декларант — техниканың Қазақстанға кіруін рәсімдейді.', hint_export_decl: 'Экспорттық декларация — техниканы Қытайдан шығаруға арналған құжат.', hint_plate: 'Мемнөмір және техпаспорт — Авто ЦОН-да тіркеу, содан кейін жүруге болады.', hint_first_reg: 'Алғашқы тіркеу — Қазақстанда есепке қою кезіндегі біржолғы мемлекеттік алым.', hint_adblue: 'AdBlue — Евро-5 қозғалтқыштарының пайдаланылған газын тазарту сұйықтығы.',
      kpb_head: 'КП қолмен жасау', kpb_toggle: 'Ашу', kpb_hide: 'Жию', kpb_pick: 'Каталогтан техника (міндетті емес)', kpb_search_ph: 'Іздеу: shacman, өзі аударғыш…', kpb_manual: '— қолмен енгізу —', kpb_title: 'Техника атауы', kpb_desc: 'Сипаттама / жинақталуы', kpb_desc_ph: 'Қозғалтқыш, қуаты, массасы, жабдығы…', kpb_price_usd: 'Бағасы, USD', kpb_price_cny: 'Бағасы, CNY', kpb_price_kzt: 'Сомасы, ₸', kpb_qty: 'Саны', kpb_buyer: 'Сатып алушы', kpb_number: 'КП нөмірі', kpb_avail: 'Қолда бары', kpb_avail_ph: 'Хоргос қаласында 15 бірлік қолда бар.', kpb_timeline: 'Жеткізу мерзімдері (әр жолға бір тармақ, бос болса — үлгіден)', kpb_timeline_ph: 'Экспорттық декларация — 2 күн.', kpb_email: 'Алушының e-mail-і (жіберу үшін)', kpb_download: 'PDF жүктеп алу', kpb_send: 'Поштаға жіберу', kpb_need_email: 'Алушының e-mail-ін көрсетіңіз',
      scalc_title: 'Есептеулерді өзіңіз шешкіңіз келмей ме?', scalc_sub: 'Үш сұраққа жауап беріңіз — біз бәрін есептеп, қоңырау шаламыз.', scalc_q1: '1. Қандай техника қажет?', scalc_q2: '2. Қандай сомаға есептеп отырсыз? (міндетті емес)', scalc_q3: '3. Телефоныңыз — қоңырау шалып, бәрін түсіндіреміз', scalc_need_tractor: 'Тартқыш', scalc_need_dump: 'Өзі аударғыш', scalc_need_crane: 'Кран', scalc_need_trailer: 'Тіркеме / трал', scalc_need_car: 'Жеңіл автокөлік', scalc_need_unsure: 'Әзірге білмеймін', scalc_budget_ph: 'мысалы, 35 млн ₸ дейін', scalc_name_ph: 'Атыңыз (міндетті емес)', scalc_send: 'Есептеу алу', scalc_sent: 'Рақмет! Жақын арада қоңырау шаламыз.', scalc_need_phone: 'Телефон нөміріңізді жазыңыз — біз қоңырау шаламыз', scalc_error: 'Қате', scalc_show_detailed: 'Толық есептеуді көрсету', scalc_hide_detailed: 'Толық есептеуді жасыру',
      contact_msg_label_opt: 'Хабарлама (міндетті емес)', contact_need_phone: 'Телефон нөміріңізді жазыңыз — біз қоңырау шаламыз',
      brand_subtitle: 'ҚЫТАЙДАН АРНАЙЫ ТЕХНИКА',
      nav_how_it_works: 'Бұл қалай жұмыс істейді',
      nav_favorites: 'Таңдаулылар',
      nav_blog: 'Блог',
      nav_login: 'Кіру',
      nav_account: 'Жеке кабинет',
      nav_not_verified: 'расталмаған',
      nav_logout_confirm: 'Аккаунттан шығу керек пе?',
      title_register: 'China Motors - Тіркелу',
      title_login: 'China Motors - Кіру',
      register_hero: 'Тіркелу',
      register_tagline: 'China Motors клиент аккаунтын жасаңыз',
      register_tab_person: 'Жеке тұлға',
      register_tab_company: 'Заңды тұлға',
      register_person_note: 'Жеке тұлға жеңіл автокөлік сатып ала алады. Коммерциялық техника үшін заңды тұлға ретінде тіркеліңіз.',
      register_company_note: 'Заңды тұлғалар әртүрлі коммерциялық техниканы сатып ала алады.',
      register_phone_label: 'Телефон',
      register_password_label: 'Құпия сөз',
      register_fullname_label: 'Аты-жөні',
      register_iin_label: 'ЖСН (келісімшарт үшін)',
      register_companyname_label: 'Компания атауы',
      register_bin_label: 'БСН (келісімшарт үшін)',
      register_address_label: 'Заңды мекенжай',
      register_submit: 'Аккаунт жасау',
      register_have_account: 'Аккаунтыңыз бар ма? Кіру',
      register_err_required: 'Міндетті өрістерді толтырыңыз',
      register_success: 'Тіркелу аяқталды! Аккаунт әкімші растауын күтуде.',
      login_hero: 'Кіру',
      login_tagline: 'China Motors жеке кабинетіне кіріңіз',
      login_submit: 'Кіру',
      login_no_account: 'Аккаунтыңыз жоқ па? Тіркелу',
      login_success: 'Кіру сәтті өтті!',
      register_tab_service: 'Сервистік серіктес (СВХ)',
      register_tab_bank: 'Банк',
      register_tab_partner: 'Серіктес-сатушы (Қытай)',
      register_service_note: 'Рөлді таңдаңыз. Аккаунт әкімші растауын күтеді.',
      register_service_role_label: 'Рөл',
      register_service_role_placeholder: '— таңдау —',
      register_role_declarant: 'Декларант (шекара)',
      register_role_logistic: 'Логист',
      register_role_lab: 'Зертхана',
      register_role_svh: 'СВХ',
      register_role_broker: 'Брокер (СВХ)',
      register_bank_note: 'Банк аккаунты мәміле бойынша есеп айырысуды сүйемелдеу үшін қолданылады.',
      register_bankname_label: 'Банк атауы',
      register_bik_label: 'БСК',
      register_partner_note: 'Серіктес кабинет алады және техника хабарландыруларын жүктейді — олар әкімші модерациясынан өтеді.',
      register_country_label: 'Ел',
      register_regno_label: 'Компанияның тіркеу нөмірі (келісімшарт үшін)',
      title_account: 'China Motors - Жеке кабинет',
      account_hero: 'Жеке кабинет',
      account_logout: 'Шығу',
      account_loading: 'Жүктелуде...',
      account_my_listings_title: 'Менің хабарландыруларым',
      account_new_listing: 'Хабарландыру орналастыру',
      account_listing_brand_label: 'Бренд',
      account_listing_title_label: 'Атауы / моделі',
      account_listing_category_label: 'Санаты',
      account_listing_city_label: 'Қала',
      account_listing_weight_label: 'Салмағы, т',
      account_listing_power_label: 'Қозғалтқыш қуаты, а.к.',
      account_listing_load_capacity_label: 'Жүк көтергіштігі, т',
      account_listing_price_kzt_label: 'Бағасы, ₸',
      account_listing_photos_label: 'Фотосуреттер',
      account_listing_description_label: 'Сипаттама',
      badge_user_listing_prefix: 'Хабарландыру:',
      product_create_deal: 'Мәміле рәсімдеу',
      product_secure_note: 'Банк арқылы қауіпсіз төлем · құжаттардың толық жинағы',
      product_extra_title: 'Жиынтықтама және сипаттамалар',
      product_cta_title: 'Осы техниканы сатып алғыңыз келе ме?',
      product_cta_sub: 'Толық құнын есептейміз және шарт бойынша мәміле рәсімдейміз.',
      product_cta_ask: 'Сұрақ қою',

      brand_title: 'China Motors',
      hero_title_main: 'Қытайдан арнайы техника мен автомобильдер, кілт тапсыру форматында',
      hero_tagline: 'Таңдау • есептеу • жеткізу • кеден • ҚР-да есепке қою',
      hp_hero_badge: 'ҚЫТАЙ ЗАУЫТТАРЫНАН ТІКЕЛЕЙ ЖЕТКІЗУ',
      hp_bullet1: 'Ресми шарт',
      hp_bullet2: 'Ақшаны банк қорғайды',
      hp_bullet3: 'Құжаттардың толық жинағы',
      hp_bullet4: '2024 жылдан бері',
      hp_cta_offer: 'КП алу',
      hp_cta_catalog: 'Каталогты қарау →',

      // --- КП беті (kp.html) ---
      title_kp: 'China Motors — Коммерциялық ұсыныс',
      kp_rule_title: 'Коммерциялық ұсыныс',
      kp_meta_number: 'НӨМІРІ', kp_meta_date: 'КҮНІ', kp_meta_buyer: 'САТЫП АЛУШЫ',
      kp_meta_valid: 'ЖАРАМДЫЛЫҚ МЕРЗІМІ',
      kp_rates_t: 'Валюта бағамы уақытша қолжетімсіз',
      kp_rates_d: 'Ұсыныстағы баға берілген күнгі Ұлттық банк бағамы бойынша есептеледі. Бағам түспегенше құжат шығарылмайды — кейінірек көріңіз немесе қоңырау шалыңыз, КП-ны өзіміз жібереміз.',
      kp_download_signed: 'ҚОЛТАҢБАМЕН ЖҮКТЕУ',
      kp_download_signed_note: 'компания мөрімен · жақында',
      kp_download_signed_ready: 'компания мөрімен',
      kp_download_page: 'САЙТТАҒЫДАЙ ЖҮКТЕУ',
      kp_download_page_note: 'осы бет, мөрсіз',
      kp_share: 'БӨЛІСУ',
      kp_share_copied: 'Сілтеме көшірілді',
      kp_share_failed: 'Сілтемені мекенжай жолынан көшіріңіз',
      kp_seller_head: 'САТУШЫ',
      kp_seller_address: 'МЕКЕНЖАЙЫ', kp_seller_bank: 'БАНК',
      kp_seller_bank_address: 'БАНК МЕКЕНЖАЙЫ', kp_seller_account: 'ШОТ', kp_seller_swift: 'SWIFT',
      kp_subject_head: 'ҰСЫНЫС ПӘНІ',
      kp_col_qty: 'САНЫ', kp_col_usd: 'БАҒАСЫ, USD', kp_col_cny: 'БАҒАСЫ, CNY', kp_col_kzt: 'СОМАСЫ, ₸',
      kp_specs_head: 'СИПАТТАМАЛАРЫ', kp_on_request: 'сұраныс бойынша',
      kp_breakdown_head: 'КІЛТТІ БҰРАП ҚҰНЫН ЕСЕПТЕУ',
      kp_total_label: 'АЛМАТЫДА КІЛТТІ БҰРАП',
      kp_total_note: 'Бұл — түпкілікті сома. Үстіне қосымша төлейтін ештеңе жоқ.',
      kp_terms_head: 'ЖЕТКІЗУ ШАРТТАРЫ', kp_timeline_head: 'МЕРЗІМДЕРІ',
      kp_service_head: 'СЕРВИС ЖӘНЕ КЕПІЛДІК',
      kp_foot_note: 'Ұсыныс бойынша сұрақтар болса — қоңырау шалыңыз немесе жазыңыз, осы КП бойынша жауап береміз.',
      kp_foot_contacts: 'МЕНЕДЖЕРГЕ ЖАЗУ',
      kp_loading: 'Коммерциялық ұсынысты дайындап жатырмыз…',
      kp_error_t: 'Ұсынысты жинау мүмкін болмады',
      kp_error_d: 'Бетті қайта ашыңыз немесе қоңырау шалыңыз — КП-ны өзіміз жібереміз.',
      kp_error_catalog: 'КАТАЛОГҚА',
      hp_calc_widget_title: 'Құнын есептеу',
      hp_calc_category: 'Санат',
      hp_calc_brand: 'Марка',
      hp_calc_submit: 'Құнын есептеу',
      hp_calc_widget_note: 'тегін және еш нәрсеге міндеттемейді',
      hp_services_title: 'Біздің қызметтер',
      hp_services_sub: 'Техниканы жеткізу және қызмет көрсету бойынша кешенді шешімдер',
      hp_service1_t: 'Тапсырыс және жеткізу',
      hp_service1_d: 'Қытайдан қажеттіліктеріңізге сай автомобильдер мен арнайы техника.',
      hp_service2_t: 'Кедендік ресімдеу',
      hp_service2_d: 'Кедендік тазартуға көмек.',
      hp_service3_t: 'Жеткізу',
      hp_service3_d: 'Хоргостан Алматыға дейін жеткізу.',
      hp_service4_t: 'Мемлекеттік нөмір',
      hp_service4_d: 'Мемлекеттік нөмір алуға көмек.',
      hp_process_title: 'Мәміле қалай өтеді',
      hp_step1_t: 'Техниканы таңдау',
      hp_step1_d: 'Міндеттер мен бюджетке сай модель таңдаймыз',
      hp_step2_t: 'Коммерциялық ұсыныс',
      hp_step2_d: 'Толық спецификациямен құнын есептеу',
      hp_step3_t: 'Шарт және төлем',
      hp_step3_d: 'Банк арқылы қауіпсіз төлем, құжаттардың толық жинағы',
      hp_step4_t: 'Жеткізу және кеденнен өткізу',
      hp_step4_d: 'Қытайдан логистика және кедендік ресімдеу',
      hp_step5_t: 'Техниканы алу',
      hp_step5_d: 'Техниканы беру және құжаттардың толық жинағы',
      hp_vehicles_title: 'Танымал техника',
      hp_vehicles_link: 'Барлық каталогты қарау →',
      hp_vehicles_loading: 'Жүктелуде...',
      hp_vehicle_cta: 'КП алу',
      hp_stats_label: 'БІЗГЕ СЕНЕДІ',
      hp_stat1: 'клиент',
      hp_stat2: 'шарт бойынша мәміле',
      hp_stat3: 'бірлік техника',
      hp_stat4: 'нарықта',
      hp_stat4_years: 'жыл',
      footer_address_khorgos: 'Хоргос қ. — қойма және жөнелту',
      hp_contact_reach_title: 'Бізбен байланысыңыз',
      hp_contact_phone_label: 'Телефон',
      hp_contact_address_label: 'Мекенжайлар',
      hp_contact_whatsapp: 'WhatsApp-қа жазу',
      footer_address_almaty: 'Алматы қ. — техниканы беру',
      footer_col1_text: 'Қытайдан сенімді техника — тапсырыспен және дайын тұрған. Хоргостан Алматыға дейін жеткізу, мәмілені толық сүйемелдеу. 2024 жылдан бері жұмыс істейміз.',
      footer_col2_title: 'Навигация',
      footer_col3_title: 'Байланыс',
      footer_col4_title: 'Әлеуметтік желілер',
      footer_copy: '© 2026 China Motors. Барлық құқықтар қорғалған.',
      footer_devnote: 'Сайттағы ақпарат анықтамалық сипатта болып табылады және ашық ұсыныс емес',
      btn_photos: 'Фотосуреттер',
      btn_calculate: 'Есептеу',
      btn_send: 'Жіберу',
      btn_refresh_rate: 'Курсты жаңарту',
      search_placeholder: 'Іздеу...',

      about_title: 'Біз туралы',
      about_p1: 'China Motors — Қорғас қаласынан Қытай техникасын жеткізетін сенімді серіктес. 2024 жылдан бері сапалы көліктер мен кедендік рәсімдеуге көмектесеміз.',
      about_p2: 'Миссиямыз — клиенттерді қолжетімді бағамен сапалы техникамен қамтамасыз ету.',
      about_card1_t: 'Кең таңдау',
      about_card1_d: 'Әртүрлі арнайы техника модельдері.',
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
      catalog_subhead: 'China Motors техника каталогы',
      catalog_found: 'Табылды',

      // FAVORITES
      title_favorites: 'China Motors - Таңдаулылар',
      fav_subtitle: 'Сақталған техника — салыстырыңыз және есептеу сұраңыз',
      fav_saved_count: 'Сақталды',
      fav_cta_title: 'Барлық тізім бойынша есептеу сұрау',
      fav_cta_sub: 'Таңдаулыдағы әр позиция бойынша КҰ жібереміз — Алматыға жеткізумен.',
      fav_cta_btn: 'Тізім бойынша КҰ алу',
      fav_empty_title: 'Таңдаулылар әзірге бос',
      fav_empty_sub: 'Каталогтағы техника карточкаларындағы бетбелгіні басыңыз — олар осында пайда болады.',
      fav_empty_btn: 'Каталогқа өту',
      fav_remove_title: 'Таңдаулылардан алып тастау',
      fav_request_btn: 'КҰ алу',

      // BLOG
      title_blog: 'China Motors - Блог',
      blog_hero: 'Блог',
      blog_subhead: 'Қытайдан техника, жеткізу және мәміле рәсімдеу туралы мақалалар мен нұсқаулықтар',
      blog_read_more: 'Оқу →',
      blog1_date: 'Нұсқаулық',
      blog1_title: 'Мәміле қалай өтеді: өтінімнен техниканы алуға дейін',
      blog1_excerpt: 'Модельді таңдаудан техниканы құжаттардың толық жинағымен беруге дейінгі бес қадам — әр кезеңде не болатыны.',
      blog2_date: 'Нұсқаулық',
      blog2_title: 'Арнайы техниканы қалай таңдау керек: самосвал, тартқыш немесе манипулятор',
      blog2_excerpt: 'Нақты тапсырмаға техника таңдағанда нені ескеру керек — жүк түрі, қашықтық, бюджет және пайдалану жиілігі.',
      blog3_date: 'Нұсқаулық',
      blog3_title: 'Қытайдан техниканы жеткізу: Хоргостан Алматыға дейінгі жол',
      blog3_excerpt: 'Техника Хоргостағы қоймадан Алматыға қалай жетеді — кезеңдер, құжаттар және біз әр қадамда не көрсетеміз.',

      filter_body_label: 'Көлік түрі',
      filter_source_label: 'Дереккөз',
      filter_source_all: 'Барлық хабарландырулар',
      filter_source_official: 'Ресми каталог',
      filter_source_user: 'Клиенттердің хабарландырулары',
      filter_sort_label: 'Сұрыптау',
      sort_none: 'Сұрыптаусыз',
      sort_price_asc: 'Баға ↑',
      sort_price_desc: 'Баға ↓',
      card_body_label: 'Көлік түрі:',
      card_wheel_formula_label: 'Дөңгелек формуласы:',
      card_gearbox_label: 'Қорап:',
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
      calculator_tagline: 'Тапсырыс беру, жеткізу және рәсімдеу — 2 минутта құнын есептеңіз',
      calc_page_title: 'Құн калькуляторы',
      calc_in_title: 'Енгізу деректері',
      calc_in_name_label: 'Модель / жабдықталымы',
      calc_in_name_ph: 'Мысалы: Тягач 2022',
      calc_in_price_label: 'Көлік бағасы, $',
      calc_in_price_ph: '59165',
      calc_in_type_label: 'Көлік түрі',
      calc_in_rate_label: 'Курс $ → ₸',
      calc_rate_info: 'ҰБК курсы: —',
      calc_real_title: 'Нақты құн',
      calc_real_hint: 'Теңгедегі баға = $ × курс',
      calc_ts_title: 'Кедендік құн',
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
      calc_mand_title: 'Қосымша шығындар',
      calc_mand_note: 'Көлік түрі және әдіске тәуелді.',
      calc_mand_list_title: 'Төлем құрамы',
      calc_ship_title: 'Жеткізу және шекара',
      calc_ship_list_title: 'Құрамы',
      calc_util_title: 'Утильалым және тіркеу',
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
      contact_note: 'Өтінім бірден Telegram-ға түседі',

      js_price_on_request: 'Баға сұраныс бойынша',
      js_form_err_phone: 'Дұрыс телефон нөмірін көрсетіңіз',
      js_form_err_msg: 'Хабарлама қосыңыз',
      js_form_sending: 'Жіберілуде...',
      js_form_sent_ok: 'Өтінім жіберілді! Байланысамыз.',
      js_form_sent_fail: 'Жіберу қатесі. Кейінірек көріңіз.',
      why_title : 'Неліктен бізге сенеді',
      why_card1_t : 'Келісімшарт бойынша жұмыс',
      why_card1_d : 'Барлық жеткізілімдер ресми рәсімделеді. Жасырын төлемсіз мөлдір шарттар.',
      why_card2_t : 'Нақты жеткізілімдер',  
      why_card2_d : 'Біз нақты техникалармен жұмыс жасаймыз. Жүктеу, қойма және жеткізу фотосуреттері мен бейнелері.',
      why_card3_t : 'Мөлдір есептеу',
      why_card3_d : 'Калькулятор сіз төлейтін төлемдерді көрсетеді. «Кейінірек қосымша төлемдер» жоқ.',
      why_card4_t : 'Бюджетке сай таңдау',
      why_card4_d : 'Біз «бар нәрсені» сатпай, тапсырма мен бюджетке сай техниканы таңдаймыз.',
      why_card5_t : 'Тіркеуге дейінгі қолдау',
      why_card5_d : 'Құжаттармен, кеденмен және тіркеумен көмек көрсетеміз.',
      footer_terms: 'Пайдаланушы келісімі',
      footer_privacy: 'Құпиялылық саясаты',
      loading: 'Жүктелуде...',
      loading_error: 'Каталогты жүктеу қатесі',
      body_all: 'Все типы',

      body_trailer: 'Тіркемелер',
      body_semitrailer: 'Жартылай тіркемелер', 
      body_dumptruck: 'Самосвал',
      body_tugboat:   'Тягач',

      body_specialequipment: 'Арнайы жабдықтар',
      body_crane:   'Түрту',
      body_manipulator: 'Манипулятор',
      body_mixer: 'Миксер',
      body_fuel_tank: 'Жанармай құю станциясы',
      body_aerial_ladder: 'Әуе платформасы',
      body_sewer_cleaner: 'Ассенизатор',

      body_refrigerator: 'Тоңазытқыш',
      body_van: 'Кемпер фургоны',
      body_sprinkler: 'Суару машинасы',
      body_drilling_rig: 'Бұрғылау қондырғысы',
      body_milk_truck: 'Сүт таситын машина',
      body_fuel_truck: 'Жанармай құю станциясы',

      calc_item_sbkts: 'СБКТС',
      calc_item_sos: 'SOS түймесі',
      calc_item_customs_fee: 'Кедендік алым',
      calc_item_broker_svh: 'СВХ-тағы брокер қызметі',
      calc_item_svh: 'СВХ',
      calc_item_border_broker: 'Шекарадағы брокер',
      calc_item_export_decl: 'Экспорттық декларация',
      calc_item_transport_almaty: 'Алматыға дейін жеткізу',
      calc_item_epts: 'ЭПТС',
      calc_item_diesel_pack: 'Дизель + AdBlue пакеті',
      calc_item_red_corridor: 'Дәліз',
      calc_item_thanks_astana: '«Астанаға рахмет»',
      calc_item_driver: 'Жүргізуші',
      calc_item_insurance: 'Сақтандыру',
      calc_item_toll_road: 'Ақылы жол',

      calc_item_declaration: 'Сәйкестік декларациясы',
      calc_item_customs_broker: 'Кедендік брокер',
      calc_item_driver: 'Жүргізуші',
      calc_item_adblue: 'AdBlue',
      calc_item_toll_road: 'Ақылы жол',
      calc_item_diesel: 'Дизель',
      calc_item_plate: 'Мемлекеттік нөмір және техникалық төлқұжат',
      calc_item_util_tax: 'Утилизациялық алым',
      calc_item_first_reg: 'Бастапқы тіркеу',
      calc_item_srtc: 'Техникалық төлқұжат (СРТС)',
      calc_flag_intl_carrier: 'Халықаралық тасымалдаушы куәлігі бар (тартқыштар үшін 7 жасқа дейін бастапқы тіркеу алынбайды)',

      // TOTAL LABELS
      calc_total_vehicle: 'Көлік құны',
      calc_total_clearance: 'Рәсімдеу құны',
      calc_total_turnkey: 'Толық құны',
      calc_year_label: 'Жылы',
      calc_item_broker_service: 'СВХ-дағы брокерлік қызметтер',
      calc_disclaimer: '⚠️ Есептеу алдын ала болып табылады және ашық ұсыныс емес. Соңғы құн валюта бағамдарына, кедендік төлемдерге және жеткізу шарттарына байланысты. Толығырақ менеджерден біліңіз.',
      body_car: 'Жеңіл көлік',
      calc_ts_bill_duty_percent: 'Баж ставкасы',
      why_card1_y: '✔ Келісімшарт бойынша жұмыс',
      why_card2_y: '✔ Жүктеу және жеткізу фотосуреттері мен бейнелері',
      why_card3_y: '✔ «Кейінірек қосымша төлемдер» жоқ мөлдір есептеу',
      why_card4_y: '✔ Кеден және тіркеуге көмек',
      btn_calculate_catalog: 'Толығырақ және есептеу',
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
      help_call: '致电我们', help_whatsapp: 'WhatsApp', help_font_title: '放大文字',
      product_cta_kp: '索取该车报价单', product_cta_breakdown: '逐步查看费用构成', product_price_note: '含关税、增值税、认证、运输和上牌。', product_how_head: '购买流程', product_how_media: '每个阶段都会发送——从工厂到交付。', spec_brand: '品牌', spec_model: '型号', spec_year: '出厂年份', spec_category: '类别', spec_mileage: '里程（公里）',
      help_write: '写信',
      vp_row_wheel: '驱动形式', vp_row_mass: '总质量（吨）', vp_row_payload: '载重（吨）', vp_row_power: '发动机（马力）', vp_row_gearbox: '变速箱', vp_price_label: '阿拉木图交钥匙价', vp_cta: '计算交钥匙价', vp_cta_kp: '索取报价单', vp_price_on_request: '— 询价', vp_owner_client: '客户', vp_avail_in_stock: '现货', vp_avail_on_order: '可订购', vp_avail_out_of_stock: '无货', catalog_rule_title: '车场', filter_search_label: '搜索', filter_brand_label: '品牌', filter_wheel_label: '驱动形式', nav_menu: '菜单',
      calc_rule_title: '计算', calc_stage_factory: '工厂 · 中国', calc_stage_border: '口岸 · 霍尔果斯', calc_stage_cert: '认证与报关', calc_stage_delivery: '运输', calc_stage_reg: '登记 · 上牌',  calc_real_row: '车辆价格', aside_total_label: '合计 · 阿拉木图交钥匙价',
      hp_hero_h1: '中国专用设备，价格精确到坚戈', hp_hero_sub: '我们计算到阿拉木图的全部费用：车辆、关税、增值税、运输、报废税、上牌。绝无「事后加价」。', hp_cta_price: '查看交钥匙价', hp_meta_units: '现货', hp_meta_rate: '汇率', hp_rule_route: '网站导航', hp_rule_included: '服务内容', hp_rule_deal: '货物路线', hp_rule_safe: '为何安全', hp_rule_gallery: '运输品类', hp_rule_reviews: '客户', hp_trust_title: '资金与单证均有合同保障', hp_led_stage: '阶段', hp_led_work: '工作内容', hp_led_incl: '包含', hp_led_yes: '包含', hp_led_cert_work: '实验室、СБКТС 和 ЭПТС —— 由我们代办。', hp_close_t: '也想这样？我们会按您的用途和预算选车。', hp_close_cta: '提交申请', hp_vehicles_empty: '目录中暂无可用车辆。', hp_vehicles_error: '无法加载目录', stage_factory: '工厂', stage_factory_s: '中国', stage_khorgos: '霍尔果斯', stage_khorgos_s: '口岸', stage_customs: '海关', stage_customs_s: '报关单', stage_cert: 'СБКТС', stage_cert_s: '实验室', stage_almaty: '阿拉木图', stage_almaty_s: '仓库', stage_handover: '交付', stage_handover_s: '单证', stage_delivery: '运输', stage_reg: '上牌',
      cab_pending_title: '账户等待审核', cab_pending_text: '管理员正在核验公司资料。审核通过后，分配给您的交易将显示在这里 —— 我们会通知您。',
      cab_rule_title: '交易', cab_rail_now: '当前', cab_rail_planned: '计划', cab_rail_late: '已逾期', cab_rail_now_head: '当前', cab_rail_late_head: '已逾期',
      vp_no_photo: '暂无照片',
      fav_rule_title: '已收藏', fav_loading: '加载中…', fav_load_error: '收藏夹中的部分车辆未能加载 —— 请刷新页面重试。',
      contacts_rule_title: '联系', blog_rule_title: '资料', contact_cta: '请回电给我',
      hp_services_h2: '直至上牌的全流程',
      product_cta_request: '就这台车提交申请',
      cat_empty_t: '没有找到符合条件的车辆', cat_empty_d: '请换一个用途，或查看全部。也可以来电——我们按您的用途和预算推荐。', cat_error_t: '目录加载失败', cat_error_d: '请刷新页面或来电——我们会告诉您现有车源。', contact_ok_t: '申请已提交！', contact_ok_d: '经理将在工作时间回电确认细节。如有急事，您也可以直接致电。', contact_ok_catalog: '查看目录',
      route_title: '从哪里开始——分步指引', route_sub: '第一次访问本站，按顺序操作即可。任何一步都可以来电，我们会帮您。', route1_t: '查看车辆', route1_d: '在目录中选择您要做什么——运沙石、长途运货还是工地吊装。我们会为您推荐合适的车型。', route1_go: '打开目录 →', route2_t: '了解「交钥匙」价格', route2_d: '计算器会给出含清关和运输的总价。不想自己算——回答三个问题，我们替您算。', route2_go: '计算费用 →', route3_t: '提交申请', route3_d: '只需姓名和电话。经理会回电确认细节并发送报价单。', route3_go: '提交申请 →', route4_t: '跟踪订单', route4_d: '签约后可在个人中心查看车辆当前状态：付款、运输、清关、交付。', route4_go: '个人中心 →', task_head: '您需要做什么？', task_all: '显示全部', task_dump: '运输沙子、碎石、土方', task_tractor: '长途货物运输', task_semi: '运输设备和超长货物', task_trailer: '为牵引车加挂车', task_crane: '工地吊装货物', task_more: '细化：品牌、驱动形式、排序', task_less: '收起细化选项',
      card_no_name: '车辆',
      trust1_t: '正式合同', trust1_d: '所有条件和期限均以书面形式约定，没有隐藏费用。', trust2_t: '银行付款', trust2_d: '款项按合同汇入公司对公账户，而非个人银行卡。', trust3_t: '完整文件包', trust3_d: 'ЭПТС、СБКТС 和海关文件由我们办理——交付时车辆即可上牌。', trust4_t: '专人对接', trust4_d: '无需自己研究——来电即可，我们为您选车并核算费用。',
      calc_total_plain: '这是阿拉木图的「交钥匙」价格，已包含清关、文件、认证和运输费用，无需额外付款。',
      hint_epts: 'ЭПТС——车辆电子护照。没有它无法上牌。由我们办理。', hint_sbkts: 'СБКТС——结构安全证书，证明车辆符合欧亚经济联盟标准。由我们办理。', hint_sos: 'ЭРА/SOS 紧急呼叫按钮——上牌必备，在实验室安装。', hint_customs_fee: '海关规费——办理报关单的固定国家费用。', hint_broker: '报关行——代您在海关办理手续的专业人员。', hint_svh: 'СВХ——临时存放仓库：清关期间车辆停放的地方。', hint_red_corridor: '红色通道——海关深度查验。提前计入，以免金额意外增加。', hint_declarant: '边境报关员——办理车辆进入哈萨克斯坦的手续。', hint_export_decl: '出口报关单——车辆从中国出口的文件。', hint_plate: '车牌和行驶证——在 Авто ЦОН 登记，之后即可上路。', hint_first_reg: '首次登记——在哈萨克斯坦上牌时的一次性国家费用。', hint_adblue: 'AdBlue——欧五发动机尾气净化液。',
      kpb_head: '手动创建报价单', kpb_toggle: '展开', kpb_hide: '收起', kpb_pick: '从目录选择车辆（选填）', kpb_search_ph: '搜索：shacman、自卸车…', kpb_manual: '— 手动输入 —', kpb_title: '车辆名称', kpb_desc: '描述 / 配置', kpb_desc_ph: '发动机、功率、质量、配置…', kpb_price_usd: '单价，USD', kpb_price_cny: '单价，CNY', kpb_price_kzt: '总额，₸', kpb_qty: '数量', kpb_buyer: '买方', kpb_number: '报价单编号', kpb_avail: '现货情况', kpb_avail_ph: '霍尔果斯现有 15 台现货。', kpb_timeline: '交付周期（每行一项，留空则用模板）', kpb_timeline_ph: '出口报关——2 天。', kpb_email: '收件人邮箱（用于发送）', kpb_download: '下载 PDF', kpb_send: '发送到邮箱', kpb_need_email: '请填写收件人邮箱',
      scalc_title: '不想研究复杂的计算？', scalc_sub: '回答三个问题——我们会算好并给您回电。', scalc_q1: '1. 您需要哪种车辆？', scalc_q2: '2. 您的预算是多少？（选填）', scalc_q3: '3. 您的电话——我们会回电并详细说明', scalc_need_tractor: '牵引车', scalc_need_dump: '自卸车', scalc_need_crane: '起重机', scalc_need_trailer: '挂车 / 低平板', scalc_need_car: '乘用车', scalc_need_unsure: '还不确定', scalc_budget_ph: '例如：3500万坚戈以内', scalc_name_ph: '您的姓名（选填）', scalc_send: '获取报价', scalc_sent: '谢谢！我们会尽快与您联系。', scalc_need_phone: '请填写电话号码，我们会给您回电', scalc_error: '错误', scalc_show_detailed: '显示详细计算', scalc_hide_detailed: '隐藏详细计算',
      contact_msg_label_opt: '留言（选填）', contact_need_phone: '请填写电话号码，我们会给您回电',
      cab_assign_head: '为阶段指派服务方', cab_assign_btn: '指派', cab_delete_deal: '删除交易', cab_unassign: '取消指派', cab_no_service_users: '没有合适的账户', cab_pick_user: '请选择执行人', cab_confirm_unassign: '要取消此阶段的指派吗？', cab_confirm_delete_deal: '确定删除整个交易？此操作无法撤销。',
      cab_tab_active: '进行中', cab_tab_done: '已完成', cab_no_done: '暂无已完成的交易',
      cab_profile_head: '我的资料', cab_profile_name: '姓名 / 公司', cab_profile_phone: '电话（登录名）', cab_profile_email: '电子邮箱', cab_profile_pw_head: '修改密码', cab_profile_old_pw: '当前密码', cab_profile_new_pw: '新密码', cab_profile_change_pw: '修改密码', cab_pw_changed: '密码已修改',
      cab_download_kp: '下载报价单', cab_send_kp: '通过邮件发送报价单', cab_kp_sent: '报价单已发送', cab_kp_no_recipient: '没有收件人：请填写客户邮箱',
      brand_subtitle: '中国专用设备',
      nav_how_it_works: '如何运作',
      nav_favorites: '收藏',
      nav_blog: '博客',
      nav_login: '登录',
      nav_account: '个人中心',
      nav_not_verified: '未验证',
      nav_logout_confirm: '确定要退出登录吗？',
      title_register: 'China Motors - 注册',
      title_login: 'China Motors - 登录',
      register_hero: '注册',
      register_tagline: '创建 China Motors 客户账户',
      register_tab_person: '个人',
      register_tab_company: '公司',
      register_person_note: '个人可以购买乘用车。购买商用车请使用公司注册。',
      register_company_note: '公司可以购买各种商用车辆。',
      register_phone_label: '电话',
      register_password_label: '密码',
      register_fullname_label: '姓名',
      register_iin_label: '身份识别号（IIN，用于合同）',
      register_companyname_label: '公司名称',
      register_bin_label: '商业识别号（BIN，用于合同）',
      register_address_label: '法定地址',
      register_submit: '创建账户',
      register_have_account: '已有账户？登录',
      register_err_required: '请填写必填项',
      register_success: '注册完成！账户正在等待管理员验证。',
      login_hero: '登录',
      login_tagline: '登录您的 China Motors 个人中心',
      login_submit: '登录',
      login_no_account: '没有账户？注册',
      login_success: '登录成功！',
      register_tab_service: '服务合作伙伴（保税仓）',
      register_tab_bank: '银行',
      register_tab_partner: '卖方合作伙伴（中国）',
      register_service_note: '请选择角色。账户将等待管理员验证。',
      register_service_role_label: '角色',
      register_service_role_placeholder: '— 请选择 —',
      register_role_declarant: '报关员（边境）',
      register_role_logistic: '物流',
      register_role_lab: '实验室',
      register_role_svh: '保税仓',
      register_role_broker: '经纪人（保税仓）',
      register_bank_note: '银行账户用于配合交易结算。',
      register_bankname_label: '银行名称',
      register_bik_label: '银行代码（BIK）',
      register_partner_note: '合作伙伴将获得账户并上传车辆信息 — 需经管理员审核。',
      register_country_label: '国家',
      register_regno_label: '公司注册号（用于合同）',
      title_account: 'China Motors - 个人中心',
      account_hero: '个人中心',
      account_logout: '退出',
      account_loading: '加载中...',
      account_my_listings_title: '我的信息',
      account_new_listing: '发布信息',
      account_listing_brand_label: '品牌',
      account_listing_title_label: '名称/型号',
      account_listing_category_label: '类别',
      account_listing_city_label: '城市',
      account_listing_weight_label: '重量(吨)',
      account_listing_power_label: '发动机功率(马力)',
      account_listing_load_capacity_label: '载重(吨)',
      account_listing_price_kzt_label: '价格(坚戈)',
      account_listing_photos_label: '照片',
      account_listing_description_label: '描述',
      badge_user_listing_prefix: '来自',
      product_create_deal: '办理交易',
      product_secure_note: '通过银行安全付款 · 提供完整证件',
      product_extra_title: '配置与规格',
      product_cta_title: '想购买这台设备吗?',
      product_cta_sub: '我们将核算完整费用并按合同办理交易。',
      product_cta_ask: '提出问题',

      brand_title: 'China Motors',
      hero_title_main: '来自中国的专用设备和汽车,一站式服务',
      hero_tagline: '选型 • 核算 • 运输 • 清关 • 哈萨克斯坦注册上牌',
      hp_hero_badge: '中国工厂直接供货',
      hp_bullet1: '正式合同',
      hp_bullet2: '银行保障资金安全',
      hp_bullet3: '完整证件',
      hp_bullet4: '始于2024年',
      hp_cta_offer: '获取报价',
      hp_cta_catalog: '查看目录 →',

      // --- 报价单页面 (kp.html) ---
      title_kp: 'China Motors — 商业报价单',
      kp_rule_title: '商业报价单',
      kp_meta_number: '编号', kp_meta_date: '日期', kp_meta_buyer: '买方',
      kp_meta_valid: '有效期至',
      kp_rates_t: '汇率暂时不可用',
      kp_rates_d: '报价按出具当日国家银行汇率计算。汇率未到之前不出具文件——请稍后再试或致电，我们会直接发送报价单。',
      kp_download_signed: '下载盖章版',
      kp_download_signed_note: '含公司印章 · 即将推出',
      kp_download_signed_ready: '含公司印章',
      kp_download_page: '下载网页版',
      kp_download_page_note: '本页面，无印章',
      kp_share: '分享',
      kp_share_copied: '链接已复制',
      kp_share_failed: '请从地址栏复制链接',
      kp_seller_head: '卖方',
      kp_seller_address: '地址', kp_seller_bank: '银行',
      kp_seller_bank_address: '银行地址', kp_seller_account: '账号', kp_seller_swift: 'SWIFT',
      kp_subject_head: '报价标的',
      kp_col_qty: '数量', kp_col_usd: '单价，USD', kp_col_cny: '单价，CNY', kp_col_kzt: '金额，₸',
      kp_specs_head: '技术参数', kp_on_request: '询价',
      kp_breakdown_head: '交钥匙价费用明细',
      kp_total_label: '阿拉木图交钥匙价',
      kp_total_note: '这是最终金额，无需另行加价。',
      kp_terms_head: '交付条件', kp_timeline_head: '时间安排',
      kp_service_head: '服务与质保',
      kp_foot_note: '对报价有疑问？请致电或留言，我们会按这份报价单答复。',
      kp_foot_contacts: '联系经理',
      kp_loading: '正在生成商业报价单…',
      kp_error_t: '无法生成报价单',
      kp_error_d: '请重新打开页面或致电——我们会直接把报价单发给您。',
      kp_error_catalog: '前往目录',
      hp_calc_widget_title: '计算费用',
      hp_calc_category: '类别',
      hp_calc_brand: '品牌',
      hp_calc_submit: '计算费用',
      hp_calc_widget_note: '免费且不承担任何义务',
      hp_services_title: '我们的服务',
      hp_services_sub: '设备供应与服务的一站式解决方案',
      hp_service1_t: '订购与供应',
      hp_service1_d: '根据您的需求提供来自中国的汽车和专用设备。',
      hp_service2_t: '清关服务',
      hp_service2_d: '协助办理清关手续。',
      hp_service3_t: '运输配送',
      hp_service3_d: '从霍尔果斯运输到阿拉木图。',
      hp_service4_t: '车牌办理',
      hp_service4_d: '协助办理车牌。',
      hp_process_title: '交易流程',
      hp_step1_t: '选择设备',
      hp_step1_d: '根据需求和预算挑选型号',
      hp_step2_t: '商业报价',
      hp_step2_d: '提供完整规格的费用核算',
      hp_step3_t: '合同与付款',
      hp_step3_d: '通过银行安全付款,提供完整证件',
      hp_step4_t: '运输与清关',
      hp_step4_d: '从中国运输并办理清关手续',
      hp_step5_t: '提车',
      hp_step5_d: '交付设备及全套证件',
      hp_vehicles_title: '热门设备',
      hp_vehicles_link: '查看完整目录 →',
      hp_vehicles_loading: '加载中...',
      hp_vehicle_cta: '获取报价',
      hp_stats_label: '值得信赖',
      hp_stat1: '客户',
      hp_stat2: '合同交易',
      hp_stat3: '交付设备',
      hp_stat4: '市场经验',
      hp_stat4_years: '年',
      footer_address_khorgos: '霍尔果斯市 — 仓库与发货',
      hp_contact_reach_title: '联系我们',
      hp_contact_phone_label: '电话',
      hp_contact_address_label: '地址',
      hp_contact_whatsapp: '通过WhatsApp联系',
      footer_address_almaty: '阿拉木图市 — 设备提取',
      footer_col1_text: '来自中国的可靠设备，现货或订购。从霍尔果斯到阿拉木图的运输，全程交易支持。我们自2024年开始运营。',
      footer_col2_title: '导航',
      footer_col3_title: '联系方式',
      footer_col4_title: '社交媒体',
      footer_copy: '© 2026 China Motors. 保留所有权利。',
      footer_devnote: '网站上的信息仅供参考，不构成公开报价',
      btn_photos: '照片',
      btn_calculate: '计算',
      btn_send: '发送',
      btn_refresh_rate: '刷新汇率',
      search_placeholder: '搜索…',

      about_title: '关于我们',
      about_p1: 'China Motors——来自中国霍尔果斯的车辆与专用设备供应商。自2024年起，我们提供高质量车辆并协助清关与运输。',
      about_p2: '我们的使命是以合理价格为客户提供高品质设备并保证质量。',
      about_card1_t: '选择丰富',
      about_card1_d: '多种专用设备型号。',
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
      catalog_subhead: 'China Motors 设备目录',
      catalog_found: '找到',

      // FAVORITES
      title_favorites: 'China Motors - 收藏',
      fav_subtitle: '已保存的设备 — 比较并申请报价',
      fav_saved_count: '已保存',
      fav_cta_title: '申请整个列表的报价',
      fav_cta_sub: '我们将为收藏中的每一项发送报价单 — 含送达阿拉木图的运输。',
      fav_cta_btn: '获取列表报价',
      fav_empty_title: '收藏夹还是空的',
      fav_empty_sub: '点击目录中设备卡片上的书签图标 — 它们将出现在这里。',
      fav_empty_btn: '前往目录',
      fav_remove_title: '从收藏中移除',
      fav_request_btn: '获取报价',

      // BLOG
      title_blog: 'China Motors - 博客',
      blog_hero: '博客',
      blog_subhead: '关于中国设备、运输和交易办理的文章和指南',
      blog_read_more: '阅读 →',
      blog1_date: '指南',
      blog1_title: '交易流程：从申请到收到设备',
      blog1_excerpt: '从选择型号到交接设备并提供完整证件的五个步骤——每个阶段发生什么。',
      blog2_date: '指南',
      blog2_title: '如何选择专用设备：自卸车、牵引车还是随车吊',
      blog2_excerpt: '根据具体任务选择设备时应关注什么——货物类型、运输距离、预算和使用频率。',
      blog3_date: '指南',
      blog3_title: '从中国运输设备：从霍尔果斯到阿拉木图的路线',
      blog3_excerpt: '设备如何从霍尔果斯仓库运到阿拉木图——各个阶段、证件以及我们在每一步展示的内容。',

      filter_body_label: '车型',
      filter_source_label: '来源',
      filter_source_all: '全部信息',
      filter_source_official: '官方目录',
      filter_source_user: '客户发布',
      filter_sort_label: '排序',
      sort_none: '无排序',
      sort_price_asc: '价格 ↑',
      sort_price_desc: '价格 ↓',
      card_body_label: '车型:',
      card_wheel_formula_label: '轮轴配置:',
      card_gearbox_label: '变速箱:',
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
      calculator_tagline: '一站式选购、运输与办理——2分钟内计算费用',
      calc_page_title: '成本计算器',
      calc_in_title: '输入数据',
      calc_in_name_label: '车型 / 配置',
      calc_in_name_ph: '例如：2022年牵引车',
      calc_in_price_label: '车辆价格, $',
      calc_in_price_ph: '59165',
      calc_in_type_label: '车型',
      calc_in_rate_label: '汇率 $ → ₸',
      calc_rate_info: '哈萨克国家银行汇率：—',
      calc_real_title: '实际成本',
      calc_real_hint: '以坚戈计价 = 美元 × 汇率',
      calc_ts_title: '海关计价',
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
      calc_mand_title: '额外费用',
      calc_mand_note: '取决于车型与计价模式。',
      calc_mand_list_title: '费用构成',
      calc_ship_title: '运输与边境',
      calc_ship_list_title: '组成',
      calc_util_title: '回收费与注册',
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
      contact_note: '申请将立即发送到我们的 Telegram',

      js_price_on_request: '价格面议',
      js_form_err_phone: '请输入正确的电话号码',
      js_form_err_msg: '请填写消息',
      js_form_sending: '发送中...',
      js_form_sent_ok: '已发送！我们会联系您。',
      js_form_sent_fail: '发送失败，请稍后再试。',
      why_title : '为什么选择我们',
      why_card1_t : '合同合作',
      why_card1_d : '所有供应均正式办理。透明条款，无隐藏费用。',
      why_card2_t : '实际供应',
      why_card2_d : '我们处理实际设备。装载、仓库和交付的照片和视频。',
      why_card3_t : '透明计算',
      why_card3_d : '计算器显示您支付的费用。没有“之后再付钱”。',
      why_card4_t : '根据预算选择',
      why_card4_d : '根据任务和预算选择设备，而不是出售“现有”设备。',
      why_card5_t : '注册支持',
      why_card5_d : '我们协助处理文件、海关和注册。',
      footer_terms: '用户协议',
      footer_privacy: '隐私政策',
      loading: '加载中...',
      loading_error: '目录加载错误',
      body_all: '所有类型',

      body_trailer: '挂车',
      body_semitrailer: '半挂车',
      body_dumptruck: '自卸车',
      body_tugboat: '牵引车',

      body_specialequipment: '专用设备',
      body_crane: '起重机',
      body_manipulator: '操作器',       
      body_mixer: '搅拌机',
      body_fuel_tank: '油罐车',
      body_aerial_ladder: '高空作业车',
      body_sewer_cleaner: '清污车',

      body_refrigerator: '冷藏车',
      body_van: '厢式货车',
      body_sprinkler: '洒水车',
      body_drilling_rig: '钻机',
      body_milk_truck: '运奶车',
      body_fuel_truck: '加油车',

      calc_item_sbkts: 'SBKTS 证书',
      calc_item_sos: 'SOS 按钮',
      calc_item_customs_fee: '海关费用',
      calc_item_broker_svh: '仓储区经纪服务',
      calc_item_svh: '仓储区',
      calc_item_border_broker: '边境代理',
      calc_item_export_decl: '出口报关单',
      calc_item_transport_almaty: '运送至阿拉木图',
      calc_item_epts: '电子车辆护照',
      calc_item_diesel_pack: '柴油 + AdBlue 套餐',
      calc_item_red_corridor: '通道',
      calc_item_thanks_astana: '“感谢阿斯塔纳”',
      calc_item_driver: '司机',
      calc_item_insurance: '保险',
      calc_item_toll_road: '收费公路',

      calc_item_declaration: '符合性声明',
      calc_item_customs_broker: '海关代理',
      calc_item_driver: '司机',
      calc_item_adblue: 'AdBlue',
      calc_item_toll_road: '收费公路',
      calc_item_diesel: '柴油',
      calc_item_plate: '车牌和技术护照',
      calc_item_util_tax: '回收费',
      calc_item_first_reg: '首次注册',
      calc_item_srtc: '技术护照（SRTC）',
      calc_flag_intl_carrier: '持有国际承运人证书（7年以内牵引车免收首次注册费）',

      // TOTAL LABELS
      calc_total_vehicle: '车辆价格',
      calc_total_clearance: '清关费用',
      calc_total_turnkey: '交钥匙总价',
      calc_year_label: '出厂年份',
      calc_item_broker_service: '保税仓经纪服务',
      calc_disclaimer: '⚠️ 计算结果为预估值，非公开报价。最终价格取决于汇率、关税和供应条件。详情请咨询经理。',
      body_car: '乘用车',
      calc_ts_bill_duty_percent: '关税税率',
      why_card1_y: '✔ 合同合作',
      why_card2_y: '✔ 装载和交付的照片与视频',
      why_card3_y: '✔ 没有“之后再付钱”的透明计算',
      why_card4_y: '✔ 协助海关和注册',
      btn_calculate_catalog: '详情与计算',
    },

    en: {
      // CLIENT CABINET (cab_*)
      cab_verified: 'verified', cab_not_verified: 'not verified',
      cab_rolefull_CUSTOMER_PERSON: 'Customer (individual)', cab_rolefull_CUSTOMER_COMPANY: 'Customer (company)',
      cab_rolefull_SERVICE_BROKER: 'Broker (TSW)', cab_rolefull_SERVICE_SVH: 'TSW', cab_rolefull_SERVICE_LAB: 'Lab',
      cab_rolefull_SERVICE_LOGISTIC: 'Logistics', cab_rolefull_SERVICE_DECLARANT: 'Declarant (border)', cab_rolefull_BANK: 'Bank',
      cab_rolefull_PARTNER: 'Partner / seller', cab_rolefull_MANAGER: 'Manager', cab_rolefull_ADMIN: 'Administrator',
      cab_role_BROKER: 'Broker (TSW)', cab_role_SVH: 'TSW', cab_role_LAB: 'Lab', cab_role_LOGISTIC: 'Logistics', cab_role_DECLARANT: 'Declarant', cab_role_BANK: 'Bank',
      cab_astatus_PENDING: 'Pending', cab_astatus_IN_PROGRESS: 'In progress', cab_astatus_DONE: 'Done',
      cab_stage_AGREEMENT: 'Agreement', cab_stage_CONTRACT: 'Contract', cab_stage_PURCHASE_CHINA: 'Purchase in China', cab_stage_DELIVERY_KZ: 'Delivery to KZ', cab_stage_SVH: 'TSW', cab_stage_CUSTOMS: 'Customs', cab_stage_DELIVERY_CLIENT: 'Delivery to client', cab_stage_COMPLETED: 'Completed',
      cab_timeline_head: 'Deal stages', cab_plan_head: 'Deal plan', cab_payments_head: 'Payments', cab_docs_head: 'Documents', cab_media_head: 'Photos & videos', cab_expenses_head: 'Expenses', cab_expenses_internal: '(manager only)', cab_activity_head: 'Change log', cab_chat_head: 'Deal chat',
      cab_loading: 'Loading...', cab_payments_empty: 'No payments yet.', cab_docs_empty: 'No documents yet.', cab_expenses_empty: 'No expenses yet.', cab_media_empty: 'No photos or videos yet.', cab_plan_empty: 'No plan yet. Add stages below.', cab_chat_empty: 'No messages yet', cab_notif_empty: 'No notifications yet', cab_leads_empty: 'No leads yet.', cab_listings_empty: 'No listings yet.',
      cab_deals_empty_mgr: 'No deals yet.', cab_deals_empty_customer: 'You have no deals yet. You can start a deal from a vehicle page in the catalog — the “Create a deal” button.', cab_deals_empty_assignee: 'No deals assigned to you yet.', cab_role_wip: 'The cabinet for this role is under development.',
      cab_load_error: 'Load error', cab_load_error_summary: 'Failed to load summary', cab_load_error_finance: 'Failed to load finance', cab_load_error_leads: 'Failed to load leads', cab_load_error_deals: 'Failed to load deals', cab_error: 'Error',
      cab_confirmed: 'Confirmed', cab_pending: 'Pending', cab_paid: 'Paid', cab_of: 'of', cab_deal_value: 'Deal value, ₸:', cab_not_set: 'not set', cab_save: 'Save', cab_saved: 'Saved', cab_sum_ph: 'Amount, ₸', cab_confirmed_lc: 'confirmed', cab_add_payment: 'Add payment',
      cab_download: 'Download', cab_no_file: 'no file', cab_doc_generic: 'Document', cab_upload: 'Upload', cab_doc_CONTRACT: 'Contract', cab_doc_GTD: 'Customs decl.', cab_doc_CMR: 'CMR', cab_doc_ACCEPTANCE: 'Acceptance act', cab_doc_PHOTO: 'Photo',
      cab_exp_total: 'Total expenses', cab_exp_note_ph: 'Comment (optional)', cab_add_expense: 'Add expense', cab_del_expense_confirm: 'Delete this expense?', cab_exp_PURCHASE: 'Purchase in China', cab_exp_LOGISTICS: 'Logistics / delivery', cab_exp_CUSTOMS: 'Customs clearance', cab_exp_CERTIFICATION: 'Certification (SBKTS/EPTS)', cab_exp_SVH: 'TSW / storage', cab_exp_OTHER: 'Other',
      cab_stage_name_ph: 'Stage name', cab_add_stage: 'Add stage', cab_del_stage_confirm: 'Delete stage?', cab_up: 'Up', cab_down: 'Down', cab_delete: 'Delete',
      cab_media_caption_ph: 'Caption (optional)', cab_media_or: 'or video link:', cab_add: 'Add', cab_video: 'Video', cab_photo_alt: 'Deal photo', cab_del_media_confirm: 'Delete this file from the gallery?', cab_media_need_one: 'Attach a photo or provide a video link.', cab_media_only_one: 'One only: either a photo or a video link.',
      cab_internal_tag: 'internal', cab_system: 'System', cab_chat_ph: 'Write a message...', cab_send: 'Send',
      cab_created: 'Created', cab_client: 'Client', cab_deal_num: 'Deal', cab_no_assignee: 'No one assigned yet', cab_not_assigned: '— not assigned', cab_you: '(you)', cab_note_ph: 'Note',
      cab_tile_total: 'Total deals', cab_tile_active: 'Active', cab_tile_completed: 'Completed', cab_tile_leads_open: 'Leads (open)',
      cab_convert_confirm: 'Create a deal from this lead? The customer will be found by phone or created automatically.', cab_creating: 'Creating…', cab_convert_new_client: 'New customer created for number', cab_convert_found_client: 'Customer found by number', cab_deal_created: 'Deal created',
      cab_no_name: 'No name', cab_create_deal: 'Create deal', cab_lead_deal_num: 'Deal', cab_lead_new: 'New', cab_lead_in_progress: 'In progress', cab_lead_won: 'Won', cab_lead_lost: 'Lost',
      cab_assign_head: 'Assign a service to a stage', cab_assign_btn: 'Assign', cab_delete_deal: 'Delete deal', cab_unassign: 'Remove assignment', cab_no_service_users: 'No matching accounts', cab_pick_user: 'Select an assignee', cab_confirm_unassign: 'Remove the assignment from this stage?', cab_confirm_delete_deal: 'Delete the whole deal? This cannot be undone.',
      cab_tab_active: 'Active', cab_tab_done: 'Completed', cab_no_done: 'No completed deals yet',
      cab_profile_head: 'My details', cab_profile_name: 'Name / company', cab_profile_phone: 'Phone (login)', cab_profile_email: 'E-mail', cab_profile_pw_head: 'Change password', cab_profile_old_pw: 'Current password', cab_profile_new_pw: 'New password', cab_profile_change_pw: 'Change password', cab_pw_changed: 'Password changed',
      cab_download_kp: 'Download proposal', cab_send_kp: 'E-mail the proposal', cab_kp_sent: 'Proposal sent', cab_kp_no_recipient: 'No recipient: add the customer e-mail',
      cab_fin_value: 'Deals value', cab_fin_received: 'Received', cab_fin_expenses: 'Expenses', cab_fin_profit: 'Profit', cab_fcol_deal: 'Deal', cab_fcol_stage: 'Stage', cab_fcol_value: 'Value', cab_fcol_received: 'Received', cab_fcol_balance: 'Balance', cab_fcol_expenses: 'Expenses', cab_fcol_profit: 'Profit', cab_fin_hint: 'Profit = deal value − expenses. Shown only for deals with a value set.',
      cab_listing_sent: 'Listing submitted for moderation', cab_listing_num: 'Listing', cab_listing_approved: 'Approved, visible in catalog', cab_listing_pending: 'Under moderation',
      cab_summary: 'Summary', cab_finance_head: 'Deal finance', cab_leads_head: 'Website leads',
      cab_partner_intro: 'As a partner/seller you manage your product catalog rather than deals — use the listings section above. Approved items appear in the public catalog.', cab_listing_delete_confirm: 'Delete this listing?', cab_lst_total: 'Listings', cab_lst_approved: 'Approved', cab_lst_moderation: 'Under moderation',
      cab_asum_head: 'My tasks',
      cab_how_to_pay: 'How to pay',

      reviews_title1: 'Equipment at the clients place',
      reviews_title2: 'Customer with a new car',
      reviews_title3: 'Customer feedback on truck delivery',
      nav_home: 'Home',
      nav_catalog: 'Catalog',
      nav_services: 'Services',
      nav_contacts: 'Contacts',
      nav_calculator: 'Calculator',
      help_call: 'Call us', help_whatsapp: 'WhatsApp', help_font_title: 'Increase text size',
      product_cta_kp: 'GET A PROPOSAL FOR THIS VEHICLE', product_cta_breakdown: 'BREAK THE PRICE DOWN', product_price_note: 'Duty, VAT, certification, delivery and registration included.', product_how_head: 'HOW THE PURCHASE WORKS', product_how_media: 'Sent at every stage — from the factory to handover.', spec_brand: 'BRAND', spec_model: 'MODEL', spec_year: 'YEAR', spec_category: 'CATEGORY', spec_mileage: 'MILEAGE, KM',
      help_write: 'Write to us',
      vp_row_wheel: 'WHEEL FORMULA', vp_row_mass: 'GROSS WEIGHT, T', vp_row_payload: 'PAYLOAD, T', vp_row_power: 'ENGINE, HP', vp_row_gearbox: 'GEARBOX', vp_price_label: 'TURNKEY IN ALMATY', vp_cta: 'TURNKEY QUOTE', vp_cta_kp: 'GET A PROPOSAL', vp_price_on_request: '— on request', vp_owner_client: 'a client', vp_avail_in_stock: 'IN STOCK', vp_avail_on_order: 'ON ORDER', vp_avail_out_of_stock: 'NONE', catalog_rule_title: 'Yard', filter_search_label: 'Search', filter_brand_label: 'Brand', filter_wheel_label: 'Wheel formula', nav_menu: 'MENU',
      calc_rule_title: 'Estimate', calc_stage_factory: 'Factory · China', calc_stage_border: 'Border · Khorgos', calc_stage_cert: 'Certification and clearance', calc_stage_delivery: 'Delivery', calc_stage_reg: 'Registration', calc_real_row: 'Vehicle price', aside_total_label: 'Total · turnkey in Almaty',
      hp_hero_h1: 'Special equipment from China, priced to the tenge', hp_hero_sub: 'We calculate the full cost to Almaty: the machine, duty, VAT, delivery, recycling fee, registration. No «pay extra later».', hp_cta_price: 'Show the turnkey price', hp_meta_units: 'in the yard', hp_meta_rate: 'rate', hp_rule_route: 'How to use this site', hp_rule_included: "What's included", hp_rule_deal: 'Freight route', hp_rule_safe: 'Why this is safe', hp_rule_gallery: 'What we ship', hp_rule_reviews: 'Clients', hp_trust_title: 'Money and papers under contract', hp_led_stage: 'Stage', hp_led_work: 'Work', hp_led_incl: 'Included', hp_led_yes: 'included', hp_led_cert_work: 'Laboratory, SBKTS and EPTS — we handle it.', hp_close_t: 'Want the same? We will pick machinery for your task and budget.', hp_close_cta: 'Submit a request', hp_vehicles_empty: 'No machinery available in the catalogue yet.', hp_vehicles_error: 'Could not load the catalogue', stage_factory: 'Factory', stage_factory_s: 'China', stage_khorgos: 'Khorgos', stage_khorgos_s: 'border', stage_customs: 'Customs', stage_customs_s: 'declaration', stage_cert: 'SBKTS', stage_cert_s: 'laboratory', stage_almaty: 'Almaty', stage_almaty_s: 'warehouse', stage_handover: 'Handover', stage_handover_s: 'documents', stage_delivery: 'Delivery', stage_reg: 'Registration',
      cab_pending_title: 'Account awaiting approval', cab_pending_text: 'An administrator is checking your company details. Once approved, the deals assigned to you will appear here — we will let you know.',
      cab_rule_title: 'Deal', cab_rail_now: 'now', cab_rail_planned: 'planned', cab_rail_late: 'overdue', cab_rail_now_head: 'Now', cab_rail_late_head: 'Overdue',
      vp_no_photo: 'NO PHOTO',
      fav_rule_title: 'Saved', fav_loading: 'Loading…', fav_load_error: 'Some saved vehicles could not be loaded — try refreshing the page.',
      contacts_rule_title: 'Contact', blog_rule_title: 'Reading', contact_cta: 'Call me back',
      hp_services_h2: 'The full cycle up to registration',
      product_cta_request: 'Request this vehicle',
      cat_empty_t: 'Nothing matches this search', cat_empty_d: 'Try another task or show everything. Or call us — we will find something for your job and budget.', cat_error_t: 'The catalogue could not be loaded', cat_error_d: 'Refresh the page or call us — we will tell you what is in stock.', contact_ok_t: 'Request sent!', contact_ok_d: 'A manager will call during working hours to confirm the details. If it is urgent, call us yourself.', contact_ok_catalog: 'Browse the catalogue',
      route_title: 'Where to start — step by step', route_sub: 'First time here? Just follow the order. You can call us at any step.', route1_t: 'Look at the vehicles', route1_d: 'In the catalogue pick what you need to do — haul sand, carry freight or lift on site. We will show the right machines.', route1_go: 'Open the catalogue →', route2_t: 'Find the turnkey price', route2_d: 'The calculator gives the final figure including customs and delivery. Rather not calculate? Answer three questions and we will do it.', route2_go: 'Calculate the cost →', route3_t: 'Leave a request', route3_d: 'A name and phone number are enough. A manager will call, confirm the details and send a proposal.', route3_go: 'Leave a request →', route4_t: 'Follow your deal', route4_d: 'Once the contract is signed, your cabinet shows where the vehicle is: payment, delivery, customs, handover.', route4_go: 'Personal cabinet →', task_head: 'What do you need to do?', task_all: 'Show everything', task_dump: 'Haul sand, gravel, soil', task_tractor: 'Carry freight long distance', task_semi: 'Move machinery and long loads', task_trailer: 'Add a trailer to a tractor unit', task_crane: 'Lift loads on a construction site', task_more: 'Refine: brand, wheel formula, sorting', task_less: 'Hide the extra filters',
      card_no_name: 'Vehicle',
      trust1_t: 'A formal contract', trust1_d: 'Every term and deadline is put in writing. No hidden extras.', trust2_t: 'Payment through a bank', trust2_d: 'Funds go to the company account under the contract — never to a private card.', trust3_t: 'Full document package', trust3_d: 'We arrange the EPTS, SBKTS and customs paperwork — the vehicle arrives ready to register.', trust4_t: 'A real manager', trust4_d: 'You do not have to work it out yourself — call us and we will pick the vehicle and do the maths.',
      calc_total_plain: 'This is the turnkey price in Almaty — customs clearance, paperwork, certification and delivery are already included. Nothing extra to pay on top.',
      hint_epts: 'EPTS — the electronic vehicle passport. Without it the truck cannot be registered. We handle it.', hint_sbkts: 'SBKTS — a construction safety certificate confirming the vehicle meets EAEU standards. We handle it.', hint_sos: 'ERA/SOS button — the emergency call system, mandatory for registration. Fitted at the lab.', hint_customs_fee: 'Customs fee — a fixed state charge for processing the declaration.', hint_broker: 'Broker — the specialist who handles the customs paperwork for you.', hint_svh: 'Bonded warehouse (SVH) — where the vehicle stays while customs clearance is under way.', hint_red_corridor: 'Red corridor — an in-depth customs inspection. Budgeted upfront so the total does not jump later.', hint_declarant: 'Border declarant — handles the vehicle entry into Kazakhstan.', hint_export_decl: 'Export declaration — the document for taking the vehicle out of China.', hint_plate: 'Plates and registration certificate — registration at Auto TSON, after which you can drive.', hint_first_reg: 'First registration — a one-off state fee when registering in Kazakhstan.', hint_adblue: 'AdBlue — exhaust treatment fluid for Euro-5 engines.',
      kpb_head: 'Create a proposal manually', kpb_toggle: 'Open', kpb_hide: 'Collapse', kpb_pick: 'Vehicle from the catalogue (optional)', kpb_search_ph: 'Search: shacman, dump truck…', kpb_manual: '— enter manually —', kpb_title: 'Vehicle name', kpb_desc: 'Description / equipment', kpb_desc_ph: 'Engine, power, weight, equipment…', kpb_price_usd: 'Price, USD', kpb_price_cny: 'Price, CNY', kpb_price_kzt: 'Total, ₸', kpb_qty: 'Qty', kpb_buyer: 'Buyer', kpb_number: 'Proposal no.', kpb_avail: 'Availability', kpb_avail_ph: '15 units in stock in Khorgos, China.', kpb_timeline: 'Delivery timeline (one item per line, empty = use template)', kpb_timeline_ph: 'Export declaration — 2 days.', kpb_email: 'Recipient e-mail (for sending)', kpb_download: 'Download PDF', kpb_send: 'Send by e-mail', kpb_need_email: 'Enter the recipient e-mail',
      scalc_title: 'Would you rather not deal with the numbers?', scalc_sub: 'Answer three questions — we will do the maths and call you back.', scalc_q1: '1. What kind of vehicle do you need?', scalc_q2: '2. What budget do you have in mind? (optional)', scalc_q3: '3. Your phone — we will call and explain everything', scalc_need_tractor: 'Tractor unit', scalc_need_dump: 'Dump truck', scalc_need_crane: 'Crane', scalc_need_trailer: 'Trailer / lowboy', scalc_need_car: 'Passenger car', scalc_need_unsure: 'Not sure yet', scalc_budget_ph: 'e.g. up to 35M ₸', scalc_name_ph: 'Your name (optional)', scalc_send: 'Get a quote', scalc_sent: 'Thank you! We will call you back shortly.', scalc_need_phone: 'Please enter your phone number — we will call you back', scalc_error: 'Error', scalc_show_detailed: 'Show the detailed calculation', scalc_hide_detailed: 'Hide the detailed calculation',
      contact_msg_label_opt: 'Message (optional)', contact_need_phone: 'Please enter your phone number — we will call you back',
      brand_subtitle: 'SPECIAL EQUIPMENT FROM CHINA',
      nav_how_it_works: 'How it works',
      nav_favorites: 'Favorites',
      nav_blog: 'Blog',
      nav_login: 'Log in',
      nav_account: 'Account',
      nav_not_verified: 'not verified',
      nav_logout_confirm: 'Log out of your account?',
      title_register: 'China Motors - Register',
      title_login: 'China Motors - Login',
      register_hero: 'Register',
      register_tagline: 'Create a China Motors customer account',
      register_tab_person: 'Individual',
      register_tab_company: 'Company',
      register_person_note: 'Individuals can purchase a passenger car. For commercial vehicles, please register as a company.',
      register_company_note: 'Companies can purchase various types of commercial vehicles.',
      register_phone_label: 'Phone',
      register_password_label: 'Password',
      register_fullname_label: 'Full name',
      register_iin_label: 'IIN (for the contract)',
      register_companyname_label: 'Company name',
      register_bin_label: 'BIN (for the contract)',
      register_address_label: 'Legal address',
      register_submit: 'Create account',
      register_have_account: 'Already have an account? Log in',
      register_err_required: 'Please fill in the required fields',
      register_success: 'Registration complete! Your account is awaiting admin verification.',
      login_hero: 'Login',
      login_tagline: 'Log in to your China Motors account',
      login_submit: 'Log in',
      login_no_account: "Don't have an account? Register",
      login_success: 'Logged in successfully!',
      register_tab_service: 'Service partner (SVH)',
      register_tab_bank: 'Bank',
      register_tab_partner: 'Seller partner (China)',
      register_service_note: 'Choose a role. The account will await admin verification.',
      register_service_role_label: 'Role',
      register_service_role_placeholder: '— select —',
      register_role_declarant: 'Declarant (border)',
      register_role_logistic: 'Logistics',
      register_role_lab: 'Laboratory',
      register_role_svh: 'SVH (bonded warehouse)',
      register_role_broker: 'Broker (SVH)',
      register_bank_note: "The bank account is used to support the deal's settlement process.",
      register_bankname_label: 'Bank name',
      register_bik_label: 'BIK',
      register_partner_note: 'Partners get a dashboard and upload vehicle listings — subject to admin moderation.',
      register_country_label: 'Country',
      register_regno_label: 'Company registration number (for the contract)',
      title_account: 'China Motors - Account',
      account_hero: 'Account',
      account_logout: 'Log out',
      account_loading: 'Loading...',
      account_my_listings_title: 'My listings',
      account_new_listing: 'Post a listing',
      account_listing_brand_label: 'Brand',
      account_listing_title_label: 'Title / model',
      account_listing_category_label: 'Category',
      account_listing_city_label: 'City',
      account_listing_weight_label: 'Weight, t',
      account_listing_power_label: 'Engine power, hp',
      account_listing_load_capacity_label: 'Load capacity, t',
      account_listing_price_kzt_label: 'Price, KZT',
      account_listing_photos_label: 'Photos',
      account_listing_description_label: 'Description',
      badge_user_listing_prefix: 'Listed by',
      product_create_deal: 'Create a deal',
      product_secure_note: 'Secure payment through the bank · full set of documents',
      product_extra_title: 'Specifications and equipment',
      product_cta_title: 'Want to buy this unit?',
      product_cta_sub: "We'll calculate the full cost and arrange the deal under contract.",
      product_cta_ask: 'Ask a question',

      brand_title: 'China Motors',
      hero_title_main: 'Special equipment and vehicles from China, turnkey',
      hero_tagline: 'Selection • calculation • delivery • customs • registration in Kazakhstan',
      hp_hero_badge: 'DIRECT SUPPLY FROM CHINESE FACTORIES',
      hp_bullet1: 'Official contract',
      hp_bullet2: 'Bank protects your money',
      hp_bullet3: 'Full set of documents',
      hp_bullet4: 'Since 2024',
      hp_cta_offer: 'Get a quote',
      hp_cta_catalog: 'View catalog →',

      // --- Proposal page (kp.html) ---
      title_kp: 'China Motors — Commercial proposal',
      kp_rule_title: 'Commercial proposal',
      kp_meta_number: 'NUMBER', kp_meta_date: 'DATE', kp_meta_buyer: 'BUYER',
      kp_meta_valid: 'VALID UNTIL',
      kp_rates_t: 'Exchange rate temporarily unavailable',
      kp_rates_d: 'The price is calculated at the National Bank rate on the day of issue. Until the rate arrives the document is not issued — try later or call us and we will send the proposal ourselves.',
      kp_download_signed: 'DOWNLOAD SIGNED',
      kp_download_signed_note: 'with the company seal · coming soon',
      kp_download_signed_ready: 'with the company seal',
      kp_download_page: 'DOWNLOAD AS ON SITE',
      kp_download_page_note: 'this page, no seal',
      kp_share: 'SHARE',
      kp_share_copied: 'Link copied',
      kp_share_failed: 'Copy the link from the address bar',
      kp_seller_head: 'SELLER',
      kp_seller_address: 'ADDRESS', kp_seller_bank: 'BANK',
      kp_seller_bank_address: 'BANK ADDRESS', kp_seller_account: 'ACCOUNT', kp_seller_swift: 'SWIFT',
      kp_subject_head: 'SUBJECT OF THE PROPOSAL',
      kp_col_qty: 'QTY', kp_col_usd: 'PRICE, USD', kp_col_cny: 'PRICE, CNY', kp_col_kzt: 'AMOUNT, ₸',
      kp_specs_head: 'SPECIFICATIONS', kp_on_request: 'on request',
      kp_breakdown_head: 'TURNKEY COST BREAKDOWN',
      kp_total_label: 'TURNKEY IN ALMATY',
      kp_total_note: 'This is the final amount. Nothing to pay on top.',
      kp_terms_head: 'DELIVERY TERMS', kp_timeline_head: 'TIMELINE',
      kp_service_head: 'SERVICE AND WARRANTY',
      kp_foot_note: 'Questions about the proposal — call or write, we will answer against this very document.',
      kp_foot_contacts: 'MESSAGE A MANAGER',
      kp_loading: 'Preparing the commercial proposal…',
      kp_error_t: 'Could not assemble the proposal',
      kp_error_d: 'Reopen the page or call us — we will send the proposal ourselves.',
      kp_error_catalog: 'TO THE CATALOGUE',
      hp_calc_widget_title: 'Calculate the cost',
      hp_calc_category: 'Category',
      hp_calc_brand: 'Brand',
      hp_calc_submit: 'Calculate the cost',
      hp_calc_widget_note: 'free and non-binding',
      hp_services_title: 'Our services',
      hp_services_sub: 'Comprehensive solutions for equipment supply and service',
      hp_service1_t: 'Order and supply',
      hp_service1_d: 'Vehicles and special equipment from China for your needs.',
      hp_service2_t: 'Customs clearance',
      hp_service2_d: 'Help with customs clearance.',
      hp_service3_t: 'Delivery',
      hp_service3_d: 'Delivery from Khorgos to Almaty.',
      hp_service4_t: 'License plate',
      hp_service4_d: 'Help getting a license plate.',
      hp_process_title: 'How the deal works',
      hp_step1_t: 'Choosing equipment',
      hp_step1_d: 'We pick a model to fit your needs and budget',
      hp_step2_t: 'Commercial offer',
      hp_step2_d: 'Cost calculation with full specification',
      hp_step3_t: 'Contract and payment',
      hp_step3_d: 'Secure payment through the bank, full set of documents',
      hp_step4_t: 'Delivery and customs',
      hp_step4_d: 'Logistics from China and customs clearance',
      hp_step5_t: 'Receiving the equipment',
      hp_step5_d: 'Handover of the equipment and full set of documents',
      hp_vehicles_title: 'Popular equipment',
      hp_vehicles_link: 'View full catalog →',
      hp_vehicles_loading: 'Loading...',
      hp_vehicle_cta: 'Get a quote',
      hp_stats_label: 'TRUSTED BY',
      hp_stat1: 'customers',
      hp_stat2: 'deals under contract',
      hp_stat3: 'units delivered',
      hp_stat4: 'on the market',
      hp_stat4_years: 'years',
      footer_address_khorgos: 'Khorgos — warehouse and shipping',
      hp_contact_reach_title: 'Contact us',
      hp_contact_phone_label: 'Phone',
      hp_contact_address_label: 'Addresses',
      hp_contact_whatsapp: 'Message on WhatsApp',
      footer_address_almaty: 'Almaty — equipment pickup',
      footer_col1_text: 'Reliable vehicles from China — in stock and on order. Delivery from Khorgos to Almaty, full deal support. Running since 2024.',
      footer_col2_title: 'Navigation',
      footer_col3_title: 'Contacts',
      footer_col4_title: 'Social',
      footer_copy: '© 2026 China Motors. All rights reserved.',
      footer_devnote: 'Information on the site is for reference only and does not constitute a public offer',
      btn_photos: 'Photos',
      btn_calculate: 'Calculate',
      btn_send: 'Send',
      btn_refresh_rate: 'Refresh rate',
      search_placeholder: 'Search...',

      about_title: 'About us',
      about_p1: 'China Motors is your reliable partner for sourcing cars and special equipment from Khorgos, China. Since 2024 we provide quality vehicles and professional logistics & customs support.',
      about_p2: 'Our mission is to deliver modern equipment at fair prices with guaranteed quality.',
      about_card1_t: 'Wide selection',
      about_card1_d: 'Various models of special equipment.',
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
      catalog_subhead: 'China Motors equipment catalog',
      catalog_found: 'Found',

      // FAVORITES
      title_favorites: 'China Motors - Favorites',
      fav_subtitle: 'Saved vehicles — compare and request a quote',
      fav_saved_count: 'Saved',
      fav_cta_title: 'Request a quote for the whole list',
      fav_cta_sub: "We'll send a quote for every item in your favorites — delivered to Almaty.",
      fav_cta_btn: 'Get a quote for the list',
      fav_empty_title: 'No favorites yet',
      fav_empty_sub: 'Tap the bookmark icon on any vehicle card in the catalog — it will appear here.',
      fav_empty_btn: 'Go to catalog',
      fav_remove_title: 'Remove from favorites',
      fav_request_btn: 'Get a quote',

      // BLOG
      title_blog: 'China Motors - Blog',
      blog_hero: 'Blog',
      blog_subhead: 'Articles and guides on equipment from China, delivery, and deal paperwork',
      blog_read_more: 'Read →',
      blog1_date: 'Guide',
      blog1_title: 'How a deal works: from request to receiving the equipment',
      blog1_excerpt: 'Five steps from choosing a model to handing over the equipment with a full set of documents — what happens at each stage.',
      blog2_date: 'Guide',
      blog2_title: 'How to choose equipment: dump truck, tractor unit, or crane truck',
      blog2_excerpt: 'What to consider when choosing equipment for a specific task — cargo type, distance, budget, and how often it will be used.',
      blog3_date: 'Guide',
      blog3_title: 'Shipping equipment from China: the route from Khorgos to Almaty',
      blog3_excerpt: 'How equipment gets from the Khorgos warehouse to you in Almaty — the stages, the paperwork, and what we show along the way.',

      filter_body_label: 'Vehicle type',
      filter_source_label: 'Source',
      filter_source_all: 'All listings',
      filter_source_official: 'Official catalog',
      filter_source_user: 'Customer listings',
      filter_sort_label: 'Sort',
      sort_none: 'No sorting',
      sort_price_asc: 'Price ↑',
      sort_price_desc: 'Price ↓',
      card_body_label: 'Vehicle type:',
      card_wheel_formula_label: 'Wheel formula:',
      card_gearbox_label: 'Gearbox:',
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
      calculator_tagline: 'One-stop cost calculation for ordering, delivery, and paperwork — in 2 minutes',
      calc_page_title: 'Cost calculator',
      calc_in_title: 'Input data',
      calc_in_name_label: 'Model / configuration',
      calc_in_name_ph: 'e.g., Tractor 2022',
      calc_in_price_label: 'Vehicle price, $',
      calc_in_price_ph: '59165',
      calc_in_type_label: 'Vehicle type',
      calc_in_rate_label: 'Rate $ → ₸',
      calc_rate_info: 'NBK official rate: —',
      calc_real_title: 'Actual cost',
      calc_real_hint: 'Price in KZT = USD × Rate',
      calc_ts_title: 'Customs value',
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
      calc_mand_title: 'Additional expenses',
      calc_mand_note: 'Depends on vehicle type and chosen mode.',
      calc_mand_list_title: 'Breakdown',
      calc_ship_title: 'Delivery & border',
      calc_ship_list_title: 'Delivery includes',
      calc_util_title: 'Recycling fee & registration',
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
      contact_note: 'Your request goes straight to our Telegram',

      js_price_on_request: 'Price on request',
      js_form_err_phone: 'Enter a valid phone number',
      js_form_err_msg: 'Add a message',
      js_form_sending: 'Sending...',
      js_form_sent_ok: 'Request sent! We will contact you.',
      js_form_sent_fail: 'Sending failed. Try again later.',
      why_title : 'Why choose us',
      why_card1_t : 'Contract cooperation',
      why_card1_d : 'All supplies are formally processed. Transparent terms, no hidden fees.',
      why_card2_t : 'Actual supply',
      why_card2_d : 'We handle actual equipment. Photos and videos of loading, warehousing, and delivery.',
      why_card3_t : 'Transparent calculation',
      why_card3_d : 'The calculator shows what you pay for. No "pay later".',
      why_card4_t : 'Choose by budget',
      why_card4_d : 'Select equipment based on task and budget, not selling "available" equipment.',
      why_card5_t : 'Registration support',
      why_card5_d : 'We assist with paperwork, customs, and registration.',
      footer_terms: 'User Agreement',
      footer_privacy: 'Privacy Policy',
      loading: 'Loading...',
      loading_error: 'Catalog loading error',
      
      body_trailer: "Trailer",
      body_semitrailer: "Semi-trailer",
      body_dumptruck: "Dump Truck",
      body_tugboat: "Tractor Unit",

      body_specialequipment: "Special Equipment",
      body_crane: "Crane",
      body_manipulator: "Truck Crane (Manipulator)",
      body_mixer: "Concrete Mixer",
      body_fuel_tank: "Fuel Tank Truck",
      body_aerial_ladder: "Aerial Platform",
      body_sewer_cleaner: "Sewage Truck",

      body_refrigerator: "Refrigerated Truck",
      body_van: "Cargo Van",
      body_sprinkler: "Water Sprinkler Truck",

      body_drilling_rig: "Drilling Rig Truck",
      body_milk_truck: "Milk Tank Truck",
      body_fuel_truck: "Fuel Refuel Truck",

      body_all: 'All types',
      calc_item_sbkts: 'SBKTS certificate',
      calc_item_sos: 'SOS button',
      calc_item_customs_fee: 'Customs fee',
      calc_item_broker_svh: 'SVH broker services',
      calc_item_svh: 'SVH',
      calc_item_border_broker: 'Border broker',
      calc_item_export_decl: 'Export declaration',
      calc_item_transport_almaty: 'Delivery to Almaty',
      calc_item_epts: 'EPTS',
      calc_item_diesel_pack: 'Diesel + AdBlue package',
      calc_item_red_corridor: 'Corridor',
      calc_item_thanks_astana: '“Thanks to Astana”',
      calc_item_driver: 'Driver',
      calc_item_insurance: 'Insurance',
      calc_item_toll_road: 'Toll road',

      calc_item_declaration: 'Declaration of conformity',
      calc_item_customs_broker: 'Customs broker',
      calc_item_driver: 'Driver',
      calc_item_adblue: 'AdBlue',
      calc_item_toll_road: 'Toll road',
      calc_item_diesel: 'Diesel',
      calc_item_plate: 'License plate and technical passport',
      calc_item_util_tax: 'Recycling fee',
      calc_item_first_reg: 'Initial registration',
      calc_item_srtc: 'Technical passport (SRTC)',
      calc_flag_intl_carrier: 'Has international carrier permit (primary registration waived for tractors under 7 years old)',

      // TOTAL LABELS
      calc_total_vehicle: 'Vehicle price',
      calc_total_clearance: 'Clearance cost',
      calc_total_turnkey: 'Turnkey total',
      calc_year_label: 'Year',
      calc_item_broker_service: 'SVH broker services',
      calc_disclaimer: '⚠️ Calculation is preliminary and not a public offer. Final cost depends on exchange rates, customs duties, and delivery terms. Consult the manager for details.',
      body_car: 'Car',
      calc_ts_bill_duty_percent: 'Duty rate',
      why_card1_y: '✔ Contract cooperation',
      why_card2_y: '✔ Photos and videos of loading and delivery',
      why_card3_y: '✔ Transparent calculation with no "pay later"',
      why_card4_y: '✔ Assistance with customs and registration',
      btn_calculate_catalog: 'Details and calculation',
    },
  };
  window.translations = translations;
  function getLang() {
    return localStorage.getItem(LS_LANG) || 'ru';
  }

  function applyLang(lang) {
    document.documentElement.lang = lang;

    // обычный текст
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const value = translations[lang]?.[key];
      if (value) el.textContent = value;
    });

    // placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      const value = translations[lang]?.[key];
      if (value) el.placeholder = value;
    });

    // title (tooltips)
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.dataset.i18nTitle;
      const value = translations[lang]?.[key];
      if (value) el.title = value;
    });

    localStorage.setItem('lang', lang);

    // Сообщаем странице о смене языка, чтобы динамически отрисованные части
    // (кабинет, калькулятор) могли перерисоваться через window.t().
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  }


  /* =====================
     THEME (ТОЛЬКО CSS)
     ===================== */
  function initTheme() {
    const saved = localStorage.getItem(LS_THEME);
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
    }

    const themeBtn = document.getElementById('themeToggle');
    themeBtn?.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
      localStorage.setItem(
        LS_THEME,
        document.documentElement.classList.contains('dark') ? 'dark' : 'light'
      );
    });
  }

  /* =====================
     LANGUAGE SWITCH (dropdown "шторка")
     ===================== */
  function initLang() {
    const wrap = document.getElementById('langSwitch');
    const trigger = document.getElementById('langToggle');
    const label = document.getElementById('langCurrentLabel');
    const menu = document.getElementById('langMenu');
    if (!trigger) return;

    let current = getLang();
    applyLang(current);
    if (label) label.textContent = current.toUpperCase();
    menu?.querySelectorAll('button[data-lang]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === current);
    });

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      wrap?.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (wrap && !wrap.contains(e.target)) wrap.classList.remove('open');
    });

    menu?.querySelectorAll('button[data-lang]').forEach(btn => {
      btn.addEventListener('click', () => {
        current = btn.dataset.lang;
        if (label) label.textContent = current.toUpperCase();
        menu.querySelectorAll('button[data-lang]').forEach(b => b.classList.toggle('active', b === btn));
        applyLang(current);
        wrap?.classList.remove('open');

        if (typeof window.recalc === 'function') {
          window.recalc();
        }
      });
    });
  }

  /* =====================
     ACTIVE NAV LINK
     ===================== */
  function initActiveNav() {
    const links = document.querySelectorAll('.nav-links a, .nav-drawer__nav a');
    const current = location.pathname.split('/').pop() || 'index.html';
    links.forEach(a => {
      const hrefPage = (a.getAttribute('href') || '').split('#')[0].split('/').pop();
      if (hrefPage === current) a.classList.add('active');
    });
  }

  /* =====================
     FAVORITES (localStorage, per-device)
     ===================== */
  const LS_FAVORITES = 'cm_favorites';

  function getFavorites() {
    try {
      const raw = JSON.parse(localStorage.getItem(LS_FAVORITES));
      return Array.isArray(raw) ? raw.map(String) : [];
    } catch {
      return [];
    }
  }

  function isFavorite(id) {
    return getFavorites().includes(String(id));
  }

  function toggleFavorite(id) {
    id = String(id);
    const favs = getFavorites();
    const idx = favs.indexOf(id);
    if (idx === -1) favs.push(id);
    else favs.splice(idx, 1);
    localStorage.setItem(LS_FAVORITES, JSON.stringify(favs));
    document.dispatchEvent(new CustomEvent('cm:favorites-changed', { detail: { favorites: favs } }));
    return idx === -1;
  }

  window.CMFavorites = { getFavorites, isFavorite, toggleFavorite };

  /* =====================
     YANDEX.METRIKA GOALS
     ===================== */
  const YM_COUNTER_ID = 110843946;

  function cmGoal(name, params) {
    if (typeof window.ym === 'function') {
      window.ym(YM_COUNTER_ID, 'reachGoal', name, params);
    }
  }
  window.cmGoal = cmGoal;

  // Клики по телефону/WhatsApp встречаются в футере, на контактах и т.д. —
  // делегирование на document ловит их везде, включая шапку/футер, которые
  // подгружаются отдельным fetch'ем позже.
  function initGoalTracking() {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href]');
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (href.startsWith('tel:')) cmGoal('phone_click');
      else if (href.includes('wa.me')) cmGoal('whatsapp_click');
    });
  }

  /* =====================
     IMAGE OPTIMIZATION (Cloudinary)
     ===================== */
  // Фото техники хранятся в Cloudinary — просим отдать WebP (там, где браузер
  // его поддерживает) и ужатое под нужную ширину, вместо оригинала как есть.
  // На остальные картинки (плейсхолдер /img/no-photo.png, внешние ссылки) не влияет.
  function cmOptimizeImage(url, opts) {
    if (!url || typeof url !== 'string') return url;
    if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;
    if (/\/upload\/[^/]*f_auto/.test(url)) return url;
    const width = opts && opts.width;
    const transform = width ? `f_auto,q_auto,w_${width}` : 'f_auto,q_auto';
    return url.replace('/upload/', `/upload/${transform}/`);
  }
  window.cmOptimizeImage = cmOptimizeImage;

  /* =====================
     COUNT-UP (числа набегают от нуля)
     ===================== */
  // Один общий счётчик для всех «живых» чисел системы: hero на главной,
  // «Итого» в калькуляторе. Правила:
  //   • запуск — один раз, когда элемент впервые попал во вьюпорт
  //     (IntersectionObserver отключается сразу после срабатывания, поэтому
  //     повторные проходы скроллом мимо ничего не перезапускают);
  //   • ease-out-cubic — число тормозит к финалу, а не ползёт равномерно;
  //   • на каждом кадре значение округляется до нужного знака и проходит
  //     через toLocaleString, так что «сырых» дробей на экране не бывает;
  //   • prefers-reduced-motion: reduce — сразу конечное значение, без кадров.
  // После того как счётчик отработал, следующие вызовы с новым значением
  // просто ставят его на место: анимация здесь — появление блока, а не
  // реакция на каждый пересчёт (иначе калькулятор дёргался бы на каждый ввод).
  const REDUCED_MOTION = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : { matches: false };
  const countUpState = new WeakMap();

  function cmCountUp(el, value, opts) {
    if (!el) return;
    const o = opts || {};
    const target = Number(value);
    if (!Number.isFinite(target)) return;

    const decimals  = Number.isFinite(o.decimals) ? o.decimals : 0;
    const duration  = Number.isFinite(o.duration) ? o.duration : 1300;
    const locale    = o.locale || 'ru-RU';
    const prefix    = o.prefix || '';
    const suffix    = o.suffix || '';
    const pow       = Math.pow(10, decimals);

    const render = (n) => {
      el.textContent = prefix + (Math.round(n * pow) / pow).toLocaleString(locale, {
        minimumFractionDigits: decimals, maximumFractionDigits: decimals,
      }) + suffix;
    };

    const state = countUpState.get(el) || {};
    state.target = target;
    countUpState.set(el, state);
    if (state.frame) { cancelAnimationFrame(state.frame); state.frame = null; }

    // Без анимации: пользователь просит меньше движения, браузер не умеет
    // IntersectionObserver, или счётчик для этого элемента уже отыграл.
    if (REDUCED_MOTION.matches || !('IntersectionObserver' in window) || state.done) {
      render(target);
      return;
    }

    const run = () => {
      state.done = true;
      const start = performance.now();
      const tick = (now) => {
        // Переключить настройку могли и в середине пробега — досчитываем сразу.
        if (REDUCED_MOTION.matches) { state.frame = null; render(state.target); return; }
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);       // ease-out-cubic
        render(state.target * eased);
        state.frame = p < 1 ? requestAnimationFrame(tick) : null;
        if (p >= 1) render(state.target);
      };
      state.frame = requestAnimationFrame(tick);
    };

    if (state.visible) { run(); return; }
    if (state.observer) return;                     // ждём появления во вьюпорте

    // Пока элемент за display:none, наблюдатель молчит и срабатывает в тот
    // момент, когда блок раскрыли и он попал во вьюпорт, — на это опираются
    // и hero (снимает hidden до вызова), и «Итого» в калькуляторе (живёт
    // внутри свёрнутого подробного расчёта).
    state.observer = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      state.observer.disconnect();
      state.observer = null;
      state.visible = true;
      run();
    }, { threshold: 0.4 });
    state.observer.observe(el);
  }
  window.cmCountUp = cmCountUp;

  // scrollIntoView({behavior:'smooth'}) задан в JS и на CSS scroll-behavior не
  // смотрит — правило из блока prefers-reduced-motion его не выключит.
  // Поэтому режим проверяем здесь, руками.
  function cmScrollIntoView(el, opts) {
    if (!el) return;
    const o = Object.assign({}, opts);
    o.behavior = REDUCED_MOTION.matches ? 'auto' : 'smooth';
    el.scrollIntoView(o);
  }
  window.cmScrollIntoView = cmScrollIntoView;

  /* =====================
     SCROLL-REVEAL (секции и карточки проявляются при подходе к ним)
     =====================
     Та же техника, что у счётчиков: IntersectionObserver, disconnect после
     первого срабатывания, никакого повторного проигрывания при прокрутке
     назад. Отличия — по существу задачи:

       • Прячущий класс .cm-reveal вешает JS, а не разметка. Это главное
         решение всего блока: без JS (или если он упал на строке выше)
         текст остаётся на экране, а не пропадает навсегда. Разметка,
         которая прячет контент сама, такой гарантии не даёт.
       • prefers-reduced-motion — выходим до того, как что-то спрятали.
         Не «спрятали и сразу показали», а вообще не трогали DOM.
       • Соседи в одной пачке проявляются лесенкой (--cm-reveal-delay),
         чтобы сетка каталога не вспыхивала целиком.
       • Аварийный таймер снимает скрытие со всего, что по любой причине
         не дождалось наблюдателя (элемент в свёрнутом блоке, вкладка
         открыта в фоне и IO не сработал, зум/скролл-контейнер). Контент
         не должен зависеть от того, отработала анимация или нет. */
  const REVEAL_STAGGER_MS  = 70;   // 60–80ms между соседями
  const REVEAL_STAGGER_MAX = 6;    // не длиннее ~420ms на всю пачку
  const REVEAL_SAFETY_MS   = 2000; // после этого показываем всё безусловно
  const revealSeen = new WeakSet();
  let revealObserver = null;
  let revealSafety = null;

  function revealNow(el) {
    el.style.removeProperty('--cm-reveal-delay');
    el.classList.remove('cm-reveal');
    el.classList.add('cm-reveal--in');
  }

  // Показать всё, что ещё висит спрятанным, и больше не прятать.
  function cmRevealAll() {
    if (revealObserver) { revealObserver.disconnect(); revealObserver = null; }
    document.querySelectorAll('.cm-reveal').forEach(revealNow);
  }

  function getRevealObserver() {
    if (revealObserver) return revealObserver;
    revealObserver = new IntersectionObserver((entries, obs) => {
      const late = [];   // проехали мимо — показать сразу, без лесенки
      const shown = [];  // вошли в кадр — показать лесенкой

      entries.forEach((e) => {
        if (e.isIntersecting) { shown.push(e); return; }
        // Быстрая прокрутка. Наблюдатель отдаёт последнее посчитанное
        // состояние, а не всю историю: если элемент успел войти в кадр и
        // выйти между двумя доставками, сюда придёт «не виден», и элемент
        // остался бы спрятанным до аварийного таймера. Отрицательный
        // bottom означает, что он уже ушёл ВВЕРХ, то есть его пролистали, —
        // проявлять его плавно поздно, надо просто показать.
        if (e.boundingClientRect.bottom < 0) late.push(e);
      });

      late.forEach((e) => { obs.unobserve(e.target); revealNow(e.target); });

      // Порядок появления — сверху вниз по документу, а не в том порядке,
      // в котором наблюдатель отдал записи: иначе лесенка идёт вразнобой.
      // Координату берём из самой записи (e.boundingClientRect), а не через
      // getBoundingClientRect(): вызов из обработчика заставляет браузер
      // пересчитать раскладку немедленно, и на пачке из десятка карточек
      // это выливается в заметную задержку на слабом процессоре. Наблюдатель
      // уже посчитал этот прямоугольник — второй раз он не нужен.
      shown.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      shown.forEach((e, i) => {
        obs.unobserve(e.target);
        // Лесенка ограничена REVEAL_STAGGER_MAX ступенями. Без ограничения
        // одна пачка на два десятка элементов (широкий экран, быстрая
        // прокрутка, вся сетка каталога разом) растягивала бы проявление
        // последней карточки почти на полторы секунды — человек успевает
        // дочитать блок раньше, чем он договорит.
        const step = Math.min(i, REVEAL_STAGGER_MAX);
        e.target.style.setProperty('--cm-reveal-delay', (step * REVEAL_STAGGER_MS) + 'ms');
        // Ждём кадр: класс должен успеть примениться в спрятанном
        // состоянии, иначе перехода не будет — элемент просто появится.
        requestAnimationFrame(() => revealNow(e.target));
      });
    }, {
      // 12% высоты элемента в кадре — проявление начинается, когда блок
      // уже виден, но ещё не дочитан. rootMargin снизу отрицательный,
      // чтобы карточка не «доезжала» проявленной из-за края экрана.
      threshold: 0.12,
      rootMargin: '0px 0px -8% 0px',
    });
    return revealObserver;
  }

  // Регистрирует элементы (NodeList, массив или селектор) на проявление.
  // Вызывается и для статичной разметки, и после отрисовки карточек.
  function cmReveal(target) {
    if (REDUCED_MOTION.matches || !('IntersectionObserver' in window)) return;

    const list = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target && target.length !== undefined ? target : [target]);

    const obs = getRevealObserver();
    let added = 0;
    Array.prototype.forEach.call(list, (el) => {
      if (!el || !el.nodeType || revealSeen.has(el)) return;
      revealSeen.add(el);
      el.classList.add('cm-reveal');
      obs.observe(el);
      added++;
    });
    if (!added) return;

    if (revealSafety) clearTimeout(revealSafety);
    revealSafety = setTimeout(cmRevealAll, REVEAL_SAFETY_MS);
  }
  window.cmReveal = cmReveal;
  window.cmRevealAll = cmRevealAll;

  // Настройку могли включить уже на открытой странице — тогда снимаем всё
  // спрятанное сразу, а не оставляем человека ждать наблюдателя.
  if (REDUCED_MOTION.addEventListener) {
    REDUCED_MOTION.addEventListener('change', (e) => { if (e.matches) cmRevealAll(); });
  }

  // Статичная разметка регистрируется здесь же, синхронно, а не по
  // DOMContentLoaded: common.js подключён последним тегом <body> на всех
  // страницах, значит секции уже разобраны, а первый кадр ещё не показан.
  // Из DOMContentLoaded скрытие пришло бы уже после отрисовки — блок успел
  // бы моргнуть. Карточки, которых в разметке нет, регистрируют сами
  // страницы после отрисовки (catalog.js, home.js, favorites.js).
  cmReveal('[data-reveal]');

  /* =====================
     МИКРО-ОТКЛИК НА КЛИК (закладка «в избранное»)
     =====================
     Класс снимается по animationend, иначе второе нажатие не перезапустит
     анимацию. Блок prefers-reduced-motion гасит длительность до 0.01ms, а
     не в none, поэтому событие приходит и там; таймер — страховка на
     случай, если анимации не будет вовсе. */
  function cmBump(el) {
    if (!el) return;
    el.classList.remove('cm-bump');
    // Перезапуск анимации требует кадра без класса — reflow даёт его сразу.
    void el.offsetWidth;
    el.classList.add('cm-bump');
    const done = () => el.classList.remove('cm-bump');
    el.addEventListener('animationend', done, { once: true });
    setTimeout(done, 400);
  }
  window.cmBump = cmBump;

  /* =====================
     РАСКРЫТИЕ СВЁРНУТОГО БЛОКА
     =====================
     display анимировать нечем, поэтому проявление вешаем одноразовым
     классом (@keyframes v2-reveal) — тем же, на котором стоит подробный
     расчёт в калькуляторе. Вынесено сюда, чтобы «Уточнить» в каталоге и
     подробный расчёт открывались одинаково, а не каждый по-своему. */
  function cmRevealToggle(el) {
    if (!el) return;
    el.classList.add('is-revealing');
    const done = () => el.classList.remove('is-revealing');
    el.addEventListener('animationend', done, { once: true });
    setTimeout(done, 400);
  }
  window.cmRevealToggle = cmRevealToggle;

  function initFavNav() {
    const countEl = document.getElementById('navFavCount');
    if (!countEl) return;
    const render = () => {
      const n = getFavorites().length;
      countEl.textContent = n;
      countEl.style.display = n > 0 ? '' : 'none';
    };
    render();
    document.addEventListener('cm:favorites-changed', render);
    window.addEventListener('storage', (e) => {
      if (e.key === LS_FAVORITES) render();
    });
  }

  // Мобильная шторка (см. мокап SiteHeader) — отдельный <aside>, а не
  // переиспользованный .nav-links. Открывается бургером, закрывается
  // крестиком/оверлеем/Escape/кликом по ссылке.
  function initMobileDrawer() {
    const burger = document.getElementById('navBurger');
    const drawer = document.getElementById('navDrawer');
    const overlay = document.getElementById('navDrawerOverlay');
    const closeBtn = document.getElementById('navDrawerClose');
    const nav = document.getElementById('navDrawerNav');
    if (!burger || !drawer || !overlay) return;

    function open() {
      drawer.classList.add('active');
      overlay.classList.add('active');
      // Пока шторка открыта, убираем плавающие кнопки и чат — иначе они
      // перекрывают пункты меню («Личный кабинет» и т.п.).
      document.documentElement.classList.add('cm-drawer-open');
    }
    function close() {
      drawer.classList.remove('active');
      overlay.classList.remove('active');
      document.documentElement.classList.remove('cm-drawer-open');
    }

    burger.addEventListener('click', open);
    closeBtn?.addEventListener('click', close);
    overlay.addEventListener('click', close);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
    nav?.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', close);
    });
  }

  // На мобильных верхняя панель не вмещает язык/тему/логин рядом с лого —
  // переключатель языка, темы и кнопка "Войти" переезжают в подвал шторки
  // (см. мокап SiteHeader); иконка избранного остаётся в верхней панели
  // всегда. Переносим сами узлы (не клоны), чтобы id/обработчики остались
  // рабочими; якорь-комментарий помнит, куда вернуть их обратно на десктопе.
  function initMobileNavControls() {
    const footer = document.getElementById('navDrawerFooter');
    const langSwitch = document.getElementById('langSwitch');
    const themeToggle = document.getElementById('themeToggle');
    const authLink = document.getElementById('navAuthLink');
    if (!footer || !langSwitch || !themeToggle || !authLink) return;

    const langAnchor = document.createComment('lang-switch-anchor');
    const themeAnchor = document.createComment('theme-toggle-anchor');
    const authAnchor = document.createComment('auth-link-anchor');
    langSwitch.before(langAnchor);
    themeToggle.before(themeAnchor);
    authLink.before(authAnchor);

    const phoneLink = footer.querySelector('.nav-drawer__phone');

    const mq = window.matchMedia('(max-width: 920px)');
    function apply(isMobile) {
      if (isMobile) {
        footer.insertBefore(langSwitch, phoneLink);
        footer.insertBefore(themeToggle, phoneLink);
        footer.insertBefore(authLink, phoneLink);
      } else {
        langAnchor.after(langSwitch);
        themeAnchor.after(themeToggle);
        authAnchor.after(authLink);
      }
    }
    apply(mq.matches);
    mq.addEventListener('change', (e) => apply(e.matches));
  }

  // Показывает «Войти» или «Личный кабинет» в шапке — зависит от того,
  // залогинен ли клиент (js/auth.js, если подключён на странице).
  function initAuthNav() {
    const link = document.getElementById('navAuthLink');
    if (!link || !window.CMAuth) return;

    const session = window.CMAuth.getSession();
    const label = link.querySelector('span');

    if (session) {
      link.href = 'account.html';
      if (label) label.setAttribute('data-i18n', 'nav_account');
      label.textContent = session.isVerified
        ? window.t('nav_account')
        : `${window.t('nav_account')} (${window.t('nav_not_verified')})`;
      link.onclick = null;
    } else {
      link.href = 'login.html';
      if (label) {
        label.setAttribute('data-i18n', 'nav_login');
        label.textContent = window.t('nav_login');
      }
      link.onclick = null;
    }
  }

  /* =====================
     PARTIAL LOADER
     ===================== */
  async function loadPartial(targetId, url, callback) {
    const target = document.getElementById(targetId);
    if (!target) return;

    const res = await fetch(url);
    target.innerHTML = await res.text();
    if (callback) callback();
  }

  /* =====================
     ДОСТУПНОСТЬ И БЫСТРАЯ СВЯЗЬ
     Плавающие кнопки «Позвонить» / WhatsApp и увеличение шрифта — на всех
     страницах сразу (вставляются скриптом, а не копируются в каждый HTML).
     Рассчитано на посетителей, которым проще позвонить, чем разбираться
     в характеристиках и формах.
     ===================== */
  const CONTACT_PHONE = '+77776133731';     // как на странице «Контакты»
  const CONTACT_WA = '77776133731';
  const LS_FONT = 'cm_font_scale';

  function applyFontScale(scale) {
    const html = document.documentElement;
    html.classList.remove('cm-font-lg', 'cm-font-xl');
    if (scale === 'lg') html.classList.add('cm-font-lg');
    if (scale === 'xl') html.classList.add('cm-font-xl');
  }

  // ContactDial (v2): один свёрнутый круг, раскрывается вверх. Никогда не
  // красный — иначе спорит с основным CTA страницы («максимум два signal-500
  // в кадре»). Живёт только на v2-страницах; v1 остаётся на прежнем виджете,
  // пока не переедет.
  //
  // Позиция — слева внизу, а не справа, как в макете: справа на проде висит
  // чат tawk.to, и по макету круг лёг бы прямо на него.
  function initContactDial() {
    if (document.getElementById('cmContactDial')) return;

    applyFontScale(localStorage.getItem(LS_FONT) || '');

    const box = document.createElement('div');
    box.id = 'cmContactDial';
    box.className = 'v2-dial-wrap';
    box.innerHTML = `
      <div class="v2-dial__items" id="cmDialItems" hidden>
        <a class="v2-dial__item" href="tel:${CONTACT_PHONE}">
          <i class="fas fa-phone" aria-hidden="true"></i>
          <span class="num">+7 (777) 613-3731</span>
        </a>
        <a class="v2-dial__item" href="https://wa.me/${CONTACT_WA}" target="_blank" rel="noopener">
          <i class="fab fa-whatsapp" aria-hidden="true"></i>
          <span data-i18n="help_whatsapp">WhatsApp</span>
        </a>
        <a class="v2-dial__item" href="contacts.html">
          <i class="fa-regular fa-envelope" aria-hidden="true"></i>
          <span data-i18n="help_write">Написать</span>
        </a>
      </div>
      <div class="v2-dial__row">
        <button type="button" class="v2-dial__font" id="cmFontToggle"
                data-i18n-title="help_font_title" title="Увеличить текст">
          <span aria-hidden="true">A<sup>+</sup></span>
        </button>
        <button type="button" class="v2-dial" id="cmDialToggle"
                aria-label="Связаться" aria-expanded="false">
          <i class="fa-solid fa-phone" aria-hidden="true"></i>
        </button>
      </div>
    `;
    document.body.appendChild(box);

    const items = document.getElementById('cmDialItems');
    const toggle = document.getElementById('cmDialToggle');
    toggle?.addEventListener('click', () => {
      const open = items.hasAttribute('hidden');
      items.toggleAttribute('hidden', !open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.querySelector('i').className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-phone';
    });

    initFontToggle();
  }

  // Три ступени размера текста: обычный → крупный → очень крупный.
  // Управление размером — не часть дизайн-системы, но это уже работающая
  // на проде доступность, поэтому переносится в v2 как есть.
  function initFontToggle() {
    document.getElementById('cmFontToggle')?.addEventListener('click', () => {
      const cur = localStorage.getItem(LS_FONT) || '';
      const next = cur === '' ? 'lg' : (cur === 'lg' ? 'xl' : '');
      localStorage.setItem(LS_FONT, next);
      applyFontScale(next);
    });
  }

  function initHelpWidget() {
    // На переехавших страницах — ContactDial из v2.
    if (document.body.classList.contains('v2')) { initContactDial(); return; }
    if (document.getElementById('cmHelpWidget')) return;

    applyFontScale(localStorage.getItem(LS_FONT) || '');

    const box = document.createElement('div');
    box.id = 'cmHelpWidget';
    box.className = 'cm-help';
    box.innerHTML = `
      <button type="button" class="cm-help__font" id="cmFontToggle"
              data-i18n-title="help_font_title" title="Увеличить текст">
        <span aria-hidden="true">A<sup>+</sup></span>
      </button>
      <a class="cm-help__btn cm-help__call" href="tel:${CONTACT_PHONE}">
        <i class="fas fa-phone" aria-hidden="true"></i>
        <span data-i18n="help_call">Позвонить</span>
      </a>
      <a class="cm-help__btn cm-help__wa" href="https://wa.me/${CONTACT_WA}"
         target="_blank" rel="noopener">
        <i class="fab fa-whatsapp" aria-hidden="true"></i>
        <span data-i18n="help_whatsapp">WhatsApp</span>
      </a>
    `;
    document.body.appendChild(box);

    initFontToggle();
  }

  // Страницы, которые перерисовывают body (например, экран ошибки на карточке
  // техники), могут стереть виджет — тогда его нужно вернуть.
  window.cmInitHelpWidget = initHelpWidget;

  /* =====================
     ПОДСКАЗКИ ПО ТЕРМИНАМ
     На телефоне подсказка из атрибута title не показывается (нет наведения),
     поэтому по нажатию на «?» открываем всплывающее окошко с текстом.
     ===================== */
  function initHintPopover() {
    let pop = null;

    function closePop() {
      pop?.remove();
      pop = null;
    }

    document.addEventListener('click', (e) => {
      const hint = e.target.closest('.cm-hint');
      if (!hint) { closePop(); return; }

      e.preventDefault();
      e.stopPropagation();
      const text = hint.getAttribute('title') || hint.dataset.hint || '';
      if (!text) return;

      // Второе нажатие по той же подсказке — закрыть.
      if (pop && pop.dataset.owner === (hint.dataset.hintId || '')) { closePop(); return; }
      closePop();

      // title показывал бы ещё и системную подсказку поверх нашей — прячем его.
      if (!hint.dataset.hint) {
        hint.dataset.hint = text;
        hint.dataset.hintId = 'h' + Math.random().toString(36).slice(2, 8);
      }
      hint.removeAttribute('title');

      pop = document.createElement('div');
      pop.className = 'cm-hint-pop';
      pop.dataset.owner = hint.dataset.hintId;
      pop.innerHTML = `<span>${hint.dataset.hint}</span>
        <button type="button" class="cm-hint-pop__x" aria-label="Закрыть">✕</button>`;
      document.body.appendChild(pop);

      const r = hint.getBoundingClientRect();
      const w = Math.min(300, window.innerWidth - 24);
      pop.style.width = w + 'px';
      let left = r.left + window.scrollX + r.width / 2 - w / 2;
      left = Math.max(12, Math.min(left, window.innerWidth - w - 12));
      pop.style.left = left + 'px';
      pop.style.top = (r.bottom + window.scrollY + 8) + 'px';

      pop.querySelector('.cm-hint-pop__x')?.addEventListener('click', closePop);
    });

    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePop(); });
    window.addEventListener('scroll', closePop, { passive: true });
  }

  /* =====================
     INIT
     ===================== */
  document.addEventListener('DOMContentLoaded', () => {

    initGoalTracking();
    initHelpWidget();
    initHintPopover();

    // Какую версию шапки и футера грузить, решает сама страница:
    // <body class="v2"> → тёмные партиалы v2, иначе — v1. Переезд идёт
    // постранично, поэтому обе версии какое-то время работают рядом.
    const v2 = document.body.classList.contains('v2');
    const navPartial = v2 ? './partials/navbar-v2.html' : './partials/navbar.html';
    const footerPartial = v2 ? './partials/footer-v2.html' : './partials/footer.html';

    loadPartial('siteHeader', navPartial, () => {
    initTheme();
    initLang();
    initMobileDrawer();
    initAuthNav();
    initActiveNav();
    initFavNav();
    initMobileNavControls();
  });


    loadPartial('siteFooter', footerPartial, () => {
      applyLang(getLang());
    });

  });
  window.t = function (key) {
    const lang = localStorage.getItem('lang') || 'ru';
    // Если перевода нет в текущем языке — откатываемся на русский, а не на
    // сырой ключ (полезно для длинных разделов вроде кабинета, где часть
    // строк может быть не переведена на все языки).
    return window.translations?.[lang]?.[key]
        || window.translations?.ru?.[key]
        || key;
  };
  function getLang() {
    const l = localStorage.getItem(LS_LANG);
    return translations[l] ? l : 'ru';
  }

  var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
  s1.async=true;
  s1.src='https://embed.tawk.to/68480dddb0d263190ae16f29/1itcncalg';
  s1.charset='UTF-8';
  s1.setAttribute('crossorigin','*');
  s0.parentNode.insertBefore(s1,s0);

  
})();



