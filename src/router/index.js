// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// ====== Import các trang ======
import HomeClient from '../views/client/HomeClient.vue'
import RegisterClient from '../views/client/RegisterClient.vue'
import LoginClient from '../views/client/Loginclient.vue'
import CartPage from '../views/client/CartPage.vue'
import CategoryPage from '../views/client/CategoryPage.vue'
import ProductDetail from '../views/client/ProductDetail.vue' // ✅ import tĩnh để tránh lỗi lazy load

// ====== Cấu hình routes ======
const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeClient,
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterClient,
  },
  {
    path: '/cart',
    name: 'cart',
    component: CartPage,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginClient,
  },

  // ====== Các trang khác dùng lazy import ======
  {
    path: '/notifications',
    name: 'notifications',
    component: () => import('../views/client/Notifications.vue'),
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('../views/client/ForgotPassword.vue'),
  },
  {
    path: '/verify-code',
    name: 'VerifyCode',
    component: () => import('../views/client/VerifyCode.vue'),
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('../views/client/ResetPassword.vue'),
  },

  // ====== Chi tiết sản phẩm ======
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: ProductDetail, // ✅ dùng import tĩnh đã khai báo ở trên
    props: true,
  },

  // ====== Danh mục sản phẩm ======
  {
    path: '/category/:slug?',
    name: 'Category',
    component: CategoryPage,
    props: (route) => ({
      slug: route.params.slug || null,
      page: Number(route.query.page || 1),
    }),
  },
]

// ====== Khởi tạo router ======
const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ====== Xuất router ======
export default router
