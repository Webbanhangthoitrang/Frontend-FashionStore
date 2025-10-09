<template>
  <div class="login-page">
    <!-- Ảnh nền -->
    <div class="bg" :style="{ backgroundImage: `url(${bgImg})` }"></div>

    <!-- Khung đăng nhập -->
    <div class="form-box">
      <h2 class="title">Welcome back!</h2>
      <p class="subtitle">Access using the provided account.</p>

      <form class="form" @submit.prevent="handleLogin">
        <!-- Username -->
        <div class="field">
          <label for="username">Tên đăng nhập</label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="Tên đăng nhập..."
            required
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
            Nhớ mật khẩu
          </label>

          <RouterLink to="/forgot-password" class="link">Quên mật khẩu</RouterLink>
        </div>

        <!-- Nút đăng nhập -->
        <button type="submit" class="btn-login">Đăng nhập</button>

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
import { RouterLink } from "vue-router";
import bgImg from "../../assets/anhnen1.jpeg";

const username = ref("");
const password = ref("");
const remember = ref(false);
const showPass = ref(false);

function handleLogin() {
  console.log("Login with:", username.value, password.value, remember.value);
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

.title {
  font-size: 26px;
  font-weight: 800;
  color: #000;
  margin: 0 0 6px 0;
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
