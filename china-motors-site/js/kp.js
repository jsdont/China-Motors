// =======================================================
// Страница КП — /kp.html?id=<id>
// Готовое коммерческое предложение без формы и без ожидания менеджера.
// =======================================================
//
// Источник данных — /api/kp/<id>/. Пока эндпоинта нет, КП собирается из
// карточки техники моковым модулем (js/kp-mock.js) той же формы. Ветвление
// одно и помечено; когда бэкенд появится, mock-ветка и <script> в kp.html
// удаляются, остальной файл не меняется.

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const metaBase = document.querySelector('meta[name="api-base"]')?.content;
  const isLocal = ['localhost', '127.0.0.1'].includes(location.hostname);
  const API_BASE = (metaBase || (isLocal ? 'http://127.0.0.1:8000' : location.origin))
    .replace(/\/+$/, '');

  // Адрес бывает двух видов: /kp/123 (переписывание в netlify.toml, красивый
  // и именно он уходит в «Поделиться») и /kp.html?id=123 (прямая ссылка,
  // локальный просмотр, открытие файла без Netlify). Поддерживаем оба.
  function readId() {
    const q = new URLSearchParams(location.search).get('id');
    if (q) return q;
    const m = location.pathname.match(/\/kp\/([^/]+)\/?$/);
    return m ? decodeURIComponent(m[1]) : null;
  }

  const id = readId();

  const $ = (sel) => document.querySelector(sel);
  const tr = (key, fallback) => (window.t ? window.t(key) : fallback) || fallback;

  const docEl = $('#kpDoc');
  const loadingEl = $('#kpLoading');
  const errorEl = $('#kpError');

  const nf = new Intl.NumberFormat('ru-RU');

  // Суммы — без копеек и с неразрывными пробелами между разрядами: в
  // документе число не должно разрываться переносом строки.
  const fmtKzt = (n) =>
    (n === null || n === undefined || n === '') ? '—' : nf.format(Math.round(n)).replace(/\s/g, ' ');

  const fmtNum = (n) =>
    (n === null || n === undefined || n === '') ? '—' : nf.format(Math.round(n)).replace(/\s/g, ' ');

  function fmtDate(iso) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso || '—';
    return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  /* ================= РЕНДЕР ================= */

  // Ряд данных — тот же примитив, что в паспорте техники и на калькуляторе:
  // моно-ярлык слева, значение справа. Значения выравниваются в колонку.
  function rowsInto(container, pairs) {
    container.innerHTML = pairs.map(([label, value]) => `
      <div class="vp__row">
        <span class="vp__row-label">${esc(label)}</span>
        <span class="vp__row-value">${esc(value)}</span>
      </div>`).join('');
  }

  function esc(s) {
    return String(s ?? '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderSeller(seller) {
    $('#kpSellerName').textContent = seller.name || '—';
    rowsInto($('#kpSellerRows'), [
      [tr('kp_seller_address', 'АДРЕС'), seller.address],
      [tr('kp_seller_bank', 'БАНК'), seller.bank],
      [tr('kp_seller_bank_address', 'АДРЕС БАНКА'), seller.bank_address],
      [tr('kp_seller_account', 'СЧЁТ'), seller.account],
      [tr('kp_seller_swift', 'SWIFT'), seller.swift]
    ].filter(([, v]) => v));
  }

  function renderSubject(kp) {
    const v = kp.vehicle || {};
    $('#kpVehicleTitle').textContent = v.title || '—';

    const photoWrap = $('#kpPhotoWrap');
    if (v.photo_url) {
      const img = $('#kpPhoto');
      img.src = window.cmOptimizeImage?.(v.photo_url, { width: 800 }) || v.photo_url;
      img.alt = v.title || '';
      // Битую ссылку на фото не показываем: КП без снимка выглядит
      // нормально, КП с иконкой сломанной картинки — нет.
      img.addEventListener('error', () => { photoWrap.hidden = true; }, { once: true });
    } else {
      photoWrap.hidden = true;
    }

    const extra = $('#kpExtraInfo');
    if (v.extra_info) { extra.textContent = v.extra_info; extra.hidden = false; }

    $('#kpQty').textContent = kp.quantity ?? 1;
    $('#kpPriceUsd').textContent = kp.price?.usd ? fmtNum(kp.price.usd) : tr('kp_on_request', 'по запросу');
    $('#kpPriceCny').textContent = kp.price?.cny ? fmtNum(kp.price.cny) : '—';
    $('#kpPriceKzt').textContent = kp.price?.kzt_total ? fmtKzt(kp.price.kzt_total) : tr('kp_on_request', 'по запросу');

    const avail = $('#kpAvailability');
    if (kp.availability_note) { avail.textContent = kp.availability_note; avail.hidden = false; }

    const specs = v.specs || [];
    if (specs.length) {
      rowsInto($('#kpSpecs'), specs.map(s => [s.label, s.value]));
    } else {
      $('#kpSpecs').closest('.kp__specs').hidden = true;
    }
  }

  // Разбивка — та же структура, что CostBreakdown на калькуляторе:
  // группа = точка маршрута, где уходят деньги, внутри — строки расхода.
  function renderBreakdown(bd) {
    const host = $('#kpBreakdown');
    const groups = Array.isArray(bd?.groups) ? bd.groups : [];

    host.innerHTML = groups.map((g, i) => {
      const rows = (g.rows || []).filter(r => Array.isArray(r) && r.length >= 2);
      const sum = rows.reduce((s, [, amount]) => s + (Number(amount) || 0), 0);
      return `
        <section class="kp__group">
          <h3 class="kp__group-head">
            <span class="kp__group-n num">${String(i + 1).padStart(2, '0')}</span>
            <span class="kp__group-title">${esc(g.title || '')}</span>
            <span class="kp__group-sum num">${fmtKzt(sum)} ₸</span>
          </h3>
          <div class="kp__group-rows">
            ${rows.map(([label, amount]) => `
              <div class="vp__row">
                <span class="vp__row-label kp__row-label">${esc(label)}</span>
                <span class="vp__row-value">${fmtKzt(amount)} ₸</span>
              </div>`).join('')}
          </div>
        </section>`;
    }).join('');

    $('#kpTotalValue').textContent = `${fmtKzt(bd?.total)} ₸`;

    // Пересчёт в доллары и юани — как в итоге калькулятора. Показываем
    // только если курс пришёл: считать по выдуманному курсу нельзя.
    const cur = bd?.currency || {};
    const alt = [];
    if (cur.usd_kzt) alt.push(`≈ ${fmtNum(bd.total / cur.usd_kzt)} $`);
    if (cur.cny_kzt) alt.push(`≈ ${fmtNum(bd.total / cur.cny_kzt)} ¥`);
    $('#kpTotalAlt').textContent = alt.join('   ');
  }

  function renderTerms(kp) {
    $('#kpDeliveryTerms').textContent = kp.delivery_terms || '—';
    $('#kpTimeline').innerHTML = (kp.timeline || [])
      .map(step => `<li class="kp__timeline-item">${esc(step)}</li>`).join('');

    if (kp.service_center) {
      $('#kpService').textContent = kp.service_center;
      $('#kpServiceBlock').hidden = false;
    }
  }

  function renderHead(kp) {
    const title = kp.vehicle?.title || tr('kp_rule_title', 'Коммерческое предложение');
    $('#kpTitle').textContent = title;
    $('#kpNumber').textContent = kp.number || '—';
    $('#kpDate').textContent = fmtDate(kp.date);

    if (kp.buyer_name) {
      $('#kpBuyer').textContent = kp.buyer_name;
      $('#kpBuyerWrap').hidden = false;
    }

    document.title = `${title} — ${tr('kp_rule_title', 'Коммерческое предложение')} · China Motors`;
    const desc = document.getElementById('seoDescription');
    if (desc) {
      desc.content = `Коммерческое предложение China Motors: ${title}. ` +
        `Цена под ключ в Алматы со всеми платежами.`;
    }
  }

  // Ссылка на ОФИЦИАЛЬНЫЙ PDF — тот, что бэкенд собирает через core/kp.py,
  // с реквизитами продавца в шапке и печатью с подписью внизу. Мок её не
  // отдаёт и отдавать не может: подписанный документ существует только как
  // файл с бэкенда. Пока её нет, кнопка «с подписью» выключена.
  let signedPdfUrl = null;

  // Когда официальный документ доступен, он и становится предпочтительным
  // действием: заливка переезжает на него, печать страницы уходит в обводку.
  function applyDownloadState() {
    const signed = $('#kpDownloadSigned');
    const page = $('#kpDownloadPage');
    if (!signed || !page) return;

    if (!signedPdfUrl) return;   // разметка уже в нужном состоянии

    signed.disabled = false;
    signed.classList.remove('is-disabled', 'v2-btn--secondary');
    signed.classList.add('v2-btn--primary');
    page.classList.remove('v2-btn--primary');
    page.classList.add('v2-btn--secondary');

    const note = $('#kpDownloadSignedNote');
    if (note) {
      note.textContent = tr('kp_download_signed_ready', 'с печатью компании');
      note.setAttribute('data-i18n', 'kp_download_signed_ready');
    }
  }

  // Бэкенд отдаёт kp_pdf_url абсолютным — сайт и API на разных хостах, и
  // относительный путь браузер разрешил бы от chinamotors.kz, где PDF нет.
  // Относительную форму всё равно поддерживаем: она короче, её легко
  // вернуть по недосмотру, и тогда ссылка обязана вести на API, а не на
  // страницу.
  function resolvePdfUrl(raw) {
    if (!raw) return null;
    if (/^https?:\/\//i.test(raw)) return raw;
    return API_BASE + (raw.startsWith('/') ? raw : '/' + raw);
  }

  function render(kp) {
    // Имя поля намеренно не pdf_url: «какой-то PDF» и «официальный
    // подписанный PDF» — разные вещи, и на странице теперь две кнопки.
    signedPdfUrl = resolvePdfUrl(kp.kp_pdf_url);
    applyDownloadState();
    renderHead(kp);
    renderSeller(kp.seller || {});
    renderSubject(kp);
    renderBreakdown(kp.breakdown);
    renderTerms(kp);

    loadingEl.hidden = true;
    docEl.hidden = false;
  }

  function showError() {
    loadingEl.hidden = true;
    docEl.hidden = true;
    errorEl.hidden = false;
  }

  /* ================= ЗАГРУЗКА ================= */

  async function loadKP() {
    if (!id) { showError(); return; }

    // --- Ветка на время отсутствия бэкенда -------------------------------
    // Когда /api/kp/<id>/ появится, остаётся только первый запрос: убрать
    // catch с моком и <script src="js/kp-mock.js"> из kp.html.
    try {
      const res = await fetch(`${API_BASE}/api/kp/${encodeURIComponent(id)}/`, {
        headers: { Accept: 'application/json' }
      });
      if (res.ok) {
        render(await res.json());
        return;
      }
      if (res.status !== 404) throw new Error('HTTP ' + res.status);
    } catch (e) {
      // Сети нет или эндпоинта ещё нет — идём в мок ниже.
      console.info('KP endpoint unavailable, falling back to mock:', e?.message || e);
    }

    if (!window.CMKPMock) { showError(); return; }

    try {
      const res = await fetch(`${API_BASE}/api/vehicles/${encodeURIComponent(id)}/`, {
        headers: { Accept: 'application/json' }
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      render(window.CMKPMock.buildFromVehicle(await res.json()));
    } catch (e) {
      console.error(e);
      showError();
    }
    // --- /Ветка на время отсутствия бэкенда ------------------------------
  }

  /* ================= ДЕЙСТВИЯ ================= */

  let toastTimer = 0;
  function toast(msg) {
    const el = $('#kpToast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-on'), 2600);
  }

  // Официальный документ — просто ссылка на файл с бэкенда. Ничего не
  // собираем на фронте: подпись и печать ставит тот, кто их имеет право
  // ставить. Если url не пришёл, кнопка выключена и сюда не попасть.
  $('#kpDownloadSigned')?.addEventListener('click', () => {
    if (!signedPdfUrl) return;
    window.open(signedPdfUrl, '_blank', 'noopener');
  });

  // «Как на сайте» — печать текущей страницы: в «Сохранить как PDF» умеют
  // все браузеры, а @media print в style-v2.css убирает с листа шапку,
  // футер, плавающий круг и сами кнопки. Печати и подписи здесь нет и не
  // будет — на это есть первая кнопка.
  $('#kpDownloadPage')?.addEventListener('click', () => {
    window.print();
  });

  // Поделиться. На мобильном — системный лист (Web Share API), на десктопе
  // копируем ссылку. Кнопок соцсетей нет намеренно: они тянут сторонние
  // скрипты и на КП по конкретной сделке им нечего делать.
  $('#kpShare')?.addEventListener('click', async () => {
    const url = location.href;
    const title = document.title;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (e) {
        // Отмена в системном листе — не ошибка, молчим.
        if (e && e.name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      toast(tr('kp_share_copied', 'Ссылка скопирована'));
    } catch (_) {
      // clipboard недоступен (не-HTTPS, старый браузер) — выделяем адрес,
      // чтобы человек мог скопировать вручную, а не остался ни с чем.
      toast(tr('kp_share_failed', 'Скопируйте ссылку из адресной строки'));
    }
  });

  loadKP();
});
