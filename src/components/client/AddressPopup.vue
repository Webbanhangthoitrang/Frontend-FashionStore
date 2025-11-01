<!-- src/components/client/AddressPopup.vue -->
<template>
  <div class="overlay" @click.self="onClose">
    <div class="modal" role="dialog" aria-modal="true">
      <!-- Header -->
      <header class="modal__head">
        <h3>Địa Chỉ Mới</h3>
        <button class="iconbtn" aria-label="Đóng" @click="onClose">✕</button>
      </header>

      <!-- Body -->
      <section class="modal__body">
        <div class="grid-2">
          <div class="form-group">
            <input
              class="input"
              type="text"
              v-model.trim="form.fullName"
              placeholder="Họ và tên"
            />
          </div>

          <div class="form-group">
            <input
              class="input"
              type="tel"
              v-model.trim="form.phone"
              placeholder="Số điện thoại"
            />
          </div>
        </div>

        <!-- Tỉnh/Quận/Phường (popover ba cấp) -->
        <div class="form-group relative">
          <button class="selector" type="button" @click="toggleRegion = !toggleRegion">
            <span class="selector__text">
              {{ regionLabel || 'Tỉnh/ Thành phố, Quận/ Huyện, Phường/ Xã' }}
            </span>
            <span class="selector__caret">▾</span>
          </button>

          <!-- Popover chọn vùng -->
          <div v-if="toggleRegion" class="region-popover" @click.stop>
            <div class="region-row">
              <label>Tỉnh/TP</label>
              <select v-model="form.province" @change="onProvinceChange">
                <option value="" disabled>— Chọn tỉnh/TP —</option>
                <option v-for="p in provinces" :key="p.code" :value="p.name">
                  {{ p.name }}
                </option>
              </select>
            </div>

            <div class="region-row">
              <label>Quận/Huyện</label>
              <select v-model="form.district" @change="onDistrictChange" :disabled="!districts.length">
                <option value="" disabled>— Chọn quận/huyện —</option>
                <option v-for="d in districts" :key="d.code" :value="d.name">
                  {{ d.name }}
                </option>
              </select>
            </div>

            <div class="region-row">
              <label>Phường/Xã</label>
              <select v-model="form.ward" :disabled="!wards.length">
                <option value="" disabled>— Chọn phường/xã —</option>
                <option v-for="w in wards" :key="w.code" :value="w.name">
                  {{ w.name }}
                </option>
              </select>
            </div>

            <div class="region-actions">
              <button class="btn ghost" @click="toggleRegion = false">Đóng</button>
              <button class="btn primary" @click="toggleRegion = false">OK</button>
            </div>
          </div>
        </div>

        <!-- Địa chỉ cụ thể -->
        <div class="form-group">
          <textarea
            class="textarea"
            rows="3"
            v-model.trim="form.addressLine"
            placeholder="Địa chỉ cụ thể"
          />
        </div>

        <!-- Thêm vị trí (chưa bắt buộc) -->
        <div class="form-group center">
          <button class="btn addloc" type="button" @click="onAddLocation">
            <span class="plus">+</span>
            Thêm vị trí
          </button>
        </div>

        <!-- Mặc định -->
        <label class="check">
          <input type="checkbox" v-model="form.isDefault" />
          <span>Đặt làm địa chỉ mặc định</span>
        </label>

        <!-- Lỗi -->
        <p v-if="error" class="error">{{ error }}</p>
      </section>

      <!-- Footer -->
      <footer class="modal__foot">
        <button class="btn ghost" :disabled="submitting" @click="onClose">Trở lại</button>
        <button class="btn primary" :disabled="!canSubmit || submitting" @click="onSubmit">
          {{ submitting ? 'Đang lưu…' : 'Hoàn thành' }}
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { createAddress } from '../../services/addressService'
import { request } from '../../services/http' // dùng wrapper có sẵn của bạn

const form = ref({
  fullName: '',
  phone: '',
  province: '',      // lưu tên để hiển thị
  district: '',
  ward: '',
  addressLine: '',
  isDefault: false
})

const submitting = ref(false)
const error = ref('')

/* ====== Dữ liệu vùng từ BE ====== */
const provinces = ref([]) // [{code, name}]
const districts = ref([]) // [{code, name}]
const wards = ref([])     // [{code, name}]

// Lưu code đang chọn để gọi API cấp dưới
const selectedProvinceCode = ref('')
const selectedDistrictCode = ref('')

async function loadProvinces () {
  try {
    const res = await request('/locations/provinces', { method: 'GET' })
    const data = res?.data ?? res
    provinces.value = (Array.isArray(data) ? data : []).map(x => ({
      code: x.code ?? x.id,
      name: x.name
    }))
  } catch (e) {
    error.value = 'Không tải được danh sách tỉnh/TP.'
    provinces.value = []
  }
}

async function onProvinceChange () {
  // tìm code theo tên vừa chọn
  const p = provinces.value.find(p => p.name === form.value.province)
  selectedProvinceCode.value = p?.code || ''
  // reset cấp dưới
  form.value.district = ''
  form.value.ward = ''
  districts.value = []
  wards.value = []
  if (!selectedProvinceCode.value) return
  try {
    const res = await request('/locations/districts', {
      method: 'GET',
      params: { provinceCode: selectedProvinceCode.value }
    })
    const data = res?.data ?? res
    districts.value = (Array.isArray(data) ? data : []).map(x => ({
      code: x.code ?? x.id,
      name: x.name
    }))
  } catch (e) {
    error.value = 'Không tải được quận/huyện.'
    districts.value = []
  }
}

