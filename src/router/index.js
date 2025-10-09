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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
