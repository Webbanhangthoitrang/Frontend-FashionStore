// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// ====== CLIENT ======
import HomeClient from '../views/client/HomeClient.vue'
import RegisterClient from '../views/client/RegisterClient.vue'
import LoginClient from '../views/client/LoginClient.vue'
import CartPage from '../views/client/CartPage.vue'
import CategoryPage from '../views/client/CategoryPage.vue'
import CheckoutPage from '../views/client/CheckoutPage.vue'
import ChangePassword from '../views/client/ChangePassword.vue'

// ====== ADMIN (lazy load) ======
const AdminUserManage = () => import('../views/admin/UserManage.vue')
const AdminProductManage = () => import('../views/admin/ProductManage.vue')
const UserDetail = () => import('../views/admin/UserDetail.vue')
// const AdminProductCreate = () => import('../views/admin/ProductCreate.vue')
// const AdminProductEdit = () => import('../views/admin/ProductEdit.vue')

// ====== ROUTES ======
const routes = [
  // 🏠 Trang chủ
  { path: '/', name: 'home', component: HomeClient },

  // 👤 Đăng ký
  { path: '/register', name: 'register', component: RegisterClient },

  // 🔐 Đăng nhập
  { path: '/login', name: 'login', component: LoginClient },

  // 🛒 Giỏ hàng
  { path: '/cart', name: 'cart', component: CartPage },

  // 🔔 Thông báo
  {
    path: '/notifications',
    name: 'notifications',
    component: () => import('../views/client/Notifications.vue'),
  },

  // 🔑 Quên mật khẩu
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('../views/client/ForgotPassword.vue'),
  },

  // 🔢 Mã OTP (dùng cho đăng ký / quên mật khẩu)
  {
    path: '/verify-code',
    name: 'verify-code',
    component: () => import('../views/client/VerifyCode.vue'),
    props: (route) => ({
      flow: route.query.flow || 'signup',
    }),
    beforeEnter: () => {
      const email =
        sessionStorage.getItem('signup_email') ||
        sessionStorage.getItem('reset_email')
      if (!email) return { name: 'login' }
      return true
    },
  },

  // 🔄 Đặt lại mật khẩu
  {
    path: '/reset-password',
    name: 'reset-password',
    component: () => import('../views/client/ResetPassword.vue'),
    beforeEnter: () => {
      const verified = sessionStorage.getItem('reset_verified') === '1'
      if (!verified) return { name: 'forgot-password' }
      return true
    },
  },

  // 🛍 Chi tiết sản phẩm
  {
    path: '/product/:id(\\d+)',
    name: 'ProductDetail',
    component: () => import('../views/client/ProductDetail.vue'),
    props: (route) => ({ id: Number(route.params.id) }),
  },

  // 📂 Danh mục sản phẩm
  {
    path: '/category/:slug?',
    name: 'category',
    component: CategoryPage,
    props: (route) => ({
      slug: route.params.slug || null,
      page: Number(route.query.page || 1),
    }),
  },

  // ✅ Xác thực OTP đăng ký
  {
    path: '/verify-code-register',
    name: 'verify-code-register',
    component: () => import('../views/client/VerifyCodeRegister.vue'),
  },

  // 👤 Hồ sơ người dùng
  {
    path: '/account/profile',
    name: 'account.profile',
    component: () => import('../views/client/AccountProfile.vue'),
    meta: { requiresAuth: true },
  },

  // 📍 Địa chỉ giao hàng
  {
    path: '/account/address',
    name: 'account.address',
    component: () => import('../views/client/AccountAddress.vue'),
    meta: { requiresAuth: true },
  },

  // 🔐 Đổi mật khẩu
  {
    path: '/account/password',
    alias: ['/account/change-password'],
    name: 'account.password',
    component: ChangePassword,
    meta: { requiresAuth: true },
  },

  // 🧾 Đơn mua
  {
    path: '/account/orders',
    name: 'account.orders',
    component: () => import('../views/client/AccountOrders.vue'),
    meta: { requiresAuth: true },
  },

  // 💳 Thanh toán
  {
    path: '/checkout',
    name: 'checkout',
    component: CheckoutPage,
    meta: { requiresAuth: true },
  },

  // ====== ADMIN ======

  // 👥 Quản lý người dùng
  {
    path: '/admin/users',
    name: 'AdminUserManage',
    component: AdminUserManage,
    meta: { requiresAuth: true }, // tùy bạn thêm kiểm tra admin
  },

  // 🛍 Quản lý sản phẩm (màn giống design bạn gửi)
  {
    path: '/admin/products',
    name: 'AdminProductManage',
    component: AdminProductManage,
    meta: { requiresAuth: true },
  },

  // ➕ Tạo sản phẩm
// {
//   path: '/admin/products/create',
//   name: 'AdminProductCreate',
//   component: AdminProductCreate,
//   meta: { requiresAuth: true },
// },

// ✏️ Sửa sản phẩm
// {
//   path: '/admin/products/:id/edit',
//   name: 'AdminProductEdit',
//   component: AdminProductEdit,
//   meta: { requiresAuth: true },
//   props: true,
// },

  {
  path: '/admin/users/:id',
  name: 'AdminUserDetail',
  component: UserDetail,
  meta: { requiresAuth: true },
  props: true,
},

]

// ====== TẠO ROUTER ======
const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ====== CHECK LOGIN CƠ BẢN ======
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('authToken')
  if (to.meta.requiresAuth && !token) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