async function onDistrictChange () {
  // tìm code theo tên vừa chọn
  const d = districts.value.find(d => d.name === form.value.district)
  selectedDistrictCode.value = d?.code || ''
  // reset cấp dưới
  form.value.ward = ''
  wards.value = []
  if (!selectedDistrictCode.value) return
  try {
    const res = await request('/locations/wards', {
      method: 'GET',
      params: { districtCode: selectedDistrictCode.value }
    })
    const data = res?.data ?? res
    wards.value = (Array.isArray(data) ? data : []).map(x => ({
      code: x.code ?? x.id,
      name: x.name
    }))
  } catch (e) {
    error.value = 'Không tải được phường/xã.'
    wards.value = []
  }
}

/* ====== Popover vùng ====== */
const toggleRegion = ref(false)
const regionLabel = computed(() => {
  const { province, district, ward } = form.value
  if (!province && !district && !ward) return ''
  return [province, district, ward].filter(Boolean).join(', ')
})

/* ====== Emits/close ====== */
const emit = defineEmits(['close', 'updated', 'select'])
function onClose () {
  emit('close')
}

/* ====== Validate & Submit ====== */
const canSubmit = computed(() => {
  const f = form.value
  return f.fullName && f.phone && f.province && f.district && f.ward && f.addressLine
})

async function onSubmit () {
  if (!canSubmit.value || submitting.value) return
  submitting.value = true
  error.value = ''
  try {
    const payload = {
      fullName: form.value.fullName,
      phone: form.value.phone,
      province: form.value.province,
      district: form.value.district,
      ward: form.value.ward,
      // nếu BE cần code thì thêm 3 dòng dưới:
      provinceCode: selectedProvinceCode.value || undefined,
      districtCode: selectedDistrictCode.value || undefined,
      wardCode: (wards.value.find(w => w.name === form.value.ward)?.code) || undefined,
      addressLine: form.value.addressLine,
      isDefault: !!form.value.isDefault
    }
    await createAddress(payload)
    emit('updated')
    emit('select', { id: undefined, ...payload })
    onClose()
  } catch (e) {
    error.value = e?.response?.data?.message || e?.message || 'Không thể lưu địa chỉ. Vui lòng thử lại.'
  } finally {
    submitting.value = false
  }
}

function onAddLocation () {
  alert('Tính năng Thêm vị trí (bản đồ) sẽ được tích hợp sau.')
}

/* ====== ESC để đóng & load provinces ====== */
function handleKeydown (e) {
  if (e.key === 'Escape') onClose()
}
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  loadProvinces() // => tải 63 tỉnh ngay khi mở popup
})
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* ==== Overlay + Modal ==== */
.overlay{
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 1000;
}
.modal{
  width: 720px;
  max-width: 100%;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 20px 60px rgba(0,0,0,.2);
  overflow: hidden;
  display: grid;
  grid-template-rows: auto 1fr auto;
}
.modal__head{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid #eee;
}
.modal__head h3{
  font-weight: 700;
  font-size: 16px;
  color: #111827;
}
.iconbtn{
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
  color: #6b7280;
}
.modal__body{
  padding: 16px;
}
.modal__foot{
  padding: 12px 16px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* ==== Form ==== */
.grid-2{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.form-group{ margin-bottom: 12px; }
.input,
.textarea{
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  outline: none;
  font-family: inherit; 
}

.input:focus,
.textarea:focus{ border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,.1); }

/* Selector */
.relative{ position: relative; }
.selector{
  width: 100%;
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}
.selector__text{ color: #6b7280; }
.selector__caret{ color: #6b7280; }

.region-popover{
  position: absolute;
  z-index: 10;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 12px 28px rgba(0,0,0,.12);
  padding: 12px;
}
.region-row{
  display: grid;
  grid-template-columns: 120px 1fr;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.region-row label{
  color: #374151;
  font-size: 13px;
}
.region-row select{
  width: 100%;
  height: 36px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0 8px;
  background: #fff;
}
.region-actions{
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 6px;
}

/* Add location */
.center{ display: flex; justify-content: center; }
.addloc{
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 8px 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}
.addloc .plus{ font-weight: 700; }
.btn.addloc{
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 12px;
  color: #6b7280
}

/* Checkbox */
.check{
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-size: 14px;
  user-select: none;
}

/* Buttons */
.btn{
  height: 40px;
  padding: 0 18px;
  border-radius: 8px;
  border: 1px solid transparent;
  cursor: pointer;
  font-weight: 400;
}
.btn.ghost{
  background: #fff;
  border-color: #e5e7eb;
}
.btn.primary{
  background: #ef4444;
  color: #fff;
}
.btn:disabled{ opacity: .6; cursor: not-allowed; }

.error{
  color: #b91c1c;
  margin-top: 6px;
}

/* Responsive */
@media (max-width: 640px){
  .grid-2{ grid-template-columns: 1fr; }
}
</style>
