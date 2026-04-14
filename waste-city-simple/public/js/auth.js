function getUser() {
  try { return JSON.parse(localStorage.getItem('wc_user')); } catch { return null; }
}

function requireAuth() {
  if (!API.getToken()) { window.location.href = '/'; return false; }
  return true;
}

function logout() {
  localStorage.removeItem('wc_token');
  localStorage.removeItem('wc_user');
  window.location.href = '/';
}

function renderUserChip() {
  const u = getUser();
  if (!u) return;
  document.getElementById('u-name')?.textContent   && (document.getElementById('u-name').textContent   = u.username);
  document.getElementById('u-role')?.textContent   && (document.getElementById('u-role').textContent   = u.role);
  document.getElementById('u-avatar')?.textContent && (document.getElementById('u-avatar').textContent = u.username[0].toUpperCase());
  // safer version
  if (document.getElementById('u-name'))   document.getElementById('u-name').textContent   = u.username;
  if (document.getElementById('u-role'))   document.getElementById('u-role').textContent   = u.role;
  if (document.getElementById('u-avatar')) document.getElementById('u-avatar').textContent = u.username[0].toUpperCase();
}

// Login form
const lf = document.getElementById('login-form');
if (lf) {
  if (API.getToken()) window.location.href = '/dashboard';

  lf.addEventListener('submit', async e => {
    e.preventDefault();
    const username = document.getElementById('un').value.trim();
    const password = document.getElementById('pw').value;
    const errEl    = document.getElementById('lerr');
    const btn      = document.getElementById('lbtn');
    errEl.classList.add('hidden');
    btn.disabled = true; btn.textContent = 'Signing in…';
    try {
      const { token, user } = await API.auth.login(username, password);
      localStorage.setItem('wc_token', token);
      localStorage.setItem('wc_user', JSON.stringify(user));
      window.location.href = '/dashboard';
    } catch (err) {
      errEl.textContent = err.message;
      errEl.classList.remove('hidden');
    } finally {
      btn.disabled = false; btn.textContent = 'Sign In';
    }
  });
}

// Logout button (present on all inner pages)
document.getElementById('logout-btn')?.addEventListener('click', logout);