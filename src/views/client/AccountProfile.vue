<template>
  <div class="account">
    <!-- Header -->
    <ClientHeader />

    <main class="page" role="main">
      <div class="container">
        <div class="grid">
          <!-- ===== Sidebar (đã tách thành component) ===== -->
          <AccountSidebar
            :username="form.username"
            @edit="router.push('/account/profile')"
          />

          <!-- ===== Nội dung phải ===== -->
          <section class="card" aria-labelledby="profile-title">
            <div class="card__header">
              <h2 id="profile-title" class="card__title">Hồ Sơ Của Tôi</h2>
              <p class="card__desc">
                Quản lý thông tin hồ sơ để bảo mật tài khoản
              </p>
            </div>

            <div class="card__body">
              <!-- Form hồ sơ -->
              <form class="form" @submit.prevent="onSubmit">
                <p v-if="errorMessage" class="form__error">
                  {{ errorMessage }}
                </p>
                <p v-if="successMessage" class="form__success">
                  {{ successMessage }}
                </p>
                <p v-if="loading" class="form__loading">Đang tải thông tin…</p>

                <div class="form__row">
                  <label for="username" class="form__label">Tên đăng nhập</label>
                  <input
                    id="username"
                    v-model="form.username"
                    type="text"
                    class="form__input"
                    autocomplete="username"
                  />
                </div>

                <div class="form__row">
                  <label for="fullname" class="form__label">Tên</label>
                  <input
                    id="fullname"
                    v-model="form.fullname"
                    type="text"
                    class="form__input"
                  />
                </div>

                <div class="form__row">
                  <label for="email" class="form__label">Email</label>
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    class="form__input"
                    autocomplete="email"
                  />
                </div>

                <div class="form__row">
                <label for="phone" class="form__label">Số điện thoại</label>
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  class="form__input"
                  placeholder="(+84) 123 456 789"
                  inputmode="numeric"
                  @input="handlePhoneInput"
                />
              </div>


                <div class="form__row">
                  <label for="dob" class="form__label">Ngày sinh</label>
                  <input
                    id="dob"
                    v-model="form.dob"
                    type="text"
                    class="form__input"
                    placeholder="dd/mm/yyyy"
                  />
                </div>

                <div class="form__row">
                  <span class="form__label">Giới tính</span>
                  <div class="radios">
                    <label
                      class="radio"
                      :class="{ 'radio--checked': form.gender === 'male' }"
                    >
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        v-model="form.gender"
                      />
                      <span>Nam</span>
                    </label>
                    <label
                      class="radio"
                      :class="{ 'radio--checked': form.gender === 'female' }"
                    >
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        v-model="form.gender"
                      />
                      <span>Nữ</span>
                    </label>
                  </div>
                </div>

                <div class="form__actions">
                  <button type="submit" class="btn btn--primary">
                    Lưu
                  </button>
                </div>
              </form>

              <!-- Upload ảnh đại diện -->
              <div class="uploader">
                <div class="uploader__preview">
                  <img
                    v-if="avatarPreview"
                    :src="avatarPreview"
                    alt="Avatar"
                  />
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M20 21a8 8 0 0 0-16 0"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="7"
                      r="4"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                  </svg>
                </div>
                <label for="avatar" class="uploader__btn">Chọn Ảnh</label>
                <input
                  id="avatar"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  class="uploader__input"
                  @change="onFileChange"
                />
                <p class="uploader__hint">Dung lượng file tối đa 5 MB</p>
                <p class="uploader__hint">Định dạng: PNG, JPG, JPEG, WebP</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <ClientFooter />
  </div>
</template>


<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ClientHeader from '../../components/client/ClientHeaderLogged.vue'
import ClientFooter from '../../components/client/ClientFooter.vue'
import AccountSidebar from '../../components/client/AccountSidebar.vue'
import { getProfile } from '../../services/authService'
import { request } from '../../services/http'
import { useAuthStore, clearAuth, updateUser } from '../../stores/auth'

const router = useRouter()
const { state, isLoggedIn } = useAuthStore()

const form = reactive({
  username: '',
  fullname: '',
  email: '',
  phone: '',
  dob: '',
  gender: 'male',
})

