<!-- src/views/admin/UserManage.vue -->
<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <AdminSidebar />

    <!-- Content -->
    <div class="admin-content">
      <main class="admin-main">
        <!-- Tiêu đề -->
        <div class="page-head">
          <h2 class="page-title">Quản lý người dùng</h2>
        </div>

        <!-- Thanh search + filter -->
        <div class="toolbar">
          <div class="search-wrap">
            <span class="search-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                  stroke="currentColor"
                  stroke-width="1.6"
                  fill="none"
                />
                <line
                  x1="16"
                  y1="16"
                  x2="21"
                  y2="21"
                  stroke="currentColor"
                  stroke-width="1.6"
                />
              </svg>
            </span>
            <input
              v-model.trim="search"
              type="text"
              class="search-input"
              placeholder="Tìm kiếm người dùng..."
            />
          </div>

          <div class="filter-wrap">
            <button type="button" class="filter-btn" @click="toggleFilter">
              <span>{{ currentStatusLabel }}</span>
              <svg viewBox="0 0 24 24" class="chevron">
                <path
                  d="M6 9l6 6 6-6"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
            <div v-if="showFilter" class="filter-dropdown">
              <div
                v-for="opt in statusOptions"
                :key="opt.value"
                class="filter-item"
                :class="{ active: status === opt.value }"
                @click="selectStatus(opt.value)"
              >
                {{ opt.label }}
              </div>
            </div>
          </div>
        </div>

        <!-- Trạng thái tải / lỗi -->
        <p v-if="loading" class="state">Đang tải danh sách người dùng…</p>
        <p v-else-if="errorMessage" class="state state--error">
          {{ errorMessage }}
        </p>

        <!-- Bảng -->
        <section v-else class="card">
          <table class="table">
            <thead>
              <tr>
                <th class="col-id">ID</th>
                <th class="col-name">Tên người dùng</th>
                <th class="col-email">Email</th>
                <th class="col-status">Trạng thái</th>
                <th class="col-date">Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredUsers.length === 0">
                <td colspan="5" class="empty">
                  Không có người dùng phù hợp.
                </td>
              </tr>

              <!-- HÀNG CÓ CLICK & HOVER -->
              <tr
                v-for="(user, index) in filteredUsers"
                :key="user.id || user.code || index"
                class="row-clickable"
                @click="goToDetail(user)"
              >
                <td>{{ user.code || user.id }}</td>
                <td>{{ user.fullName || user.name || "-" }}</td>
                <td>{{ user.email || "-" }}</td>
                <td>
                  <button
                    type="button"
                    class="badge"
                    :class="
                      isUserActive(user) ? 'badge--active' : 'badge--inactive'
                    "
                    @click.stop="onToggleStatus(user)"
                  >
                    {{ isUserActive(user) ? "Active" : "Inactive" }}
                  </button>
                </td>
                <td>{{ formatDate(user.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
} from "vue";
import { useRouter } from "vue-router";
import AdminSidebar from "../../components/admin/AdminSidebar.vue";
import { request } from "../../services/http";

/* ==========================
   STATE
========================== */
const users = ref([]);
const loading = ref(false);
const errorMessage = ref("");

const search = ref("");
const status = ref(""); // '', 'active', 'inactive'
const showFilter = ref(false);

const statusOptions = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const router = useRouter();

/* ==========================
   ĐÓNG DROPDOWN KHI CLICK RA NGOÀI
========================== */
const handleClickOutside = (e) => {
  const wrap = document.querySelector(".filter-wrap");
  if (wrap && !wrap.contains(e.target)) {
    showFilter.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  fetchUsers();
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

/* ==========================
   GỌI API LẤY DANH SÁCH USER
========================== */
const fetchUsers = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    const res = await request("/users", {
      method: "GET",
      auth: true,
    });

    console.log("📦 /users response:", res);

    let list = [];

    if (Array.isArray(res.data)) {
      list = res.data;
    } else if (Array.isArray(res.data?.items)) {
      list = res.data.items;
    } else if (Array.isArray(res.data?.users)) {
      list = res.data.users;
    } else if (Array.isArray(res.raw?.data?.items)) {
      list = res.raw.data.items;
    }

    users.value = list;
    console.log("✅ users.value:", users.value);
  } catch (err) {
    console.error("❌ Lỗi tải người dùng:", err);
    errorMessage.value =
      err.message ||
      "Không tải được danh sách người dùng. Vui lòng thử lại.";
  } finally {
    loading.value = false;
  }
};

/* ==========================
   FILTER TRẠNG THÁI
========================== */
const toggleFilter = () => {
  showFilter.value = !showFilter.value;
};

const selectStatus = (value) => {
  status.value = value;
  showFilter.value = false;
};

const currentStatusLabel = computed(() => {
  const opt = statusOptions.find((o) => o.value === status.value);
  return opt ? opt.label : "Lọc trạng thái";
});

/* ==========================
   HELPER: KIỂM TRA ACTIVE
========================== */
const isUserActive = (user) => {
  if (typeof user.isActive === "boolean") return user.isActive;

  if (typeof user.status === "string") {
    const s = user.status.toLowerCase();
    return s === "active" || s === "1" || s === "enabled";
  }

  if (typeof user.status === "number") return user.status === 1;

  return false;
};

/* ==========================
   FILTER + SEARCH
========================== */
const filteredUsers = computed(() => {
  const keyword = search.value.trim().toLowerCase();

  return users.value.filter((u) => {
    const active = isUserActive(u);

    if (status.value === "active" && !active) return false;
    if (status.value === "inactive" && active) return false;

    if (!keyword) return true;

    const name = (u.fullName || u.name || "").toLowerCase();
    const email = (u.email || "").toLowerCase();
    const code = (u.code || String(u.id || "")).toLowerCase();

    return (
      name.includes(keyword) ||
      email.includes(keyword) ||
      code.includes(keyword)
    );
  });
});

/* ==========================
   FORMAT NGÀY
========================== */
const formatDate = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("vi-VN");
};

/* ==========================
   ĐIỀU HƯỚNG SANG TRANG CHI TIẾT
========================== */
const goToDetail = (user) => {
  const id = user.id || user.code;
  if (!id) return;

  // name phải trùng route bạn khai báo trong router
  router.push({ name: "AdminUserDetail", params: { id } });
};

/* ==========================
   ĐỔI TRẠNG THÁI USER
========================== */
const onToggleStatus = async (user) => {
  try {
    const active = isUserActive(user);
    const newActive = !active;

    await request(`/users/${user.id}/toggle-status`, {
      method: "PUT",
      auth: true,
    });

    if ("isActive" in user) {
      user.isActive = newActive;
    } else if (typeof user.status === "string") {
      user.status = newActive ? "ACTIVE" : "INACTIVE";
    } else if (typeof user.status === "number") {
      user.status = newActive ? 1 : 0;
    }
  } catch (err) {
    console.error("❌ Lỗi đổi trạng thái:", err);
    alert(err.message || "Không thể đổi trạng thái người dùng.");
  }
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
  display: flex;
  flex-direction: column;
}

/* Nội dung chính */
.admin-main {
  padding: 24px 32px;
}

/* Tiêu đề */
.page-head {
  margin-bottom: 16px;
}
.page-title {
  font-size: 22px;
  font-weight: 600;
  color: #111827;
}

/* Toolbar */
.toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

/* Search */
.search-wrap {
  flex: 1;
  position: relative;
}
.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}
.search-icon svg {
  width: 18px;
  height: 18px;
}
.search-input {
  width: 100%;
  padding: 10px 12px 10px 34px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  font-size: 14px;
  outline: none;
  transition: all 0.15s ease;
}
.search-input::placeholder {
  color: #9ca3af;
}
.search-input:focus {
  background: #ffffff;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.08);
}

