import { request } from './http';

async function getCategories() {
  const { data } = await request('/categories', { auth: false });
  return Array.isArray(data) ? data : [];
}

export { getCategories };
