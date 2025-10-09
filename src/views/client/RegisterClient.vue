<template>
  <div class="register-page">
    <!-- Ảnh nền sử dụng thẻ img -->
    <img src="../../assets/anhnen1.jpeg" alt="Background" class="background-image">

    <!-- Form đăng ký -->
    <div class="register-card">
      <h2 class="title">Đăng ký</h2>

      <form class="form" @submit.prevent="handleRegister">
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
          <button type="submit" class="btn-submit">Đăng ký</button>
          <button type="button" class="btn-login" @click="goToLogin">Đăng nhập</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegisterPage',
  data() {
    return {
      formData: {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      showPassword: false,
      showConfirmPassword: false
    }
  },
  methods: {
    handleRegister() {
      // Kiểm tra mật khẩu trùng khớp
      if (this.formData.password !== this.formData.confirmPassword) {
        alert('Mật khẩu xác nhận không khớp!');
        return;
      }

      // Xử lý đăng ký
      console.log('Thông tin đăng ký:', this.formData);
      
      // Gọi API đăng ký ở đây
      // this.$api.post('/register', this.formData)
    },
    // METHOD MỚI - ĐIỀU HƯỚNG SANG TRANG ĐĂNG NHẬP
    goToLogin() {
      this.$router.push('/login');
    }
  }
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