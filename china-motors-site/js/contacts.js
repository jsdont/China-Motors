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
  async function sendToTelegram(text) {
    const resp = await fetch(`${API_BASE}/api/telegram`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok || data.ok === false) {
      throw new Error(data.description || data.error || `HTTP ${resp.status}`);
    }
    return true;
  }

  sendBtn?.addEventListener('click', async (e) => {
    e.preventDefault();
    const name = nameEl?.value?.trim() || '—';
    const phone = phoneEl?.value?.trim() || '';
    const msg = msgEl?.value?.trim() || '';

    // simple validation
    let valid = true;
    phoneEl?.style.removeProperty('border-color');
    msgEl?.style.removeProperty('border-color');
    if (!phone || !/^\+?[0-9\s-]{6,}$/.test(phone)) {
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

    const text =
      `📩 <b>Новая заявка</b>\n` +
      `Имя: ${name}\n` +
      `Телефон: ${phone}\n\n` +
      msg;

    sendBtn.disabled = true;
    const prev = sendBtn.textContent;
    sendBtn.textContent = 'Отправка...';

    try {
      await sendToTelegram(text);
      sendBtn.textContent = '✅ Отправлено';
      if (statusEl) {
        statusEl.textContent = 'Заявка успешно отправлена!';
        statusEl.className = 'success';
        statusEl.style.display = 'block';
      }
    } catch (err) {
      console.error(err);
      if (statusEl) {
        statusEl.textContent = 'Ошибка: ' + err.message;
        statusEl.className = 'error';
        statusEl.style.display = 'block';
      }
    }

    nameEl && (nameEl.value = '');
    phoneEl && (phoneEl.value = '');
    msgEl && (msgEl.value = '');

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
