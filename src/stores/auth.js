import { reactive, computed } from 'vue';

const state = reactive({
  token: localStorage.getItem('authToken') || '',
  user: null,
  status: 'idle',
  error: null,
});

try {
  const rawUser = localStorage.getItem('authUser');
  if (rawUser) {
    state.user = JSON.parse(rawUser);
  }
} catch (err) {
  // eslint-disable-next-line no-console
  console.warn('Không thể đọc dữ liệu người dùng từ localStorage:', err);
  state.user = null;
}

function setAuth(token, user) {
  state.token = token || '';
  state.user = user || null;
  localStorage.setItem('authToken', state.token);
  if (state.user) {
    localStorage.setItem('authUser', JSON.stringify(state.user));
  } else {
    localStorage.removeItem('authUser');
  }
}

function clearAuth() {
  state.token = '';
  state.user = null;
  localStorage.removeItem('authToken');
  localStorage.removeItem('authUser');
}

function setStatus(status) {
  state.status = status;
}

function setError(error) {
  state.error = error;
}

function updateUser(partial) {
  state.user = { ...(state.user || {}), ...(partial || {}) };
  if (state.user && state.user.id !== undefined) {
    localStorage.setItem('authUser', JSON.stringify(state.user));
  } else {
    localStorage.removeItem('authUser');
  }
}

function useAuthStore() {
  const isLoggedIn = computed(() => Boolean(state.token));
  const role = computed(() => state.user?.role || state.user?.roleId || null);

  return {
    state,
    isLoggedIn,
    role,
    setAuth,
    clearAuth,
    setStatus,
    setError,
    updateUser,
  };
}

function getAuthToken() {
  return state.token;
}

export { useAuthStore, getAuthToken, setAuth, clearAuth, updateUser, setStatus, setError };
