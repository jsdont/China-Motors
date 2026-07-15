// js/register.js — переключение форм по типу регистрации + отправка на бэкенд
document.addEventListener('DOMContentLoaded', () => {
  const regType = document.getElementById('regType');
  const tabButtons = document.querySelectorAll('#regTabs button');
  const forms = {
    person: document.getElementById('formPerson'),
    company: document.getElementById('formCompany'),
    service: document.getElementById('formService'),
    bank: document.getElementById('formBank'),
    partner: document.getElementById('formPartner'),
  };

  function selectType(key) {
    if (regType) regType.value = key;
    Object.entries(forms).forEach(([k, form]) => {
      if (form) form.style.display = k === key ? '' : 'none';
    });
    tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.type === key));
  }

  tabButtons.forEach(btn => btn.addEventListener('click', () => selectType(btn.dataset.type)));
  regType?.addEventListener('change', () => selectType(regType.value));

  function showStatus(el, message, isError) {
    if (!el) return;
    el.textContent = message;
    el.className = isError ? 'error' : 'success';
    el.style.display = 'block';
  }

  function handleSubmit(formId, btnId, statusId, requiredFields, action) {
    const form = document.getElementById(formId);
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById(btnId);
      const statusEl = document.getElementById(statusId);

      const missing = requiredFields.some(id => !document.getElementById(id).value.trim());
      if (missing) {
        showStatus(statusEl, t('register_err_required'), true);
        return;
      }

      btn.disabled = true;
      try {
        await action();
        showStatus(statusEl, t('register_success'), false);
        setTimeout(() => { location.href = 'index.html'; }, 1500);
      } catch (err) {
        showStatus(statusEl, err.message, true);
        btn.disabled = false;
      }
    });
  }

  handleSubmit('formPerson', 'btnRegisterPerson', 'personStatus', ['p-phone', 'p-password'], () =>
    window.CMAuth.registerPerson({
      phone: document.getElementById('p-phone').value.trim(),
      password: document.getElementById('p-password').value,
      fullName: document.getElementById('p-fullname').value.trim(),
      iin: document.getElementById('p-iin').value.trim(),
    })
  );

  handleSubmit('formCompany', 'btnRegisterCompany', 'companyStatus', ['c-phone', 'c-password', 'c-companyname'], () =>
    window.CMAuth.registerCompany({
      phone: document.getElementById('c-phone').value.trim(),
      password: document.getElementById('c-password').value,
      companyName: document.getElementById('c-companyname').value.trim(),
      bin: document.getElementById('c-bin').value.trim(),
      address: document.getElementById('c-address').value.trim(),
    })
  );

  handleSubmit('formService', 'btnRegisterService', 'serviceStatus', ['s-phone', 's-password', 's-companyname', 's-role'], () =>
    window.CMAuth.registerService({
      phone: document.getElementById('s-phone').value.trim(),
      password: document.getElementById('s-password').value,
      companyName: document.getElementById('s-companyname').value.trim(),
      bin: document.getElementById('s-bin').value.trim(),
      roleKey: document.getElementById('s-role').value,
    })
  );

  handleSubmit('formBank', 'btnRegisterBank', 'bankStatus', ['b-phone', 'b-password', 'b-bankname'], () =>
    window.CMAuth.registerBank({
      phone: document.getElementById('b-phone').value.trim(),
      password: document.getElementById('b-password').value,
      bankName: document.getElementById('b-bankname').value.trim(),
      bik: document.getElementById('b-bik').value.trim(),
      address: document.getElementById('b-address').value.trim(),
    })
  );

  handleSubmit('formPartner', 'btnRegisterPartner', 'partnerStatus', ['pt-phone', 'pt-password', 'pt-companyname'], () =>
    window.CMAuth.registerPartner({
      phone: document.getElementById('pt-phone').value.trim(),
      password: document.getElementById('pt-password').value,
      companyName: document.getElementById('pt-companyname').value.trim(),
      country: document.getElementById('pt-country').value.trim(),
      regNo: document.getElementById('pt-regno').value.trim(),
    })
  );
});