const fileObj = ref(null)
const avatarPreview = ref('')

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

/* ============================================
   LOAD PROFILE – KHÔNG XÓA successMessage
============================================ */
async function loadProfile() {
  if (!isLoggedIn.value) {
    router.replace('/login')
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const profile = await getProfile()
    const user = profile?.user || state.user

    if (!user) throw new Error('Không tìm thấy thông tin người dùng')

    form.username = user.username || user.name || ''
    form.fullname = user.name || form.username
    form.email = user.email || ''

    // Backend: phoneNumber
    form.phone = user.phoneNumber || ''

    // Backend: dateOfBirth = yyyy-mm-dd
    if (user.dateOfBirth) {
      const d = new Date(user.dateOfBirth)
      const day = String(d.getDate()).padStart(2, '0')
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const year = d.getFullYear()
      form.dob = `${day}/${month}/${year}`
    } else {
      form.dob = ''
    }

    form.gender = user.gender || 'male'
    avatarPreview.value = user.avatarUrl || user.avatar || null
  } catch (error) {
    console.error('Không thể tải hồ sơ', error)
    errorMessage.value =
      error?.message || 'Không thể tải hồ sơ người dùng.'

    if (error?.status === 401) {
      clearAuth()
      router.replace('/login')
    }
  } finally {
    loading.value = false
  }
}

/*  CHỈ CHO NHẬP SỐ 0–9 CHO SĐT*/
function handlePhoneInput(e) {
  const raw = e.target.value || ''
  form.phone = raw.replace(/[^0-9]/g, '')
}

/* VALIDATE NGÀY SINH – dd/mm/yyyy */
function isValidDob(dobStr) {
  const match = dobStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!match) return false

  const day = Number(match[1])
  const month = Number(match[2])
  const year = Number(match[3])

  const d = new Date(year, month - 1, day)

  const isSameDate =
    d.getFullYear() === year &&
    d.getMonth() === month - 1 &&
    d.getDate() === day

  return isSameDate
}

/* convert dd/mm/yyyy → yyyy-mm-dd */
function dobToISO(dobStr) {
  const m = dobStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!m) return null
  return `${m[3]}-${m[2]}-${m[1]}`
}

/*SUBMIT FORM */
async function onSubmit() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!form.username || !form.email) {
    errorMessage.value = 'Vui lòng nhập đầy đủ tên đăng nhập và email.'
    return
  }

  if (form.phone && !/^[0-9]+$/.test(form.phone)) {
    errorMessage.value = 'Số điện thoại chỉ được chứa chữ số (0-9).'
    return
  }

  if (form.phone && form.phone.length !== 10) {
    errorMessage.value = 'Số điện thoại sai định dạng (phải đủ 10 số).'
    return
  }

  if (form.dob && !isValidDob(form.dob)) {
    errorMessage.value = 'Ngày sinh không hợp lệ'
    return
  }

  try {
    loading.value = true

    let res
    // Nếu có ảnh avatar thì dùng FormData, không thì dùng JSON
    if (fileObj.value) {
      const formData = new FormData()
      formData.append('avatar', fileObj.value)
      formData.append('name', form.fullname || form.username)
      formData.append('email', form.email)
      if (form.phone) formData.append('phoneNumber', form.phone)
      if (form.dob) formData.append('dateOfBirth', dobToISO(form.dob))
      formData.append('gender', form.gender)

      res = await request('/users/me', {
        method: 'PUT',
        data: formData,
      })
    } else {
      const payload = {
        name: form.fullname || form.username,
        email: form.email,
        phoneNumber: form.phone || null,
        dateOfBirth: form.dob ? dobToISO(form.dob) : null,
        gender: form.gender,
      }

      res = await request('/users/me', {
        method: 'PUT',
        data: payload,
      })
    }

    successMessage.value = res?.message || 'Lưu thông tin thành công!'

    // Reset file object sau khi upload thành công
    fileObj.value = null

    // Refresh profile data
    await loadProfile()

    // Cập nhật thông tin vào auth store để sidebar hiển thị ngay
    const updatedData = {
      name: form.fullname || form.username,
      email: form.email,
      phoneNumber: form.phone,
      dateOfBirth: form.dob ? dobToISO(form.dob) : null,
      gender: form.gender,
    }
    
    // Nếu có avatarUrl mới từ response hoặc từ preview
    if (res?.user?.avatarUrl) {
      updatedData.avatarUrl = res.user.avatarUrl
    } else if (avatarPreview.value && avatarPreview.value.startsWith('blob:')) {
      // Nếu chỉ có preview tạm thì dùng preview (trường hợp backend không trả về avatarUrl)
      updatedData.avatarUrl = avatarPreview.value
    } else if (avatarPreview.value) {
      updatedData.avatarUrl = avatarPreview.value
    }
    
    updateUser(updatedData)
  } catch (error) {
    console.error('Lỗi cập nhật hồ sơ', error)
    errorMessage.value =
      error?.message || 'Cập nhật hồ sơ thất bại. Vui lòng thử lại.'
  } finally {
    loading.value = false
  }
}

