// Dùng cùng request helper bạn đang xài ở các service khác
import { request } from "./http";

// Lấy danh sách thông báo của người dùng hiện tại
export async function getNotifications(params = {}) {
  // ví dụ hỗ trợ phân trang nếu backend có ?page=&pageSize=
  return request({
    url: "/notifications",
    method: "GET",
    params, // { page, pageSize } nếu cần
  });
}

// (tuỳ backend có hay không) đánh dấu đã đọc tất cả
export async function markAllNotificationsRead() {
  // Nếu swagger KHÔNG có endpoint này thì bỏ hàm này đi
  return request({
    url: "/notifications/mark-all-read",
    method: "PUT",
  });
}
