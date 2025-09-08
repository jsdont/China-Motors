// /js/contacts.js␊
document.addEventListener('DOMContentLoaded', () => {
  const metaBase = document.querySelector('meta[name="api-base"]')?.content?.trim();
  const isLocal = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  const API_BASE = (metaBase || (isLocal ? 'http://127.0.0.1:8000' : 'https://cm-backend-daniyal.fly.dev')).replace(/\/+$/, '');

  const nameEl = document.getElementById('c-name');
  const phoneEl = document.getElementById('c-phone');
  const msgEl = document.getElementById('c-message');
  const sendBtn = document.getElementById('c-send');

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
    const phone = phoneEl?.value?.trim() || '—';
    const msg = msgEl?.value?.trim() || '—';

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
      alert('Заявка успешно отправлена!');
    } catch (err) {
      console.error(err);
      alert('❌ Ошибка: ' + err.message);
      sendBtn.textContent = prev;
      sendBtn.disabled = false;
    }
  });
});
