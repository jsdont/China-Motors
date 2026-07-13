// js/register.js — переключение форм физ./юр. лицо + отправка на бэкенд
document.addEventListener('DOMContentLoaded', () => {
  const tabPerson = document.getElementById('tabPerson');
  const tabCompany = document.getElementById('tabCompany');
  const formPerson = document.getElementById('formPerson');
  const formCompany = document.getElementById('formCompany');

  tabPerson?.addEventListener('click', () => {
    tabPerson.classList.add('active');
    tabCompany.classList.remove('active');
    formPerson.style.display = '';
    formCompany.style.display = 'none';
  });

  tabCompany?.addEventListener('click', () => {
    tabCompany.classList.add('active');
    tabPerson.classList.remove('active');
    formCompany.style.display = '';
    formPerson.style.display = 'none';
  });

  function showStatus(el, message, isError) {
    if (!el) return;
    el.textContent = message;
    el.className = isError ? 'error' : 'success';
    el.style.display = 'block';
  }

  formPerson?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btnRegisterPerson');
    const statusEl = document.getElementById('personStatus');
    const phone = document.getElementById('p-phone').value.trim();
    const password = document.getElementById('p-password').value;
    const fullName = document.getElementById('p-fullname').value.trim();
    const iin = document.getElementById('p-iin').value.trim();

    if (!phone || !password) {
      showStatus(statusEl, t('register_err_required'), true);
      return;
    }

    btn.disabled = true;
    try {
      await window.CMAuth.registerPerson({ phone, password, fullName, iin });
      showStatus(statusEl, t('register_success'), false);
      setTimeout(() => { location.href = 'index.html'; }, 1500);
    } catch (err) {
      showStatus(statusEl, err.message, true);
      btn.disabled = false;
    }
  });

  formCompany?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btnRegisterCompany');
    const statusEl = document.getElementById('companyStatus');
    const phone = document.getElementById('c-phone').value.trim();
    const password = document.getElementById('c-password').value;
    const companyName = document.getElementById('c-companyname').value.trim();
    const bin = document.getElementById('c-bin').value.trim();
    const address = document.getElementById('c-address').value.trim();

    if (!phone || !password || !companyName) {
      showStatus(statusEl, t('register_err_required'), true);
      return;
    }

    btn.disabled = true;
    try {
      await window.CMAuth.registerCompany({ phone, password, companyName, bin, address });
      showStatus(statusEl, t('register_success'), false);
      setTimeout(() => { location.href = 'index.html'; }, 1500);
    } catch (err) {
      showStatus(statusEl, err.message, true);
      btn.disabled = false;
    }
  });
});
