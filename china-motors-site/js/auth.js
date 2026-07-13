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
  const LS_USER_ID = 'cm_user_id';

  function saveSession({ access, refresh, role, is_verified, user_id }) {
    if (access) localStorage.setItem(LS_ACCESS, access);
    if (refresh) localStorage.setItem(LS_REFRESH, refresh);
    if (role) localStorage.setItem(LS_ROLE, role);
    if (user_id) localStorage.setItem(LS_USER_ID, user_id);
    localStorage.setItem(LS_VERIFIED, is_verified ? '1' : '0');
  }

  function clearSession() {
    localStorage.removeItem(LS_ACCESS);
    localStorage.removeItem(LS_REFRESH);
    localStorage.removeItem(LS_ROLE);
    localStorage.removeItem(LS_VERIFIED);
    localStorage.removeItem(LS_USER_ID);
  }

  function getSession() {
    const access = localStorage.getItem(LS_ACCESS);
    if (!access) return null;
    return {
      access,
      refresh: localStorage.getItem(LS_REFRESH),
      role: localStorage.getItem(LS_ROLE),
      isVerified: localStorage.getItem(LS_VERIFIED) === '1',
      userId: Number(localStorage.getItem(LS_USER_ID)) || null,
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

  async function registerService({ phone, password, companyName, bin, roleKey }) {
    const data = await apiPost('/api/auth/register/service/', {
      phone, password, company_name: companyName, bin, role_key: roleKey,
    });
    saveSession(data);
    return data;
  }

  async function registerBank({ phone, password, bankName, bik, address }) {
    const data = await apiPost('/api/auth/register/bank/', {
      phone, password, bank_name: bankName, bik, address,
    });
    saveSession(data);
    return data;
  }

  async function registerPartner({ phone, password, companyName, country, regNo }) {
    const data = await apiPost('/api/auth/register/partner/', {
      phone, password, company_name: companyName, country, reg_no: regNo,
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

  async function refreshAccess() {
    const refresh = localStorage.getItem(LS_REFRESH);
    if (!refresh) return null;
    try {
      const res = await fetch(`${API_BASE}/api/auth/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      localStorage.setItem(LS_ACCESS, data.access);
      return data.access;
    } catch {
      return null;
    }
  }

  // Авторизованный запрос — вешает Bearer-токен, при 401 один раз
  // пробует обновить access через refresh-токен и повторяет запрос.
  async function apiAuthed(method, path, body) {
    let session = getSession();
    if (!session) throw new Error('NOT_AUTHENTICATED');

    async function doFetch(token) {
      return fetch(`${API_BASE}${path}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    }

    let res = await doFetch(session.access);
    if (res.status === 401) {
      const newAccess = await refreshAccess();
      if (!newAccess) {
        clearSession();
        throw new Error('SESSION_EXPIRED');
      }
      res = await doFetch(newAccess);
    }

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const firstError = Object.values(data)[0];
      const message = Array.isArray(firstError) ? firstError[0] : (data.detail || 'Ошибка запроса');
      throw new Error(message);
    }
    return data;
  }

  window.CMAuth = {
    API_BASE, registerPerson, registerCompany, registerService, registerBank, registerPartner,
    login, logout, getSession, apiAuthed,
  };
})();
