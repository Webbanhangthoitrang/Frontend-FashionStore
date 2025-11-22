<template>
  <div class="login-page">
    <!-- Ảnh nền -->
    <div class="bg" :style="{ backgroundImage: `url(${bgImg})` }"></div>

    <!-- Khung đăng nhập -->
    <div :class="['form-box', { shake: doShake }]">
      <h2 class="title">Welcome back!</h2>
      <p class="subtitle">Access using the provided account.</p>

      <form class="form" @submit.prevent="handleLogin" novalidate>
        <!-- Tên đăng nhập -->
        <div class="field" :class="{ 'has-error': errors.email }">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="text"
            placeholder="Email..."
            autocomplete="username"
            :class="{ 'input-error': errors.email }"
          />
          <p v-if="errors.email" class="field-error">{{ errors.email }}</p>
        </div>

        <!-- Mật khẩu -->
        <div class="field" :class="{ 'has-error': errors.password }">
          <label for="password">Mật khẩu</label>
          <div class="input-wrap">
            <input
              id="password"
              v-model="password"
              :type="showPass ? 'text' : 'password'"
              placeholder="Mật khẩu..."
              autocomplete="current-password"
              :class="{ 'input-error': errors.password }"
            />
            <button
              type="button"
              class="eye"
              @click="showPass = !showPass"
              :aria-label="showPass ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
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
          <p v-if="errors.password" class="field-error">{{ errors.password }}</p>
        </div>

        <!-- Nhớ mật khẩu + Quên mật khẩu -->
        <div class="actions">
          <label class="remember">
            <input type="checkbox" v-model="remember" />
            Nhớ mật khẩu
          </label>

          <!-- Link quên mật khẩu -->
          <RouterLink to="/forgot-password" class="link-forgot">
            Quên mật khẩu
          </RouterLink>
        </div>

        <!-- Nút đăng nhập -->
        <button type="submit" class="btn-login" :disabled="loading">
          <span v-if="loading">Đang đăng nhập…</span>
          <span v-else>Đăng nhập</span>
        </button>

        <!-- Link đăng ký -->
        <div class="register-wrap">
          <RouterLink to="/register" class="link-register">Đăng ký</RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";//Dùng để tạo state bên trong component.
import { useRouter, RouterLink } from "vue-router";//điều hướng sau khi đăng nhập
import bgImg from "../../assets/anhnen1.jpeg";
import { login } from "../../services/authService";//gọi api
import { useAuthStore } from "../../stores/auth";//xử lý trạng thái đăng nhập

const router = useRouter();
const { setAuth, setStatus, setError } = useAuthStore();

const email = ref("");
const password = ref("");
const remember = ref(false);//Checkbox "Ghi nhớ đăng nhập".
const showPass = ref(false);//Hiển thị/ẩn mật khẩu.
const loading = ref(false);//Disable nút đăng nhập + hiển thị spinner.
const errors = reactive({ email: "", password: "" });//Object reactive chứa lỗi của từng field để show dưới input.
const doShake = ref(false);//Trigger hiệu ứng lắc khi nhập sai.
//Hàm tạo hiệu ứng lắc
function triggerShake() {
  doShake.value = false;
  setTimeout(() => {
    doShake.value = true;
    setTimeout(() => (doShake.value = false), 450);
  }, 10);
}

