// src/services/categoryService.js
import { request } from "./http";

// GET /categories
async function getCategories(params) {
  const { data } = await request("/categories", { params, auth: false });
  return Array.isArray(data) ? data : [];
}

// POST /categories  (JSON)
async function createCategory(payload) {
  // payload ví dụ: { name: "Váy", description: "...", isActive: true }
  const { data } = await request("/categories", {
    method: "POST",
    data: payload, // Đổi từ 'body' thành 'data'
    auth: true,
  });
  return data;
}

// POST /categories  (FormData – khi upload file icon)
async function createCategoryFormData(formData) {
  // formData.append("name", "Giày dép"); formData.append("icon", file);
  const { data } = await request("/categories", {
    method: "POST",
    data: formData, // Đổi từ 'body' thành 'data'
    auth: true,
  });
  return data;
}

// PUT /categories/:id
async function updateCategory(id, payload) {
  const { data } = await request(`/categories/${id}`, {
    method: "PUT",
    data: payload, // Đổi từ 'body' thành 'data'
    auth: true,
  });
  return data;
}

// DELETE /categories/:id
async function deleteCategory(id) {
  const { data } = await request(`/categories/${id}`, {
    method: "DELETE",
    auth: true,
  });
  return data;
}

export {
  getCategories,
  createCategory,
  createCategoryFormData,
  updateCategory,
  deleteCategory,
};
