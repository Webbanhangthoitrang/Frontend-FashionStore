<!-- src/components/admin/AdminSidebar.vue -->
<template>
  <aside class="admin-sidebar" ref="sidebarRef">
    <!-- Top: Logo + bell -->
    <div class="top">
      <div class="logo">Fashion_Store</div>

      <!-- WRAPPER BELL + PANEL -->
      <div class="notif-wrapper">
        <button
          class="bell"
          aria-label="Thông báo"
          type="button"
          @click.stop="toggleNotif"
        >
          <svg
            width="50"
            height="50"
            viewBox="0 0 50 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.433 18.6869C13.7714 15.6412 13.9406 14.1183 14.5148 12.9071C15.4364 10.9631 17.1021 9.47214 19.1361 8.77089C20.4033 8.33398 21.9355 8.33398 25 8.33398C28.0645 8.33398 29.5967 8.33398 30.8639 8.77089C32.8979 9.47214 34.5636 10.9631 35.4852 12.9071C36.0594 14.1183 36.2286 15.6412 36.567 18.6869L37.1144 23.6133C37.3064 25.3419 37.4025 26.2062 37.6784 27.0238C37.9544 27.8413 38.4018 28.587 39.2966 30.0784L41.9326 34.4717C42.7384 35.8146 43.1412 36.486 42.854 36.9933C42.5668 37.5006 41.7837 37.5006 40.2176 37.5006H9.78238C8.21627 37.5006 7.43322 37.5006 7.14599 36.9933C6.85876 36.486 7.26164 35.8146 8.06739 34.4717L10.7034 30.0784C11.5982 28.587 12.0456 27.8413 12.3216 27.0238C12.5975 26.2062 12.6936 25.3419 12.8856 23.6133L13.433 18.6869Z"
              stroke="#686868"
              stroke-width="3"
            />
            <path
              d="M18.963 38.3456C19.3191 39.896 20.1037 41.266 21.1952 42.2432C22.2868 43.2204 23.6242 43.75 25 43.75C26.3758 43.75 27.7132 43.2204 28.8048 42.2432C29.8963 41.2661 30.6809 39.896 31.037 38.3456"
              stroke="#686868"
              stroke-width="3"
              stroke-linecap="round"
            />
          </svg>

          <!-- BADGE SỐ CHƯA ĐỌC -->
          <span v-if="unreadCount > 0" class="bell-badge">
            {{ unreadCount }}
          </span>
        </button>

        <!-- PANEL THÔNG BÁO -->
        <div v-if="notifOpen" class="notif-panel" @click.stop>
          <div class="notif-header">
            <span class="notif-title">Thông báo</span>

            <!-- NÚT ĐÁNH DẤU + ĐÓNG -->
            <div class="notif-actions">
              <button
                class="notif-mark-all"
                type="button"
                @click="markAllRead"
                :disabled="markAllLoading || notifications.length === 0"
              >
                {{ markAllLoading ? 'Đang xử lý...' : 'Đánh dấu tất cả đã đọc' }}
              </button>

              <!-- NÚT X ĐÓNG PANEL -->
              <button
                class="notif-close"
                type="button"
                aria-label="Đóng"
                @click="notifOpen = false"
              >
                ✕
              </button>
            </div>
          </div>

          <div class="notif-body">
            <p v-if="notifLoading" class="notif-state">Đang tải thông báo…</p>
            <p v-else-if="notifError" class="notif-state notif-state--error">
              {{ notifError }}
            </p>
            <p
              v-else-if="notifications.length === 0"
              class="notif-state notif-empty"
            >
              Chưa có thông báo nào.
            </p>

            <ul v-else class="notif-list">
              <li
                v-for="n in notifications"
                :key="n.id"
                class="notif-item"
                :class="{ 'notif-item--unread': !n.isRead }"
                @click="handleClickNotif(n)"
              >
                <div class="notif-dot" v-if="!n.isRead"></div>
                <div class="notif-main">
                  <div class="notif-text">
                    <div class="notif-title-line">
                      <span class="notif-text-title">
                        {{ n.title || 'Thông báo' }}
                      </span>
                    </div>
                    <p class="notif-text-msg">
                      {{ n.message || n.content }}
                    </p>
                  </div>
                  <span class="notif-time">
                    {{ formatTime(n.createdAt) }}
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Menu -->
    <nav class="menu">
      <RouterLink to="/admin/dashboard" class="item" active-class="active">
        <span class="icon">
          <svg viewBox="0 0 24 24">
            <path
              d="M3 3v18h18"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
            />
            <path
              d="m6 14 4-4 4 3 4-7"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        <span class="text">Hiệu suất</span>
      </RouterLink>

      <RouterLink to="/admin/users" class="item" active-class="active">
        <span class="icon">
          <svg viewBox="0 0 24 24">
            <path
              d="M9 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm8 0a3 3 0 1 0-3-3 3 3 0 0 0 3 3Z"
              fill="none"
              stroke="currentColor"
              stroke-width="1.4"
            />
            <path
              d="M3 19a4 4 0 0 1 8 0M13 19a4 4 0 0 1 8 0"
              fill="none"
              stroke="currentColor"
              stroke-width="1.4"
              stroke-linecap="round"
            />
          </svg>
        </span>
        <span class="text">Quản lý người dùng</span>
      </RouterLink>

      <RouterLink to="/admin/products" class="item" active-class="active">
        <span class="icon">
          <svg viewBox="0 0 24 24">
            <path
              d="M4 7 12 3l8 4-8 4-8-4Z"
              fill="none"
              stroke="currentColor"
              stroke-width="1.4"
              stroke-linejoin="round"
            />
            <path
              d="M4 7v10l8 4 8-4V7"
              fill="none"
              stroke="currentColor"
              stroke-width="1.4"
              stroke-linejoin="round"
            />
            <path
              d="M12 11v10"
              fill="none"
              stroke="currentColor"
              stroke-width="1.4"
            />
          </svg>
        </span>
        <span class="text">Quản lý sản phẩm</span>
      </RouterLink>

      <RouterLink to="/admin/categories" class="item" active-class="active">
        <span class="icon">
          <svg viewBox="0 0 24 24">
            <rect x="3" y="4" width="7" height="6" rx="0.8" />
            <rect x="14" y="4" width="7" height="6" rx="0.8" />
            <rect x="3" y="14" width="7" height="6" rx="0.8" />
            <rect x="14" y="14" width="7" height="6" rx="0.8" />
          </svg>
        </span>
        <span class="text">Quản lý danh mục</span>
      </RouterLink>

      <RouterLink to="/admin/orders" class="item" active-class="active">
        <span class="icon">
          <svg viewBox="0 0 24 24">
            <path
              d="M6 8h12l-1 11H7L6 8Z"
              fill="none"
              stroke="currentColor"
              stroke-width="1.4"
              stroke-linejoin="round"
            />
            <path
              d="M9 10V7a3 3 0 0 1 6 0v3"
              fill="none"
              stroke="currentColor"
              stroke-width="1.4"
              stroke-linecap="round"
            />
          </svg>
        </span>
        <span class="text">Quản lý đơn hàng</span>
      </RouterLink>

      <RouterLink to="/admin/reviews" class="item" active-class="active">
        <span class="icon">
          <svg viewBox="0 0 24 24">
            <path d="m12 3 2.4 4.9L20 9l-3.8 3.7L17 19l-5-2.6L7 19l.8-6.3L4 9l5.6-1.1L12 3Z" />
          </svg>
        </span>
        <span class="text">Quản lý đánh giá</span>
      </RouterLink>
    </nav>

    <!-- User bottom -->
    <div class="user">
      <div class="avatar">M</div>
      <div class="info">
        <div class="name">MaiAdmin</div>
      </div>

      <!-- WRAP MORE + MENU -->
      <div class="user-menu-wrapper">
        <button
          class="more"
          aria-label="Tùy chọn thêm"
          type="button"
          @click.stop="toggleUserMenu"
        >
          ⋮
        </button>

        <!-- MENU ĐĂNG XUẤT -->
        <div v-if="userMenuOpen" class="user-menu" @click.stop>
          <button
            type="button"
            class="user-menu-item"
            @click="handleLogout"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { request } from '../../services/http'

