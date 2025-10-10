import { createRouter, createWebHistory } from 'vue-router'

// ✅ Import các trang chính
import HomeClient from '../views/client/HomeClient.vue'
import RegisterClient from '../views/client/RegisterClient.vue'
import LoginClient from '../views/client/LoginClient.vue'  

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeClient
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterClient
  },
  {
    path: '/login',             
    name: 'login',
    component: LoginClient
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('../views/client/ForgotPassword.vue')
  },
  {
  path: '/verify-code',
  name: 'VerifyCode',
  component: () => import('../views/client/VerifyCode.vue')
},
{
  path: '/reset-password',
  name: 'ResetPassword',
  component: () => import('../views/client/ResetPassword.vue')
},
{
  path: '/product/:id',
  name: 'ProductDetail',
  component: () => import('../views/client/ProductDetail.vue'),
  props: true, // truyền id thành prop
},
{
  path: '/account/profile',
  name: 'AccountProfile',
  component: () => import('../views/client/AccountProfile.vue')
}


]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
