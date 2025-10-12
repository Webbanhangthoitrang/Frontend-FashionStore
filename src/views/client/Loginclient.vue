<template>
  <div class="login-page">
    <!-- Ảnh nền -->
    <div class="bg" :style="{ backgroundImage: `url(${bgImg})` }"></div>

    <!-- Khung đăng nhập -->
    <div class="form-box">
      <h2 class="title">Welcome back!</h2>
      <p class="subtitle">Đăng nhập bằng tài khoản đã đăng ký.</p>

      <form class="form" @submit.prevent="handleLogin">
        <p v-if="errorMessage" class="form__error">{{ errorMessage }}</p>
        <!-- Email -->
        <div class="field">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Email..."
            required
            autocomplete="email"
          />
        </div>

        <!-- Password -->
        <div class="field">
          <label for="password">Mật khẩu</label>
          <div class="input-wrap">
            <input
              id="password"
              v-model="password"
              :type="showPass ? 'text' : 'password'"
              placeholder="Mật khẩu..."
              required
              autocomplete="current-password"
            />
            <button
              type="button"
              class="eye"
              @click="showPass = !showPass"
              :aria-label="showPass ? 'Ẩn' : 'Hiện'"
            >
              <svg
                v-if="showPass"
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

        <!-- Nhớ mật khẩu + Quên mật khẩu -->
        <div class="actions">
          <label class="remember">
            <input type="checkbox" v-model="remember" />
            Ghi nhớ đăng nhập
          </label>

          <RouterLink to="/forgot-password" class="link">Quên mật khẩu</RouterLink>
        </div>

        <!-- Nút đăng nhập -->
        <button type="submit" class="btn-login" :disabled="loading">
          <span v-if="loading">Đang đăng nhập...</span>
          <span v-else>Đăng nhập</span>
        </button>

        <!-- Đăng ký -->
        <div class="under">
          <RouterLink to="/register" class="link-strong">Đăng ký</RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import bgImg from "../../assets/anhnen1.jpeg";
import { login } from "../../services/authService";
import { useAuthStore } from "../../stores/auth";

const router = useRouter();
const { setAuth, setStatus, setError } = useAuthStore();

const email = ref("");
const password = ref("");
const remember = ref(false);
const showPass = ref(false);
const loading = ref(false);
const errorMessage = ref("");

async function handleLogin() {
  errorMessage.value = "";
  loading.value = true;
  setStatus("loading");
  setError(null);

  try {
    const payload = {
      email: email.value.trim().toLowerCase(),
      password: password.value,
    };
    const response = await login(payload);
    if (!response?.token) {
      throw new Error("Không nhận được token từ máy chủ");
    }
    const userPayload = response.user || {
      id: 0,
      name: response.role === "admin" ? "Admin" : email.value,
      email: email.value,
      role: response.role,
    };
    setAuth(response.token, userPayload);
    if (remember.value) {
      localStorage.setItem("authRemember", "1");
    } else {
      localStorage.removeItem("authRemember");
    }
    setStatus("success");
    router.push("/");
  } catch (error) {
    console.error("Đăng nhập thất bại", error);
    const message = error?.message || "Đăng nhập thất bại. Vui lòng thử lại.";
    errorMessage.value = message;
    setError(message);
    setStatus("error");
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
/* Tổng thể */
.login-page {
  position: relative;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Poppins", sans-serif;
}

/* Ảnh nền */
.bg {
  position: absolute;
  inset: 0;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  filter: brightness(0.96);
  z-index: 1;
}

/* Form đăng nhập */
.form-box {
  position: relative;
  z-index: 2;
  width: 380px;
  background: #fff;
  border-radius: 16px;
  padding: 32px 36px;
  box-shadow: 0 8px 36px rgba(0, 0, 0, 0.25);
}

.form__error {
  background: #fee2e2;
  color: #991b1b;
  padding: 10px 14px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
}

.title {
  text-align: left;
  font-family: "Khula", sans-serif;
  margin-bottom: 30px;
  color: #333;
  font-size: 24px;
  font-weight: 600;
}

.subtitle {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 24px;
}

/* Input */
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

label {
  font-size: 13px;
  font-weight: 600;
  color: #111827;
}

.input-wrap {
  position: relative;
}

input[type="text"],
input[type="password"] {
  width: 330px;
  padding: 10px 42px 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border 0.2s;
}

input:focus {
  border-color: #4f7ee6;
  box-shadow: 0 0 0 3px rgba(79, 126, 230, 0.15);
}

/* Con mắt hiển thị mật khẩu */
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

/* Nhớ mật khẩu + Quên mật khẩu */
.actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 6px 0 18px;
  font-size: 13px;
}

.remember {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #374151;
}

.link {
  color: #4f7ee6;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

/* Nút đăng nhập */
.btn-login {
  width: 100%;
  background: #1a4bff;
  color: #fff;
  font-weight: 600;
  border: none;
  padding: 10px 0;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-login:hover {
  background: #003be0;
}

.btn-login:disabled {
  cursor: wait;
  opacity: 0.8;
}

/* Link dưới cùng */
.under {
  margin-top: 12px;
  text-align: center;
}

.link-strong {
  color: #1a4bff;
  font-weight: 600;
  text-decoration: none;
}

.link-strong:hover {
  text-decoration: underline;
}
</style>
