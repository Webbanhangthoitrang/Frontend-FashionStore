<template>
  <header class="header">
    <div class="header__container">
      <!-- Logo -->
      <div class="header__left">
        <router-link to="/" class="header__logo-link" aria-label="Trang chủ">
          <img src="../../assets/logo.png" alt="Logo" class="header__logo" />
        </router-link>
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
       
      </div>
    </div>

    <!-- Dòng menu danh mục -->
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
import { ref } from 'vue'
const keyword = ref('')

function onSearch() {
  console.log('Tìm kiếm:', keyword.value)
}
</script>

<style scoped>
/* ========= Biến dùng canh ô search ========= */
.header { --search-max: 700px; }

/* Tổng thể header */
.header {
  background-color: #4C80E6;
  color: #fff;
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

/* Container dòng trên (logo - search - auth/cart) */
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
.header__left { display: flex; align-items: center; }
.header__logo-link { display: inline-flex; }
.header__logo {
  height: 50px;
  width: auto;
  border-radius: 8px;
  object-fit: contain;
}

/* Ô tìm kiếm (căn giữa theo container) */
.header__center {
  flex: 1;
  display: flex;
  justify-content: center;
}
.header__search {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 6px;
  overflow: hidden;
  width: 100%;
  max-width: var(--search-max);
  border: 1px solid rgba(0,0,0,0.1);
}
.header__input {
  flex: 1;
  padding: 10px 14px;
  border: none;
  outline: none;
  font-size: 15px;
  color: #111827;
}
.header__input::placeholder { color: #a0a0a0; }
.header__search-btn {
  border: none;
  background: none;
  padding: 10px;
  cursor: pointer;
  color: #555;
}
.header__icon { width: 22px; height: 22px; }

/* Auth + Cart */
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
  color: #fff;
  font-weight: 600;
  text-decoration: none;
}
.header__link:hover { text-decoration: underline; }
.header__sep {
  height: 18px;
  border-left: 1px solid rgba(255,255,255,0.8);
}


/* ========= Dòng menu dưới ========= */
.header__menu {
  background-color: #4C80E6;
  padding-bottom: 10px;
}
.header__menu-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Danh mục: căn TRÁI và thẳng mép trái với ô search bên trên */
.menu__list {
  display: flex;
  gap: 24px;
  list-style: none;
  margin: 0;
  padding: 0;

  /* ⭐ Mấu chốt: đẩy list để mép trái trùng với mép trái ô search (ô search max 700px, căn giữa) */
  margin-left: 170px;
}
.menu__link {
  color: #fff;
  font-weight: 700;
  text-decoration: none;
}
.menu__link:hover { text-decoration: underline; }

/* ========= Responsive nhỏ hơn 768px ========= */
@media (max-width: 768px) {
  .header__container { gap: 12px; }
  .header__logo { height: 42px; }
  .menu__list {
    gap: 16px;
    /* Khi màn hình nhỏ hơn --search-max, min(100%, --search-max) = 100% => margin-left = 0, tự căn trái */
    margin-left: 0;
  }
}
</style>
