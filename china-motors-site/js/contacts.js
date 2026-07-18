// /js/contacts.js␊
document.addEventListener('DOMContentLoaded', () => {
  const metaBase = document.querySelector('meta[name="api-base"]')?.content?.trim();
  const isLocal = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  const API_BASE = (metaBase || (isLocal ? 'http://127.0.0.1:8000' : 'https://cm-backend-daniyal.fly.dev')).replace(/\/+$/, '');

  const nameEl = document.getElementById('c-name');
  const phoneEl = document.getElementById('c-phone');
  const msgEl = document.getElementById('c-message');
  const sendBtn = document.getElementById('c-send');
  const statusEl = document.getElementById('formStatus');

  // 1) автоподстановка текста из калькулятора ?message=...
  const qs = new URLSearchParams(location.search);
  const pre = qs.get('message');
  if (pre && msgEl) {
    msgEl.value = pre;
  }

  // 2) отправка в Telegram через backend
  async function sendToBackend(name, phone, message, productId) {
    const resp = await fetch(`${API_BASE}/api/contacts/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        phone,
        message,
        page: window.location.href,
        product_id: productId || null,
      }),


    });

    const data = await resp.json().catch(() => ({}));
    if (!resp.ok || data.status !== 'ok') {
      throw new Error(data.error || `HTTP ${resp.status}`);
    }
    return true;
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

    try {
      await sendToBackend(name, phone, msg, productId);
      sendBtn.textContent = '✅ Отправлено';
      if (statusEl) {
        statusEl.textContent = 'Заявка успешно отправлена!';
        statusEl.className = 'success';
        statusEl.style.display = 'block';
      }
      window.cmGoal?.('contact_form_success');
      // Поля очищаем только при успехе — при ошибке пользователь не
      // должен терять то, что уже написал, и может просто нажать ещё раз.
      nameEl && (nameEl.value = '');
      phoneEl && (phoneEl.value = '');
      msgEl && (msgEl.value = '');
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
