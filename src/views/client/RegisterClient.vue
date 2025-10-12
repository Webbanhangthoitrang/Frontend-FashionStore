<template>
  <div class="register-page">
    <!-- Ảnh nền sử dụng thẻ img -->
    <img src="../../assets/anhnen1.jpeg" alt="Background" class="background-image">

    <!-- Form đăng ký -->
    <div class="register-card">
      <h2 class="title">Đăng ký</h2>

      <form class="form" @submit.prevent="handleRegister">
        <p v-if="errorMessage" class="form__error">{{ errorMessage }}</p>
        <p v-if="successMessage" class="form__success">{{ successMessage }}</p>
        <!-- Tên đăng nhập -->
        <div class="form-group">
          <label for="username">Tên đăng nhập</label>
          <input 
            id="username" 
            v-model="formData.username" 
            type="text" 
            placeholder="Tên đăng nhập..." 
            required 
          />
        </div>

        <!-- Email -->
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            id="email" 
            v-model="formData.email" 
            type="email" 
            placeholder="Email..." 
            required 
          />
        </div>

        <!-- Mật khẩu -->
        <div class="form-group">
          <label for="password">Mật khẩu</label>
          <div class="input-wrap">
            <input 
              id="password" 
              v-model="formData.password" 
              :type="showPassword ? 'text' : 'password'" 
              placeholder="Mật khẩu..." 
              required 
            />
            <button
              type="button"
              class="eye"
              @click="showPassword = !showPassword"
              :aria-label="showPassword ? 'Hide' : 'Show'"
            >
              <svg
                v-if="showPassword"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a20.3 20.3 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 5c7 0 11 7 11 7a20.3 20.3 0 0 1-4.09 4.78"
                />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Xác nhận mật khẩu -->
        <div class="form-group">
          <label for="confirmPassword">Xác nhận mật khẩu</label>
          <div class="input-wrap">
            <input 
              id="confirmPassword" 
              v-model="formData.confirmPassword" 
              :type="showConfirmPassword ? 'text' : 'password'" 
              placeholder="Xác nhận mật khẩu..." 
              required 
            />
            <button
              type="button"
              class="eye"
              @click="showConfirmPassword = !showConfirmPassword"
              :aria-label="showConfirmPassword ? 'Hide' : 'Show'"
            >
              <svg
                v-if="showConfirmPassword"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a20.3 20.3 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 5c7 0 11 7 11 7a20.3 20.3 0 0 1-4.09 4.78"
                />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Nút hành động -->
        <div class="form-actions">
          <button type="submit" class="btn-submit" :disabled="loading">
            <span v-if="loading">Đang đăng ký...</span>
            <span v-else>Đăng ký</span>
          </button>
          <button type="button" class="btn-login" @click="goToLogin">Đăng nhập</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '../../services/authService'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const { setAuth, setStatus, setError } = useAuthStore()

const formData = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

async function handleRegister() {
  errorMessage.value = ''
  successMessage.value = ''

  if (formData.password !== formData.confirmPassword) {
    errorMessage.value = 'Mật khẩu xác nhận không khớp.'
    return
  }

  loading.value = true
  setStatus('loading')
  setError(null)

  try {
    const payload = {
      name: formData.username.trim(),
      fullName: formData.username.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    }

    const response = await register(payload)
    if (!response?.token) {
      throw new Error('Không nhận được token sau khi đăng ký')
    }

    setAuth(response.token, response.user || {
      id: response.user?.id || 0,
      name: payload.name,
      email: payload.email,
      role: response.role,
    })

    setStatus('success')
    successMessage.value = 'Đăng ký thành công! Chuyển sang trang chủ...'
    setTimeout(() => {
      router.push('/')
    }, 800)
  } catch (error) {
    console.error('Đăng ký thất bại', error)
    const message = error?.message || 'Đăng ký thất bại. Vui lòng thử lại.'
    errorMessage.value = message
    setError(message)
    setStatus('error')
  } finally {
    loading.value = false
  }
}

function goToLogin() {
  router.push('/login')
}
</script>

<style scoped>
.register-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

.register-card {
  position: relative;
  z-index: 2;
  width: 90%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
}

.title {
  text-align: left;
  font-family: "Khula", sans-serif;
  margin-bottom: 30px;
  color: #333;
  font-size: 24px;
  font-weight: 600;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.input-wrap {
  position: relative;
}

input[type="text"],
input[type="password"],
input[type="email"] {
  width: 100%;
  padding: 10px 42px 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border 0.2s;
  box-sizing: border-box;
}

input:focus {
  border-color: #4f7ee6;
  box-shadow: 0 0 0 3px rgba(79, 126, 230, 0.15);
}

/* Con mắt */
.eye {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  color: #6b7280;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 25px;
}

/* Nút Đăng ký */
.btn-submit {
  padding: 10px 24px;
  background: #003be0;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

/* Nút Đăng nhập */
.btn-login {
  padding: 8px 0;
  background: none;
  color: #4a90e2;
  border: none;
  border-radius: 0;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.3s;
  text-decoration: underline;
}

.btn-login:hover {
  color: #357abd;
  background: none;
}

.btn-submit:disabled {
  background: #0f3099;
  cursor: wait;
  opacity: 0.9;
}

.form__error {
  background: #fee2e2;
  color: #991b1b;
  padding: 10px 14px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
}

.form__success {
  background: #dcfce7;
  color: #166534;
  padding: 10px 14px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
}

/* Responsive */
@media (max-width: 480px) {
  .register-card {
    padding: 20px;
  }
  
  input {
    padding: 10px 35px 10px 12px;
  }
  
  .eye {
    right: 10px;
  }
}
</style>