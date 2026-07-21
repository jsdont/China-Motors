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
  const MANAGER_ROLES = ['MANAGER', 'ADMIN'];
  const LEAD_STATUS_LABELS = { new: 'Новая', in_progress: 'В работе', won: 'Выиграна', lost: 'Проиграна' };
  const EXPENSE_CATEGORIES = [
    ['PURCHASE', 'Закупка в Китае'],
    ['LOGISTICS', 'Логистика / доставка'],
    ['CUSTOMS', 'Растаможка'],
    ['CERTIFICATION', 'Сертификация (СБКТС/ЭПТС)'],
    ['SVH', 'СВХ / хранение'],
    ['OTHER', 'Прочее'],
  ];

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

  // Этапы сделки по порядку — совпадают с Deal.STATUS_CHOICES на бэкенде.
  // Порядок важен: по индексу текущего статуса строится дорожная карта.
  const DEAL_STAGES = [
    ['AGREEMENT', 'Согласование', 'fa-handshake'],
    ['CONTRACT', 'Договор', 'fa-file-signature'],
    ['PURCHASE_CHINA', 'Покупка в Китае', 'fa-cart-shopping'],
    ['DELIVERY_KZ', 'Доставка в КЗ', 'fa-truck-fast'],
    ['SVH', 'СВХ', 'fa-warehouse'],
    ['CUSTOMS', 'Таможня', 'fa-stamp'],
    ['DELIVERY_CLIENT', 'Доставка клиенту', 'fa-truck-ramp-box'],
    ['COMPLETED', 'Завершена', 'fa-flag-checkered'],
  ];
  const DEAL_STAGE_INDEX = Object.fromEntries(DEAL_STAGES.map(([k], i) => [k, i]));

  function dealStatusLabel(status) {
    const stage = DEAL_STAGES.find(([k]) => k === status);
    return stage ? stage[1] : (status || '');
  }

  // Дорожная карта сделки: этапы до текущего — «пройдено», текущий —
  // «активен», после — «предстоит». Для COMPLETED все этапы пройдены.
  function buildTimelineHtml(status) {
    const curIdx = status in DEAL_STAGE_INDEX ? DEAL_STAGE_INDEX[status] : 0;
    const isCompleted = status === 'COMPLETED';

    const steps = DEAL_STAGES.map(([key, label, icon], i) => {
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
          <span class="tl-label">${label}</span>
        </li>`;
    }).join('');

    return `
      <div class="tl-block">
        <div class="tl-block__head"><i class="fa-solid fa-route"></i> Этапы сделки</div>
        <ol class="tl-steps">${steps}</ol>
      </div>`;
  }

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

  function buildPaymentsBlock(dealId, manager, currentPrice) {
    const wrap = document.createElement('div');
    wrap.className = 'dc-block';
    wrap.innerHTML = '<div class="dc-block__head"><i class="fa-solid fa-wallet"></i> Платежи</div><div class="dc-body"></div>';
    const body = wrap.querySelector('.dc-body');
    loadPayments(dealId, body);

    if (manager) {
      // Стоимость сделки — нужна для финансового отчёта (остаток к оплате).
      const valueRow = document.createElement('div');
      valueRow.className = 'dc-value-row';
      valueRow.innerHTML = `
        <span>Стоимость сделки, ₸:</span>
        <input type="number" step="0.01" min="0" class="dc-value-input" value="${currentPrice != null ? currentPrice : ''}" placeholder="не указана">
        <button type="button" class="dc-value-save btn">Сохранить</button>
      `;
      const valueInput = valueRow.querySelector('.dc-value-input');
      const valueBtn = valueRow.querySelector('.dc-value-save');
      valueBtn.addEventListener('click', async () => {
        valueBtn.disabled = true;
        try {
          await window.CMAuth.apiAuthed('PATCH', `/api/manager/deals/${dealId}/status/`, { total_price: valueInput.value || null });
          valueBtn.textContent = 'Сохранено';
          setTimeout(() => { valueBtn.textContent = 'Сохранить'; }, 1500);
          loadManagerFinance();
        } catch (err) {
          alert('Ошибка: ' + err.message);
        } finally {
          valueBtn.disabled = false;
        }
      });
      wrap.appendChild(valueRow);

      const form = document.createElement('form');
      form.className = 'dc-add-form';
      form.innerHTML = `
        <input type="number" step="0.01" min="0" placeholder="Сумма, ₸" required>
        <label class="dc-check"><input type="checkbox"> подтверждён</label>
        <button type="submit" class="btn">Добавить платёж</button>
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
          alert('Ошибка: ' + err.message);
        } finally {
          btn.disabled = false;
        }
      });
      wrap.appendChild(form);
    }
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

  function buildDocumentsBlock(dealId, manager) {
    const wrap = document.createElement('div');
    wrap.className = 'dc-block';
    wrap.innerHTML = '<div class="dc-block__head"><i class="fa-solid fa-folder-open"></i> Документы</div><div class="dc-body"></div>';
    const body = wrap.querySelector('.dc-body');
    loadDocuments(dealId, body);

    if (manager) {
      const form = document.createElement('form');
      form.className = 'dc-add-form';
      form.innerHTML = `
        <select class="doc-type">
          <option value="CONTRACT">Договор</option>
          <option value="GTD">ГТД</option>
          <option value="CMR">CMR</option>
          <option value="ACCEPTANCE">Акт приёма</option>
          <option value="PHOTO">Фото</option>
        </select>
        <input type="file" class="doc-file" required>
        <button type="submit" class="btn">Загрузить</button>
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
          alert('Ошибка: ' + err.message);
        } finally {
          btn.disabled = false;
        }
      });
      wrap.appendChild(form);
    }
    return wrap;
  }

  // === Расходы по сделке (ТОЛЬКО менеджер; клиенту не показываются) ===
  async function loadExpenses(dealId, container) {
    try {
      const items = await window.CMAuth.apiAuthed('GET', `/api/manager/deals/${dealId}/expenses/`);
      if (!items.length) {
        container.innerHTML = '<p class="dc-empty">Расходов пока нет.</p>';
        return;
      }
      const total = items.reduce((s, x) => s + Number(x.amount || 0), 0);
      container.innerHTML = `
        <ul class="dc-list">
          ${items.map(x => `
            <li class="dc-row">
              <span class="dc-doc">${escapeHtml(x.category_display || x.category)}${x.note ? ` <span class="exp-note">— ${escapeHtml(x.note)}</span>` : ''}</span>
              <span class="dc-amount">${fmtMoney(x.amount)}</span>
              <button type="button" class="exp-del" data-exp-id="${x.id}" title="Удалить">✕</button>
            </li>`).join('')}
        </ul>
        <div class="dc-total">Итого расходов: <b>${fmtMoney(total)}</b></div>`;
      container.querySelectorAll('.exp-del').forEach(btn => {
        btn.addEventListener('click', async () => {
          if (!confirm('Удалить этот расход?')) return;
          btn.disabled = true;
          try {
            await window.CMAuth.apiAuthed('DELETE', `/api/manager/expenses/${btn.dataset.expId}/`);
            loadExpenses(dealId, container);
            loadManagerFinance();
          } catch (err) {
            alert('Ошибка: ' + err.message);
            btn.disabled = false;
          }
        });
      });
    } catch (e) {
      container.innerHTML = `<p class="dc-empty" style="color:#e74c3c">Ошибка загрузки: ${escapeHtml(e.message)}</p>`;
    }
  }

  function buildExpensesBlock(dealId) {
    const wrap = document.createElement('div');
    wrap.className = 'dc-block';
    wrap.innerHTML = '<div class="dc-block__head"><i class="fa-solid fa-coins"></i> Расходы <span class="dc-internal">(видит только менеджер)</span></div><div class="dc-body"></div>';
    const body = wrap.querySelector('.dc-body');
    loadExpenses(dealId, body);

    const form = document.createElement('form');
    form.className = 'dc-add-form';
    form.innerHTML = `
      <select class="exp-cat">
        ${EXPENSE_CATEGORIES.map(([v, l]) => `<option value="${v}">${l}</option>`).join('')}
      </select>
      <input type="number" step="0.01" min="0" class="exp-amount" placeholder="Сумма, ₸" required>
      <input type="text" class="exp-note-input" placeholder="Комментарий (необязательно)">
      <button type="submit" class="btn">Добавить расход</button>
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
        alert('Ошибка: ' + err.message);
      } finally {
        btn.disabled = false;
      }
    });
    wrap.appendChild(form);
    return wrap;
  }

  // === Конструктор сценариев: кастомный план сделки ===
  // Менеджер читает/пишет через /api/manager/..., клиент читает через
  // /api/deals/<id>/stages/ (он не «участник» в смысле менеджерских ручек).
  async function loadStages(dealId, container, manager, wrap) {
    const readUrl = manager ? `/api/manager/deals/${dealId}/stages/` : `/api/deals/${dealId}/stages/`;
    try {
      const stages = await window.CMAuth.apiAuthed('GET', readUrl);
      if (!stages.length) {
        if (manager) {
          container.innerHTML = '<p class="dc-empty">План ещё не составлен. Добавьте этапы ниже.</p>';
        } else if (wrap) {
          wrap.style.display = 'none'; // клиенту пустой план не показываем
        }
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
              <button type="button" class="stage-up" ${i === 0 ? 'disabled' : ''} title="Выше">▲</button>
              <button type="button" class="stage-down" ${i === stages.length - 1 ? 'disabled' : ''} title="Ниже">▼</button>
              <button type="button" class="stage-del" title="Удалить">✕</button>
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
          } catch (err) { alert('Ошибка: ' + err.message); e.target.checked = !e.target.checked; }
        });
        row.querySelector('.stage-del').addEventListener('click', async () => {
          if (!confirm('Удалить этап?')) return;
          try { await window.CMAuth.apiAuthed('DELETE', `/api/manager/stages/${id}/`); reload(); }
          catch (err) { alert('Ошибка: ' + err.message); }
        });
        const swap = async (j) => {
          const a = stages[i], b = stages[j];
          try {
            await window.CMAuth.apiAuthed('PATCH', `/api/manager/stages/${a.id}/`, { order: b.order });
            await window.CMAuth.apiAuthed('PATCH', `/api/manager/stages/${b.id}/`, { order: a.order });
            reload();
          } catch (err) { alert('Ошибка: ' + err.message); }
        };
        row.querySelector('.stage-up').addEventListener('click', () => { if (i > 0) swap(i - 1); });
        row.querySelector('.stage-down').addEventListener('click', () => { if (i < stages.length - 1) swap(i + 1); });
      });
    } catch (e) {
      container.innerHTML = `<p class="dc-empty" style="color:#e74c3c">Ошибка загрузки: ${escapeHtml(e.message)}</p>`;
    }
  }

  // === Галерея сделки (фото/видео): клиент видит, менеджер добавляет/удаляет ===
  async function loadMedia(dealId, container, manager, wrap) {
    const readUrl = manager ? `/api/manager/deals/${dealId}/media/` : `/api/deals/${dealId}/media/`;
    try {
      const items = await window.CMAuth.apiAuthed('GET', readUrl);
      if (!items.length) {
        if (manager) container.innerHTML = '<p class="dc-empty">Фото и видео пока не добавлены.</p>';
        else if (wrap) wrap.style.display = 'none';
        return;
      }
      if (wrap) wrap.style.display = '';
      container.innerHTML = `<div class="media-grid">${items.map(m => {
        const cap = m.caption ? `<span class="media-cap">${escapeHtml(m.caption)}</span>` : '';
        const del = manager ? `<button type="button" class="media-del" data-id="${m.id}" title="Удалить">✕</button>` : '';
        if (m.media_type === 'video') {
          return `
            <div class="media-item media-item--video">
              <a href="${encodeURI(m.url || '#')}" target="_blank" rel="noopener" class="media-thumb media-thumb--video">
                <i class="fa-solid fa-play"></i>
              </a>
              ${cap || '<span class="media-cap">Видео</span>'}
              ${del}
            </div>`;
        }
        const thumb = window.cmOptimizeImage ? window.cmOptimizeImage(m.url, { width: 400 }) : m.url;
        return `
          <div class="media-item">
            <a href="${encodeURI(m.url || '#')}" target="_blank" rel="noopener" class="media-thumb">
              <img src="${encodeURI(thumb || '')}" alt="${escapeHtml(m.caption || 'Фото сделки')}" loading="lazy">
            </a>
            ${cap}
            ${del}
          </div>`;
      }).join('')}</div>`;

      if (!manager) return;
      container.querySelectorAll('.media-del').forEach(btn => {
        btn.addEventListener('click', async () => {
          if (!confirm('Удалить этот файл из галереи?')) return;
          btn.disabled = true;
          try {
            await window.CMAuth.apiAuthed('DELETE', `/api/manager/media/${btn.dataset.id}/`);
            loadMedia(dealId, container, manager, wrap);
          } catch (err) { alert('Ошибка: ' + err.message); btn.disabled = false; }
        });
      });
    } catch (e) {
      container.innerHTML = `<p class="dc-empty" style="color:#e74c3c">Ошибка загрузки: ${escapeHtml(e.message)}</p>`;
    }
  }

  function buildMediaBlock(dealId, manager) {
    const wrap = document.createElement('div');
    wrap.className = 'dc-block';
    wrap.innerHTML = '<div class="dc-block__head"><i class="fa-solid fa-images"></i> Фото и видео</div><div class="dc-body"></div>';
    const body = wrap.querySelector('.dc-body');
    loadMedia(dealId, body, manager, wrap);

    if (manager) {
      const form = document.createElement('form');
      form.className = 'dc-add-form media-add-form';
      form.innerHTML = `
        <input type="text" class="media-caption" placeholder="Подпись (необязательно)">
        <input type="file" class="media-file" accept="image/*">
        <span class="media-or">или ссылка на видео:</span>
        <input type="url" class="media-video" placeholder="https://youtu.be/...">
        <button type="submit" class="btn">Добавить</button>
      `;
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const caption = form.querySelector('.media-caption').value;
        const fileInput = form.querySelector('.media-file');
        const videoUrl = form.querySelector('.media-video').value.trim();
        const btn = form.querySelector('button');
        if (!fileInput.files.length && !videoUrl) { alert('Приложите фото или укажите ссылку на видео.'); return; }
        if (fileInput.files.length && videoUrl) { alert('Что-то одно: либо фото, либо ссылка на видео.'); return; }
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
        } catch (err) { alert('Ошибка: ' + err.message); }
        finally { btn.disabled = false; }
      });
      wrap.appendChild(form);
    }
    return wrap;
  }

  function buildStagesBlock(dealId, manager) {
    const wrap = document.createElement('div');
    wrap.className = 'dc-block';
    const badge = manager ? '' : '';
    wrap.innerHTML = `<div class="dc-block__head"><i class="fa-solid fa-list-check"></i> План сделки${badge}</div><div class="dc-body"></div>`;
    const body = wrap.querySelector('.dc-body');
    loadStages(dealId, body, manager, wrap);

    if (manager) {
      const form = document.createElement('form');
      form.className = 'dc-add-form';
      form.innerHTML = `
        <input type="text" class="stage-input" placeholder="Название этапа" required>
        <button type="submit" class="btn">Добавить этап</button>
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
        } catch (err) { alert('Ошибка: ' + err.message); }
        finally { btn.disabled = false; }
      });
      wrap.appendChild(form);
    }
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

    const statusControl = editableStatus
      ? `<select class="deal-status-select">
           ${DEAL_STAGES.map(([k, l]) => `<option value="${k}" ${k === deal.status ? 'selected' : ''}>${l}</option>`).join('')}
         </select>`
      : `<span class="deal-status-pill">${escapeHtml(dealStatusLabel(deal.status))}</span>`;

    card.innerHTML = `
      <div class="deal-card__head">
        <h3>${deal.vehicle_title || deal.title || ('Сделка #' + deal.id)}</h3>
        ${statusControl}
      </div>
      <div class="deal-meta">
        Создана: ${fmtDate(deal.created_at)}
        ${editableRole ? '' : `· Клиент: ${deal.customer_info?.name || deal.customer_info?.phone || '—'}`}
      </div>
      ${buildTimelineHtml(deal.status)}
      <div class="assignments-block">${assignmentsHtml}</div>
    `;

    // Менеджер меняет этап сделки прямо из карточки — обновляем и timeline.
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
          alert('Ошибка: ' + err.message);
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
          alert('Сохранено');
        } catch (err) {
          alert('Ошибка: ' + err.message);
        }
      });
    });

    card.appendChild(buildStagesBlock(deal.id, editableStatus));
    card.appendChild(buildPaymentsBlock(deal.id, editableStatus, deal.total_price));
    card.appendChild(buildDocumentsBlock(deal.id, editableStatus));
    card.appendChild(buildMediaBlock(deal.id, editableStatus));
    if (editableStatus) card.appendChild(buildExpensesBlock(deal.id));
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

  // === Кабинет менеджера: дашборд-счётчики + инбокс заявок ===
  async function loadManagerStats() {
    const el = document.getElementById('managerStats');
    if (!el) return;
    try {
      const s = await window.CMAuth.apiAuthed('GET', '/api/manager/stats/');
      const tiles = [
        ['Всего сделок', s.deals_total],
        ['Активные', s.deals_active],
        ['Завершённые', s.deals_completed],
        ['Заявки (открытые)', s.leads_open],
      ];
      el.innerHTML = tiles.map(([label, val]) => `
        <div class="mgr-tile">
          <div class="mgr-tile__val">${val ?? 0}</div>
          <div class="mgr-tile__label">${label}</div>
        </div>`).join('');
    } catch (e) {
      el.innerHTML = `<p class="empty-note" style="color:#e74c3c">Ошибка загрузки сводки: ${escapeHtml(e.message)}</p>`;
    }
  }

  // Конвертация заявки в сделку. На успехе — создаётся (или находится по
  // телефону) клиент и новая сделка; перезагружаем заявки, сделки и сводку.
  async function convertLead(leadId, btn) {
    if (!confirm('Создать сделку из этой заявки? Клиент будет найден по телефону или создан автоматически.')) return;
    btn.disabled = true;
    const prevText = btn.textContent;
    btn.textContent = 'Создаём…';
    try {
      const res = await window.CMAuth.apiAuthed('POST', `/api/manager/leads/${leadId}/convert/`, {});
      const note = res.created_customer
        ? `\nСоздан новый клиент по номеру ${res.customer_phone}.`
        : `\nКлиент найден по номеру ${res.customer_phone}.`;
      alert(`Сделка создана: «${res.deal_title}» (№${res.deal_id}).${note}`);
      loadManagerLeads();
      loadManagerDeals();
      loadManagerStats();
    } catch (e) {
      alert('Ошибка: ' + e.message);
      btn.disabled = false;
      btn.textContent = prevText;
    }
  }

  // === Финансовый отчёт по сделкам: стоимость против полученных денег ===
  async function loadManagerFinance() {
    const el = document.getElementById('managerFinance');
    if (!el) return;
    try {
      const data = await window.CMAuth.apiAuthed('GET', '/api/manager/finance/');
      const s = data.summary;
      const tiles = [
        ['Стоимость сделок', s.total_value],
        ['Получено', s.total_received],
        ['Расходы', s.total_expenses],
        ['Прибыль', s.total_profit],
      ];
      const rows = data.deals.map(d => `
        <tr>
          <td data-label="Сделка">${escapeHtml(d.title)}</td>
          <td data-label="Этап">${escapeHtml(d.status_display)}</td>
          <td data-label="Стоимость" class="fin-num">${Number(d.total_price) ? fmtMoney(d.total_price) : '—'}</td>
          <td data-label="Получено" class="fin-num">${fmtMoney(d.received)}</td>
          <td data-label="Остаток" class="fin-num ${Number(d.balance) > 0 ? 'fin-due' : 'fin-ok'}">${fmtMoney(d.balance)}</td>
          <td data-label="Расходы" class="fin-num">${fmtMoney(d.expenses)}</td>
          <td data-label="Прибыль" class="fin-num ${d.profit == null ? '' : (Number(d.profit) >= 0 ? 'fin-ok' : 'fin-due')}">${d.profit == null ? '—' : fmtMoney(d.profit)}</td>
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
            <thead><tr><th>Сделка</th><th>Этап</th><th class="fin-num">Стоимость</th><th class="fin-num">Получено</th><th class="fin-num">Остаток</th><th class="fin-num">Расходы</th><th class="fin-num">Прибыль</th></tr></thead>
            <tbody>${rows || '<tr><td colspan="7" class="dc-empty">Сделок пока нет.</td></tr>'}</tbody>
          </table>
        </div>
        <p class="fin-hint">Прибыль = стоимость сделки − расходы. Показывается только для сделок с указанной стоимостью.</p>`;
    } catch (e) {
      el.innerHTML = `<p class="empty-note" style="color:#e74c3c">Ошибка загрузки финансов: ${escapeHtml(e.message)}</p>`;
    }
  }

  async function loadManagerLeads() {
    const el = document.getElementById('managerLeads');
    if (!el) return;
    try {
      const leads = await window.CMAuth.apiAuthed('GET', '/api/manager/leads/');
      if (!leads.length) {
        el.innerHTML = '<p class="empty-note">Заявок пока нет.</p>';
        return;
      }
      el.innerHTML = `
        <ul class="lead-list">
          ${leads.map(l => {
            const action = l.converted_deal
              ? `<span class="lead-converted"><i class="fa-solid fa-check"></i> Сделка №${l.converted_deal}</span>`
              : (l.phone
                  ? `<button type="button" class="lead-convert-btn" data-lead-id="${l.id}">Создать сделку</button>`
                  : '');
            return `
            <li class="lead-row">
              <div class="lead-main">
                <span class="lead-name">${escapeHtml(l.name || 'Без имени')}</span>
                <a class="lead-phone" href="tel:${escapeHtml(l.phone || '')}">${escapeHtml(l.phone || '—')}</a>
                <span class="lead-source">${escapeHtml(l.source || '')}</span>
              </div>
              ${l.message ? `<div class="lead-msg">${escapeHtml(l.message)}</div>` : ''}
              <div class="lead-foot">
                <span class="lead-status s-${escapeHtml(l.status)}">${escapeHtml(l.status_display || LEAD_STATUS_LABELS[l.status] || l.status)}</span>
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
      el.innerHTML = `<p class="empty-note" style="color:#e74c3c">Ошибка загрузки заявок: ${escapeHtml(e.message)}</p>`;
    }
  }

  async function loadManagerDeals() {
    try {
      const deals = await window.CMAuth.apiAuthed('GET', '/api/manager/deals/');
      dealListEl.innerHTML = '';
      if (!deals.length) {
        dealListEl.innerHTML = '<p class="empty-note">Сделок пока нет.</p>';
        return;
      }
      deals.forEach(d => dealListEl.appendChild(buildDealCard(d, { editableStatus: true })));
    } catch (e) {
      dealListEl.innerHTML = `<p class="empty-note" style="color:#e74c3c">Ошибка загрузки сделок: ${escapeHtml(e.message)}</p>`;
    }
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
      } else if (MANAGER_ROLES.includes(session.role)) {
        document.getElementById('managerStatsSection').style.display = '';
        document.getElementById('managerFinanceSection').style.display = '';
        document.getElementById('managerLeadsSection').style.display = '';
        loadManagerStats();
        loadManagerFinance();
        loadManagerLeads();
        await loadManagerDeals();
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
