import { getAuthToken } from '../stores/auth';

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'ngrok-skip-browser-warning': 'true',
};

const rawBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'https://tx972csv-5000.asse.devtunnels.ms/api').trim();
const API_BASE_URL = rawBaseUrl.replace(/\/$/, '');

function buildUrl(path = '', params) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (!params || Object.keys(params).length === 0) {
    return `${API_BASE_URL}${cleanPath}`;
  }
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.append(key, value);
    }
  });
  const qs = search.toString();
  return qs ? `${API_BASE_URL}${cleanPath}?${qs}` : `${API_BASE_URL}${cleanPath}`;
}

async function request(path, { method = 'GET', params, body, headers = {}, auth = true } = {}) {
  const url = buildUrl(path, params);
  const token = auth ? getAuthToken() : null;

  const init = {
    method,
    headers: {
      ...DEFAULT_HEADERS,
      ...headers,
    },
  };

  if (token) {
    init.headers.Authorization = `Bearer ${token}`;
  }

  if (body instanceof FormData) {
    // Let browser set appropriate headers for multipart
    delete init.headers['Content-Type'];
    init.body = body;
  } else if (body !== undefined) {
    init.body = JSON.stringify(body);
  }

  const response = await fetch(url, init);
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (err) {
    throw new Error(`Không đọc được phản hồi từ server (${response.status})`);
  }

  if (!response.ok || data?.success === false) {
    const message = data?.message || `Yêu cầu thất bại (${response.status})`;
    const errors = data?.errors;
    const error = new Error(message);
    error.status = response.status;
    error.details = errors;
    throw error;
  }

  return {
    data: data?.data ?? null,
    raw: data,
  };
}

export { request, API_BASE_URL };
