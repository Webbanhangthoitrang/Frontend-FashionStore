import { request } from './http';

async function login(credentials) {
  const { data, raw } = await request('/auth/login', {
    method: 'POST',
    body: credentials,
    auth: false,
  });
  return raw;
}

async function register(payload) {
  const { data, raw } = await request('/auth/register', {
    method: 'POST',
    body: payload,
    auth: false,
  });
  return raw;
}

async function getProfile() {
  const { raw } = await request('/auth/me', {
    method: 'GET',
    auth: true,
  });
  return raw;
}
async function forgotPassword(payload) {
  const { raw } = await request('/auth/forgot-password', {
    method: 'POST',
    body: payload,
    auth: false,
  });
  return raw;
}

async function verifyResetCode(payload) {
  const { raw } = await request('/auth/verify-reset-code', {
    method: 'POST',
    body: payload,
    auth: false,
  });
  return raw;
}

async function resetPassword(payload) {
  const { raw } = await request('/auth/reset-password', {
    method: 'POST',
    body: payload,
    auth: false,
  });
  return raw;
}

async function updateProfile(payload) {
  const { raw } = await request('/users/me', {
    method: 'PUT',
    body: payload,
  });
  return raw;
}

export { login, register, getProfile, forgotPassword, verifyResetCode, resetPassword, updateProfile };
