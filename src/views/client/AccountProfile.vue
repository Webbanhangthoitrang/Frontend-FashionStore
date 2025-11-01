<template>
  <div class="account">
    <!-- Header -->
    <ClientHeader />

    <main class="page" role="main">
      <div class="container">
        <div class="grid">
          <!-- ===== Sidebar trái ===== -->
          <aside class="sidebar" aria-label="Thanh điều hướng tài khoản">
            <div class="userbox">
              <div class="avatar">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20 21a8 8 0 0 0-16 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="12" cy="7" r="4" fill="none" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <div class="uname">{{ form.username }}</div>
              <button class="edit-link" type="button">✎ Sửa Hồ Sơ</button>
            </div>

            <!-- Khối: Tài Khoản Của Tôi -->
            <nav class="snav">
              <p class="snav__title">Tài Khoản Của Tôi</p>
              <ul class="snav__list">
                <li>
                  <router-link
                    to="/account/profile"
                    class="snav__link"
                    :class="{ 'snav__link--active': isActive('/account/profile') }"
                  >Hồ Sơ</router-link>
                </li>
                <li>
                  <router-link
                    to="/account/address"
                    class="snav__link"
                    :class="{ 'snav__link--active': isActive('/account/address') }"
                  >Địa Chỉ</router-link>
                </li>
                <li>
                  <router-link
                    to="/account/password"
                    class="snav__link"
                    :class="{ 'snav__link--active': isActive('/account/password') }"
                  >Đổi Mật Khẩu</router-link>
                </li>
              </ul>
            </nav>

            <!-- ✅ Khối: Đơn Mua (cùng cấp với Tài Khoản Của Tôi) -->
            <div class="orders">
              <router-link
                to="/account/orders"
                class="orders-link"
                :class="{ 'orders-link--active': isActive('/account/orders') }"
                aria-label="Đơn Mua"
              >
                <span class="snav__icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M25.833 8.3335C28.1738 8.3335 29.3442 8.3335 30.1849 8.89526C30.5489 9.13846 30.8614 9.45096 31.1046 9.81493C31.6663 10.6557 31.6663 11.8261 31.6663 14.1668V30.0002C31.6663 33.1429 31.6663 34.7142 30.69 35.6905C29.7137 36.6668 28.1424 36.6668 24.9997 36.6668H14.9997C11.857 36.6668 10.2856 36.6668 9.30932 35.6905C8.33301 34.7142 8.33301 33.1429 8.33301 30.0002V14.1668C8.33301 11.8261 8.33301 10.6557 8.89478 9.81493C9.13797 9.45096 9.45047 9.13846 9.81444 8.89526C10.6552 8.3335 11.8256 8.3335 14.1663 8.3335" stroke="currentColor" stroke-width="2"/>
                    <path d="M15 8.33333C15 6.49238 16.4924 5 18.3333 5H21.6667C23.5076 5 25 6.49238 25 8.33333C25 10.1743 23.5076 11.6667 21.6667 11.6667H18.3333C16.4924 11.6667 15 10.1743 15 8.33333Z" stroke="currentColor" stroke-width="2"/>
                    <path d="M15 20L25 20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M15 26.6665L21.6667 26.6665" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </span>
                <span>Đơn Mua</span>
              </router-link>
            </div>
          </aside>

          <!-- ===== Nội dung phải ===== -->
          <section class="card" aria-labelledby="profile-title">
            <div class="card__header">
              <h2 id="profile-title" class="card__title">Hồ Sơ Của Tôi</h2>
              <p class="card__desc">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
            </div>

            <div class="card__body">
              <!-- Form hồ sơ -->
              <form class="form" @submit.prevent="onSubmit">
                <p v-if="errorMessage" class="form__error">{{ errorMessage }}</p>
                <p v-if="successMessage" class="form__success">{{ successMessage }}</p>
                <p v-if="loading" class="form__loading">Đang tải thông tin…</p>

                <div class="form__row">
                  <label for="username" class="form__label">Tên đăng nhập</label>
                  <input id="username" v-model="form.username" type="text" class="form__input" />
                </div>

                <div class="form__row">
                  <label for="fullname" class="form__label">Tên</label>
                  <input id="fullname" v-model="form.fullname" type="text" class="form__input" />
                </div>

                <div class="form__row">
                  <label for="email" class="form__label">Email</label>
                  <input id="email" v-model="form.email" type="email" class="form__input" />
                </div>

                <div class="form__row">
                  <label for="phone" class="form__label">Số điện thoại</label>
                  <input id="phone" v-model="form.phone" type="tel" class="form__input" placeholder="(+84) 123 456 789" />
                </div>

                <div class="form__row">
                  <label for="dob" class="form__label">Ngày sinh</label>
                  <input id="dob" v-model="form.dob" type="text" class="form__input" placeholder="dd/mm/yyyy" />
                </div>

                <div class="form__row">
                  <span class="form__label">Giới tính</span>
                  <div class="radios">
                    <label class="radio" :class="{ 'radio--checked': form.gender === 'male' }">
                      <input type="radio" name="gender" value="male" v-model="form.gender" />
                      <span>Nam</span>
                    </label>
                    <label class="radio" :class="{ 'radio--checked': form.gender === 'female' }">
                      <input type="radio" name="gender" value="female" v-model="form.gender" />
                      <span>Nữ</span>
                    </label>
                  </div>
                </div>

                <div class="form__actions">
                  <button type="submit" class="btn btn--primary">Lưu</button>
                </div>
              </form>

              <!-- Upload ảnh đại diện -->
              <div class="uploader">
                <div class="uploader__preview">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M20 21a8 8 0 0 0-16 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="12" cy="7" r="4" fill="none" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
                <label for="avatar" class="uploader__btn">Chọn Ảnh</label>
                <input id="avatar" type="file" accept=".png" class="uploader__input" @change="onFileChange" />
                <p class="uploader__hint">Dung lượng file tối đa 1 MB</p>
                <p class="uploader__hint">Định dạng: .PNG</p>
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
import { useRouter, useRoute } from 'vue-router'
import ClientHeader from '../../components/client/ClientHeaderLogged.vue'
import ClientFooter from '../../components/client/ClientFooter.vue'
import { getProfile } from '../../services/authService'
import { useAuthStore, clearAuth } from '../../stores/auth'

