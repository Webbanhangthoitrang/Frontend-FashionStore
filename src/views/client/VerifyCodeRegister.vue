<!-- src/views/client/VerifyCodeRegister.vue -->
<template>
  <div class="verify-page">
    <div class="form-box">
      <h2 class="title">Xác minh email</h2>

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
          Nhập mã OTP đã gửi tới <strong>{{ maskedEmail }}</strong> để xác minh tài khoản.
        </p>

        <p v-if="error" class="alert error">{{ error }}</p>
        <p v-if="success" class="alert success">{{ success }}</p>

        <div class="btn-group">
          <button type="submit" class="btn-confirm" :disabled="loading || code.length < 4">
            <span v-if="loading">Đang xử lý...</span>
            <span v-else>Xác nhận</span>
          </button>

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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { verifyRegisterOtp, resendRegisterOtp } from '../../services/authService'

const router = useRouter()

//  State 
const email = ref('')
const lastSignupPayload = ref(null)       
const code = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')
const cooldown = ref(0)// Timer đếm ngược 60s khi resend OTP
let tick = null

// Chỉ giữ chữ số & giới hạn 6 ký tự
watch(code, v => {
  code.value = (v || '').replace(/\D/g, '').slice(0, 6)
})

onMounted(() => {
  email.value = sessionStorage.getItem('signup_email') || ''
  try {
    const raw = sessionStorage.getItem('signup_payload')
    lastSignupPayload.value = raw ? JSON.parse(raw) : null
  } catch {
    lastSignupPayload.value = null
  }
  // nếu mất email chuyển về đăng kí
  if (!email.value) {
    router.replace({ name: 'register' })
  }
})

onUnmounted(() => clearInterval(tick))
// hiển thị email dạng ẩn
const maskedEmail = computed(() => {
  const [name, domain] = (email.value || '').split('@')
  if (!name || !domain) return email.value
  return name.slice(0, 2) + '***@' + domain
})
// hàm đếm ngược khitp
function startCooldown(sec = 60) {
  cooldown.value = sec
  clearInterval(tick)
  tick = setInterval(() => {
    cooldown.value -= 1
    if (cooldown.value <= 0) clearInterval(tick)
  }, 1000)
}

async function handleVerify() {
  error.value = ''
  success.value = ''
  loading.value = true
  try {
    
    const response = await verifyRegisterOtp({
      email: email.value,
      code: code.value,
    })

    // Backend trả về token và user sau khi verify thành công
    if (response?.token && response?.user) {
      // Import setAuth từ stores
      const { setAuth } = await import('../../stores/auth')
      setAuth(response.token, response.user)
    }

    // Dọn session
    sessionStorage.removeItem('signup_email')
    sessionStorage.removeItem('signup_verification_id')
    sessionStorage.removeItem('signup_payload')

    success.value = 'Đăng ký thành công! Đang chuyển hướng...'
    setTimeout(() => {
      router.replace({ name: 'login' })
    }, 800)
  } catch (e) {
    error.value = e?.message || 'Mã OTP không đúng hoặc đã hết hạn.'
  } finally {
    loading.value = false
  }
}
// gửi lại otp
async function handleResend() {
  error.value = ''
  success.value = ''
  loading.value = true
  try {
    
    let payloadForResend =
      lastSignupPayload.value && lastSignupPayload.value.email
        ? { ...lastSignupPayload.value }
        : null

    if (!payloadForResend) {
      
      throw new Error('Thiếu thông tin đăng ký để gửi lại OTP. Hãy đăng ký lại.')
    }

    
    payloadForResend.email = email.value

    await resendRegisterOtp(payloadForResend)

    success.value = 'Đã gửi lại mã. Vui lòng kiểm tra email.'
    startCooldown(60)
  } catch (e) {
    error.value = e?.message || 'Không gửi lại được mã. Thử lại sau.'
  } finally {
    loading.value = false
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
  font-size: 28px;
  font-weight: 700;
  color: #000;
  margin-bottom: 20px;
}

.field { display: flex; flex-direction: column; text-align: left; gap: 6px; margin-bottom: 14px; }
input { border: 1px solid #d1d5db; border-radius: 8px; padding: 10px 12px; font-size: 14px; }

.note { font-size: 13px; color: #6b7280; margin-bottom: 12px; text-align: left; }

.btn-group { display: flex; justify-content: center; gap: 20px; margin-top: 10px; }
.btn-confirm { width: 150px; background: #1a4bff; color: #fff; font-weight: 600; border: none; padding: 10px 0; border-radius: 8px; font-size: 15px; cursor: pointer; transition: background 0.2s; }
.btn-confirm:hover { background: #003be0; }

.alert { text-align: left; margin: 8px 0 0; padding: 8px 10px; border-radius: 8px; font-size: 13px; }
.error { background: #fee2e2; color: #991b1b; }
.success { background: #dcfce7; color: #166534; }
</style>