async function handleLogin() {
  //Reset lỗi, bật loading
  errors.email = "";
  errors.password = "";
  loading.value = true;
  setStatus("loading");
  setError(null);
  //Bỏ khoảng trắng đầu/cuối email.
  const trimmedEmail = email.value.trim();
  const trimmedPassword = password.value;
  //Nếu thiếu email/mật khẩu show lỗi/ lắc
  try {
    if (!trimmedEmail) errors.email = "Vui lòng nhật đầy đủ thông tin";
    if (!trimmedPassword) errors.password = "Vui lòng nhật đầy đủ thông tin";
    if (errors.email || errors.password) {
      triggerShake();
      loading.value = false;
      return;
    }
    //gửi yêu cầu api đăng nhập
    const response = await login({ email: trimmedEmail, password: trimmedPassword });

    if (!response?.token) throw new Error("Email hoặc mật khẩu không chính xác");
    //Lấy userPayload
    const userPayload = response.user || {
      id: 0,
      name: trimmedEmail,
      email: trimmedEmail,
      role: response.role,
      roleId: response.user?.roleId
    };
    //Lưu token, user vào store
    setAuth(response.token, userPayload);
    if (remember.value) localStorage.setItem("authRemember", "1");
    else localStorage.removeItem("authRemember");

    // Phân biệt admin và user
    const isAdmin = response.role === 'admin' || userPayload.roleId === 1;
    
    if (isAdmin) {
      // Admin -> chuyển sang trang quản lý đơn hàng
      router.push('/admin/orders');
    } else {
      // User thường -> về trang chủ
      router.push('/');
    }
  } catch (error) {
    console.error("Đăng nhập thất bại:", error);
    const is401Error = error?.status === 401;
    const errorMsg = (error?.message || "").toLowerCase();

    if (
      is401Error ||
      errorMsg.includes("invalid") ||
      errorMsg.includes("incorrect") ||
      errorMsg.includes("không đúng") ||
      errorMsg.includes("sai")
    ) {//Nếu message chứa "email", "user", "tài khoản" thông báo lỗi
      if (errorMsg.includes("email") || errorMsg.includes("user") || errorMsg.includes("tài khoản")) {
        errors.email = "Email không hợp lệ";
        errors.password = "";
        //Nếu message chứa "password" hoặc "mật khẩu" thông báo lỗi
      } else if (errorMsg.includes("password") || errorMsg.includes("mật khẩu")) {
        errors.email = "Email hoặc mật khẩu không chính xác";
        errors.password = "Email hoặc mật khẩu không chính xác";
      } else {
        errors.email = "Email hoặc mật khẩu không chính xác";
        errors.password = "Email hoặc mật khẩu không chính xác";
      }
      setError("Thông tin đăng nhập không chính xác");
      triggerShake();
    } else {// lỗi sever, mạng
      setError(error?.message || "Đăng nhập thất bại. Vui lòng thử lại.");
      triggerShake();
    }

    setStatus("error");
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-page {
  position: relative;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Poppins", sans-serif;
  padding: 24px;
  box-sizing: border-box;
}

/* Ảnh nền */
.bg {
  position: absolute;
  inset: 0;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  filter: brightness(0.95);
  z-index: 1;
}

/* Khung đăng nhập */
.form-box {
  position: relative;
  z-index: 2;
  width: 380px;
  max-width: calc(100% - 40px);
  background: #ffffff;
  border-radius: 12px;
  padding: 28px 36px;
  box-shadow: 0 10px 40px rgba(2, 6, 23, 0.25);
  transition: transform 0.12s ease;
}

.form-box.shake {
  animation: shake 420ms ease;
}

@keyframes shake {
  0% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-6px); }
  80% { transform: translateX(6px); }
  100% { transform: translateX(0); }
}

/* Title */
.title {
  text-align: left;
  margin-bottom: 6px;
  color: #111827;
  font-size: 26px;
  font-weight: 700;
}

.subtitle {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 18px;
}

/* Input field */
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
}

label {
  font-size: 13px;
  font-weight: 600;
  color: #111827;
}

.input-wrap { position: relative; }

/* Input styles */
input[type="text"],
input[type="password"],
input[type="email"] {
  width: 100%;
  padding: 11px 40px 11px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border 0.15s, box-shadow 0.15s;
  background: #fff;
  color: #0f172a;
  box-sizing: border-box;
}

input:focus {
  border-color: #3b5bff;
  box-shadow: 0 0 0 6px rgba(59, 91, 255, 0.06);
}

/* Lỗi */
.input-error {
  border-color: #dc2626 !important;
  box-shadow: 0 0 0 6px rgba(220, 38, 38, 0.06);
}

.field.has-error input { border-color: #dc2626 !important; }

.field-error {
  color: #dc2626;
  font-size: 13px;
  font-style: italic;
  margin-top: 4px;
  line-height: 1;
}

/* Icon con mắt */
.eye {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
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

.link-forgot {
  color: #6b7280;
  text-decoration: none;
}
.link-forgot:hover { text-decoration: underline; }

/* Nút login */
.btn-login {
  width: 100%;
  background: linear-gradient(180deg, #2748ff 0%, #0820d6 100%);
  color: #fff;
  font-weight: 700;
  border: none;
  padding: 12px 0;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.08s ease, box-shadow 0.1s ease;
  box-shadow: 0 6px 18px rgba(41, 67, 255, 0.18);
}

.btn-login:hover:not(:disabled) { transform: translateY(-1px); }

.btn-login:disabled {
  cursor: wait;
  opacity: 0.75;
  transform: none;
  box-shadow: none;
}

/* Link đăng ký */
.register-wrap {
  text-align: center;
  margin-top: 12px;
}
.link-register {
  font-size: 14px;
  color: #2748ff;
  text-decoration: none;
  font-weight: 600;
}
.link-register:hover { text-decoration: underline; }
</style>