/* XỬ LÝ CHỌN AVATAR*/
function onFileChange(e) {
  const file = e.target.files?.[0]
  if (!file) return

  // Chấp nhận PNG, JPG, JPEG, WebP
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    errorMessage.value = 'Chỉ cho phép ảnh định dạng PNG, JPG, JPEG hoặc WebP'
    e.target.value = ''
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    errorMessage.value = 'Kích thước ảnh tối đa 5 MB'
    e.target.value = ''
    return
  }

  fileObj.value = file
  avatarPreview.value = URL.createObjectURL(file)
  errorMessage.value = ''
  successMessage.value = 'Ảnh đã chọn. Nhấn "Lưu" để cập nhật.'
}

onMounted(() => {
  loadProfile()
})
</script>



<style scoped>
.account {
  background: #f3f4f6;
}
.page {
  padding: 16px 0 32px;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}
.grid {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 24px;
}

/*  Card phải  */
.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04);
}
.card__header {
  padding: 18px 22px 8px;
  border-bottom: 1px solid #e5e7eb;
}
.card__title {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
}
.card__desc {
  color: #6b7280;
  font-size: 14px;
}
.card__body {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 24px;
  padding: 18px 22px 22px;
}

/*  Form  */
.form {
  max-width: 640px;
}
.form__row {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 10px;
  align-items: center;
  margin-bottom: 12px;
}
.form__label {
  color: #374151;
  font-weight: 600;
}
.form__input {
  height: 40px;
  padding: 0 12px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 14px;
  color: #111827;
}
.form__input:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}
.radios {
  display: flex;
  gap: 18px;
}
.radio {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: #374151;
}
.radio input {
  accent-color: #ef4444;
}
.radio--checked {
  color: #111827;
  font-weight: 700;
}
.form__actions {
  display: flex;
  justify-content: center;
  padding-top: 10px;
}
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 20px;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
  border: none;
}
.btn--primary {
  background: #ef4444;
  color: #fff;
}
.btn--primary:hover {
  background: #dc2626;
}
.form__error {
  background: #fee2e2;
  color: #981b1b;
  padding: 12px 14px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
}
.form__success {
  background: #dcfce7;
  color: #166534;
  padding: 12px 14px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
}
.form__loading {
  background: #eff6ff;
  color: #1d4ed8;
  padding: 10px 14px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
}

/*  Uploader  */
.uploader {
  display: grid;
  grid-auto-rows: max-content;
  justify-items: center;
  padding: 0 22px;
  border-left: 1px solid #e5e7eb;
}
.uploader__preview {
  width: 140px;
  height: 140px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #f8fafc;
  display: grid;
  place-items: center;
  color: #9ca3af;
  margin: 8px 0 14px;
  overflow: hidden;
}
.uploader__preview svg {
  width: 68px;
  height: 68px;
}
.uploader__preview img {
  width: 100%;
  height: 100%;
  border-radius: inherit;
  object-fit: cover;
}
.uploader__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 36px;
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
}
.uploader__btn:hover {
  background: #f9fafb;
}
.uploader__input {
  display: none;
}
.uploader__hint {
  margin-top: 10px;
  color: #6b7280;
  font-size: 12px;
  text-align: center;
}

</style>
