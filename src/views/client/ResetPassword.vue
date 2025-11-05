<template>
  <div class="reset-page">
    <div class="form-box">
      <h2 class="title">Đặt mật khẩu mới</h2>

      <form @submit.prevent="handleSubmit">
        <!-- Mật khẩu -->
        <div class="field">
          <label for="password">Mật khẩu</label>
          <div class="input-wrap">
            <input
              id="password"
              :type="showPass1 ? 'text' : 'password'"
              v-model.trim="password"
              placeholder="Mật khẩu..."
              required
              minlength="8"
            />
            <!-- 👁 con mắt kiểu LoginClient -->
            <button
              type="button"
              class="eye"
              @click="showPass1 = !showPass1"
              :aria-label="showPass1 ? 'Ẩn' : 'Hiện'"
            >
              <svg v-if="showPass1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                   width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                   width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a20.3 20.3 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 5c7 0 11 7 11 7a20.3 20.3 0 0 1-4.09 4.78"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            </button>
          </div>
          <p v-if="password && password.length < 8" class="err">Mật khẩu tối thiểu 8 ký tự.</p>
        </div>

        <!-- Xác nhận mật khẩu -->
        <div class="field">
          <label for="confirm">Xác nhận mật khẩu</label>
          <div class="input-wrap">
            <input
              id="confirm"
              :type="showPass2 ? 'text' : 'password'"
              v-model.trim="confirmPassword"
              placeholder="Xác nhận mật khẩu..."
              required
              minlength="8"
            />
            <!-- 👁 con mắt y hệt -->
            <button
              type="button"
              class="eye"
              @click="showPass2 = !showPass2"
              :aria-label="showPass2 ? 'Ẩn' : 'Hiện'"
            >
              <svg v-if="showPass2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                   width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                   width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a20.3 20.3 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 5c7 0 11 7 11 7a20.3 20.3 0 0 1-4.09 4.78"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            </button>
          </div>
          <p v-if="confirmPassword && !isMatch" class="err">Mật khẩu xác nhận không khớp.</p>
        </div>

        <button :disabled="!canSubmit" type="submit" class="btn-primary">
          Cập nhật mật khẩu
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import bgImg from "../../assets/anhnen1.jpeg";

const router = useRouter();
const password = ref("");
const confirmPassword = ref("");
const showPass1 = ref(false);
const showPass2 = ref(false);

const isMatch = computed(() => confirmPassword.value === password.value);
const canSubmit = computed(() => password.value.length >= 8 && isMatch.value);

function handleSubmit() {
  // TODO: gọi API reset password
  alert("Đổi mật khẩu thành công!");
  router.push("/login");
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Khula:wght@400;600;700&display=swap');

.reset-page {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Khula", sans-serif;
  background: url("../../assets/anhnen1.jpeg") center/cover no-repeat;
}

/* Khung form */
.form-box {
  background: #fff;
  border-radius: 16px;
  padding: 36px;
  width: 320px;
  box-shadow: 0 8px 36px rgba(0,0,0,.25);
  text-align: center;
}

/* Title */
.title { 
  text-align: left;
  margin-bottom: 30px;
  color: #333;
  font-size: 30px;
  font-family: "Khula", sans-serif;
  font-weight: 600;
 }

/* Field + input */
.field { display: flex; flex-direction: column; text-align: left; gap: 6px; margin-bottom: 14px; }
.input-wrap { position: relative; }
.input-wrap input{
  width: 280px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 10px 44px 10px 12px; /* chừa chỗ nút mắt */
  font-size: 14px;
  outline: none;
  transition: border .2s;
  background: #fff;
}
.input-wrap input:focus{ border-color:#003be0; box-shadow:0 0 0 3px rgba(79,126,230,.15); }


.eye{
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  color: #6b7280;
}
.eye:hover{ background:#eaecef; border-color:#d1d5db; }

/* Lỗi */
.err{ color:#ef4444; font-size:12.5px; margin-top:4px; }

/* Nút submit */
.btn-primary{
  width: 200px; background:#1a4bff; color:#fff; font-weight:600;
  border:none; padding:10px 0; border-radius:8px; font-size:15px;
  cursor:pointer; transition:background .2s, opacity .2s; margin-top:8px;
}
.btn-primary:hover{ background:#003be0; }
.btn-primary:disabled{ opacity:.6; cursor:not-allowed; }
</style>
