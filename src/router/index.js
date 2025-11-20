// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// ========== CLIENT (lazy load hết) ==========
const HomeClient         = () => import('../views/client/HomeClient.vue')
const RegisterClient     = () => import('../views/client/RegisterClient.vue')
const LoginClient        = () => import('../views/client/LoginClient.vue')
const CartPage           = () => import('../views/client/CartPage.vue')
const CategoryPage       = () => import('../views/client/CategoryPage.vue')
const CheckoutPage       = () => import('../views/client/CheckoutPage.vue')
const ChangePassword     = () => import('../views/client/ChangePassword.vue')

const Notifications      = () => import('../views/client/Notifications.vue')
const ForgotPassword     = () => import('../views/client/ForgotPassword.vue')
const VerifyCode         = () => import('../views/client/VerifyCode.vue')
const ResetPassword      = () => import('../views/client/ResetPassword.vue')
const ProductDetail      = () => import('../views/client/ProductDetail.vue')
const VerifyCodeRegister = () => import('../views/client/VerifyCodeRegister.vue')

const AccountProfile     = () => import('../views/client/AccountProfile.vue')
const AccountAddress     = () => import('../views/client/AccountAddress.vue')
const AccountOrders      = () => import('../views/client/AccountOrders.vue')
const AccountOrderDetail = () => import('../views/client/AccountOrderDetail.vue')

// ========== ADMIN (lazy load) ==========
const AdminDashboard         = () => import('../views/admin/Dashboard.vue')
const AdminUserManage        = () => import('../views/admin/UserManage.vue')
const AdminUserDetail        = () => import('../views/admin/UserDetail.vue')

const AdminProductManage     = () => import('../views/admin/ProductManage.vue')
const AdminProductCreate     = () => import('../views/admin/ProductCreate.vue')
const AdminProductEdit       = () => import('../views/admin/ProductEdit.vue')

const AdminCategoryManage    = () => import('../views/admin/CategoryManage.vue')
const AdminOrderManage       = () => import('../views/admin/OrderManage.vue')
const AdminOrderUpdate       = () => import('../views/admin/OrderUpdate.vue')
const AdminOrderReturnUpdate = () => import('../views/admin/OrderReturnUpdate.vue')
const AdminReviewManage      = () => import('../views/admin/ReviewManage.vue')

// ========== ROUTES ==========
const routes = [
  // ----- CLIENT -----
  {
    path: '/',
    name: 'home',
    component: HomeClient,
  },

  {
    path: '/register',
    name: 'register',
    component: RegisterClient,
  },

  {
    path: '/login',
    name: 'login',
    component: LoginClient,
  },

  {
    path: '/cart',
    name: 'cart',
    component: CartPage,
  },

  {
    path: '/notifications',
    name: 'notifications',
    component: Notifications,
  },

  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: ForgotPassword,
  },

  {
    path: '/verify-code',
    name: 'verify-code',
    component: VerifyCode,
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

  {
    path: '/reset-password',
    name: 'reset-password',
    component: ResetPassword,
    beforeEnter: () => {
      const verified = sessionStorage.getItem('reset_verified') === '1'
      if (!verified) return { name: 'forgot-password' }
      return true
    },
  },

  {
    path: '/product/:id(\\d+)',
    name: 'ProductDetail',
    component: ProductDetail,
    props: (route) => ({
      id: Number(route.params.id),
    }),
  },

  {
    path: '/category/:slug?',
    name: 'category',
    component: CategoryPage,
    props: (route) => ({
      slug: route.params.slug || null,
      page: Number(route.query.page || 1),
    }),
  },

  {
    path: '/verify-code-register',
    name: 'verify-code-register',
    component: VerifyCodeRegister,
  },

  {
    path: '/account/profile',
    name: 'account.profile',
    component: AccountProfile,
    meta: { requiresAuth: true },
  },

  {
    path: '/account/address',
    name: 'account.address',
    component: AccountAddress,
    meta: { requiresAuth: true },
  },

  {
    path: '/account/password',
    alias: ['/account/change-password'],
    name: 'account.password',
    component: ChangePassword,
    meta: { requiresAuth: true },
  },

  {
    path: '/account/orders',
    name: 'account.orders',
    component: AccountOrders,
    meta: { requiresAuth: true },
  },

  // Chi tiết đơn hàng khách hàng
  {
    path: '/account/orders/:id(\\d+)',
    name: 'account.orders.detail',
    component: AccountOrderDetail,
    props: (route) => ({
      id: Number(route.params.id),
    }),
    meta: { requiresAuth: true },
  },

  {
    path: '/checkout',
    name: 'checkout',
    component: CheckoutPage,
    meta: { requiresAuth: true },
  },

  // ----- ADMIN -----

  // vào /admin tự redirect sang dashboard
  {
    path: '/admin',
    redirect: '/admin/dashboard',
  },

  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, isAdmin: true },
  },

  {
    path: '/admin/users',
    name: 'AdminUserManage',
    component: AdminUserManage,
    meta: { requiresAuth: true, isAdmin: true },
  },

  {
    path: '/admin/users/:id',
    name: 'AdminUserDetail',
    component: AdminUserDetail,
    props: true,
    meta: { requiresAuth: true, isAdmin: true },
  },

  {
    path: '/admin/products',
    name: 'AdminProductManage',
    component: AdminProductManage,
    meta: { requiresAuth: true, isAdmin: true },
  },

  {
    path: '/admin/products/create',
    name: 'AdminProductCreate',
    component: AdminProductCreate,
    meta: { requiresAuth: true, isAdmin: true },
  },

  {
    path: '/admin/products/:id/edit',
    name: 'AdminProductEdit',
    component: AdminProductEdit,
    props: true,
    meta: { requiresAuth: true, isAdmin: true },
  },

  {
    path: '/admin/categories',
    name: 'AdminCategoryManage',
    component: AdminCategoryManage,
    meta: { requiresAuth: true, isAdmin: true },
  },

  {
    path: '/admin/orders',
    name: 'AdminOrderManage',
    component: AdminOrderManage,
    meta: { requiresAuth: true, isAdmin: true },
  },

  {
    path: '/admin/orders/return/:id',
    name: 'AdminOrderReturnUpdate',
    component: AdminOrderReturnUpdate,
    props: true,
    meta: { requiresAuth: true, isAdmin: true },
  },

  {
    path: '/admin/orders/:id',
    name: 'admin-order-update',
    component: AdminOrderUpdate,
    props: true,
    meta: { requiresAuth: true, isAdmin: true },
  },

  {
    path: '/admin/reviews',
    name: 'AdminReviewManage',
    component: AdminReviewManage,
    meta: { requiresAuth: true, isAdmin: true },
  },
]

// ========== CREATE ROUTER ==========
const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ========== GLOBAL GUARD ==========
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('authToken')

  // Lấy thông tin user từ localStorage
  let user = null
  try {
    const rawUser = localStorage.getItem('authUser')
    if (rawUser) user = JSON.parse(rawUser)
  } catch (err) {
    console.warn('Cannot parse authUser from localStorage')
  }

  // Kiểm tra admin
  const isAdmin =
    user?.roleId === 1 || user?.role === 1 || user?.role === 'admin'

  // 1. Route cần đăng nhập mà chưa có token
  if (to.meta.requiresAuth && !token) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }

  // 2. Chặn user thường truy cập trang admin
  if (to.path.startsWith('/admin') && !isAdmin) {
    return next({ name: 'home' })
  }

  next()
})

export default router
