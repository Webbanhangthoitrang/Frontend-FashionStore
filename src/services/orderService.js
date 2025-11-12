import { request } from './http';

export function createOrder(data) {
  return request('/orders', {
    method: 'POST',
    data: data, // Dùng 'data' thay vì 'body', http.js sẽ tự stringify
  });
}
