import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 👉 Không còn PrimeVue/PrimeIcons/ToastService

const app = createApp(App)
app.use(router)
app.mount('#app')
