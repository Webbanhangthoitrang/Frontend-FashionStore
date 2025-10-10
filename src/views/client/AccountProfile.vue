<template>
  <div class="account">
    <!-- Header đã có sẵn -->
    <ClientHeader />

    <main 
      class="page"
      role="main"
    >
      <div class="container">
        <!-- Lưới 2 cột: sidebar + nội dung -->
        <div class="grid">
          <!-- Sidebar trái -->
          <aside 
            class="sidebar"
            aria-label="Thanh điều hướng tài khoản"
          >
            <div class="userbox">
              <div class="avatar">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
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

              <div class="uname">
                {{ form.username }}
              </div>

              <button 
                class="edit-link"
                type="button"
              >
                ✎ Sửa Hồ Sơ
              </button>
            </div>

            <nav class="snav">
              <p class="snav__title">
                Tài Khoản Của Tôi
              </p>

              <ul class="snav__list">
                <li>
                  <router-link 
                    to="/account/profile"
                    class="snav__link snav__link--active"
                  >
                    Hồ Sơ
                  </router-link>
                </li>

                <li>
                  <router-link 
                    to="/account/address" 
                    class="snav__link"
                  >
                    Địa Chỉ
                  </router-link>
                </li>

                <li>
                  <router-link 
                    to="/account/password" 
                    class="snav__link"
                  >
                    Đổi Mật Khẩu
                  </router-link>
                </li>
              </ul>
            </nav>
          </aside>

          <!-- Nội dung phải -->
          <section 
            class="card"
            aria-labelledby="profile-title"
          >
            <!-- Tiêu đề -->
            <div class="card__header">
              <h2 
                id="profile-title"
                class="card__title"
              >
                Hồ Sơ Của Tôi
              </h2>

              <p class="card__desc">
                Quản lý thông tin hồ sơ để bảo mật tài khoản
              </p>
            </div>

            <!-- Nội dung chia 2 cột: form + khối upload -->
            <div class="card__body">
              <!-- Cột form -->
              <form 
                class="form"
                @submit.prevent="onSubmit"
              >
                <div class="form__row">
                  <label 
                    for="username"
                    class="form__label"
                  >
                    Tên đăng nhập
                  </label>

                  <input 
                    id="username"
                    v-model="form.username"
                    type="text"
                    class="form__input"
                    autocomplete="username"
                  />
                </div>

                <div class="form__row">
                  <label 
                    for="fullname"
                    class="form__label"
                  >
                    Tên
                  </label>

                  <input 
                    id="fullname"
                    v-model="form.fullname"
                    type="text"
                    class="form__input"
                    autocomplete="name"
                  />
                </div>

                <div class="form__row">
                  <label 
                    for="email"
                    class="form__label"
                  >
                    Email
                  </label>

                  <input 
                    id="email"
                    v-model="form.email"
                    type="email"
                    class="form__input"
                    autocomplete="email"
                  />
                </div>

                <div class="form__row">
                  <label 
                    for="phone"
                    class="form__label"
                  >
                    Số điện thoại
                  </label>

                  <input 
                    id="phone"
                    v-model="form.phone"
                    type="tel"
                    class="form__input"
                    placeholder="(+84) 123 456 789"
                    autocomplete="tel"
                  />
                </div>

                <div class="form__row">
                  <label 
                    for="dob"
                    class="form__label"
                  >
                    Ngày sinh
                  </label>

                  <input 
                    id="dob"
                    v-model="form.dob"
                    type="text"
                    class="form__input"
                    placeholder="dd/mm/yyyy"
                    inputmode="numeric"
                  />
                </div>

                <div class="form__row">
                  <span class="form__label">
                    Giới tính
                  </span>

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
                      <span>
                        Nam
                      </span>
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
                      <span>
                        Nữ
                      </span>
                    </label>
                  </div>
                </div>

                <div class="form__actions">
                  <button 
                    type="submit"
                    class="btn btn--primary"
                  >
                    Lưu
                  </button>
                </div>
              </form>

              <!-- Cột upload avatar -->
              <div class="uploader">
                <div class="uploader__preview">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
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

                <label 
                  for="avatar"
                  class="uploader__btn"
                >
                  Chọn Ảnh
                </label>

                <input 
                  id="avatar"
                  type="file"
                  accept=".png"
                  class="uploader__input"
                  @change="onFileChange"
                />

                <p class="uploader__hint">
                  Dung lượng file tối đa 1 MB
                </p>

                <p class="uploader__hint">
                  Định dạng: .PNG
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>

    <!-- Footer đã có sẵn -->
    <ClientFooter />
  </div>
