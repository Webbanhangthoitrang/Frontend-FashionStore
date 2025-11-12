<!-- src/views/admin/UserDetail.vue -->
<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <AdminSidebar />

    <!-- Content -->
    <div class="admin-content">
      <!-- Tiêu đề lớn -->
      <div class="page-header">
        <h1>Quản lý người dùng</h1>
      </div>

      <!-- Hàng: nút back + tiêu đề phụ -->
      <div class="sub-header">
        <button class="back-btn" @click="goBack" aria-label="Quay lại danh sách người dùng">
          <!-- SVG go back vuông -->
          <svg
            width="30"
            height="30"
            viewBox="0 0 50 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            >
            <path
                d="M31.25 37.5L18.75 25L31.25 12.5"
                stroke="#585858"
                stroke-width="5"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            </svg>


        </button>

        <span class="sub-title">Thông tin chi tiết khách hàng</span>
      </div>

      <!-- Card thông tin khách hàng -->
      <section class="card info-card">
        <div class="info-row">
          <div class="label">Họ và tên:</div>
          <div class="value">{{ user.fullName || user.name || '-' }}</div>
          <div class="id-text">(ID: {{ user.code || user.id || '—' }})</div>
        </div>
        <div class="info-row">
          <div class="label">Email:</div>
          <div class="value">{{ user.email || '-' }}</div>
        </div>
        <div class="info-row">
          <div class="label">Số điện thoại:</div>
          <div class="value">{{ user.phone || user.phoneNumber || '-' }}</div>
        </div>
        <div class="info-row">
          <div class="label">Ngày tạo:</div>
          <div class="value">{{ formatDate(user.createdAt) }}</div>
        </div>
        <div class="info-row">
          <div class="label">Trạng thái:</div>
          <div class="value">
            <span
              class="badge"
              :class="isActive ? 'badge--active' : 'badge--inactive'"
            >
              {{ isActive ? 'Active' : 'Inactive' }}
            </span>
          </div>
        </div>
      </section>

      <!-- Lịch sử mua hàng -->
      <section class="card orders-card">
        <div class="orders-head">
          <div class="icon-box">📄</div>
          <span class="orders-title">Lịch sử mua hàng</span>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Mã đơn hàng</th>
              <th>Ngày đặt hàng</th>
              <th>Thành tiền</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="orders.length === 0">
              <td colspan="5" class="empty">Chưa có đơn hàng nào.</td>
            </tr>
            <tr v-for="(order, i) in orders" :key="order.id || i">
              <td>{{ order.code || order.id }}</td>
              <td>{{ formatDate(order.createdAt) }}</td>
              <td>{{ formatMoney(order.total) }}</td>
              <td>
                <span class="status-pill" :class="statusClass(order.status)">
                  {{ mapStatus(order.status) }}
                </span>
              </td>
              <td class="update-link">Cập nhật</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import AdminSidebar from "../../components/admin/AdminSidebar.vue";
import { request } from "../../services/http";

const route = useRoute();
const router = useRouter();

const userId = route.params.id;

const user = ref({});
const orders = ref([]);

const goBack = () => {
  // về đúng trang danh sách người dùng
  router.push({ name: "AdminUserManage" });
};

const fetchUserDetail = async () => {
  try {
    // chỉnh endpoint theo backend của bạn
    const res = await request(`/users/${userId}`, { method: "GET", auth: true });
    user.value = res.data || res;
  } catch (e) {
    console.error("Lỗi lấy chi tiết user:", e);
  }
};

const fetchUserOrders = async () => {
  try {
    // ví dụ: /orders?userId=...
    const res = await request("/orders", {
      method: "GET",
      auth: true,
      params: { userId },
    });
    const list = res.data?.items || res.data || [];
    orders.value = Array.isArray(list) ? list : [];
  } catch (e) {
    console.error("Lỗi lấy đơn hàng:", e);
  }
};

onMounted(() => {
  fetchUserDetail();
  fetchUserOrders();
});

const isActive = computed(() => {
  const u = user.value;
  if (typeof u.isActive === "boolean") return u.isActive;
  if (typeof u.status === "string") {
    const s = u.status.toLowerCase();
    return s === "active" || s === "1" || s === "enabled";
  }
  if (typeof u.status === "number") return u.status === 1;
  return false;
});

const formatDate = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("vi-VN");
};

const formatMoney = (value) => {
  if (value == null) return "-";
  return Number(value).toLocaleString("vi-VN") + "đ";
};

const mapStatus = (status) => {
  if (!status) return "-";
  const s = String(status).toLowerCase();
  if (s.includes("pending")) return "Đang xử lý";
  if (s.includes("shipping") || s.includes("delivery")) return "Vận chuyển";
  if (s.includes("completed") || s.includes("success")) return "Hoàn thành";
  if (s.includes("cancel")) return "Đã hủy";
  return status;
};

const statusClass = (status) => {
  if (!status) return "";
  const s = String(status).toLowerCase();
  if (s.includes("shipping") || s.includes("delivery")) return "pill--shipping";
  if (s.includes("completed") || s.includes("success")) return "pill--done";
  if (s.includes("cancel")) return "pill--cancel";
  return "pill--pending";
};
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f5f5f7;
}

.admin-content {
  flex: 1;
  padding: 24px 32px 32px;
}

/* Tiêu đề lớn */
.page-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 12px;
}

/* Hàng back + sub title */
.sub-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
}

.back-btn {
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.sub-title {
  font-size: 15px;
  font-weight: 500;
  color: #111827;
}

/* Card chung */
.card {
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
  margin-bottom: 16px;
}

/* Card info */
.info-card {
  padding: 18px 22px 16px;
}
.info-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 14px;
}
.info-row .label {
  width: 110px;
  color: #6b7280;
}
.info-row .value {
  color: #111827;
}
.id-text {
  margin-left: 8px;
  font-size: 13px;
  color: #6b7280;
}

/* Badge trạng thái user */
.badge {
  padding: 4px 14px;
  border-radius: 999px;
  font-size: 12px;
}
.badge--active {
  background: #bbf7d0;
  color: #166534;
}
.badge--inactive {
  background: #fecaca;
  color: #b91c1c;
}

/* Orders */
.orders-card {
  padding: 14px 18px 14px;
}
.orders-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.icon-box {
  width: 20px;
  height: 20px;
  font-size: 14px;
}
.orders-title {
  font-weight: 500;
  font-size: 14px;
  color: #111827;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.table th,
.table td {
  padding: 10px 10px;
  border-bottom: 1px solid #f1f5f9;
  text-align: left;
}
.table th {
  color: #6b7280;
  font-weight: 500;
}
.empty {
  text-align: center;
  padding: 14px;
  color: #9ca3af;
}

/* Trạng thái đơn hàng */
.status-pill {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
}
.pill--shipping {
  background: #dbeafe;
  color: #1d4ed8;
}
.pill--done {
  background: #e9d5ff;
  color: #6d28d9;
}
.pill--cancel {
  background: #fee2e2;
  color: #b91c1c;
}
.pill--pending {
  background: #fef9c3;
  color: #854d0e;
}

.update-link {
  font-size: 11px;
  color: #2563eb;
  cursor: pointer;
}
.update-link:hover {
  text-decoration: underline;
}
</style>
