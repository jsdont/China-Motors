// js/account.js — личный кабинет: клиент видит свои сделки,
// исполнитель (брокер/СВХ/лаборатория/логист/декларант/банк) видит
// назначенные ему сделки и обновляет статус своего этапа.
// Все видимые строки идут через window.t() → мультиязычность (RU/KK/EN/ZH).
document.addEventListener('DOMContentLoaded', async () => {
  const session = window.CMAuth?.getSession();
  if (!session) {
    location.href = 'login.html';
    return;
  }

  const t = (k) => (window.t ? window.t(k) : k);

  const CUSTOMER_ROLES = ['CUSTOMER_PERSON', 'CUSTOMER_COMPANY'];
  const ASSIGNEE_ROLES = ['SERVICE_BROKER', 'SERVICE_SVH', 'SERVICE_LAB', 'SERVICE_LOGISTIC', 'SERVICE_DECLARANT', 'BANK'];
  const MANAGER_ROLES = ['MANAGER', 'ADMIN'];
  // Кто может размещать товары/объявления: клиенты + партнёры-продавцы.
  const SELLER_ROLES = [...CUSTOMER_ROLES, 'PARTNER'];

  const EXPENSE_KEYS = ['PURCHASE', 'LOGISTICS', 'CUSTOMS', 'CERTIFICATION', 'SVH', 'OTHER'];
  const DOC_KEYS = ['CONTRACT', 'GTD', 'CMR', 'ACCEPTANCE', 'PHOTO'];

  const roleLine = document.getElementById('accountRoleLine');
  const dealListEl = document.getElementById('dealList');

  function roleLabel(role) { return t('cab_rolefull_' + role) !== 'cab_rolefull_' + role ? t('cab_rolefull_' + role) : role; }
  function renderRoleLine() {
    const badge = session.isVerified
      ? `<span class="account-badge verified">${t('cab_verified')}</span>`
      : `<span class="account-badge not-verified">${t('cab_not_verified')}</span>`;
    roleLine.innerHTML = `${roleLabel(session.role)} ${badge}`;
  }
  renderRoleLine();

  document.getElementById('btnLogout')?.addEventListener('click', () => {
    window.CMAuth.logout();
    location.href = 'index.html';
  });

  function assignmentStatusLabel(s) { return t('cab_astatus_' + s); }
  function roleShort(r) { return t('cab_role_' + r); }

  // Этапы сделки по порядку — совпадают с Deal.STATUS_CHOICES на бэкенде.
  const DEAL_STAGES = [
    ['AGREEMENT', 'fa-handshake'],
    ['CONTRACT', 'fa-file-signature'],
    ['PURCHASE_CHINA', 'fa-cart-shopping'],
    ['DELIVERY_KZ', 'fa-truck-fast'],
    ['SVH', 'fa-warehouse'],
    ['CUSTOMS', 'fa-stamp'],
    ['DELIVERY_CLIENT', 'fa-truck-ramp-box'],
    ['COMPLETED', 'fa-flag-checkered'],
  ];
  const DEAL_STAGE_INDEX = Object.fromEntries(DEAL_STAGES.map(([k], i) => [k, i]));
  function stageLabel(key) { return t('cab_stage_' + key); }
  function dealStatusLabel(status) {
    return DEAL_STAGE_INDEX[status] !== undefined ? stageLabel(status) : (status || '');
  }

  // Дорожная карта сделки: этапы до текущего — «пройдено», текущий —
  // «активен», после — «предстоит». Для COMPLETED все этапы пройдены.
  function buildTimelineHtml(status) {
    const curIdx = status in DEAL_STAGE_INDEX ? DEAL_STAGE_INDEX[status] : 0;
    const isCompleted = status === 'COMPLETED';

    const steps = DEAL_STAGES.map(([key, icon], i) => {
      let state;
      if (isCompleted || i < curIdx) state = 'done';
      else if (i === curIdx) state = 'active';
      else state = 'todo';
      const mark = state === 'done'
        ? '<i class="fa-solid fa-check"></i>'
        : `<i class="fa-solid ${icon}"></i>`;
      return `
        <li class="tl-step tl-${state}">
          <span class="tl-dot">${mark}</span>
          <span class="tl-label">${stageLabel(key)}</span>
        </li>`;
    }).join('');

    return `
      <div class="tl-block">
        <div class="tl-block__head"><i class="fa-solid fa-route"></i> ${t('cab_timeline_head')}</div>
        <ol class="tl-steps">${steps}</ol>
      </div>`;
  }

  function fmtDate(iso) {
    return new Date(iso).toLocaleString('ru-RU');
  }

  function escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  const nfKzt = new Intl.NumberFormat('ru-RU');
  function fmtMoney(v) {
    const n = Number(v);
    return (Number.isFinite(n) ? nfKzt.format(Math.round(n)) : v) + ' ₸';
  }

  async function loadComments(dealId, container) {
    try {
      const comments = await window.CMAuth.apiAuthed('GET', `/api/deals/${dealId}/comments/`);
      container.innerHTML = comments.length
        ? comments.map(c => {
            const isOwn = c.author === session.userId;
            const who = c.author_info?.name || c.author_info?.phone || '—';
            return `
              <div class="comment-item ${isOwn ? 'own' : 'other'}">
                ${isOwn ? '' : `<div class="who">${escapeHtml(who)}</div>`}
                <div class="bubble">${escapeHtml(c.text)}</div>
              </div>`;
          }).join('')
        : `<div class="comment-item other"><div class="bubble" style="opacity:.6">${t('cab_chat_empty')}</div></div>`;
      container.scrollTop = container.scrollHeight;
    } catch (e) {
      container.innerHTML = `<div class="comment-item other"><div class="bubble" style="color:#e74c3c">${t('cab_load_error')}: ${escapeHtml(e.message)}</div></div>`;
    }
  }

  function buildCommentsBlock(dealId) {
    const wrap = document.createElement('div');
    wrap.className = 'comments-block';
    wrap.innerHTML = `
      <div class="comments-block__head">${t('cab_chat_head')}</div>
      <div class="comments-list"></div>
      <form class="comment-form">
        <input type="text" placeholder="${t('cab_chat_ph')}" required>
        <button type="submit" class="btn">${t('cab_send')}</button>
      </form>
    `;
    const list = wrap.querySelector('.comments-list');
    loadComments(dealId, list);

    wrap.querySelector('.comment-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = e.target.querySelector('input');
      const text = input.value.trim();
      if (!text) return;
      try {
        await window.CMAuth.apiAuthed('POST', `/api/deals/${dealId}/comments/`, { text });
        input.value = '';
        loadComments(dealId, list);
      } catch (err) {
        alert(t('cab_error') + ': ' + err.message);
      }
    });

    return wrap;
  }

  const DOC_ICONS = {
    CONTRACT: 'fa-file-contract',
    GTD: 'fa-file-invoice',
    CMR: 'fa-truck',
    ACCEPTANCE: 'fa-file-signature',
    PHOTO: 'fa-image',
  };

  // Инструкция «как оплатить» (реквизиты) — грузим один раз и кэшируем.
  let _paymentInfo; // undefined = ещё не грузили; строка = загружено
  async function getPaymentInfo() {
    if (_paymentInfo !== undefined) return _paymentInfo;
    try {
      const d = await window.CMAuth.apiAuthed('GET', '/api/payment-info/');
      _paymentInfo = d.instructions || '';
    } catch (e) { _paymentInfo = ''; }
    return _paymentInfo;
  }

  // === Платежи по сделке ===
  async function loadPayments(dealId, container) {
    try {
      const payments = await window.CMAuth.apiAuthed('GET', `/api/deals/${dealId}/payments/`);
      if (!payments.length) {
        container.innerHTML = `<p class="dc-empty">${t('cab_payments_empty')}</p>`;
        return;
      }
      const total = payments.reduce((s, p) => s + Number(p.amount || 0), 0);
      const confirmed = payments.filter(p => p.is_confirmed).reduce((s, p) => s + Number(p.amount || 0), 0);
      container.innerHTML = `
        <ul class="dc-list">
          ${payments.map(p => `
            <li class="dc-row">
              <span class="dc-amount">${fmtMoney(p.amount)}</span>
              <span class="dc-pill ${p.is_confirmed ? 'ok' : 'wait'}">
                ${p.is_confirmed ? t('cab_confirmed') : t('cab_pending')}
              </span>
              <span class="dc-date">${fmtDate(p.created_at)}</span>
            </li>`).join('')}
        </ul>
        <div class="dc-total">
          ${t('cab_paid')}: <b>${fmtMoney(confirmed)}</b> ${t('cab_of')} <b>${fmtMoney(total)}</b>
        </div>`;

      // Клиенту с неоплаченным остатком показываем «как оплатить» (реквизиты).
      if (CUSTOMER_ROLES.includes(session.role) && confirmed < total) {
        const info = await getPaymentInfo();
        if (info) {
          container.insertAdjacentHTML('beforeend', `
            <div class="pay-how">
              <div class="pay-how__head"><i class="fa-solid fa-circle-info"></i> ${t('cab_how_to_pay')}</div>
              <div class="pay-how__body">${escapeHtml(info)}</div>
            </div>`);
        }
      }
    } catch (e) {
      container.innerHTML = `<p class="dc-empty" style="color:#e74c3c">${t('cab_load_error')}: ${escapeHtml(e.message)}</p>`;
    }
  }

  function buildPaymentsBlock(dealId, manager, currentPrice) {
    const wrap = document.createElement('div');
    wrap.className = 'dc-block';
    wrap.innerHTML = `<div class="dc-block__head"><i class="fa-solid fa-wallet"></i> ${t('cab_payments_head')}</div><div class="dc-body"></div>`;
    const body = wrap.querySelector('.dc-body');
    loadPayments(dealId, body);

    if (manager) {
      const valueRow = document.createElement('div');
      valueRow.className = 'dc-value-row';
      valueRow.innerHTML = `
        <span>${t('cab_deal_value')}</span>
        <input type="number" step="0.01" min="0" class="dc-value-input" value="${currentPrice != null ? currentPrice : ''}" placeholder="${t('cab_not_set')}">
        <button type="button" class="dc-value-save btn">${t('cab_save')}</button>
      `;
      const valueInput = valueRow.querySelector('.dc-value-input');
      const valueBtn = valueRow.querySelector('.dc-value-save');
      valueBtn.addEventListener('click', async () => {
        valueBtn.disabled = true;
        try {
          await window.CMAuth.apiAuthed('PATCH', `/api/manager/deals/${dealId}/status/`, { total_price: valueInput.value || null });
          valueBtn.textContent = t('cab_saved');
          setTimeout(() => { valueBtn.textContent = t('cab_save'); }, 1500);
          loadManagerFinance();
        } catch (err) {
          alert(t('cab_error') + ': ' + err.message);
        } finally {
          valueBtn.disabled = false;
        }
      });
      wrap.appendChild(valueRow);

      const form = document.createElement('form');
      form.className = 'dc-add-form';
      form.innerHTML = `
        <input type="number" step="0.01" min="0" placeholder="${t('cab_sum_ph')}" required>
        <label class="dc-check"><input type="checkbox"> ${t('cab_confirmed_lc')}</label>
        <button type="submit" class="btn">${t('cab_add_payment')}</button>
      `;
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const amount = form.querySelector('input[type="number"]').value;
        const is_confirmed = form.querySelector('input[type="checkbox"]').checked;
        const btn = form.querySelector('button');
        btn.disabled = true;
        try {
          await window.CMAuth.apiAuthed('POST', `/api/manager/deals/${dealId}/payments/`, { amount, is_confirmed });
          form.reset();
          loadPayments(dealId, body);
        } catch (err) {
          alert(t('cab_error') + ': ' + err.message);
        } finally {
          btn.disabled = false;
        }
      });
      wrap.appendChild(form);
    }
    return wrap;
  }

  // === Документы по сделке ===
  async function loadDocuments(dealId, container) {
    try {
      const docs = await window.CMAuth.apiAuthed('GET', `/api/deals/${dealId}/documents/`);
      if (!docs.length) {
        container.innerHTML = `<p class="dc-empty">${t('cab_docs_empty')}</p>`;
        return;
      }
      container.innerHTML = `
        <ul class="dc-list">
          ${docs.map(d => {
            const icon = DOC_ICONS[d.type] || 'fa-file';
            const label = escapeHtml(DOC_KEYS.includes(d.type) ? t('cab_doc_' + d.type) : (d.type_display || d.type || t('cab_doc_generic')));
            const link = d.file_url
              ? `<a class="dc-download" href="${encodeURI(d.file_url)}" target="_blank" rel="noopener">
                   <i class="fa-solid fa-download"></i> ${t('cab_download')}
                 </a>`
              : `<span class="dc-date" style="opacity:.6">${t('cab_no_file')}</span>`;
            return `
              <li class="dc-row">
                <span class="dc-doc"><i class="fa-solid ${icon}"></i> ${label}</span>
                ${link}
                <span class="dc-date">${fmtDate(d.created_at)}</span>
              </li>`;
          }).join('')}
        </ul>`;
    } catch (e) {
      container.innerHTML = `<p class="dc-empty" style="color:#e74c3c">${t('cab_load_error')}: ${escapeHtml(e.message)}</p>`;
    }
  }

  function buildDocumentsBlock(dealId, manager) {
    const wrap = document.createElement('div');
    wrap.className = 'dc-block';
    wrap.innerHTML = `<div class="dc-block__head"><i class="fa-solid fa-folder-open"></i> ${t('cab_docs_head')}</div><div class="dc-body"></div>`;
    const body = wrap.querySelector('.dc-body');
    loadDocuments(dealId, body);

    if (manager) {
      const form = document.createElement('form');
      form.className = 'dc-add-form';
      form.innerHTML = `
        <select class="doc-type">
          ${DOC_KEYS.map(k => `<option value="${k}">${t('cab_doc_' + k)}</option>`).join('')}
        </select>
        <input type="file" class="doc-file" required>
        <button type="submit" class="btn">${t('cab_upload')}</button>
      `;
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const type = form.querySelector('.doc-type').value;
        const fileInput = form.querySelector('.doc-file');
        if (!fileInput.files.length) return;
        const btn = form.querySelector('button');
        btn.disabled = true;
        try {
          const fd = new FormData();
          fd.append('type', type);
          fd.append('file', fileInput.files[0]);
          await window.CMAuth.apiAuthedUpload('POST', `/api/manager/deals/${dealId}/documents/`, fd);
          form.reset();
          loadDocuments(dealId, body);
        } catch (err) {
          alert(t('cab_error') + ': ' + err.message);
        } finally {
          btn.disabled = false;
        }
      });
      wrap.appendChild(form);
    }
    return wrap;
  }

  // === Расходы по сделке (ТОЛЬКО менеджер) ===
  async function loadExpenses(dealId, container) {
    try {
      const items = await window.CMAuth.apiAuthed('GET', `/api/manager/deals/${dealId}/expenses/`);
      if (!items.length) {
        container.innerHTML = `<p class="dc-empty">${t('cab_expenses_empty')}</p>`;
        return;
      }
      const total = items.reduce((s, x) => s + Number(x.amount || 0), 0);
      container.innerHTML = `
        <ul class="dc-list">
          ${items.map(x => {
            const cat = EXPENSE_KEYS.includes(x.category) ? t('cab_exp_' + x.category) : (x.category_display || x.category);
            return `
            <li class="dc-row">
              <span class="dc-doc">${escapeHtml(cat)}${x.note ? ` <span class="exp-note">— ${escapeHtml(x.note)}</span>` : ''}</span>
              <span class="dc-amount">${fmtMoney(x.amount)}</span>
              <button type="button" class="exp-del" data-exp-id="${x.id}" title="${t('cab_delete')}">✕</button>
            </li>`;
          }).join('')}
        </ul>
        <div class="dc-total">${t('cab_exp_total')}: <b>${fmtMoney(total)}</b></div>`;
      container.querySelectorAll('.exp-del').forEach(btn => {
        btn.addEventListener('click', async () => {
          if (!confirm(t('cab_del_expense_confirm'))) return;
          btn.disabled = true;
          try {
            await window.CMAuth.apiAuthed('DELETE', `/api/manager/expenses/${btn.dataset.expId}/`);
            loadExpenses(dealId, container);
            loadManagerFinance();
          } catch (err) {
            alert(t('cab_error') + ': ' + err.message);
            btn.disabled = false;
          }
        });
      });
    } catch (e) {
      container.innerHTML = `<p class="dc-empty" style="color:#e74c3c">${t('cab_load_error')}: ${escapeHtml(e.message)}</p>`;
    }
  }

  function buildExpensesBlock(dealId) {
    const wrap = document.createElement('div');
    wrap.className = 'dc-block';
    wrap.innerHTML = `<div class="dc-block__head"><i class="fa-solid fa-coins"></i> ${t('cab_expenses_head')} <span class="dc-internal">${t('cab_expenses_internal')}</span></div><div class="dc-body"></div>`;
    const body = wrap.querySelector('.dc-body');
    loadExpenses(dealId, body);

    const form = document.createElement('form');
    form.className = 'dc-add-form';
    form.innerHTML = `
      <select class="exp-cat">
        ${EXPENSE_KEYS.map(k => `<option value="${k}">${t('cab_exp_' + k)}</option>`).join('')}
      </select>
      <input type="number" step="0.01" min="0" class="exp-amount" placeholder="${t('cab_sum_ph')}" required>
      <input type="text" class="exp-note-input" placeholder="${t('cab_exp_note_ph')}">
      <button type="submit" class="btn">${t('cab_add_expense')}</button>
    `;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const category = form.querySelector('.exp-cat').value;
      const amount = form.querySelector('.exp-amount').value;
      const note = form.querySelector('.exp-note-input').value;
      const btn = form.querySelector('button');
      btn.disabled = true;
      try {
        await window.CMAuth.apiAuthed('POST', `/api/manager/deals/${dealId}/expenses/`, { category, amount, note });
        form.reset();
        loadExpenses(dealId, body);
        loadManagerFinance();
      } catch (err) {
        alert(t('cab_error') + ': ' + err.message);
      } finally {
        btn.disabled = false;
      }
    });
    wrap.appendChild(form);
    return wrap;
  }

  // === Конструктор сценариев: кастомный план сделки ===
  async function loadStages(dealId, container, manager, wrap) {
    const readUrl = manager ? `/api/manager/deals/${dealId}/stages/` : `/api/deals/${dealId}/stages/`;
    try {
      const stages = await window.CMAuth.apiAuthed('GET', readUrl);
      if (!stages.length) {
        if (manager) container.innerHTML = `<p class="dc-empty">${t('cab_plan_empty')}</p>`;
        else if (wrap) wrap.style.display = 'none';
        return;
      }
      if (wrap) wrap.style.display = '';
      container.innerHTML = `<ul class="stage-list">${stages.map((st, i) => {
        const done = st.is_done;
        if (!manager) {
          return `
            <li class="stage-row ${done ? 'done' : ''}">
              <span class="stage-mark">${done ? '<i class="fa-solid fa-circle-check"></i>' : '<i class="fa-regular fa-circle"></i>'}</span>
              <span class="stage-title">${escapeHtml(st.title)}</span>
            </li>`;
        }
        return `
          <li class="stage-row ${done ? 'done' : ''}" data-id="${st.id}">
            <label class="stage-check"><input type="checkbox" ${done ? 'checked' : ''}></label>
            <span class="stage-title">${escapeHtml(st.title)}</span>
            <span class="stage-actions">
              <button type="button" class="stage-up" ${i === 0 ? 'disabled' : ''} title="${t('cab_up')}">▲</button>
              <button type="button" class="stage-down" ${i === stages.length - 1 ? 'disabled' : ''} title="${t('cab_down')}">▼</button>
              <button type="button" class="stage-del" title="${t('cab_delete')}">✕</button>
            </span>
          </li>`;
      }).join('')}</ul>`;

      if (!manager) return;

      const reload = () => loadStages(dealId, container, manager, wrap);
      container.querySelectorAll('.stage-row').forEach((row, i) => {
        const id = row.dataset.id;
        row.querySelector('input[type="checkbox"]').addEventListener('change', async (e) => {
          try {
            await window.CMAuth.apiAuthed('PATCH', `/api/manager/stages/${id}/`, { is_done: e.target.checked });
            row.classList.toggle('done', e.target.checked);
          } catch (err) { alert(t('cab_error') + ': ' + err.message); e.target.checked = !e.target.checked; }
        });
        row.querySelector('.stage-del').addEventListener('click', async () => {
          if (!confirm(t('cab_del_stage_confirm'))) return;
          try { await window.CMAuth.apiAuthed('DELETE', `/api/manager/stages/${id}/`); reload(); }
          catch (err) { alert(t('cab_error') + ': ' + err.message); }
        });
        const swap = async (j) => {
          const a = stages[i], b = stages[j];
          try {
            await window.CMAuth.apiAuthed('PATCH', `/api/manager/stages/${a.id}/`, { order: b.order });
            await window.CMAuth.apiAuthed('PATCH', `/api/manager/stages/${b.id}/`, { order: a.order });
            reload();
          } catch (err) { alert(t('cab_error') + ': ' + err.message); }
        };
        row.querySelector('.stage-up').addEventListener('click', () => { if (i > 0) swap(i - 1); });
        row.querySelector('.stage-down').addEventListener('click', () => { if (i < stages.length - 1) swap(i + 1); });
      });
    } catch (e) {
      container.innerHTML = `<p class="dc-empty" style="color:#e74c3c">${t('cab_load_error')}: ${escapeHtml(e.message)}</p>`;
    }
  }

  function buildStagesBlock(dealId, manager) {
    const wrap = document.createElement('div');
    wrap.className = 'dc-block';
    wrap.innerHTML = `<div class="dc-block__head"><i class="fa-solid fa-list-check"></i> ${t('cab_plan_head')}</div><div class="dc-body"></div>`;
    const body = wrap.querySelector('.dc-body');
    loadStages(dealId, body, manager, wrap);

    if (manager) {
      const form = document.createElement('form');
      form.className = 'dc-add-form';
      form.innerHTML = `
        <input type="text" class="stage-input" placeholder="${t('cab_stage_name_ph')}" required>
        <button type="submit" class="btn">${t('cab_add_stage')}</button>
      `;
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = form.querySelector('.stage-input');
        const title = input.value.trim();
        if (!title) return;
        const btn = form.querySelector('button');
        btn.disabled = true;
        try {
          await window.CMAuth.apiAuthed('POST', `/api/manager/deals/${dealId}/stages/`, { title });
          input.value = '';
          loadStages(dealId, body, manager, wrap);
        } catch (err) { alert(t('cab_error') + ': ' + err.message); }
        finally { btn.disabled = false; }
      });
      wrap.appendChild(form);
    }
    return wrap;
  }

  // === Галерея сделки (фото/видео) ===
  async function loadMedia(dealId, container, manager, wrap) {
    const readUrl = manager ? `/api/manager/deals/${dealId}/media/` : `/api/deals/${dealId}/media/`;
    try {
      const items = await window.CMAuth.apiAuthed('GET', readUrl);
      if (!items.length) {
        if (manager) container.innerHTML = `<p class="dc-empty">${t('cab_media_empty')}</p>`;
        else if (wrap) wrap.style.display = 'none';
        return;
      }
      if (wrap) wrap.style.display = '';
      container.innerHTML = `<div class="media-grid">${items.map(m => {
        const cap = m.caption ? `<span class="media-cap">${escapeHtml(m.caption)}</span>` : '';
        const del = manager ? `<button type="button" class="media-del" data-id="${m.id}" title="${t('cab_delete')}">✕</button>` : '';
        if (m.media_type === 'video') {
          return `
            <div class="media-item media-item--video">
              <a href="${encodeURI(m.url || '#')}" target="_blank" rel="noopener" class="media-thumb media-thumb--video">
                <i class="fa-solid fa-play"></i>
              </a>
              ${cap || `<span class="media-cap">${t('cab_video')}</span>`}
              ${del}
            </div>`;
        }
        const thumb = window.cmOptimizeImage ? window.cmOptimizeImage(m.url, { width: 400 }) : m.url;
        return `
          <div class="media-item">
            <a href="${encodeURI(m.url || '#')}" target="_blank" rel="noopener" class="media-thumb">
              <img src="${encodeURI(thumb || '')}" alt="${escapeHtml(m.caption || t('cab_photo_alt'))}" loading="lazy">
            </a>
            ${cap}
            ${del}
          </div>`;
      }).join('')}</div>`;

      if (!manager) return;
      container.querySelectorAll('.media-del').forEach(btn => {
        btn.addEventListener('click', async () => {
          if (!confirm(t('cab_del_media_confirm'))) return;
          btn.disabled = true;
          try {
            await window.CMAuth.apiAuthed('DELETE', `/api/manager/media/${btn.dataset.id}/`);
            loadMedia(dealId, container, manager, wrap);
          } catch (err) { alert(t('cab_error') + ': ' + err.message); btn.disabled = false; }
        });
      });
    } catch (e) {
      container.innerHTML = `<p class="dc-empty" style="color:#e74c3c">${t('cab_load_error')}: ${escapeHtml(e.message)}</p>`;
    }
  }

  function buildMediaBlock(dealId, manager) {
    const wrap = document.createElement('div');
    wrap.className = 'dc-block';
    wrap.innerHTML = `<div class="dc-block__head"><i class="fa-solid fa-images"></i> ${t('cab_media_head')}</div><div class="dc-body"></div>`;
    const body = wrap.querySelector('.dc-body');
    loadMedia(dealId, body, manager, wrap);

    if (manager) {
      const form = document.createElement('form');
      form.className = 'dc-add-form media-add-form';
      form.innerHTML = `
        <input type="text" class="media-caption" placeholder="${t('cab_media_caption_ph')}">
        <input type="file" class="media-file" accept="image/*">
        <span class="media-or">${t('cab_media_or')}</span>
        <input type="url" class="media-video" placeholder="https://youtu.be/...">
        <button type="submit" class="btn">${t('cab_add')}</button>
      `;
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const caption = form.querySelector('.media-caption').value;
        const fileInput = form.querySelector('.media-file');
        const videoUrl = form.querySelector('.media-video').value.trim();
        const btn = form.querySelector('button');
        if (!fileInput.files.length && !videoUrl) { alert(t('cab_media_need_one')); return; }
        if (fileInput.files.length && videoUrl) { alert(t('cab_media_only_one')); return; }
        btn.disabled = true;
        try {
          if (fileInput.files.length) {
            const fd = new FormData();
            fd.append('image', fileInput.files[0]);
            if (caption) fd.append('caption', caption);
            await window.CMAuth.apiAuthedUpload('POST', `/api/manager/deals/${dealId}/media/`, fd);
          } else {
            await window.CMAuth.apiAuthed('POST', `/api/manager/deals/${dealId}/media/`, { video_url: videoUrl, caption });
          }
          form.reset();
          loadMedia(dealId, body, manager, wrap);
        } catch (err) { alert(t('cab_error') + ': ' + err.message); }
        finally { btn.disabled = false; }
      });
      wrap.appendChild(form);
    }
    return wrap;
  }

  // === Лог изменений по сделке (аудит) ===
  async function loadActivity(dealId, container, manager, wrap) {
    const readUrl = manager ? `/api/manager/deals/${dealId}/activity/` : `/api/deals/${dealId}/activity/`;
    try {
      const items = await window.CMAuth.apiAuthed('GET', readUrl);
      if (!items.length) {
        if (wrap) wrap.style.display = 'none';
        return;
      }
      if (wrap) wrap.style.display = '';
      container.innerHTML = `<ul class="act-list">${items.map(a => {
        const who = a.actor_info?.name || a.actor_info?.phone || t('cab_system');
        return `
          <li class="act-row${a.internal ? ' act-internal' : ''}">
            <span class="act-dot"></span>
            <div class="act-body">
              <div class="act-text">${escapeHtml(a.text)}${a.internal ? ` <span class="act-tag">${t('cab_internal_tag')}</span>` : ''}</div>
              <div class="act-meta">${escapeHtml(who)} · ${fmtDate(a.created_at)}</div>
            </div>
          </li>`;
      }).join('')}</ul>`;
    } catch (e) {
      container.innerHTML = `<p class="dc-empty" style="color:#e74c3c">${t('cab_load_error')}: ${escapeHtml(e.message)}</p>`;
    }
  }

  function buildActivityBlock(dealId, manager) {
    const wrap = document.createElement('div');
    wrap.className = 'dc-block';
    wrap.innerHTML = `<div class="dc-block__head"><i class="fa-solid fa-clock-rotate-left"></i> ${t('cab_activity_head')}</div><div class="dc-body"></div>`;
    loadActivity(dealId, wrap.querySelector('.dc-body'), manager, wrap);
    return wrap;
  }

  function buildDealCard(deal, { editableRole, editableStatus } = {}) {
    const card = document.createElement('div');
    card.className = 'deal-card';

    const statusIcon = (status) => status === 'DONE'
      ? '<i class="fa-solid fa-circle-check" style="color:#4ade80;flex-shrink:0"></i>'
      : '<i class="fa-regular fa-circle" style="color:rgba(255,255,255,0.3);flex-shrink:0"></i>';

    const assignmentsHtml = deal.assignments.length
      ? deal.assignments.map(a => {
          const isMine = editableRole && a.role === editableRole;
          if (!isMine) {
            return `
              <div class="assignment-row">
                ${statusIcon(a.status)}
                <span class="assignment-role">${roleShort(a.role) || a.role}</span>
                <span class="assignment-role">${a.assigned_user_info?.name || a.assigned_user_info?.phone || t('cab_not_assigned')}</span>
                <span class="assignment-status ${a.status}">${assignmentStatusLabel(a.status) || a.status}</span>
              </div>`;
          }
          return `
            <div class="assignment-row">
              ${statusIcon(a.status)}
              <span class="assignment-role">${roleShort(a.role) || a.role} ${t('cab_you')}</span>
              <form class="my-assignment-form" data-assignment-id="${a.id}">
                <select name="status">
                  ${['PENDING', 'IN_PROGRESS', 'DONE'].map(v => `<option value="${v}" ${v === a.status ? 'selected' : ''}>${assignmentStatusLabel(v)}</option>`).join('')}
                </select>
                <input type="text" name="note" placeholder="${t('cab_note_ph')}" value="${escapeHtml(a.note || '')}">
                <button type="submit" class="btn">${t('cab_save')}</button>
              </form>
            </div>`;
        }).join('')
      : `<p style="opacity:.7;color:rgba(255,255,255,0.6)">${t('cab_no_assignee')}</p>`;

    const statusControl = editableStatus
      ? `<select class="deal-status-select">
           ${DEAL_STAGES.map(([k]) => `<option value="${k}" ${k === deal.status ? 'selected' : ''}>${stageLabel(k)}</option>`).join('')}
         </select>`
      : `<span class="deal-status-pill">${escapeHtml(dealStatusLabel(deal.status))}</span>`;

    card.innerHTML = `
      <div class="deal-card__head">
        <h3>${deal.vehicle_title || deal.title || (t('cab_deal_num') + ' #' + deal.id)}</h3>
        ${statusControl}
      </div>
      <div class="deal-meta">
        ${t('cab_created')}: ${fmtDate(deal.created_at)}
        ${editableRole ? '' : `· ${t('cab_client')}: ${deal.customer_info?.name || deal.customer_info?.phone || '—'}`}
      </div>
      ${buildTimelineHtml(deal.status)}
      <div class="assignments-block">${assignmentsHtml}</div>
    `;

    if (editableStatus) {
      const sel = card.querySelector('.deal-status-select');
      sel?.addEventListener('change', async () => {
        const newStatus = sel.value;
        const prev = deal.status;
        sel.disabled = true;
        try {
          await window.CMAuth.apiAuthed('PATCH', `/api/manager/deals/${deal.id}/status/`, { status: newStatus });
          deal.status = newStatus;
          const tl = card.querySelector('.tl-block');
          if (tl) tl.outerHTML = buildTimelineHtml(newStatus);
        } catch (err) {
          alert(t('cab_error') + ': ' + err.message);
          sel.value = prev;
        } finally {
          sel.disabled = false;
        }
      });
    }

    card.querySelectorAll('.my-assignment-form').forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = form.dataset.assignmentId;
        const status = form.querySelector('[name="status"]').value;
        const note = form.querySelector('[name="note"]').value;
        try {
          await window.CMAuth.apiAuthed('PATCH', `/api/deals/assignments/${id}/`, { status, note });
          alert(t('cab_saved'));
        } catch (err) {
          alert(t('cab_error') + ': ' + err.message);
        }
      });
    });

    card.appendChild(buildStagesBlock(deal.id, editableStatus));
    card.appendChild(buildPaymentsBlock(deal.id, editableStatus, deal.total_price));
    card.appendChild(buildDocumentsBlock(deal.id, editableStatus));
    card.appendChild(buildMediaBlock(deal.id, editableStatus));
    if (editableStatus) card.appendChild(buildExpensesBlock(deal.id));
    card.appendChild(buildCommentsBlock(deal.id));
    card.appendChild(buildActivityBlock(deal.id, editableStatus));
    return card;
  }

  // === "Мои объявления/товары" — для клиентов и партнёров-продавцов ===
  let reloadMyListings = null;
  function initMyListings() {
    if (!SELLER_ROLES.includes(session.role)) return;

    const section = document.getElementById('myListingsSection');
    const form = document.getElementById('listingForm');
    const toggleBtn = document.getElementById('btnToggleListingForm');
    const listEl = document.getElementById('myListingsList');
    const statusEl = document.getElementById('listingFormStatus');
    if (!section) return;

    section.style.display = '';

    toggleBtn?.addEventListener('click', () => {
      form.classList.toggle('open');
    });

    async function loadMyListings() {
      try {
        const listings = await window.CMAuth.apiAuthed('GET', '/api/vehicles/my-listings/');
        if (!listings.length) {
          listEl.innerHTML = `<p class="empty-note">${t('cab_listings_empty')}</p>`;
          return;
        }
        const approved = listings.filter(l => l.is_approved).length;
        const pending = listings.length - approved;
        const summary = `
          <div class="listing-summary">
            ${t('cab_lst_total')}: <b>${listings.length}</b> ·
            ${t('cab_lst_approved')}: <b>${approved}</b> ·
            ${t('cab_lst_moderation')}: <b>${pending}</b>
          </div>`;
        listEl.innerHTML = summary + listings.map(l => `
            <div class="my-listing-card">
              <span>${escapeHtml([l.brand, l.model, l.body_type].filter(Boolean).join(' ') || (t('cab_listing_num') + ' #' + l.id))}${l.year ? ', ' + l.year : ''}</span>
              <span class="listing-approval ${l.is_approved ? 'approved' : 'pending'}">
                ${l.is_approved ? t('cab_listing_approved') : t('cab_listing_pending')}
              </span>
              <button type="button" class="listing-del" data-id="${l.id}" title="${t('cab_delete')}">✕</button>
            </div>`).join('');
        listEl.querySelectorAll('.listing-del').forEach(btn => {
          btn.addEventListener('click', async () => {
            if (!confirm(t('cab_listing_delete_confirm'))) return;
            btn.disabled = true;
            try {
              await window.CMAuth.apiAuthed('DELETE', `/api/vehicles/my-listings/${btn.dataset.id}/`);
              loadMyListings();
            } catch (err) { alert(t('cab_error') + ': ' + err.message); btn.disabled = false; }
          });
        });
      } catch (e) {
        listEl.innerHTML = `<p class="empty-note" style="color:#e74c3c">${t('cab_load_error')}: ${e.message}</p>`;
      }
    }
    reloadMyListings = loadMyListings;

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('btnSubmitListing');
      btn.disabled = true;
      try {
        const created = await window.CMAuth.apiAuthed('POST', '/api/vehicles/my-listings/', {
          brand: document.getElementById('l-brand').value.trim(),
          model: document.getElementById('l-model').value.trim(),
          year: Number(document.getElementById('l-year').value) || null,
          body_type: document.getElementById('l-body-type').value.trim(),
          category: document.getElementById('l-category').value.trim(),
          city: document.getElementById('l-city').value.trim(),
          weight_t: document.getElementById('l-weight-t').value || null,
          wheel_formula: document.getElementById('l-wheel-formula').value.trim(),
          engine_power_hp: Number(document.getElementById('l-engine-power').value) || null,
          load_capacity_t: document.getElementById('l-load-capacity').value || null,
          gearbox: document.getElementById('l-gearbox').value.trim(),
          price_kzt: document.getElementById('l-price-kzt').value || null,
          mileage_km: Number(document.getElementById('l-mileage').value) || null,
          extra_info: document.getElementById('l-extra-info').value.trim(),
        });

        const photoInput = document.getElementById('l-photos');
        if (photoInput?.files?.length) {
          const formData = new FormData();
          [...photoInput.files].forEach(f => formData.append('photos', f));
          await window.CMAuth.apiAuthedUpload('POST', `/api/vehicles/my-listings/${created.id}/photos/`, formData);
        }

        statusEl.textContent = t('cab_listing_sent');
        statusEl.className = 'success';
        statusEl.style.display = 'block';
        form.reset();
        form.classList.remove('open');
        loadMyListings();
      } catch (err) {
        statusEl.textContent = t('cab_error') + ': ' + err.message;
        statusEl.className = 'error';
        statusEl.style.display = 'block';
      }
      btn.disabled = false;
    });

    loadMyListings();
  }

  // === Кабинет менеджера: дашборд-счётчики + инбокс заявок ===
  async function loadManagerStats() {
    const el = document.getElementById('managerStats');
    if (!el) return;
    try {
      const s = await window.CMAuth.apiAuthed('GET', '/api/manager/stats/');
      const tiles = [
        [t('cab_tile_total'), s.deals_total],
        [t('cab_tile_active'), s.deals_active],
        [t('cab_tile_completed'), s.deals_completed],
        [t('cab_tile_leads_open'), s.leads_open],
      ];
      el.innerHTML = tiles.map(([label, val]) => `
        <div class="mgr-tile">
          <div class="mgr-tile__val">${val ?? 0}</div>
          <div class="mgr-tile__label">${label}</div>
        </div>`).join('');
    } catch (e) {
      el.innerHTML = `<p class="empty-note" style="color:#e74c3c">${t('cab_load_error_summary')}: ${escapeHtml(e.message)}</p>`;
    }
  }

  async function convertLead(leadId, btn) {
    if (!confirm(t('cab_convert_confirm'))) return;
    btn.disabled = true;
    const prevText = btn.textContent;
    btn.textContent = t('cab_creating');
    try {
      const res = await window.CMAuth.apiAuthed('POST', `/api/manager/leads/${leadId}/convert/`, {});
      const note = res.created_customer
        ? `\n${t('cab_convert_new_client')} ${res.customer_phone}.`
        : `\n${t('cab_convert_found_client')} ${res.customer_phone}.`;
      alert(`${t('cab_deal_created')}: «${res.deal_title}» (№${res.deal_id}).${note}`);
      loadManagerLeads();
      loadManagerDeals();
      loadManagerStats();
    } catch (e) {
      alert(t('cab_error') + ': ' + e.message);
      btn.disabled = false;
      btn.textContent = prevText;
    }
  }

  // === Финансовый отчёт по сделкам ===
  async function loadManagerFinance() {
    const el = document.getElementById('managerFinance');
    if (!el) return;
    try {
      const data = await window.CMAuth.apiAuthed('GET', '/api/manager/finance/');
      const s = data.summary;
      const tiles = [
        [t('cab_fin_value'), s.total_value],
        [t('cab_fin_received'), s.total_received],
        [t('cab_fin_expenses'), s.total_expenses],
        [t('cab_fin_profit'), s.total_profit],
      ];
      const rows = data.deals.map(d => `
        <tr>
          <td data-label="${t('cab_fcol_deal')}">${escapeHtml(d.title)}</td>
          <td data-label="${t('cab_fcol_stage')}">${escapeHtml(d.status_display)}</td>
          <td data-label="${t('cab_fcol_value')}" class="fin-num">${Number(d.total_price) ? fmtMoney(d.total_price) : '—'}</td>
          <td data-label="${t('cab_fcol_received')}" class="fin-num">${fmtMoney(d.received)}</td>
          <td data-label="${t('cab_fcol_balance')}" class="fin-num ${Number(d.balance) > 0 ? 'fin-due' : 'fin-ok'}">${fmtMoney(d.balance)}</td>
          <td data-label="${t('cab_fcol_expenses')}" class="fin-num">${fmtMoney(d.expenses)}</td>
          <td data-label="${t('cab_fcol_profit')}" class="fin-num ${d.profit == null ? '' : (Number(d.profit) >= 0 ? 'fin-ok' : 'fin-due')}">${d.profit == null ? '—' : fmtMoney(d.profit)}</td>
        </tr>`).join('');
      el.innerHTML = `
        <div class="mgr-stats">
          ${tiles.map(([label, val]) => `
            <div class="mgr-tile">
              <div class="mgr-tile__val fin-tile-val">${fmtMoney(val)}</div>
              <div class="mgr-tile__label">${label}</div>
            </div>`).join('')}
        </div>
        <div class="fin-table-wrap">
          <table class="fin-table">
            <thead><tr><th>${t('cab_fcol_deal')}</th><th>${t('cab_fcol_stage')}</th><th class="fin-num">${t('cab_fcol_value')}</th><th class="fin-num">${t('cab_fcol_received')}</th><th class="fin-num">${t('cab_fcol_balance')}</th><th class="fin-num">${t('cab_fcol_expenses')}</th><th class="fin-num">${t('cab_fcol_profit')}</th></tr></thead>
            <tbody>${rows || `<tr><td colspan="7" class="dc-empty">${t('cab_deals_empty_mgr')}</td></tr>`}</tbody>
          </table>
        </div>
        <p class="fin-hint">${t('cab_fin_hint')}</p>`;
    } catch (e) {
      el.innerHTML = `<p class="empty-note" style="color:#e74c3c">${t('cab_load_error_finance')}: ${escapeHtml(e.message)}</p>`;
    }
  }

  async function loadManagerLeads() {
    const el = document.getElementById('managerLeads');
    if (!el) return;
    try {
      const leads = await window.CMAuth.apiAuthed('GET', '/api/manager/leads/');
      if (!leads.length) {
        el.innerHTML = `<p class="empty-note">${t('cab_leads_empty')}</p>`;
        return;
      }
      el.innerHTML = `
        <ul class="lead-list">
          ${leads.map(l => {
            const action = l.converted_deal
              ? `<span class="lead-converted"><i class="fa-solid fa-check"></i> ${t('cab_lead_deal_num')} №${l.converted_deal}</span>`
              : (l.phone
                  ? `<button type="button" class="lead-convert-btn" data-lead-id="${l.id}">${t('cab_create_deal')}</button>`
                  : '');
            const leadStatus = t('cab_lead_' + l.status) !== 'cab_lead_' + l.status ? t('cab_lead_' + l.status) : (l.status_display || l.status);
            return `
            <li class="lead-row">
              <div class="lead-main">
                <span class="lead-name">${escapeHtml(l.name || t('cab_no_name'))}</span>
                <a class="lead-phone" href="tel:${escapeHtml(l.phone || '')}">${escapeHtml(l.phone || '—')}</a>
                <span class="lead-source">${escapeHtml(l.source || '')}</span>
              </div>
              ${l.message ? `<div class="lead-msg">${escapeHtml(l.message)}</div>` : ''}
              <div class="lead-foot">
                <span class="lead-status s-${escapeHtml(l.status)}">${escapeHtml(leadStatus)}</span>
                ${action}
                <span class="lead-date">${fmtDate(l.created_at)}</span>
              </div>
            </li>`;
          }).join('')}
        </ul>`;
      el.querySelectorAll('.lead-convert-btn').forEach(btn => {
        btn.addEventListener('click', () => convertLead(btn.dataset.leadId, btn));
      });
    } catch (e) {
      el.innerHTML = `<p class="empty-note" style="color:#e74c3c">${t('cab_load_error_leads')}: ${escapeHtml(e.message)}</p>`;
    }
  }

  async function loadManagerDeals() {
    try {
      const deals = await window.CMAuth.apiAuthed('GET', '/api/manager/deals/');
      dealListEl.innerHTML = '';
      if (!deals.length) {
        dealListEl.innerHTML = `<p class="empty-note">${t('cab_deals_empty_mgr')}</p>`;
        return;
      }
      deals.forEach(d => dealListEl.appendChild(buildDealCard(d, { editableStatus: true })));
    } catch (e) {
      dealListEl.innerHTML = `<p class="empty-note" style="color:#e74c3c">${t('cab_load_error_deals')}: ${escapeHtml(e.message)}</p>`;
    }
  }

  // Сводка по задачам исполнителя-партнёра (СВХ/брокер/…): считаем этапы,
  // назначенные именно этому аккаунту, по статусам.
  function renderAssigneeSummary(deals) {
    const section = document.getElementById('assigneeSummarySection');
    const el = document.getElementById('assigneeSummary');
    if (!section || !el) return;
    let pending = 0, inProgress = 0, done = 0;
    deals.forEach(d => {
      const mine = (d.assignments || []).find(a => a.assigned_user === session.userId);
      if (!mine) return;
      if (mine.status === 'DONE') done++;
      else if (mine.status === 'IN_PROGRESS') inProgress++;
      else pending++;
    });
    const tiles = [
      [t('cab_tile_total'), deals.length],
      [t('cab_astatus_PENDING'), pending],
      [t('cab_astatus_IN_PROGRESS'), inProgress],
      [t('cab_astatus_DONE'), done],
    ];
    el.innerHTML = tiles.map(([label, val]) => `
      <div class="mgr-tile"><div class="mgr-tile__val">${val}</div><div class="mgr-tile__label">${label}</div></div>`).join('');
    section.style.display = '';
  }

  async function render() {
    dealListEl.innerHTML = `<p class="empty-note">${t('cab_loading')}</p>`;
    try {
      if (CUSTOMER_ROLES.includes(session.role)) {
        const deals = await window.CMAuth.apiAuthed('GET', '/api/deals/my/');
        dealListEl.innerHTML = '';
        if (!deals.length) {
          dealListEl.innerHTML = `<p class="empty-note">${t('cab_deals_empty_customer')}</p>`;
          return;
        }
        deals.forEach(d => dealListEl.appendChild(buildDealCard(d)));
      } else if (ASSIGNEE_ROLES.includes(session.role)) {
        const deals = await window.CMAuth.apiAuthed('GET', '/api/deals/assigned/');
        dealListEl.innerHTML = '';
        if (!deals.length) {
          dealListEl.innerHTML = `<p class="empty-note">${t('cab_deals_empty_assignee')}</p>`;
          return;
        }
        const shortRole = session.role.startsWith('SERVICE_') ? session.role.replace('SERVICE_', '') : session.role;
        renderAssigneeSummary(deals);
        deals.forEach(d => dealListEl.appendChild(buildDealCard(d, { editableRole: shortRole })));
      } else if (MANAGER_ROLES.includes(session.role)) {
        document.getElementById('managerStatsSection').style.display = '';
        document.getElementById('managerFinanceSection').style.display = '';
        document.getElementById('managerLeadsSection').style.display = '';
        loadManagerStats();
        loadManagerFinance();
        loadManagerLeads();
        await loadManagerDeals();
      } else if (session.role === 'PARTNER') {
        // Партнёр-продавец ведёт не сделки, а свой каталог товаров (выше).
        dealListEl.innerHTML = `<p class="empty-note">${t('cab_partner_intro')}</p>`;
      } else {
        dealListEl.innerHTML = `<p class="empty-note">${t('cab_role_wip')}</p>`;
      }
    } catch (e) {
      dealListEl.innerHTML = `<p class="empty-note" style="color:#e74c3c">${t('cab_load_error')}: ${e.message}</p>`;
    }
  }

  // === Уведомления: колокольчик со счётчиком новых событий по сделкам ===
  function initNotifications() {
    const bell = document.getElementById('notifBell');
    const panel = document.getElementById('notifPanel');
    const badge = document.getElementById('notifBadge');
    if (!bell || !panel || !badge) return;

    async function refresh() {
      try {
        const data = await window.CMAuth.apiAuthed('GET', '/api/notifications/');
        panel.innerHTML = data.items.length
          ? data.items.map(n => {
              const who = n.actor?.name || n.actor?.phone || t('cab_system');
              return `
                <div class="notif-item${n.unread ? ' unread' : ''}">
                  <div class="notif-item__deal">${escapeHtml(n.deal_title)}</div>
                  <div class="notif-item__text">${escapeHtml(n.text)}</div>
                  <div class="notif-item__meta">${escapeHtml(who)} · ${fmtDate(n.created_at)}</div>
                </div>`;
            }).join('')
          : `<div class="notif-empty">${t('cab_notif_empty')}</div>`;
        if (data.unread_count > 0) {
          badge.textContent = data.unread_count > 99 ? '99+' : String(data.unread_count);
          badge.style.display = '';
        } else {
          badge.style.display = 'none';
        }
      } catch (e) { /* тихо: уведомления не критичны */ }
    }

    bell.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (panel.style.display !== 'none') { panel.style.display = 'none'; return; }
      await refresh();
      panel.style.display = 'block';
      try {
        await window.CMAuth.apiAuthed('POST', '/api/notifications/mark-read/', {});
        badge.style.display = 'none';
      } catch (e) { /* тихо */ }
    });
    document.addEventListener('click', (e) => {
      if (panel.style.display !== 'none' && !panel.contains(e.target) && !bell.contains(e.target)) {
        panel.style.display = 'none';
      }
    });

    refresh();
    setInterval(refresh, 60000);
  }

  // Смена языка: перерисовываем динамические части кабинета (data-i18n
  // статику обновляет common.js сам).
  document.addEventListener('langchange', () => {
    renderRoleLine();
    if (reloadMyListings) reloadMyListings();
    render();
  });

  initMyListings();
  initNotifications();
  render();
});
