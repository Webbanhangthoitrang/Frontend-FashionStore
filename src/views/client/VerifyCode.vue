<template>
  <div class="verify-page">
    <div class="form-box">
      <h2 class="title">{{ pageTitle }}</h2>

      <form @submit.prevent="handleVerify" novalidate>
        <div class="field">
          <label for="code">Mã xác nhận</label>
          <input
            id="code"
            v-model.trim="code"
            type="text"
            inputmode="numeric"
            placeholder="Nhập mã xác nhận..."
            maxlength="6"
            required
          />
        </div>

        <p class="note">
          {{ hintText }}
        </p>

        <p v-if="error" class="alert error">{{ error }}</p>
        <p v-if="success" class="alert success">{{ success }}</p>

        <div class="btn-group">
          <!-- Nút xác nhận -->
          <button type="submit" class="btn-confirm" :disabled="loading || code.length < 4">
            <span v-if="loading">Đang xử lý...</span>
            <span v-else>Xác nhận</span>
          </button>

          <!-- Nút gửi lại mã -->
          <button
            type="button"
            class="btn-confirm"
            :disabled="loading || cooldown > 0"
            @click="handleResend"
          >
            <span v-if="cooldown > 0">Gửi lại ({{ cooldown }}s)</span>
            <span v-else>Gửi lại mã</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { verifyResetOtp, resendResetOtp } from "../../services/authService";

const router = useRouter();

const email    = ref("");
const code     = ref("");
const loading  = ref(false);
const error    = ref("");
const success  = ref("");
const cooldown = ref(0);
let tick = null;

onMounted(() => {
  // Lấy email từ bước quên mật khẩu
  email.value = sessionStorage.getItem("reset_email") || "";

  // Không có email thì quay về bước nhập email
  if (!email.value) {
    router.replace({ name: "ForgotPassword" });
  }
});

const pageTitle = computed(() => "Quên mật khẩu");

// Ẩn email
const maskedEmail = computed(() => {
  const [name, domain] = (email.value || "").split("@");
  if (!name || !domain) return email.value;
  return name.slice(0, 2) + "***@" + domain;
});

// Nội dung mô tả
const hintText = computed(
  () => `Kiểm tra ${maskedEmail.value} và nhập mã xác nhận để đặt lại mật khẩu.`
);

// Đếm ngược gửi lại OTP
function startCooldown(sec = 60) {
  cooldown.value = sec;
  clearInterval(tick);
  tick = setInterval(() => {
    cooldown.value -= 1;
    if (cooldown.value <= 0) clearInterval(tick);
  }, 1000);
}

async function handleVerify() {
  error.value = "";
  success.value = "";
  loading.value = true;

  try {
    const res = await verifyResetOtp({
      email: email.value,
      otp: code.value,
    });

    // Lấy token (nếu BE trả về) cho bước đặt lại mật khẩu
    const resetToken = res?.data?.resetToken || res?.resetToken;
    if (resetToken) sessionStorage.setItem("reset_token", resetToken);

    // Gắn cờ cho guard ResetPassword
    sessionStorage.setItem("reset_verified", "1");

    // LƯU LUÔN EMAIL + OTP ĐỂ DÙNG Ở MÀN RESET
    sessionStorage.setItem("reset_email", email.value);
    sessionStorage.setItem("reset_otp", code.value);

    success.value = "Mã hợp lệ. Vui lòng đặt mật khẩu mới.";

    setTimeout(() => {
      router.replace({
        name: "reset-password",
        query: { flow: "reset" },
      });
    }, 600);
  } catch (e) {
    error.value = e?.message || "Mã OTP không đúng hoặc đã hết hạn.";
  } finally {
    loading.value = false;
  }
}

async function handleResend() {
  error.value = "";
  success.value = "";
  loading.value = true;

  try {
    await resendResetOtp({ email: email.value });

    success.value = "Đã gửi lại mã. Vui lòng kiểm tra email.";
    startCooldown(60);
  } catch (e) {
    error.value = e?.message || "Không gửi lại được mã. Thử lại sau.";
  } finally {
    loading.value = false;
  }
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
  margin-bottom: 12px;
  text-align: left;
}

.btn-group {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 10px;
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

.alert {
  text-align: left;
  margin: 8px 0 0;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 13px;
}
.error {
  background: #fee2e2;
  color: #991b1b;
}
.success {
  background: #dcfce7;
  color: #166534;
}
</style>
