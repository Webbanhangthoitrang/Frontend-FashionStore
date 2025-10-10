<template>
  <div class="verify-page">
    <div class="form-box">
      <h2 class="title">Quên mật khẩu</h2>

      <form @submit.prevent="handleVerify">
        <div class="field">
          <label for="code">Mã xác nhận</label>
          <input
            id="code"
            v-model="code"
            type="text"
            placeholder="Nhập mã xác nhận..."
            required
          />
        </div>

        <p class="note">Kiểm tra Email của bạn và nhập mã xác nhận</p>

        <div class="btn-group">
          <!-- Nút xác nhận -->
          <button type="submit" class="btn-confirm">Xác nhận</button>

          <!-- Nút gửi lại mã -->
          <button type="button" class="btn-confirm" @click="handleResend">
            Gửi lại mã
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const code = ref("");
const router = useRouter();

function handleVerify() {
  alert("Mã xác nhận chính xác!");
  router.push("/reset-password"); //  điều hướng sang trang đặt mật khẩu mới
}

function handleResend() {
  alert("Đã gửi lại mã xác nhận đến email của bạn!");
  router.push("/verify-code"); // quay lại trang nhập mã
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Khula:wght@400;600;700&display=swap');

.verify-page {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Khula", sans-serif;
  background: url("../../assets/anhnen1.jpeg") center/cover no-repeat;
}

.form-box {
  background: #fff;
  border-radius: 16px;
  padding: 36px;
  width: 380px;
  box-shadow: 0 8px 36px rgba(0, 0, 0, 0.25);
  text-align: center;
}

.title {
  font-size: 30px;
  font-weight: 700;
  color: #000;
  margin-bottom: 20px;
  font-family: "Khula", sans-serif;
}

.field {
  display: flex;
  flex-direction: column;
  text-align: left;
  gap: 6px;
  margin-bottom: 14px;
}

input {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
}

.note {
  font-size: 12.5px;
  color: #6b7280;
  margin-bottom: 22px;
  text-align: left;
}

.btn-group {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.btn-confirm {
  width: 150px;
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
