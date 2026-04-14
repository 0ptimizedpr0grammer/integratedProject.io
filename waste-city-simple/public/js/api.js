const BASE = '/api';

function getToken() {
  return localStorage.getItem('wc_token');
}

async function req(path, opts = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  if (token) headers['Authorization'] = 'Bearer ' + token;
  const res  = await fetch(BASE + path, { ...opts, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'HTTP ' + res.status);
  return data;
}

window.API = {
  auth: {
    login: (u, p) => req('/auth/login', { method: 'POST', body: JSON.stringify({ username: u, password: p }) }),
    me:    ()     => req('/auth/me'),
  },
  cities: {
    list:    ()   => req('/cities'),
    get:     (id) => req('/cities/' + id),
    summary: (id) => req('/cities/' + id + '/summary'),
  },
  analytics: {
    trend:     (cid, days = 30) => req('/analytics/' + cid + '/trend?days=' + days),
    zones:     (cid)            => req('/analytics/' + cid + '/zones'),
    recycling: (cid)            => req('/analytics/' + cid + '/recycling'),
  },
  security: {
    encrypt:     (text)                       => req('/security/encrypt',      { method: 'POST', body: JSON.stringify({ text }) }),
    decrypt:     (ciphertext)                 => req('/security/decrypt',      { method: 'POST', body: JSON.stringify({ ciphertext }) }),
    hash:        (text)                       => req('/security/hash',         { method: 'POST', body: JSON.stringify({ text }) }),
    rsaGenerate: ()                           => req('/security/rsa/generate', { method: 'POST' }),
    rsaSign:     (privateKey, data)           => req('/security/rsa/sign',     { method: 'POST', body: JSON.stringify({ privateKey, data }) }),
    rsaVerify:   (publicKey, data, signature) => req('/security/rsa/verify',   { method: 'POST', body: JSON.stringify({ publicKey, data, signature }) }),
    auditLogs:   ()                           => req('/security/audit-logs'),
  },
  query: (sql) => req('/query', { method: 'POST', body: JSON.stringify({ sql }) }),
  getToken,
};