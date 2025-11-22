<template>
  <div class="register-page">
    <!-- Ảnh nền -->
    <img src="../../assets/anhnen1.jpeg" alt="Background" class="background-image" />

    <div class="register-card">
      <h2 class="title">Đăng ký</h2>

      <form class="form" @submit.prevent="handleRegister" novalidate>
        <!-- Banner tổng -->
        <p v-if="errorMessage" class="form__error">{{ errorMessage }}</p>
        <p v-if="successMessage" class="form__success">{{ successMessage }}</p>

        <!-- Tên tài khoản -->
        <div class="form-group" :class="{ 'has-error': !!errors.username }">
          <label for="username">Tên tài khoản</label>
          <input
            id="username"
            v-model.trim="formData.username"
            type="text"
            placeholder="Tên tài khoản..."
            class="input"
            :aria-invalid="!!errors.username"
          />
          <small v-if="errors.username" class="field-error">{{ errors.username }}</small>
        </div>

        <!-- Email -->
        <div class="form-group" :class="{ 'has-error': !!errors.email }">
          <label for="email">Email</label>
          <input
            id="email"
            v-model.trim="formData.email"
            type="email"
            placeholder="Email..."
            class="input"
            :aria-invalid="!!errors.email"
          />
          <small v-if="errors.email" class="field-error">{{ errors.email }}</small>
        </div>

        <!-- Mật khẩu -->
        <div class="form-group" :class="{ 'has-error': !!errors.password }">
          <label for="password">Mật khẩu</label>
          <div class="input-wrap">
            <input
              id="password"
              v-model="formData.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Mật khẩu..."
              class="input"
              :aria-invalid="!!errors.password"
            />
            <button
              type="button"
              class="eye"
              @click="showPassword = !showPassword"
              :aria-label="showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
            >
              <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a20.3 20.3 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 5c7 0 11 7 11 7a20.3 20.3 0 0 1-4.09 4.78" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            </button>
          </div>
          <small v-if="errors.password" class="field-error">{{ errors.password }}</small>
        </div>

        <!-- Xác nhận mật khẩu -->
        <div class="form-group" :class="{ 'has-error': !!errors.confirmPassword }">
          <label for="confirmPassword">Xác nhận mật khẩu</label>
          <div class="input-wrap">
            <input
              id="confirmPassword"
              v-model="formData.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Xác nhận mật khẩu..."
              class="input"
              :aria-invalid="!!errors.confirmPassword"
            />
            <button
              type="button"
              class="eye"
              @click="showConfirmPassword = !showConfirmPassword"
              :aria-label="showConfirmPassword ? 'Ẩn xác nhận' : 'Hiện xác nhận'"
            >
              <svg v-if="showConfirmPassword" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a20.3 20.3 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 5c7 0 11 7 11 7a20.3 20.3 0 0 1-4.09 4.78" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            </button>
          </div>
          <small v-if="errors.confirmPassword" class="field-error">{{ errors.confirmPassword }}</small>
        </div>

        <!-- Nút hành động -->
        <div class="form-actions">
          <button type="submit" class="btn-submit" :disabled="loading">
            <span v-if="loading">Đang xử lý...</span>
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
import { register } from '../../services/authService'// gọi api đăng kí
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const { setStatus, setError } = useAuthStore()

/* THÔNG ĐIỆP  */
const MSG = {
  GENERIC_INPUT: 'Vui lòng nhập đầy đủ thông tin.',
  USERNAME_TAKEN: 'Tên đăng nhập đã tồn tại, vui lòng chọn tên khác.',
  USERNAME_INVALID: 'Không được chỉ chứa số hoặc ký tự đặc biệt. Vui lòng nhập ít nhất một chữ cái',
  USERNAME_LENGTH: 'Tên tài khoản phải có 4-30 ký tự',
  EMAIL_TAKEN: 'Email đã được đăng ký, vui lòng dùng Email khác hoặc Đăng nhập.',
  EMAIL_INVALID: 'Email không hợp lệ', 
  PASSWORD_POLICY: 'Mật khẩu phải có ít nhất 8 ký tự, 1 chữ cái hoa, 1 chữ số và 1 ký tự đặc biệt.',
  PASSWORD_CONFIRM: 'Mật khẩu xác nhận không khớp.',
  SYSTEM: 'Có lỗi xảy ra, vui lòng thử lại sau.'
}