</template>

<script setup>
import { 
  reactive, 
  ref 
} from 'vue'

import ClientHeader from '../../components/client/ClientHeaderLogged.vue'
import ClientFooter from '../../components/client/ClientFooter.vue'

const form = reactive({
  username: 'xunmaing240',
  fullname: 'XuanMai2411❤️😎',
  email: 'xuanmai@gmail.com',
  phone: '(+84) 123 456 789',
  dob: '24/11/2004',
  gender: 'male'
})

const fileObj = ref(null)

function onSubmit() {
  // Front-end demo: kiểm tra cơ bản
  if (!form.username || !form.email) {
    alert('Vui lòng nhập đủ Tên đăng nhập và Email.')
    return
    }
  alert('Đã lưu hồ sơ (demo).')
}

function onFileChange(e) {
  const file = e.target.files?.[0]
  if (!file) {
    return
  }
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
</script>

<style scoped>
/* Tổng thể trang */
.account {
  background: #f3f4f6;
}

/* Vùng chính dưới header */
.page {
  padding-top: 16px;
  padding-bottom: 32px;
}

/* Container canh giữa */
.container {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 24px;
  padding-right: 24px;
}

/* Grid 2 cột */
.grid {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 24px;
}

/* =========== Sidebar =========== */
.sidebar {
  background: #fff;
  border-radius: 6px;
  padding: 16px 14px;
  border: 1px solid #e5e7eb;
}

.userbox {
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
}

.avatar {
  width: 56px;
  height: 56px;
  border-radius: 999px;
  background: #eef2ff;
  display: grid;
  place-items: center;
  color: #4b5563;
  border: 1px solid #e5e7eb;
}

.avatar svg {
  width: 30px;
  height: 30px;
}

.uname {
  font-weight: 700;
  color: #111827;
}

.edit-link {
  grid-column: 2 / span 1;
  justify-self: start;
  margin-top: -4px;
  padding: 0;
  background: none;
  border: none;
  color: #2563eb;
  cursor: pointer;
  font-size: 13px;
}

.edit-link:hover {
  text-decoration: underline;
}

.snav__title {
  margin-top: 8px;
  margin-bottom: 8px;
  color: #6b7280;
  font-weight: 600;
  font-size: 14px;
}

.snav__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.snav__link {
  display: block;
  padding: 8px 10px;
  border-radius: 6px;
  color: #111827;
  text-decoration: none;
  font-weight: 600;
}

.snav__link:hover {
  color: #ef4444;           /* ✅ đổi màu chữ sang đỏ */
  background: #fef2f2; 
}



/* =========== Card phải =========== */
.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  box-shadow: 0 1px 0 rgba(0,0,0,0.04);
}

.card__header {
  padding: 18px 22px 8px 22px;
  border-bottom: 1px solid #e5e7eb;
}

.card__title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #111827;
}

.card__desc {
  margin-top: 6px;
  margin-bottom: 0;
  color: #6b7280;
  font-size: 14px;
}

.card__body {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 24px;
  padding: 18px 22px 22px 22px;
}

/* =========== Form =========== */
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
  padding-left: 12px;
  padding-right: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  outline: none;
  font-size: 14px;
  color: #111827;
  background: #fff;
}

.form__input:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 3px rgba(59,130,246,.15);
}

/* Radios */
.radios {
  display: flex;
  align-items: center;
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

/* Actions */
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
  padding-left: 20px;
  padding-right: 20px;
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

/* =========== Uploader =========== */
.uploader {
  display: grid;
  grid-auto-rows: max-content;
  justify-items: center;
  padding-left: 22px;
  padding-right: 22px;
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
  margin-top: 8px;
  margin-bottom: 14px;
}

.uploader__preview svg {
  width: 68px;
  height: 68px;
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
  margin-bottom: 0;
  color: #6b7280;
  font-size: 12px;
  text-align: center;
}

/* =========== Responsive =========== */
@media (max-width: 992px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .card__body {
    grid-template-columns: 1fr;
  }

  .uploader {
    border-left: 0;
    padding-left: 0;
    padding-right: 0;
    border-top: 1px solid #e5e7eb;
    padding-top: 18px;
  }
}

@media (max-width: 640px) {
  .form__row {
    grid-template-columns: 1fr;
  }

  .form__label {
    margin-bottom: 4px;
  }

  .form__actions {
    justify-content: center;
  }
}
</style>
