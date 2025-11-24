<template>
  <header class="header">
    <div class="header__container">
      <!-- Logo -->
      <div class="header__left">
        <router-link to="/" class="header__logo-link" aria-label="Trang chủ">
          <img 
            src="../../assets/logo.png" 
            alt="Logo" 
            class="header__logo" 
          />
        </router-link>
      </div>

      <!-- Khu vực user -->
      <div class="header__right">
        <!-- Nếu đã đăng nhập -->
        <nav v-if="isLoggedIn" class="header__user">
          <!-- Thông báo -->
          <router-link to="/notifications" class="header__user-link">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="header__icon"
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round"
            >
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              <path d="M21 19H3l2-2v-5a7 7 0 1 1 14 0v5l2 2z"/>
            </svg>
            <span>Thông báo</span>
          </router-link>

          <!-- Hồ sơ người dùng -->
          <router-link to="/account/profile" class="header__user-link">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="header__icon"
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round"
            >
              <path d="M20 21a8 8 0 0 0-16 0"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span>{{ username }}</span>
          </router-link>

          <!-- Đăng xuất -->
          <button 
            type="button"
            class="header__user-link header__logout"
            @click="logout"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="header__icon"
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Đăng xuất</span>
          </button>
        </nav>

        <!-- Nếu chưa đăng nhập -->
        <nav v-else class="header__auth">
          <router-link to="/register" class="header__link">
            Đăng ký
          </router-link>
          <span class="header__sep"></span>
          <router-link to="/login" class="header__link">
            Đăng nhập
          </router-link>
        </nav>

        <!-- Giỏ hàng -->
        <button class="header__cart" aria-label="Giỏ hàng" @click="goToCart">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="header__icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Menu danh mục -->
    <div class="header__menu">
      <div class="header__menu-inner">
        <ul class="menu__list">
          <li><a href="#" class="menu__link">Váy</a></li>
          <li><a href="#" class="menu__link">Áo</a></li>
          <li><a href="#" class="menu__link">Quần</a></li>
          <li><a href="#" class="menu__link">Best seller</a></li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore, clearAuth } from "../../stores/auth";

const router = useRouter();
const { state, isLoggedIn } = useAuthStore();

const username = computed(() => state.user?.name || state.user?.email || "Tài khoản");

function goToCart() {
  router.push({ path: "/cart" });
}

function logout() {
  clearAuth();
  router.push({ path: "/login" });
}
</script>

<style scoped>
.header {
  background-color: #4c80e6;
  color: #fff;
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Container chính */
.header__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  padding: 0 24px;
  max-width: 1200px;
  margin: 0 auto;
}

/* Logo */
.header__left {
  display: flex;
  align-items: center;
}
.header__logo-link {
  display: inline-flex;
}
.header__logo {
  height: 50px;
  width: auto;
  border-radius: 8px;
  object-fit: contain;
}

/* User + giỏ hàng */
.header__right {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* Khi đã đăng nhập */
.header__user {
  display: flex;
  align-items: center;
  gap: 16px;
}
.header__user-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #fff;
  font-weight: 600;
  text-decoration: none;
}
.header__user-link:hover {
  text-decoration: underline;
}
.header__logout {
  background: transparent;
  border: none;
  cursor: pointer;
}

/* Khi chưa đăng nhập */
.header__auth {
  display: flex;
  align-items: center;
  gap: 10px;
}
.header__link {
  color: #fff;
  font-weight: 600;
  text-decoration: none;
}
.header__link:hover {
  text-decoration: underline;
}
.header__sep {
  height: 18px;
  border-left: 1px solid rgba(255, 255, 255, 0.8);
}
.header__cart {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #fff;
}

/* Menu danh mục */
.header__menu {
  background-color: #4c80e6;
  padding-bottom: 10px;
}
.header__menu-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}
.menu__list {
  display: flex;
  gap: 24px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.menu__link {
  color: #fff;
  font-weight: 700;
  text-decoration: none;
}
.menu__link:hover {
  text-decoration: underline;
}


</style>