/* Filter */
.filter-wrap {
  position: relative;
}
.filter-btn {
  min-width: 150px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 14px;
  color: #6b7280;
  cursor: pointer;
}
.filter-btn:hover {
  background: #ffffff;
}
.chevron {
  width: 18px;
  height: 18px;
}
.filter-dropdown {
  position: absolute;
  right: 0;
  top: 110%;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
  padding: 6px 0;
  z-index: 10;
  min-width: 160px;
}
.filter-item {
  padding: 8px 12px;
  font-size: 14px;
  color: #4b5563;
  cursor: pointer;
}
.filter-item:hover {
  background: #f3f4ff;
  color: #4f46e5;
}
.filter-item.active {
  font-weight: 600;
  color: #4f46e5;
  background: #eef2ff;
}

/* Card + Table */
.card {
  background: #ffffff;
  border-radius: 18px;
  padding: 0;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
  overflow: hidden;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.table thead {
  background: #f9fafb;
}
.table th,
.table td {
  padding: 12px 18px;
  text-align: left;
  border-bottom: 1px solid #f1f5f9;
  color: #111827;
  font-weight: 400;
}
.table th {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}
.col-id {
  width: 90px;
}
.col-name {
  width: 180px;
}
.col-email {
  width: 260px;
}
.col-status {
  width: 140px;
}
.col-date {
  width: 140px;
}
.empty {
  text-align: center;
  color: #9ca3af;
  padding: 20px;
}

/* Hàng có hover + click */
.row-clickable {
  cursor: pointer;
  transition: background 0.18s ease;
}
.row-clickable:hover {
  background: #f3f4f6;
}

/* Trạng thái badge */
.badge {
  padding: 4px 14px;
  border-radius: 999px;
  font-size: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
}
.badge--active {
  background: #bbf7d0;
  color: #166534;
}
.badge--inactive {
  background: #fecaca;
  color: #b91c1c;
}
.badge:hover {
  transform: translateY(-1px);
}

/* Loading & error text */
.state {
  margin: 8px 0 12px;
  font-size: 14px;
  color: #6b7280;
}
.state--error {
  color: #b91c1c;
}
</style>
