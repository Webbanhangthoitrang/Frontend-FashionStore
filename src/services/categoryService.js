// src/services/categoryService.js
import { request } from "./http";

// GET /categories
async function getCategories(params) {
  const { data } = await request("/categories", { params, auth: false });
  return Array.isArray(data) ? data : [];
}

// POST /categories  (JSON)
async function createCategory(payload) {
  // payload ví dụ: { name: "Váy", icon: "https://..." }
  const { data } = await request("/categories", {
    method: "POST",
    body: payload,
    auth: true, // đổi false nếu API cho phép public
  });
  return data;
}

// POST /categories  (FormData – khi upload file icon)
async function createCategoryFormData(formData) {
  // formData.append("name", "Giày dép"); formData.append("icon", file);
  const { data } = await request("/categories", {
    method: "POST",
    body: formData, // http.js sẽ tự bỏ Content-Type cho multipart
    auth: true,
  });
  return data;
}

// PUT /categories/:id
async function updateCategory(id, payload) {
  const { data } = await request(`/categories/${id}`, {
    method: "PUT",
    body: payload,
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
