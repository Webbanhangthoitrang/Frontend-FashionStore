<!-- src/views/client/ChangePassword.vue -->
<template>
  <div class="account">
    <ClientHeader />

    <main class="page" role="main">
      <div class="container">
        <div class="grid">
          <AccountSidebar :username="state.user?.name || ''" />

          <section class="card" aria-labelledby="pw-title">
            <div class="card__header">
              <h2 id="pw-title" class="card__title">Đổi Mật Khẩu</h2>
              <div class="divider"></div>
            </div>

            <div class="card__body only-one-col">
              <form class="form" @submit.prevent="onSubmit">
                <p v-if="errorMessage" class="form__error">{{ errorMessage }}</p>
                <p v-if="successMessage" class="form__success">{{ successMessage }}</p>

                <div class="form__row">
                  <label class="form__label" for="old">Mật khẩu hiện tại</label>
                  <div class="field">
                    <input
                      id="old"
                      class="form__input"
                      :type="show.old ? 'text' : 'password'"
                      v-model.trim="form.oldPassword"
                    />
                    <button
                      type="button"
                      class="field__eye"
                      @click.stop.prevent="show.old = !show.old"
                      aria-label="Hiện/Ẩn mật khẩu">
                      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" fill="none" stroke="currentColor" stroke-width="1.6"/>
                        <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.6"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="form__row">
                  <label class="form__label" for="new">Mật khẩu mới</label>
                  <div class="field">
                    <input
                      id="new"
                      class="form__input"
                      :type="show.new ? 'text' : 'password'"
                      v-model.trim="form.newPassword"
                    />
                    <button
                      type="button"
                      class="field__eye"
                      @click.stop.prevent="show.new = !show.new"
                      aria-label="Hiện/Ẩn mật khẩu">
                      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" fill="none" stroke="currentColor" stroke-width="1.6"/>
                        <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.6"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="form__row">
                  <label class="form__label" for="confirm">Xác nhận mật khẩu mới</label>
                  <div class="field">
                    <input
                      id="confirm"
                      class="form__input"
                      :type="show.confirm ? 'text' : 'password'"
                      v-model.trim="form.confirm"
                    />
                    <button
                      type="button"
                      class="field__eye"
                      @click.stop.prevent="show.confirm = !show.confirm"
                      aria-label="Hiện/Ẩn mật khẩu">
                      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" fill="none" stroke="currentColor" stroke-width="1.6"/>
                        <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.6"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="form__actions">
                  <button class="btn btn--primary" :disabled="loading">
                    {{ loading ? 'Đang lưu…' : 'Lưu' }}
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      </div>
    </main>

    <ClientFooter />
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import ClientHeader from '../../components/client/ClientHeaderLogged.vue'
import ClientFooter from '../../components/client/ClientFooter.vue'
import AccountSidebar from '../../components/client/AccountSidebar.vue'
import { useAuthStore } from '../../stores/auth'
import { changePassword } from '../../services/authService'

const { state } = useAuthStore()

const form = reactive({
  oldPassword: '',
  newPassword: '',
  confirm: ''
})
const show = reactive({ old: false, new: false, confirm: false })
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

async function onSubmit () {
  errorMessage.value = ''
  successMessage.value = ''

  if (!form.oldPassword || !form.newPassword || !form.confirm) {
    errorMessage.value = 'Vui lòng nhập đầy đủ các trường.'
    return
  }
  if (form.newPassword.length < 6) {
    errorMessage.value = 'Mật khẩu mới tối thiểu 6 ký tự.'
    return
  }
  if (form.newPassword !== form.confirm) {
    errorMessage.value = 'Xác nhận mật khẩu không khớp.'
    return
  }
  try {
    loading.value = true
    await changePassword({ oldPassword: form.oldPassword, newPassword: form.newPassword })
    successMessage.value = 'Đổi mật khẩu thành công.'
    form.oldPassword = form.newPassword = form.confirm = ''
  } catch (e) {
    errorMessage.value = e?.message || 'Không thể đổi mật khẩu.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Nền trang */
.account { background:#f3f4f6; }
.page { padding:16px 0 32px; }
.container { max-width:1200px; margin:0 auto; padding:0 24px; }
.grid { display:grid; grid-template-columns:260px 1fr; gap:24px; }

/* Card */
.card { background:#fff; border:1px solid #e5e7eb; border-radius:6px; box-shadow:0 1px 0 rgba(0,0,0,.04); }
.card__header { padding:18px 22px 4px; }
.card__title { font-size:18px; font-weight:700; color:#111827; }
.divider { height:1px; background:#e5e7eb; margin-top:10px; }
.card__body.only-one-col { display:grid; grid-template-columns:1fr; padding:18px 22px 22px; }

/* Form layout giống ảnh: label trái – field phải, canh giữa card */
.form { width: 640px; margin: 0 auto; }
.form__row { display:grid; grid-template-columns: 180px 1fr; gap: 12px; align-items:center; margin-bottom:14px; }
.form__label { color:#374151; font-weight:600; }

/* Ô nhập + icon mắt */
.field { position:relative; }
.form__input {
  width:100%;
  height:36px;
  border:1px solid #d1d5db;
  border-radius:4px;
  padding:0 38px 0 12px;
  font-size:14px;
  color:#111827;
  background:#fff;
  position: relative;   /* để z-index hoạt động */
  z-index: 1;
}
.form__input:focus { border-color:#60a5fa; box-shadow:0 0 0 3px rgba(59,130,246,.15); outline:none; }

.field__eye {
  position:absolute; right:8px; top:50%; transform:translateY(-50%);
  width:28px; height:28px; display:grid; place-items:center;
  border:none; background:transparent; color:#6b7280; cursor:pointer;
  z-index: 2;            /* nằm trên input */
  pointer-events: auto;  /* nhận click */
}
.field__eye:hover { color:#111827; }

/* Nút lưu đỏ giữa */
.form__actions { display:flex; justify-content:center; margin-top:8px; }
.btn {
  display:inline-flex; align-items:center; justify-content:center;
  height:36px; padding:0 20px; border-radius:6px; font-weight:700; border:none; cursor:pointer;
}
.btn--primary { background:#e11d2f; color:#fff; }
.btn--primary:hover { background:#c91526; }

/* Thông báo */
.form__error { background:#fee2e2; color:#991b1b; padding:10px 12px; border-radius:8px; margin-bottom:12px; font-size:14px; }
.form__success { background:#dcfce7; color:#166534; padding:10px 12px; border-radius:8px; margin-bottom:12px; font-size:14px; }


</style>
