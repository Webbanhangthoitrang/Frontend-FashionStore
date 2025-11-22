<template>
  <div class="forgot-page">
    <!-- Background -->
    <div class="bg" :style="{ backgroundImage: `url(${bgImg})` }"></div>

    <!-- Form -->
    <div class="form-box">
      <h2 class="title">Quên mật khẩu</h2>

      <form @submit.prevent="handleSubmit">
        <div class="field">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Nhập email..."
            required
          />
        </div>

        <p class="note">Nhập email để nhận mã OTP khôi phục tài khoản</p>

        <button type="submit" class="btn-confirm">Gửi mã xác nhận</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import bgImg from "../../assets/anhnen1.jpeg";
import { forgotPassword } from "../../services/authService";


const email = ref("");
const router = useRouter();

const handleSubmit = async () => {
  await forgotPassword({ email: email.value });  // gửi đúng payload
  sessionStorage.setItem("reset_email", email.value);
  router.push({ name: "verify-code", query: { flow: "reset" } });
};



</script>

<style scoped>
/* Tổng thể */
.forgot-page {
  position: relative;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

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
  font-family: "Khula", sans-serif;
}

/* Khung form */
.form-box {
  position: relative;
  z-index: 2;
  width: 380px;
  background: #fff;
  border-radius: 16px;
  padding: 36px 36px 28px;
  box-shadow: 0 8px 36px rgba(0, 0, 0, 0.25);
  text-align: center;
}

.title {
  font-size: 30px;
  font-family: "Khula", sans-serif;
  font-weight: 700;
  color: #000;
  margin-bottom: 20px;
}

/* Input */
.field {
  display: flex;
  flex-direction: column;
  text-align: left;
  gap: 6px;
  margin-bottom: 14px;
}

label {
  font-size: 13px;
  font-weight: 600;
  color: #111827;
}

input[type="email"] {
  width: 100%;
  padding: 10px 12px;
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

.note {
  font-size: 12.5px;
  color: #6b7280;
  margin-bottom: 22px;
}

/* Nút xác nhận */
.btn-confirm {
  width: 200px;
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

.btn-confirm:hover {
  background: #003be0;
}
</style>
