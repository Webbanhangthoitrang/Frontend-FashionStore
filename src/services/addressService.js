// src/services/addressService.js
import { request } from './http';

/**
 * Lấy danh sách địa chỉ của người dùng hiện tại
 * GET /addresses
 */
export function getMyAddresses() {
  return request('/addresses', {
    method: 'GET',
  });
}

/**
 * Tạo địa chỉ mới
 * POST /addresses
 * @param {Object} payload
 *  - fullName
 *  - phone
 *  - addressLine
 *  - ward
 *  - district
 *  - province
 *  - isDefault (optional)
 */
export function createAddress(payload) {
  return request('/addresses', {
    method: 'POST',
    data: payload,
  });
}

/**
 * Cập nhật địa chỉ
 * PUT /addresses/{id}
 * @param {number|string} id
 * @param {Object} payload (các trường giống create)
 */
export function updateAddress(id, payload) {
  return request(`/addresses/${id}`, {
    method: 'PUT',
    data: payload,
  });
}

/**
 * Xoá địa chỉ
 * DELETE /addresses/{id}
 * @param {number|string} id
 */
export function deleteAddress(id) {
  return request(`/addresses/${id}`, {
    method: 'DELETE',
  });
}