const router = useRouter()
const route = useRoute()
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
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const isActive = (base) => route.path.startsWith(base)

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
    form.username = user.name || ''
    form.fullname = user.name || ''
    form.email = user.email || ''
    form.phone = user.phone || ''
    form.gender = user.gender || form.gender || 'male'
    form.dob = user.dob || ''
  } catch (error) {
    console.error('Không thể tải hồ sơ', error)
    errorMessage.value = error?.message || 'Không thể tải hồ sơ người dùng.'
    if (error?.status === 401) {
      clearAuth()
      router.replace('/login')
    }
  } finally {
    loading.value = false
  }
}

function onSubmit() {
  if (!form.username || !form.email) {
    errorMessage.value = 'Vui lòng nhập đầy đủ tên đăng nhập và email.'
    return
  }
  successMessage.value = 'Thông tin được lưu (demo - cần API cập nhật hồ sơ).'
  errorMessage.value = ''
}

function onFileChange(e) {
  const file = e.target.files?.[0]
  if (!file) return
  if (file.type !== 'image/png') {
    alert('Chỉ cho phép ảnh .PNG')
    e.target.value = ''
    return
  }
  if (file.size > 1024 * 1024) {
    alert('Kích thước ảnh tối đa 1 MB')
    e.target.value = ''
    return
  }
  fileObj.value = file
  alert('Ảnh đã chọn (demo).')
}

onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
.account { background:#f3f4f6; }
.page { padding:16px 0 32px; }
.container { max-width:1200px; margin:0 auto; padding:0 24px; }
.grid { display:grid; grid-template-columns:260px 1fr; gap:24px; }

/* ===== Sidebar ===== */
.sidebar { background:#fff; border-radius:6px; padding:16px 14px; border:1px solid #e5e7eb; }
.userbox { display:grid; grid-template-columns:56px 1fr; gap:12px; align-items:center; margin-bottom:12px; }
.avatar { width:56px; height:56px; border-radius:999px; background:#eef2ff; display:grid; place-items:center; color:#4b5563; border:1px solid #e5e7eb; }
.avatar svg { width:30px; height:30px; }
.uname { font-weight:700; color:#111827; }
.edit-link { grid-column:2; background:none; border:none; color:#2563eb; cursor:pointer; font-size:13px; }
.edit-link:hover { text-decoration:underline; }

.snav__title { color:#6b7280; font-weight:600; margin:8px 0; font-size:14px; }
.snav__list { list-style:none; padding:0; margin:0; }
.snav__link { display:flex; align-items:center; gap:8px; padding:8px 10px; border-radius:6px; color:#111827; text-decoration:none; font-weight:600; }
.snav__link:hover { color:#ef4444; background:#fef2f2; }
.snav__link--active { color:#ef4444; background:#fdecec; }

/* ✅ Khối Đơn Mua riêng */
.orders { margin-top:10px; margin-left: -15px; }
.orders-link { display:flex; align-items:center; gap:8px; padding:8px 10px; border-radius:6px; color:#111827; text-decoration:none; font-weight:600; }
.orders-link:hover { background:#f9fafb; }
.orders-link--active { color:#ef4444; }
.snav__icon { display:inline-flex; align-items:center; justify-content:center; width:20px; height:20px; color:#4c80e6; }

/* ===== Card phải ===== */
.card { background:#fff; border:1px solid #e5e7eb; border-radius:6px; box-shadow:0 1px 0 rgba(0,0,0,.04); }
.card__header { padding:18px 22px 8px; border-bottom:1px solid #e5e7eb; }
.card__title { font-size:20px; font-weight:700; color:#111827; }
.card__desc { color:#6b7280; font-size:14px; }
.card__body { display:grid; grid-template-columns:1fr 280px; gap:24px; padding:18px 22px 22px; }

/* ===== Form ===== */
.form { max-width:640px; }
.form__row { display:grid; grid-template-columns:180px 1fr; gap:10px; align-items:center; margin-bottom:12px; }
.form__label { color:#374151; font-weight:600; }
.form__input { height:40px; padding:0 12px; border:1px solid #e5e7eb; border-radius:4px; font-size:14px; color:#111827; }
.form__input:focus { border-color:#60a5fa; box-shadow:0 0 0 3px rgba(59,130,246,.15); }
.radios { display:flex; gap:18px; }
.radio { display:inline-flex; align-items:center; gap:6px; cursor:pointer; color:#374151; }
.radio input { accent-color:#ef4444; }
.radio--checked { color:#111827; font-weight:700; }
.form__actions { display:flex; justify-content:center; padding-top:10px; }
.btn { display:inline-flex; align-items:center; justify-content:center; height:40px; padding:0 20px; border-radius:6px; font-weight:700; cursor:pointer; border:none; }
.btn--primary { background:#ef4444; color:#fff; }
.btn--primary:hover { background:#dc2626; }
.form__error { background:#fee2e2; color:#981b1b; padding:12px 14px; border-radius:8px; margin-bottom:16px; font-size:14px; }
.form__success { background:#dcfce7; color:#166534; padding:12px 14px; border-radius:8px; margin-bottom:16px; font-size:14px; }
.form__loading { background:#eff6ff; color:#1d4ed8; padding:10px 14px; border-radius:8px; margin-bottom:16px; font-size:14px; }

/* ===== Uploader ===== */
.uploader { display:grid; grid-auto-rows:max-content; justify-items:center; padding:0 22px; border-left:1px solid #e5e7eb; }
.uploader__preview { width:140px; height:140px; border-radius:999px; border:1px solid #e5e7eb; background:#f8fafc; display:grid; place-items:center; color:#9ca3af; margin:8px 0 14px; }
.uploader__preview svg { width:68px; height:68px; }
.uploader__btn { display:inline-flex; align-items:center; justify-content:center; width:120px; height:36px; background:#fff; border:1px solid #d1d5db; border-radius:6px; font-weight:700; cursor:pointer; }
.uploader__btn:hover { background:#f9fafb; }
.uploader__input { display:none; }
.uploader__hint { margin-top:10px; color:#6b7280; font-size:12px; text-align:center; }

/* ===== Responsive ===== */
@media (max-width: 992px) {
  .grid { grid-template-columns:1fr; }
  .card__body { grid-template-columns:1fr; }
  .uploader { border-left:0; padding-left:0; padding-right:0; border-top:1px solid #e5e7eb; padding-top:18px; }
}
@media (max-width: 640px) {
  .form__row { grid-template-columns:1fr; }
  .form__label { margin-bottom:4px; }
  .form__actions { justify-content:center; }
}
</style>
