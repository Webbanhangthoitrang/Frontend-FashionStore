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

      <!-- Thanh tìm kiếm -->
      <div class="header__center">
        <form 
          class="header__search" 
          @submit.prevent="onSearch"
        >
          <input
            type="text"
            v-model="keyword"
            placeholder="Siêu nhanh siêu rẻ"
            class="header__input"
          />
          <button 
            type="submit" 
            class="header__search-btn" 
            aria-label="Tìm kiếm"
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
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </form>
      </div>

      <!-- Khu vực user -->
      <div class="header__right">
        <!-- Nếu đã đăng nhập -->
        <nav 
          v-if="isLoggedIn" 
          class="header__user"
        >
          <!-- Thông báo (mở popup, không điều hướng route) -->
          <button 
            type="button" 
            class="header__user-link" 
            @click="toggleNoti" 
            aria-haspopup="dialog"
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
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              <path d="M21 19H3l2-2v-5a7 7 0 1 1 14 0v5l2 2z"/>
            </svg>
            <span>Thông báo</span>
          </button>

          <!-- Popup thông báo -->
          <NotificationPopup 
          v-if="showNoti"
          :items="notifications"
          @close="showNoti = false"
          @markAllRead="handleMarkAllRead"   
        />


          <!-- Tên người dùng -->
          <router-link 
            to="/account/profile" 
            class="header__user-link"
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
              <path d="M20 21a8 8 0 0 0-16 0"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span>{{ username }}</span>
          </router-link>

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
        <nav 
          v-else 
          class="header__auth"
        >
          <router-link 
            to="/register" 
            class="header__link"
          >
            Đăng ký
          </router-link>

          <span class="header__sep"></span>

          <router-link 
            to="/login" 
            class="header__link"
          >
            Đăng nhập
          </router-link>
        </nav>

        <!-- Giỏ hàng -->
        <button 
          class="header__cart" 
          aria-label="Giỏ hàng"
          @click="goToCart"
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
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </button>
      </div>
    </div>

  </header>
</template>

<script setup>
import NotificationPopup from '../../components/client/NotificationPopup.vue'
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore, clearAuth } from '../../stores/auth'
import { getNotifications } from '../../services/notificationService'

const keyword = ref('')
const router = useRouter()
const route = useRoute()
const { state, isLoggedIn } = useAuthStore()
const showNoti = ref(false)
const rawNoti = ref([])

// Chuyển dữ liệu API -> đúng format cho NotificationPopup
const notifications = computed(() =>
  (rawNoti.value || []).map(n => ({
    id: n.id || n._id,
    emoji: n.emoji || '',
    title: n.title || n.heading || 'Thông báo',
    desc: n.message || n.content || '',
    time: formatTime(n.createdAt || n.time || n.created_date),
    icon: n.iconUrl || n.icon || '',
    read: !!(n.read || n.isRead),
  }))
)

function formatTime(t) {
  if (!t) return ''
  const d = new Date(t)
  const dd = String(d.getDate()).padStart(2,'0')
  const mm = String(d.getMonth()+1).padStart(2,'0')
  const yyyy = d.getFullYear()
  const hh = String(d.getHours()).padStart(2,'0')
  const mi = String(d.getMinutes()).padStart(2,'0')
  return `${dd}/${mm}/${yyyy} - ${hh}:${mi}`
}

async function fetchNotifications() {
  try {
    const res = await getNotifications()
    rawNoti.value =
      Array.isArray(res) ? res :
      Array.isArray(res?.data) ? res.data :
      Array.isArray(res?.items) ? res.items :
      Array.isArray(res?.data?.items) ? res.data.items : []
  } catch (e) {
    console.error('Không tải được thông báo', e)
    rawNoti.value = []
  }
}

const toggleNoti = async () => {
  showNoti.value = !showNoti.value
  if (showNoti.value) await fetchNotifications()
}

watch(
  () => route.query.q,
  (value) => {
    keyword.value = (value || '').toString()
  },
  { immediate: true }
)

const username = computed(() => state.user?.name || state.user?.email || 'Tài khoản')

function onSearch() {
  const q = keyword.value.trim()
  router.push({ name: 'home', query: q ? { q } : {} })
}

function goToCart() {
  router.push({ path: '/cart' })
}

function logout() {
  clearAuth()
  router.push({ path: '/login' })
}
function handleMarkAllRead() {
  
  rawNoti.value = (rawNoti.value || []).map(n => ({
    ...n,
    read: true,
    isRead: true,  
  }))

  
}

</script>

<style scoped>
.header {
  --search-max: 700px;
  background-color: #4C80E6;
  color: #fff;
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
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
.header__left { display: flex; align-items: center; }
.header__logo-link { display: inline-flex; }
.header__logo {
  height: 50px;
  width: auto;
  border-radius: 8px;
  object-fit: contain;
}

/* Search */
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
.header__icon {
  width: 22px;
  height: 22px;
}

/* Phần user + giỏ hàng */
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
.header__user-link,
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
.header__link:hover { text-decoration: underline; }
.header__sep {
  height: 18px;
  border-left: 1px solid rgba(255,255,255,0.8);
}
.header__cart {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #fff;
}


/* Responsive */
@media (max-width: 768px) {
  .header__container { gap: 12px; }
  .header__logo { height: 42px; }
  .menu__list {
    gap: 16px;
    margin-left: 0;
  }
}
</style>