/* ===== STATE ===== */
const formData = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})
const errors = reactive({
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

/*  HELPERS  */
//Xóa thông báo
function clearNotify() {
  errorMessage.value = ''
  successMessage.value = ''
}
//Gán lỗi tổng quát
function showError(msg) {
  errorMessage.value = msg
  successMessage.value = ''
  setError(msg)
  setStatus('error')
}
//Gán thành công
function showSuccess(msg) {
  successMessage.value = msg
  errorMessage.value = ''
  setError(null)
  setStatus('success')
}
//Xóa toàn bộ lỗi từng ô
function clearFieldErrors() {
  Object.keys(errors).forEach(k => (errors[k] = ''))
}

/* Kiểm tra dữ liệu trước khi gửi*/
const LETTER_REGEX = /[A-Za-zÀ-ỹ]/ //Username phải có ít nhất 1 chữ cái
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ //Email phải đúng format
const PASSWORD_POLICY = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/ //mất khẩu phải có 8 kí tự, 1 chữ hoa, 1 kí tự đặc biệt

function validateBasic() {
  clearFieldErrors()
  let valid = true
  let anyFieldInvalid = false

 
// Username
const username = formData.username.trim()
//ko được rỗng
if (!username) {
  errors.username = MSG.GENERIC_INPUT
  anyFieldInvalid = true
  valid = false
}
// phải có chữ cái
else if (!LETTER_REGEX.test(username)) {
  errors.username = MSG.USERNAME_INVALID
  anyFieldInvalid = true
  valid = false
}
//đọp dài từ 4- 40
else if (username.length < 4 || username.length > 30) {
  errors.username = 'Tên tài khoản phải có 4-30 ký tự'
  anyFieldInvalid = true
  valid = false
}

// Email
const email = formData.email.trim()

if (!email) {
  // ko rỗng
  errors.email = MSG.GENERIC_INPUT        
  anyFieldInvalid = true
  valid = false
} else if (!EMAIL_REGEX.test(email)) {
  // đúng form
  errors.email = MSG.EMAIL_INVALID
  anyFieldInvalid = true
  valid = false
}



  // Password tuân thủ password policy
if (!formData.password || !PASSWORD_POLICY.test(formData.password)) {
  errors.password = formData.password
    ? MSG.PASSWORD_POLICY           
    : MSG.GENERIC_INPUT            
  anyFieldInvalid = true
  valid = false
}


  // Confirm
  // ko rỗng, giống password
  if (!formData.confirmPassword || formData.password !== formData.confirmPassword) {
    errors.confirmPassword = formData.confirmPassword ? MSG.PASSWORD_CONFIRM : MSG.GENERIC_INPUT
    anyFieldInvalid = true
    valid = false
  }

  // Banner tổng cho case 1 (thiếu/nhập sai định dạng dữ liệu)
  if (anyFieldInvalid) showError(MSG.GENERIC_INPUT)

  return valid
}

/*MAP LỖI API 
   Ưu tiên set lỗi field đúng câu chữ đặc tả. */
function mapApiErrorToFields(err) {
  const status = err?.status
  const details = Array.isArray(err?.details) ? err.details : []
  const msg = String(err?.message || '').toLowerCase()

  // chi tiết dạng { field, message }
  for (const e of details) {
    const field = String(e?.field || '').toLowerCase()

    if (field.includes('email')) {
      errors.email = MSG.EMAIL_TAKEN
      showError(MSG.GENERIC_INPUT) // vẫn giữ banner theo mục 1
      return true
    }
    if (field.includes('username') || field.includes('user')) {
      errors.username = MSG.USERNAME_TAKEN
      showError(MSG.GENERIC_INPUT)
      return true
    }
    if (field.includes('password')) {
      errors.password = MSG.PASSWORD_POLICY
      showError(MSG.GENERIC_INPUT)
      return true
    }
    if (field.includes('confirm')) {
      errors.confirmPassword = MSG.PASSWORD_CONFIRM
      showError(MSG.GENERIC_INPUT)
      return true
    }
  }

  // bắt theo text tổng quát từ server
  if (/(email).*(exists|taken|duplicate|tồn tại|đã đăng)/.test(msg)) {
    errors.email = MSG.EMAIL_TAKEN
    showError(MSG.GENERIC_INPUT)
    return true
  }
  if (/(user(name)?).*(exists|taken|duplicate|tồn tại)/.test(msg)) {
    errors.username = MSG.USERNAME_TAKEN
    showError(MSG.GENERIC_INPUT)
    return true
  }
  if (status === 409) {
    // thường là trùng lặp
    errors.email = MSG.EMAIL_TAKEN
    showError(MSG.GENERIC_INPUT)
    return true
  }
  return false
}

/* ===== SUBMIT ===== */
async function handleRegister() {
  clearNotify()//xóa thông báo cũ
  if (!validateBasic()) return
  loading.value = true
  setStatus('loading'); setError(null)

  try {
    const payload = {
      name: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password,
      phoneNumber: '0123456789',
      dateOfBirth: '2000-01-01',
    }

    const resp = await register(payload)//gửi api đăng kí

    // Lưu thông tin để chuyển sang bước xác minh
    sessionStorage.setItem('signup_email', payload.email)
    sessionStorage.setItem('signup_payload', JSON.stringify(payload))
    const verificationId = resp?.data?.verificationId || resp?.verificationId
    if (verificationId) sessionStorage.setItem('signup_verification_id', verificationId)

    router.replace({ name: 'verify-code-register', query: { flow: 'signup' } })
  } catch (err) {
    const mapped = mapApiErrorToFields(err)
    if (!mapped) showError(MSG.SYSTEM)
  } finally {
    loading.value = false
  }
}

/* ===== NAV ===== */
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
  inset: 0;
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
.form-group { margin-bottom: 18px; }
label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}
.input-wrap { position: relative; }
.input {
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
/* Lỗi */
.form-group.has-error .input { border-color: #ef4444 !important; }
.field-error {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  line-height: 1.3;
  color: #b91c1c;
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
/* Nút hành động */
.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 25px;
}
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
.btn-submit:disabled {
  background: #0f3099;
  cursor: wait;
  opacity: 0.9;
}
.btn-login {
  padding: 8px 0;
  background: none;
  color: #4a90e2;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
}
.btn-login:hover { color: #357abd; }
/* Banner tổng */
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
  .register-card { padding: 20px; }
  .input { padding: 10px 35px 10px 12px; }
  .eye { right: 10px; }
}
</style>
