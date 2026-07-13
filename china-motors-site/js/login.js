// js/login.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formLogin');
  const statusEl = document.getElementById('loginStatus');
  const btn = document.getElementById('btnLogin');

  function showStatus(message, isError) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.className = isError ? 'error' : 'success';
    statusEl.style.display = 'block';
  }

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const phone = document.getElementById('l-phone').value.trim();
    const password = document.getElementById('l-password').value;

    if (!phone || !password) {
      showStatus(t('register_err_required'), true);
      return;
    }

    btn.disabled = true;
    try {
      await window.CMAuth.login({ phone, password });
      showStatus(t('login_success'), false);
      const next = new URLSearchParams(location.search).get('next');
      setTimeout(() => { location.href = next || 'index.html'; }, 1000);
    } catch (err) {
      showStatus(err.message, true);
      btn.disabled = false;
    }
  });
});
