<template>
  <header class="header">
    <div class="header__container">
      <!-- Logo -->
      <div class="header__left">
        <img src="../../assets/logo.png" alt="Logo" class="header__logo" />

      </div>

      <!-- Search -->
      <div class="header__center">
        <form class="header__search" @submit.prevent="onSearch">
          <input
            type="text"
            v-model="keyword"
            placeholder="Siêu nhanh siêu rẻ"
            class="header__input"
          />
          <button type="submit" class="header__search-btn" aria-label="Tìm kiếm">
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
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </form>
      </div>

      <!-- Auth + Cart -->
      <div class="header__right">
        <nav class="header__auth">
          <router-link to="/register" class="header__link">Đăng ký</router-link>
          <span class="header__sep"></span>
          <router-link to="/login" class="header__link">Đăng nhập</router-link>
        </nav>
        <button class="header__cart" aria-label="Giỏ hàng">
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

    <!-- Danh mục menu -->
    <div class="header__menu">
      <ul class="menu__list">
        <li><a href="#" class="menu__link">Váy</a></li>
        <li><a href="#" class="menu__link">Áo</a></li>
        <li><a href="#" class="menu__link">Quần</a></li>
        <li><a href="#" class="menu__link">Best seller</a></li>
      </ul>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
const keyword = ref('')

function onSearch() {
  console.log('Tìm kiếm:', keyword.value)
}
</script>

<style scoped>

/* Tổng thể header */
.header {
  background-color: #4C80E6;
  color: var(--white);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 50;
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
.header__logo {
  height: 50px;
  width: auto;
  border-radius: 8px;
  object-fit: contain;
}

/* Ô tìm kiếm */
.header__center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.header__search {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 6px;
  overflow: hidden;
  width: 100%;
  max-width: 700px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.header__input {
  flex: 1;
  padding: 10px 14px;
  border: none;
  outline: none;
  font-size: 15px;
  color: var(--text);
}

.header__input::placeholder {
  color: #a0a0a0;
}

.header__search-btn {
  border: none;
  background: none;
  padding: 10px;
  cursor: pointer;
  color: #555;
}

.header__icon {
  width: 22px;
  height: 22px;
}

/* Auth và giỏ hàng */
.header__right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header__auth {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header__link {
  color: white;
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
  color: white;
}

/* Menu danh mục */
.header__menu {
  display: flex;
  justify-content: center;
  background-color: #4C80E6;
  padding-bottom: 10px;
}

.menu__list {
  display: flex;
  gap: 24px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.menu__link {
  color: white;
  font-weight: 700;
  text-decoration: none;
}

.menu__link:hover {
  text-decoration: underline;
}
</style>
