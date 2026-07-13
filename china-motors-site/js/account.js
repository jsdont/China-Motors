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
        ? comments.map(c => `<div class="comment-item"><b>${c.author_info?.name || c.author_info?.phone || '—'}:</b> ${escapeHtml(c.text)}</div>`).join('')
        : '<div class="comment-item" style="opacity:.6">Пока нет сообщений</div>';
    } catch (e) {
      container.innerHTML = `<div class="comment-item" style="color:#e74c3c">Ошибка загрузки: ${e.message}</div>`;
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

  function buildDealCard(deal, { editableRole } = {}) {
    const card = document.createElement('div');
    card.className = 'deal-card';

    const assignmentsHtml = deal.assignments.length
      ? deal.assignments.map(a => {
          const isMine = editableRole && a.role === editableRole;
          if (!isMine) {
            return `
              <div class="assignment-row">
                <span class="assignment-role">${ROLE_LABELS_SHORT[a.role] || a.role}</span>
                <span>${a.assigned_user_info?.name || a.assigned_user_info?.phone || '— не назначен'}</span>
                <span class="assignment-status ${a.status}">${STATUS_LABELS[a.status] || a.status}</span>
              </div>`;
          }
          return `
            <div class="assignment-row">
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
      : '<p style="opacity:.7">Пока никто не назначен</p>';

    card.innerHTML = `
      <h3>${deal.vehicle_title || deal.title || ('Сделка #' + deal.id)}</h3>
      <div class="deal-meta">
        Статус сделки: <b>${deal.status}</b> · Создана: ${fmtDate(deal.created_at)}
        ${editableRole ? '' : `<br>Клиент: ${deal.customer_info?.name || deal.customer_info?.phone || '—'}`}
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

    card.appendChild(buildCommentsBlock(deal.id));
    return card;
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

  render();
});