const router = useRouter()
const sidebarRef = ref(null)

// ===== STATE THÔNG BÁO =====
const notifOpen = ref(false)
const notifLoading = ref(false)
const notifError = ref('')
const notifications = ref([])
const markAllLoading = ref(false)

// ===== STATE MENU USER (⋮) =====
const userMenuOpen = ref(false)

// SỐ CHƯA ĐỌC
const unreadCount = computed(
  () => notifications.value.filter((n) => !n.isRead).length
)

const fetchNotifications = async () => {
  notifLoading.value = true
  notifError.value = ''
  try {
    const res = await request('/notifications', { method: 'GET' })
    notifications.value =
      Array.isArray(res?.data) ? res.data : res?.data?.notifications || []
  } catch (err) {
    notifError.value = 'Không tải được thông báo.'
  } finally {
    notifLoading.value = false
  }
}

const markOneRead = async (id) => {
  try {
    await request(`/notifications/${id}/read`, { method: 'PUT' })
    const idx = notifications.value.findIndex((n) => n.id === id)
    if (idx !== -1) notifications.value[idx].isRead = true
  } catch (err) {
    console.error(err)
  }
}

const markAllRead = async () => {
  if (!notifications.value.length) return
  markAllLoading.value = true
  try {
    await request('/notifications/read-all', { method: 'PUT' })
    notifications.value = notifications.value.map((n) => ({ ...n, isRead: true }))
  } catch (err) {
    console.error(err)
  } finally {
    markAllLoading.value = false
  }
}

