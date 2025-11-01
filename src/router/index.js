// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// ====== Import các trang ======
import HomeClient from '../views/client/HomeClient.vue'
import RegisterClient from '../views/client/RegisterClient.vue'
import LoginClient from '../views/client/Loginclient.vue'
import CartPage from '../views/client/CartPage.vue'
import CategoryPage from '../views/client/CategoryPage.vue'
import ProductDetail from '../views/client/ProductDetail.vue'
import CheckoutPage from '../views/client/CheckoutPage.vue'


// ====== Cấu hình routes ======
const routes = [
  // Trang chính
  { path: '/', name: 'Home', component: HomeClient },

  // Đăng ký
  { path: '/register', name: 'register', component: RegisterClient },

  // Đăng nhập
  { path: '/login', name: 'login', component: LoginClient },

  // Giỏ hàng
  { path: '/cart', name: 'cart', component: CartPage },

  // Thông báo
  {
    path: '/notifications',
    name: 'notifications',
    component: () => import('../views/client/Notifications.vue'),
  },

  // Quên mật khẩu → nhập email
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('../views/client/ForgotPassword.vue'),
  },

  // ✅ Màn nhập OTP (dùng chung cho cả đăng ký và quên mật khẩu)
  {
    path: '/verify-code',
    name: 'VerifyCode',
    component: () => import('../views/client/VerifyCode.vue'),
    props: (route) => ({
      flow: route.query.flow || 'signup', // truyền query flow
    }),
    beforeEnter: () => {
      // Chặn vào trực tiếp nếu không có email lưu tạm
      const email =
        sessionStorage.getItem('signup_email') ||
        sessionStorage.getItem('reset_email')
      if (!email) return { name: 'login' }
      return true
    },
  },

  // ✅ Màn đặt lại mật khẩu (sau khi verify reset OTP)
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('../views/client/ResetPassword.vue'),
    beforeEnter: () => {
      const verified = sessionStorage.getItem('reset_verified') === '1'
      if (!verified) return { name: 'ForgotPassword' }
      return true
    },
  },

  // Chi tiết sản phẩm
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: ProductDetail,
    props: true,
  },

  // Danh mục sản phẩm
  {
    path: '/category/:slug?',
    name: 'Category',
    component: CategoryPage,
    props: (route) => ({
      slug: route.params.slug || null,
      page: Number(route.query.page || 1),
    }),
  },
  // ...
{
  path: '/verify-code-register',
  name: 'VerifyCodeRegister',
  component: () => import('../views/client/VerifyCodeRegister.vue'),
},
// ...
{
  path: '/account/profile',
  name: 'account.profile',
  component: () => import('../views/client/AccountProfile.vue'),
},
// Checkout
{
  path: '/checkout',
  name: 'checkout',
  component: () => import('../views/client/CheckoutPage.vue'), // đổi path nếu bạn đặt file ở pages/
  meta: { requiresAuth: true } // tuỳ bạn, có thể bỏ
},


]

// ====== Khởi tạo router ======
const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ====== Xuất router ======
export default router
