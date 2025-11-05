// src/services/reviewService.js
import { request } from "./http";

// ✅ Lấy danh sách đánh giá sản phẩm
async function getReviewsByProductId(productId, params = {}) {
  // backend nên hỗ trợ phân trang: ?page=1&limit=3
  const { data } = await request(`/products/${productId}/reviews`, {
    params,
    auth: false, // xem đánh giá không cần đăng nhập
  });

  // backend có thể trả data.items hoặc data trực tiếp
  return {
    items: data?.items || data || [],
    total: data?.total || (Array.isArray(data) ? data.length : 0),
  };
}

// ✅ Thêm hoặc cập nhật đánh giá
async function createOrUpdateReview(productId, review) {
  // review = { rating: 5, text: "Sản phẩm rất tốt!" }
  const { data } = await request(`/products/${productId}/reviews`, {
    method: "POST",
    body: review,
    auth: true, // chỉ người dùng đăng nhập mới được đánh giá
  });
  return data;
}

// ✅ Xoá đánh giá
async function deleteReview(productId, reviewId) {
  const { data } = await request(`/products/${productId}/reviews/${reviewId}`, {
    method: "DELETE",
    auth: true, // chỉ người đã đăng nhập mới xoá được
  });
  return data;
}

export { getReviewsByProductId, createOrUpdateReview, deleteReview };
