// Dùng cùng request helper bạn đang xài ở các service khác
import { request } from "./http";

// Lấy danh sách thông báo của người dùng hiện tại
export async function getNotifications(params = {}) {
  // params ví dụ: { unreadOnly: true, page: 1, limit: 20 }
  const { data } = await request("/notifications", {
    method: "GET",
    params,
    auth: true
  });
  return data;
}

// Đánh dấu 1 thông báo đã đọc
export async function markNotificationRead(notificationId) {
  const { data } = await request(`/notifications/${notificationId}/read`, {
    method: "PUT",
    auth: true
  });
  return data;
}

// Đánh dấu tất cả thông báo đã đọc
export async function markAllNotificationsRead() {
  const { data } = await request("/notifications/read-all", {
    method: "PUT",
    auth: true
  });
  return data;
}

// Xóa thông báo
export async function deleteNotification(notificationId) {
  const { data } = await request(`/notifications/${notificationId}`, {
    method: "DELETE",
    auth: true
  });
  return data;
}