const toggleNotif = async () => {
  notifOpen.value = !notifOpen.value
  if (notifOpen.value && notifications.value.length === 0) {
    await fetchNotifications()
  }
}

const handleClickNotif = (notif) => {
  if (!notif.isRead) markOneRead(notif.id)
}

// ===== MENU USER (⋮) =====
const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value
}

const handleLogout = () => {
  // Xoá token trong localStorage (tên key tuỳ bạn dùng)
  localStorage.removeItem('auth_token')
  userMenuOpen.value = false
  router.push('/login')
}

// đóng khi click bên ngoài (ẩn cả notif + menu user)
const handleClickOutside = (e) => {
  if (sidebarRef.value && !sidebarRef.value.contains(e.target)) {
    notifOpen.value = false
    userMenuOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

const formatTime = (value) => {
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleString('vi-VN')
}
</script>

<style scoped>
.admin-sidebar {
  width: 230px;
  min-height: 100vh;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e5e7eb;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI';
  position: relative;
}

.top {
  display: flex;
  justify-content: space-between;
  padding: 14px;
  border-bottom: 1px solid #e5e7eb;
}

.logo {
  font-weight: 700;
  font-size: 20px;
}

.notif-wrapper {
  position: relative;
}

.bell {
  border: none;
  background: transparent;
  cursor: pointer;
  position: relative;
}
.bell svg {
  width: 20px;
  height: 20px;
}

.bell-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 16px;
  height: 16px;
  border-radius: 999px;
  background: #ef4444;
  color: #fff;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  box-shadow: 0 0 0 2px #fff;
}

.notif-panel {
  position: absolute;
  right: 0;
  top: 0;
  width: 240px;
  max-height: 420px;
  background: #ffffff;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 15px 35px rgba(15, 23, 42, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 20;
}

.notif-header {
  padding: 10px 12px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notif-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.notif-mark-all {
  border: none;
  background: transparent;
  color: #4f46e5;
  font-size: 12px;
  cursor: pointer;
}
.notif-mark-all:disabled {
  color: #9ca3af;
  cursor: default;
}

.notif-close {
  width: 20px;
  height: 20px;
  border-radius: 999px;
  border: none;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  cursor: pointer;
}
.notif-close:hover {
  background: #e5e7eb;
}

.notif-body {
  padding: 6px 0;
  overflow-y: auto;
}

.notif-state {
  padding: 10px 12px;
  font-size: 13px;
  color: #6b7280;
}
.notif-state--error {
  color: #b91c1c;
}
.notif-empty {
  text-align: center;
}

.notif-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.notif-item {
  display: flex;
  padding: 8px 12px;
  gap: 8px;
  cursor: pointer;
  transition: background 0.15s ease;
}
.notif-item:hover {
  background: #f9fafb;
}

.notif-item--unread {
  background: #eef2ff;
}

.notif-dot {
  width: 8px;
  height: 8px;
  background: #4f46e5;
  border-radius: 999px;
  margin-top: 4px;
}

.notif-main {
  flex: 1;
}

.notif-text-title {
  font-size: 13px;
  font-weight: 600;
}

.notif-text-msg {
  font-size: 12px;
  color: #4b5563;
  margin: 0;
}

.notif-time {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 2px;
}

/* Menu */
.menu {
  display: flex;
  flex-direction: column;
  padding-top: 6px;
}

.item {
  display: flex;
  gap: 12px;
  padding: 10px 18px;
  height: 70px;
  font-size: 14px;
  color: #374151;
  text-decoration: none;
  position: relative;
}
.item:hover {
  background: #f5f5f5;
}

.icon svg {
  width: 22px;
  height: 22px;
  stroke: #6b7280;
}

.active {
  background: #f3f2ff;
  color: #4f46e5;
  font-weight: 500;
}
.active::before {
  content: '';
  width: 3px;
  background: #4f46e5;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
}
.active .icon svg {
  stroke: #4f46e5;
}

/* User bottom */
.user {
  margin-top: auto;
  padding: 10px 14px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
}

.avatar {
  width: 28px;
  height: 28px;
  background: #9ca3af;
  color: #fff;
  border-radius: 999px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.info .name {
  font-size: 13px;
}

.user-menu-wrapper {
  margin-left: auto;
  position: relative;
}

.more {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 16px;
  color: #6b7280;
}

/* MENU ĐĂNG XUẤT */
.user-menu {
  position: absolute;
  right: 0;
  bottom: 110%;
  min-width: 120px;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.15);
  padding: 6px 0;
  z-index: 30;
}

.user-menu-item {
  width: 100%;
  border: none;
  background: transparent;
  text-align: left;
  padding: 8px 12px;
  font-size: 13px;
  color: #b91c1c;
  cursor: pointer;
}
.user-menu-item:hover {
  background: #fef2f2;
}
</style>
