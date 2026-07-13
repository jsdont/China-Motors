// js/auth.js — регистрация/вход (физ. лицо / юр. лицо), JWT в localStorage
(function () {
  const metaBase = document.querySelector('meta[name="api-base"]')?.content?.trim();
  const isLocal = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  const API_BASE = (metaBase || (isLocal ? 'http://127.0.0.1:8000' : 'https://cm-backend-daniyal.fly.dev'))
    .replace(/\/+$/, '');

  const LS_ACCESS = 'cm_access';
  const LS_REFRESH = 'cm_refresh';
  const LS_ROLE = 'cm_role';
  const LS_VERIFIED = 'cm_verified';

  function saveSession({ access, refresh, role, is_verified }) {
    if (access) localStorage.setItem(LS_ACCESS, access);
    if (refresh) localStorage.setItem(LS_REFRESH, refresh);
    if (role) localStorage.setItem(LS_ROLE, role);
    localStorage.setItem(LS_VERIFIED, is_verified ? '1' : '0');
  }

  function clearSession() {
    localStorage.removeItem(LS_ACCESS);
    localStorage.removeItem(LS_REFRESH);
    localStorage.removeItem(LS_ROLE);
    localStorage.removeItem(LS_VERIFIED);
  }

  function getSession() {
    const access = localStorage.getItem(LS_ACCESS);
    if (!access) return null;
    return {
      access,
      refresh: localStorage.getItem(LS_REFRESH),
      role: localStorage.getItem(LS_ROLE),
      isVerified: localStorage.getItem(LS_VERIFIED) === '1',
    };
  }

  async function apiPost(path, body) {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const firstError = Object.values(data)[0];
      const message = Array.isArray(firstError) ? firstError[0] : (data.detail || 'Ошибка запроса');
      throw new Error(message);
    }
    return data;
  }

  async function registerPerson({ phone, password, fullName, iin }) {
    const data = await apiPost('/api/auth/register/person/', {
      phone, password, full_name: fullName, iin,
    });
    saveSession(data);
    return data;
  }

  async function registerCompany({ phone, password, companyName, bin, address }) {
    const data = await apiPost('/api/auth/register/company/', {
      phone, password, company_name: companyName, bin, address,
    });
    saveSession(data);
    return data;
  }

  async function login({ phone, password }) {
    const data = await apiPost('/api/auth/login/', { phone, password });
    saveSession(data);
    return data;
  }

  function logout() {
    clearSession();
  }

  window.CMAuth = { API_BASE, registerPerson, registerCompany, login, logout, getSession };
})();
