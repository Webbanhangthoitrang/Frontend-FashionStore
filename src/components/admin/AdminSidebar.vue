<!-- src/components/admin/AdminSidebar.vue -->
<template>
  <aside class="admin-sidebar">
    <!-- Top: Logo + bell -->
    <div class="top">
      <div class="logo">Fashion_Store</div>
      <button class="bell" aria-label="Thông báo">
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.433 18.6869C13.7714 15.6412 13.9406 14.1183 14.5148 12.9071C15.4364 10.9631 17.1021 9.47214 19.1361 8.77089C20.4033 8.33398 21.9355 8.33398 25 8.33398C28.0645 8.33398 29.5967 8.33398 30.8639 8.77089C32.8979 9.47214 34.5636 10.9631 35.4852 12.9071C36.0594 14.1183 36.2286 15.6412 36.567 18.6869L37.1144 23.6133C37.3064 25.3419 37.4025 26.2062 37.6784 27.0238C37.9544 27.8413 38.4018 28.587 39.2966 30.0784L41.9326 34.4717C42.7384 35.8146 43.1412 36.486 42.854 36.9933C42.5668 37.5006 41.7837 37.5006 40.2176 37.5006H9.78238C8.21627 37.5006 7.43322 37.5006 7.14599 36.9933C6.85876 36.486 7.26164 35.8146 8.06739 34.4717L10.7034 30.0784C11.5982 28.587 12.0456 27.8413 12.3216 27.0238C12.5975 26.2062 12.6936 25.3419 12.8856 23.6133L13.433 18.6869Z" stroke="#686868" stroke-width="3"/>
        <path d="M18.963 38.3456C19.3191 39.896 20.1037 41.266 21.1952 42.2432C22.2868 43.2204 23.6242 43.75 25 43.75C26.3758 43.75 27.7132 43.2204 28.8048 42.2432C29.8963 41.2661 30.6809 39.896 31.037 38.3456" stroke="#686868" stroke-width="3" stroke-linecap="round"/>
        </svg>

      </button>
    </div>

    <!-- Menu -->
    <nav class="menu">
      <!-- Hiệu suất -->
      <RouterLink to="/admin/dashboard" class="item" active-class="active">
        <span class="icon">
          <svg viewBox="0 0 24 24">
            <path d="M3 3v18h18" fill="none" stroke="currentColor" stroke-width="1.6" />
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

      <!-- Quản lý người dùng -->
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

      <!-- Quản lý sản phẩm -->
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
            <path d="M12 11v10" fill="none" stroke="currentColor" stroke-width="1.4" />
          </svg>
        </span>
        <span class="text">Quản lý sản phẩm</span>
      </RouterLink>

      <!-- Quản lý danh mục -->
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

      <!-- Quản lý đơn hàng -->
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

      <!-- Quản lý đánh giá -->
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
      <button class="more" aria-label="Tùy chọn thêm">⋮</button>
    </div>
  </aside>
</template>

<script setup>
/* Không cần logic thêm */
</script>

<style scoped>
.admin-sidebar {
  width: 230px;
  min-height: 100vh;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border-right: 1px solid #e5e7eb;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

/* Top */
.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 14px 12px;
  border-bottom: 1px solid #e5e7eb;
}
.logo {
  font-weight: 700;
  font-size: 20px;
  color: #111827;
}
.bell {
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
}
.bell svg {
  width: 20px;
  height: 20px;

}

/* Menu */
.menu {
  display: flex;
  flex-direction: column;
  padding-top: 6px;
}

/* Item */
.item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 18px;
  color: #374151;
  text-decoration: none;
  font-size: 14px;
  transition: background 0.15s ease, color 0.15s ease;
  height: 70px;
}
.item:hover {
  background: #f5f5f5;
}

.icon {
  width: 22px;
  display: flex;
  justify-content: center;
}
.icon svg {
  width: 22px;
  height: 22px;
}
.icon svg path,
.icon svg rect {
  stroke: #6b7280;
  fill: none;
}
.item .text {
  font-weight: 400;
 
}

/* Active: tím nhạt + thanh dọc bên trái giống mockup */
.active {
  background: #f3f2ff;
  color: #4f46e5;
  font-weight: 500;
}
.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background-color: #4f46e5;
  border-radius: 0 3px 3px 0;
}
.active .icon svg path,
.active .icon svg rect {
  stroke: #4f46e5;
}
.active .icon svg {
  fill: none;
}

/* User bottom */
.user {
  margin-top: auto;
  padding: 10px 14px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.avatar {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: #9ca3af;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
}
.info .name {
  font-size: 13px;
  color: #111827;
}
.more {
  margin-left: auto;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #6b7280;
  font-size: 16px;
}
</style>
