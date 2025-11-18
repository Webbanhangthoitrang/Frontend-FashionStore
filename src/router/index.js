import { createRouter, createWebHistory } from 'vue-router'

//  CLIENT 
import HomeClient from '../views/client/HomeClient.vue'
import RegisterClient from '../views/client/RegisterClient.vue'
import LoginClient from '../views/client/LoginClient.vue'
import CartPage from '../views/client/CartPage.vue'
import CategoryPage from '../views/client/CategoryPage.vue'
import CheckoutPage from '../views/client/CheckoutPage.vue'
import ChangePassword from '../views/client/ChangePassword.vue'

// ADMIN 
const AdminUserManage = () => import('../views/admin/UserManage.vue')
const AdminUserDetail = () => import('../views/admin/UserDetail.vue')

const AdminProductManage = () => import('../views/admin/ProductManage.vue')
const AdminProductCreate = () => import('../views/admin/ProductCreate.vue')
const AdminProductEdit = () => import('../views/admin/ProductEdit.vue')

const AdminCategoryManage = () => import('../views/admin/CategoryManage.vue')
const AdminOrderManage = () => import('../views/admin/OrderManage.vue')
const AdminOrderUpdate = () => import('../views/admin/OrderUpdate.vue')

// ROUTES 
const routes = [
  // CLIENT 

  { path: '/', name: 'home', component: HomeClient },

  { path: '/register', name: 'register', component: RegisterClient },

  { path: '/login', name: 'login', component: LoginClient },

  { path: '/cart', name: 'cart', component: CartPage },

  {
    path: '/notifications',
    name: 'notifications',
    component: () => import('../views/client/Notifications.vue'),
  },

  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('../views/client/ForgotPassword.vue'),
  },

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

  {
    path: '/product/:id(\\d+)',
    name: 'ProductDetail',
    component: () => import('../views/client/ProductDetail.vue'),
    props: (route) => ({ id: Number(route.params.id) }),
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
    component: () => import('../views/client/VerifyCodeRegister.vue'),
  },

  {
    path: '/account/profile',
    name: 'account.profile',
    component: () => import('../views/client/AccountProfile.vue'),
    meta: { requiresAuth: true },
  },

  {
    path: '/account/address',
    name: 'account.address',
    component: () => import('../views/client/AccountAddress.vue'),
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
    component: () => import('../views/client/AccountOrders.vue'),
    meta: { requiresAuth: true },
  },


  {
    path: '/checkout',
    name: 'checkout',
    component: CheckoutPage,
    meta: { requiresAuth: true },
  },

  // ADMIN 


  {
    path: '/admin/users',
    name: 'AdminUserManage',
    component: AdminUserManage,
    meta: { requiresAuth: true },
  },

  {
    path: '/admin/users/:id',
    name: 'AdminUserDetail',
    component: AdminUserDetail,
    meta: { requiresAuth: true },
    props: true,
  },

  {
    path: '/admin/products',
    name: 'AdminProductManage',
    component: AdminProductManage,
    meta: { requiresAuth: true },
  },

  {
    path: '/admin/products/create',
    name: 'AdminProductCreate',
    component: AdminProductCreate,
    meta: { requiresAuth: true },
  },

  {
    path: '/admin/products/:id/edit',
    name: 'AdminProductEdit',
    component: AdminProductEdit,
    meta: { requiresAuth: true, isAdmin: true },
    props: true,
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
  meta: { requiresAuth: true },
},
{
  path: '/admin/orders/:id',
  name: 'admin-order-update',
  component: AdminOrderUpdate,
  props: true,
},
  
]

// ====== TẠO ROUTER ======
const router = createRouter({
  history: createWebHistory(),
  routes,
})


router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('authToken');
  
  // Lấy thông tin user từ localStorage
  let user = null;
  try {
    const rawUser = localStorage.getItem('authUser');
    if (rawUser) user = JSON.parse(rawUser);
  } catch (err) {
    console.warn('Cannot parse authUser from localStorage');
  }

  // Kiểm tra xem có phải admin không
  const isAdmin = user?.roleId === 1 || user?.role === 1 || user?.role === 'admin';

  // 1. Kiểm tra authentication
  if (to.meta.requiresAuth && !token) {
    return next({ name: 'login', query: { redirect: to.fullPath } });
  }

  // 2. Kiểm tra admin access
  if (to.path.startsWith('/admin') && !isAdmin) {
    // Nếu người dùng không phải admin nhưng cố truy cập trang admin
    return next({ name: 'home' });
  }

  next();
});

export default router
