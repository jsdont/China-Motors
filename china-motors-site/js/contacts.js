// /js/contacts.js␊
document.addEventListener('DOMContentLoaded', () => {
  const metaBase = document.querySelector('meta[name="api-base"]')?.content?.trim();
  const isLocal = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  const API_BASE = (metaBase || (isLocal ? 'http://127.0.0.1:8000' : 'https://cm-backend-daniyal.fly.dev')).replace(/\/+$/, '');

  const nameEl = document.getElementById('c-name');
  const phoneEl = document.getElementById('c-phone');
  const msgEl = document.getElementById('c-message');
  const companyEl = document.getElementById('c-company'); // honeypot — should stay empty
  const sendBtn = document.getElementById('c-send');
  const statusEl = document.getElementById('formStatus');

  // момент загрузки формы — для проверки "слишком быстрой" отправки ботом
  const formLoadedAt = Date.now();

  // 1) автоподстановка текста из калькулятора ?message=...
  const qs = new URLSearchParams(location.search);
  const pre = qs.get('message');
  if (pre && msgEl) {
    msgEl.value = pre;
  }

  // 2) отправка в Telegram через backend
  async function sendToBackend(name, phone, message, productId) {
    // Детализация расчёта из калькулятора (если пришли со страницы калькулятора)
    let calcBreakdown = null;
    try {
      const raw = sessionStorage.getItem('cm_calc_breakdown');
      if (raw) calcBreakdown = JSON.parse(raw);
    } catch (_) {}

    const resp = await fetch(`${API_BASE}/api/contacts/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        phone,
        message,
        page: window.location.href,
        product_id: productId || null,
        company: companyEl?.value || '', // honeypot, бэкенд отклонит непустое значение
        calc_breakdown: calcBreakdown,
      }),


    });

    const data = await resp.json().catch(() => ({}));
    if (!resp.ok || data.status !== 'ok') {
      throw new Error(data.error || `HTTP ${resp.status}`);
    }
    return true;
  }


  function showSuccessAndReset() {
    // расчёт уже ушёл с заявкой — чистим, чтобы не прицепился к следующей
    try { sessionStorage.removeItem('cm_calc_breakdown'); } catch (_) {}
    sendBtn.textContent = '✅ Отправлено';
    if (statusEl) {
      statusEl.textContent = 'Заявка успешно отправлена!';
      statusEl.className = 'success';
      statusEl.style.display = 'block';
    }
    nameEl && (nameEl.value = '');
    phoneEl && (phoneEl.value = '');
    msgEl && (msgEl.value = '');
  }

  sendBtn?.addEventListener('click', async (e) => {
    e.preventDefault();
    const name = nameEl?.value?.trim() || '—';
    const phone = phoneEl?.value?.trim() || '';
    const msg = msgEl?.value?.trim() || '';

    // simple validation — телефон разрешает +, цифры, пробелы, дефисы
    // и скобки (плейсхолдер показывает формат "+7 (___) ___-__-__",
    // так что скобки должны проходить, а не блокировать отправку).
    let valid = true;
    phoneEl?.style.removeProperty('border-color');
    msgEl?.style.removeProperty('border-color');
    if (!phone || !/^\+?[0-9()\s-]{6,}$/.test(phone)) {
      phoneEl?.style.setProperty('border-color', 'red');
      valid = false;
    }
    if (!msg) {
      msgEl?.style.setProperty('border-color', 'red');
      valid = false;
    }
    if (!valid) {
      alert('Пожалуйста, корректно заполните телефон и сообщение');
      return;
    }

    sendBtn.disabled = true;
    const prev = sendBtn.textContent;
    sendBtn.textContent = 'Отправка...';

    const productId = qs.get('product_id');

    // Заполнено быстрее, чем реально успел бы человек, — почти наверняка
    // бот. Отклоняем тихо (без запроса на бэкенд и без объяснения),
    // чтобы не подсказывать боту, на что подстроиться.
    const secondsSinceLoad = (Date.now() - formLoadedAt) / 1000;
    if (secondsSinceLoad < 3) {
      showSuccessAndReset();
      sendBtn.disabled = false;
      sendBtn.textContent = prev;
      setTimeout(() => {
        if (statusEl) {
          statusEl.style.display = 'none';
          statusEl.textContent = '';
          statusEl.className = '';
        }
      }, 4000);
      return;
    }

    try {
      await sendToBackend(name, phone, msg, productId);
      showSuccessAndReset();
      window.cmGoal?.('contact_form_success');
    } catch (err) {
      console.error(err);
      if (statusEl) {
        statusEl.textContent = 'Ошибка: ' + err.message;
        statusEl.className = 'error';
        statusEl.style.display = 'block';
      }
    }

    sendBtn.disabled = false;
    sendBtn.textContent = prev;

    setTimeout(() => {
      if (statusEl) {
        statusEl.style.display = 'none';
        statusEl.textContent = '';
        statusEl.className = '';
      }
    }, 4000);
  });
});
