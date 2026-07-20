// js/account.js — личный кабинет: клиент видит свои сделки,
// исполнитель (брокер/СВХ/лаборатория/логист/декларант/банк) видит
// назначенные ему сделки и обновляет статус своего этапа.
document.addEventListener('DOMContentLoaded', async () => {
  const session = window.CMAuth?.getSession();
  if (!session) {
    location.href = 'login.html';
    return;
  }

  const CUSTOMER_ROLES = ['CUSTOMER_PERSON', 'CUSTOMER_COMPANY'];
  const ASSIGNEE_ROLES = ['SERVICE_BROKER', 'SERVICE_SVH', 'SERVICE_LAB', 'SERVICE_LOGISTIC', 'SERVICE_DECLARANT', 'BANK'];

  const roleLine = document.getElementById('accountRoleLine');
  const dealListEl = document.getElementById('dealList');
  const roleLabels = {
    CUSTOMER_PERSON: 'Клиент (физ. лицо)',
    CUSTOMER_COMPANY: 'Клиент (юр. лицо)',
    SERVICE_BROKER: 'Брокер (СВХ)',
    SERVICE_SVH: 'СВХ',
    SERVICE_LAB: 'Лаборатория',
    SERVICE_LOGISTIC: 'Логист',
    SERVICE_DECLARANT: 'Декларант (граница)',
    BANK: 'Банк',
    PARTNER: 'Партнёр-продавец',
  };
  const verifiedBadge = session.isVerified
    ? '<span class="account-badge verified">подтверждён</span>'
    : '<span class="account-badge not-verified">не подтверждён</span>';
  roleLine.innerHTML = `${roleLabels[session.role] || session.role} ${verifiedBadge}`;

  document.getElementById('btnLogout')?.addEventListener('click', () => {
    window.CMAuth.logout();
    location.href = 'index.html';
  });

  const STATUS_LABELS = { PENDING: 'Ожидает', IN_PROGRESS: 'В работе', DONE: 'Завершено' };
  const ROLE_LABELS_SHORT = {
    BROKER: 'Брокер (СВХ)', SVH: 'СВХ', LAB: 'Лаборатория',
    LOGISTIC: 'Логист', DECLARANT: 'Декларант', BANK: 'Банк',
  };

  function fmtDate(iso) {
    return new Date(iso).toLocaleString('ru-RU');
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
        : '<div class="comment-item other"><div class="bubble" style="opacity:.6">Пока нет сообщений</div></div>';
      container.scrollTop = container.scrollHeight;
    } catch (e) {
      container.innerHTML = `<div class="comment-item other"><div class="bubble" style="color:#e74c3c">Ошибка загрузки: ${e.message}</div></div>`;
    }
  }

  function escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function buildCommentsBlock(dealId) {
    const wrap = document.createElement('div');
    wrap.className = 'comments-block';
    wrap.innerHTML = `
      <div class="comments-block__head">Чат по сделке</div>
      <div class="comments-list"></div>
      <form class="comment-form">
        <input type="text" placeholder="Написать сообщение..." required>
        <button type="submit" class="btn">Отправить</button>
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
        alert('Ошибка: ' + err.message);
      }
    });

    return wrap;
  }

  const nfKzt = new Intl.NumberFormat('ru-RU');
  function fmtMoney(v) {
    const n = Number(v);
    return (Number.isFinite(n) ? nfKzt.format(Math.round(n)) : v) + ' ₸';
  }

  const DOC_ICONS = {
    CONTRACT: 'fa-file-contract',
    GTD: 'fa-file-invoice',
    CMR: 'fa-truck',
    ACCEPTANCE: 'fa-file-signature',
    PHOTO: 'fa-image',
  };

  // === Платежи по сделке (только просмотр; создаёт менеджер в админке) ===
  async function loadPayments(dealId, container) {
    try {
      const payments = await window.CMAuth.apiAuthed('GET', `/api/deals/${dealId}/payments/`);
      if (!payments.length) {
        container.innerHTML = '<p class="dc-empty">Платежей пока нет.</p>';
        return;
      }
      const total = payments.reduce((s, p) => s + Number(p.amount || 0), 0);
      const confirmed = payments
        .filter(p => p.is_confirmed)
        .reduce((s, p) => s + Number(p.amount || 0), 0);
      container.innerHTML = `
        <ul class="dc-list">
          ${payments.map(p => `
            <li class="dc-row">
              <span class="dc-amount">${fmtMoney(p.amount)}</span>
              <span class="dc-pill ${p.is_confirmed ? 'ok' : 'wait'}">
                ${p.is_confirmed ? 'Подтверждён' : 'Ожидает'}
              </span>
              <span class="dc-date">${fmtDate(p.created_at)}</span>
            </li>`).join('')}
        </ul>
        <div class="dc-total">
          Оплачено: <b>${fmtMoney(confirmed)}</b> из <b>${fmtMoney(total)}</b>
        </div>`;
    } catch (e) {
      container.innerHTML = `<p class="dc-empty" style="color:#e74c3c">Ошибка загрузки: ${escapeHtml(e.message)}</p>`;
    }
  }

  function buildPaymentsBlock(dealId) {
    const wrap = document.createElement('div');
    wrap.className = 'dc-block';
    wrap.innerHTML = '<div class="dc-block__head"><i class="fa-solid fa-wallet"></i> Платежи</div><div class="dc-body"></div>';
    loadPayments(dealId, wrap.querySelector('.dc-body'));
    return wrap;
  }

  // === Документы по сделке (просмотр/скачивание; загружает менеджер) ===
  async function loadDocuments(dealId, container) {
    try {
      const docs = await window.CMAuth.apiAuthed('GET', `/api/deals/${dealId}/documents/`);
      if (!docs.length) {
        container.innerHTML = '<p class="dc-empty">Документов пока нет.</p>';
        return;
      }
      container.innerHTML = `
        <ul class="dc-list">
          ${docs.map(d => {
            const icon = DOC_ICONS[d.type] || 'fa-file';
            const label = escapeHtml(d.type_display || d.type || 'Документ');
            const link = d.file_url
              ? `<a class="dc-download" href="${encodeURI(d.file_url)}" target="_blank" rel="noopener">
                   <i class="fa-solid fa-download"></i> Скачать
                 </a>`
              : '<span class="dc-date" style="opacity:.6">нет файла</span>';
            return `
              <li class="dc-row">
                <span class="dc-doc"><i class="fa-solid ${icon}"></i> ${label}</span>
                ${link}
                <span class="dc-date">${fmtDate(d.created_at)}</span>
              </li>`;
          }).join('')}
        </ul>`;
    } catch (e) {
      container.innerHTML = `<p class="dc-empty" style="color:#e74c3c">Ошибка загрузки: ${escapeHtml(e.message)}</p>`;
    }
  }

  function buildDocumentsBlock(dealId) {
    const wrap = document.createElement('div');
    wrap.className = 'dc-block';
    wrap.innerHTML = '<div class="dc-block__head"><i class="fa-solid fa-folder-open"></i> Документы</div><div class="dc-body"></div>';
    loadDocuments(dealId, wrap.querySelector('.dc-body'));
    return wrap;
  }

  function buildDealCard(deal, { editableRole } = {}) {
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
                <span class="assignment-role">${ROLE_LABELS_SHORT[a.role] || a.role}</span>
                <span class="assignment-role">${a.assigned_user_info?.name || a.assigned_user_info?.phone || '— не назначен'}</span>
                <span class="assignment-status ${a.status}">${STATUS_LABELS[a.status] || a.status}</span>
              </div>`;
          }
          return `
            <div class="assignment-row">
              ${statusIcon(a.status)}
              <span class="assignment-role">${ROLE_LABELS_SHORT[a.role] || a.role} (вы)</span>
              <form class="my-assignment-form" data-assignment-id="${a.id}">
                <select name="status">
                  ${Object.entries(STATUS_LABELS).map(([v, l]) => `<option value="${v}" ${v === a.status ? 'selected' : ''}>${l}</option>`).join('')}
                </select>
                <input type="text" name="note" placeholder="Заметка" value="${escapeHtml(a.note || '')}">
                <button type="submit" class="btn">Сохранить</button>
              </form>
            </div>`;
        }).join('')
      : '<p style="opacity:.7;color:rgba(255,255,255,0.6)">Пока никто не назначен</p>';

    card.innerHTML = `
      <div class="deal-card__head">
        <h3>${deal.vehicle_title || deal.title || ('Сделка #' + deal.id)}</h3>
        <span class="deal-status-pill">${escapeHtml(deal.status || '')}</span>
      </div>
      <div class="deal-meta">
        Создана: ${fmtDate(deal.created_at)}
        ${editableRole ? '' : `· Клиент: ${deal.customer_info?.name || deal.customer_info?.phone || '—'}`}
      </div>
      <div class="assignments-block">${assignmentsHtml}</div>
    `;

    card.querySelectorAll('.my-assignment-form').forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = form.dataset.assignmentId;
        const status = form.querySelector('[name="status"]').value;
        const note = form.querySelector('[name="note"]').value;
        try {
          await window.CMAuth.apiAuthed('PATCH', `/api/deals/assignments/${id}/`, { status, note });
          alert('Сохранено');
        } catch (err) {
          alert('Ошибка: ' + err.message);
        }
      });
    });

    card.appendChild(buildPaymentsBlock(deal.id));
    card.appendChild(buildDocumentsBlock(deal.id));
    card.appendChild(buildCommentsBlock(deal.id));
    return card;
  }

  // === "Мои объявления" — только для клиентов (физ./юр. лицо) ===
  function initMyListings() {
    if (!CUSTOMER_ROLES.includes(session.role)) return;

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
        listEl.innerHTML = listings.length
          ? listings.map(l => `
              <div class="my-listing-card">
                <span>${[l.brand, l.model, l.body_type].filter(Boolean).join(' ') || ('Объявление #' + l.id)}${l.year ? ', ' + l.year : ''}</span>
                <span class="listing-approval ${l.is_approved ? 'approved' : 'pending'}">
                  ${l.is_approved ? 'Одобрено, видно в каталоге' : 'На модерации'}
                </span>
              </div>`).join('')
          : '<p class="empty-note">Объявлений пока нет.</p>';
      } catch (e) {
        listEl.innerHTML = `<p class="empty-note" style="color:#e74c3c">Ошибка загрузки: ${e.message}</p>`;
      }
    }

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

        statusEl.textContent = 'Объявление отправлено на модерацию';
        statusEl.className = 'success';
        statusEl.style.display = 'block';
        form.reset();
        form.classList.remove('open');
        loadMyListings();
      } catch (err) {
        statusEl.textContent = 'Ошибка: ' + err.message;
        statusEl.className = 'error';
        statusEl.style.display = 'block';
      }
      btn.disabled = false;
    });

    loadMyListings();
  }

  async function render() {
    dealListEl.innerHTML = '<p class="empty-note">Загрузка...</p>';
    try {
      if (CUSTOMER_ROLES.includes(session.role)) {
        const deals = await window.CMAuth.apiAuthed('GET', '/api/deals/my/');
        dealListEl.innerHTML = '';
        if (!deals.length) {
          dealListEl.innerHTML = '<p class="empty-note">У вас пока нет сделок. Оформить сделку можно со страницы конкретной техники в каталоге — кнопка «Оформить сделку».</p>';
          return;
        }
        deals.forEach(d => dealListEl.appendChild(buildDealCard(d)));
      } else if (ASSIGNEE_ROLES.includes(session.role)) {
        const deals = await window.CMAuth.apiAuthed('GET', '/api/deals/assigned/');
        dealListEl.innerHTML = '';
        if (!deals.length) {
          dealListEl.innerHTML = '<p class="empty-note">Вам пока не назначили ни одной сделки.</p>';
          return;
        }
        // роль в DealAssignment (BROKER/SVH/...) без префикса SERVICE_
        const shortRole = session.role.startsWith('SERVICE_') ? session.role.replace('SERVICE_', '') : session.role;
        deals.forEach(d => dealListEl.appendChild(buildDealCard(d, { editableRole: shortRole })));
      } else {
        dealListEl.innerHTML = '<p class="empty-note">Личный кабинет для этой роли пока в разработке.</p>';
      }
    } catch (e) {
      dealListEl.innerHTML = `<p class="empty-note" style="color:#e74c3c">Ошибка загрузки: ${e.message}</p>`;
    }
  }

  initMyListings();
  render();
});
