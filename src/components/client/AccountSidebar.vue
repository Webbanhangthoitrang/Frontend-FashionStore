<template>
  <aside class="sidebar" aria-label="Thanh điều hướng tài khoản">
    <div class="userbox">
      <div class="avatar">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 21a8 8 0 0 0-16 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="12" cy="7" r="4" fill="none" stroke="currentColor" stroke-width="2"/>
        </svg>
      </div>
      <div class="uname">{{ username }}</div>
    </div>

    <!-- Khối: Tài Khoản Của Tôi -->
    <nav class="snav">
      <p class="snav__title">Tài Khoản Của Tôi</p>
      <ul class="snav__list">
        <li>
          <router-link
            to="/account/profile"
            class="snav__link"
            :class="{ 'snav__link--active': isActive('/account/profile') }"
          >Hồ Sơ</router-link>
        </li>
        <li>
          <router-link
            to="/account/address"
            class="snav__link"
            :class="{ 'snav__link--active': isActive('/account/address') }"
          >Địa Chỉ</router-link>
        </li>
        <li>
          <router-link
            to="/account/password"
            class="snav__link"
            :class="{ 'snav__link--active': isActive('/account/password') }"
          >Đổi Mật Khẩu</router-link>
        </li>
      </ul>
    </nav>

    <!-- Khối: Đơn Mua -->
    <div class="orders">
      <router-link
        to="/account/orders"
        class="orders-link"
        :class="{ 'orders-link--active': isActive('/account/orders') }"
        aria-label="Đơn Mua"
      >
        <span class="snav__icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M25.833 8.3335C28.1738 8.3335 29.3442 8.3335 30.1849 8.89526C30.5489 9.13846 30.8614 9.45096 31.1046 9.81493C31.6663 10.6557 31.6663 11.8261 31.6663 14.1668V30.0002C31.6663 33.1429 31.6663 34.7142 30.69 35.6905C29.7137 36.6668 28.1424 36.6668 24.9997 36.6668H14.9997C11.857 36.6668 10.2856 36.6668 9.30932 35.6905C8.33301 34.7142 8.33301 33.1429 8.33301 30.0002V14.1668C8.33301 11.8261 8.33301 10.6557 8.89478 9.81493C9.13797 9.45096 9.45047 9.13846 9.81444 8.89526C10.6552 8.3335 11.8256 8.3335 14.1663 8.3335" stroke="currentColor" stroke-width="2"/>
            <path d="M15 8.33333C15 6.49238 16.4924 5 18.3333 5H21.6667C23.5076 5 25 6.49238 25 8.33333C25 10.1743 23.5076 11.6667 21.6667 11.6667H18.3333C16.4924 11.6667 15 10.1743 15 8.33333Z" stroke="currentColor" stroke-width="2"/>
            <path d="M15 20L25 20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M15 26.6665L21.6667 26.6665" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </span>
        <span>Đơn Mua</span>
      </router-link>
    </div>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'

defineProps({
  username: {
    type: String,
    default: 'Người dùng'
  }
})
defineEmits(['edit'])

const route = useRoute()
const isActive = (base) => route.path.startsWith(base)
</script>

<style scoped>
.sidebar { background:#fff; border-radius:6px; padding:16px 14px; border:1px solid #e5e7eb; }
.userbox { display:grid; grid-template-columns:56px 1fr; gap:12px; align-items:center; margin-bottom:12px; }
.avatar { width:56px; height:56px; border-radius:999px; background:#eef2ff; display:grid; place-items:center; color:#4b5563; border:1px solid #e5e7eb; }
.avatar svg { width:30px; height:30px; }
.uname { font-weight:700; color:#111827; }

.snav__title { color:#6b7280; font-weight:600; margin:8px 0; font-size:14px; }
.snav__list { list-style:none; padding:0; margin:0; }
.snav__link { display:flex; align-items:center; gap:8px; padding:8px 10px; border-radius:6px; color:#111827; text-decoration:none; font-weight:600; }
.snav__link:hover { color:#ef4444; background:#fef2f2; }
.snav__link--active { color:#ef4444; background:#fdecec; }

.orders { margin-top:10px; margin-left:-15px; }
.orders-link { display:flex; align-items:center; gap:8px; padding:8px 10px; border-radius:6px; color:#111827; text-decoration:none; font-weight:600; }
.orders-link:hover { background:#f9fafb; }
.orders-link--active { color:#ef4444; }
.snav__icon { display:inline-flex; align-items:center; justify-content:center; width:20px; height:20px; color:#4c80e6; }
</style>
