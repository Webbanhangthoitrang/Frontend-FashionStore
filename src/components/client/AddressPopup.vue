<!-- src/components/client/AddressPopup.vue -->
<template>
  <div class="overlay" @click.self="onClose">
    <div class="modal" role="dialog" aria-modal="true">
      <!-- Header -->
      <header class="modal__head">
        <h3>Địa Chỉ Mới</h3>
        <button type="button" class="iconbtn" aria-label="Đóng" @click="onClose">✕</button>
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

        <!-- Tỉnh/Quận/Phường -->
        <div class="form-group relative">
          <button type="button" class="selector" @click="toggleRegion = !toggleRegion">
            <span class="selector__text">
              {{ regionLabel || 'Tỉnh/ Thành phố, Quận/ Huyện, Phường/ Xã' }}
            </span>
            <span class="selector__caret">▾</span>
          </button>

          <div v-if="toggleRegion" class="region-popover" @click.stop>
            <div class="region-row">
              <label>Tỉnh/TP</label>
              <select v-model="form.province" @change="onProvinceChange">
                <option value="" disabled>— Chọn tỉnh/TP —</option>
                <option v-for="p in provinces" :key="p.code" :value="p.name">{{ p.name }}</option>
              </select>
            </div>

            <div class="region-row">
              <label>Quận/Huyện</label>
              <select v-model="form.district" @change="onDistrictChange" :disabled="!districts.length">
                <option value="" disabled>— Chọn quận/huyện —</option>
                <option v-for="d in districts" :key="d.code" :value="d.name">{{ d.name }}</option>
              </select>
            </div>

            <div class="region-row">
              <label>Phường/Xã</label>
              <select v-model="form.ward" :disabled="!wards.length" @change="onWardChange">
                <option value="" disabled>— Chọn phường/xã —</option>
                <option v-for="w in wards" :key="w.code" :value="w.name">{{ w.name }}</option>
              </select>
            </div>

            <div class="region-actions">
              <button type="button" class="btn ghost" @click="toggleRegion = false">Đóng</button>
              <button type="button" class="btn primary" @click="toggleRegion = false">OK</button>
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
          ></textarea>
        </div>

        <!-- Mặc định -->
        <label class="check">
          <input type="checkbox" v-model="form.isDefault" />
          <span>Đặt làm địa chỉ mặc định</span>
        </label>

        <!-- Thông báo lỗi -->
        <p v-if="error" class="error">{{ error }}</p>
      </section>

      <!-- Footer -->
      <footer class="modal__foot">
        <button
          type="button"
          class="btn ghost"
          :disabled="submitting"
          @click="onClose"
        >
          Trở lại
        </button>
        <button
          type="button"
          class="btn primary"
          :disabled="!canSubmit || submitting"
          @click.once="onSubmit"
        >
          {{ submitting ? 'Đang lưu…' : 'Hoàn thành' }}
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { createAddress } from '../../services/addressService'
import { request } from '../../services/http'

// ====== Form data ======
const form = ref({
  fullName: '',
  phone: '',
  province: '',
  district: '',
  ward: '',
  addressLine: '',
  isDefault: false,
})

const submitting = ref(false)
const error = ref('')

// ====== Dữ liệu vùng ======
const provinces = ref([])
const districts = ref([])
const wards = ref([])

const selectedProvinceCode = ref('')
const selectedDistrictCode = ref('')
const selectedWardCode = ref('')

// ====== Tải danh sách tỉnh ======
async function loadProvinces() {
  try {
    const res = await request('/locations/provinces', { method: 'GET' })
    const data = res?.data ?? res
    provinces.value = (Array.isArray(data) ? data : []).map(x => ({
      code: String(x.code ?? x.id),
      name: x.name
    }))
  } catch {
    // tránh dùng biến 'data' chưa khai báo
    provinces.value = []
  }
}

// ====== Khi chọn tỉnh ======
async function onProvinceChange() {
  const p = provinces.value.find(p => p.name === form.value.province)
  selectedProvinceCode.value = p?.code || ''
  form.value.district = ''
  form.value.ward = ''
  districts.value = []
  wards.value = []
  selectedDistrictCode.value = ''
  selectedWardCode.value = ''

  if (!selectedProvinceCode.value) return
  try {
    const res = await request('/locations/districts', {
      method: 'GET',
      params: { provinceCode: selectedProvinceCode.value },
    })
    const data = res?.data ?? res
    districts.value = (Array.isArray(data) ? data : []).map(x => ({
      code: String(x.code ?? x.id ?? x.districtCode),
      name: x.name
    }))
  } catch {
    districts.value = []
  }
}

// ====== Khi chọn huyện ======
async function onDistrictChange() {
  const d = districts.value.find(d => d.name === form.value.district)
  selectedDistrictCode.value = d?.code || ''
  form.value.ward = ''
  wards.value = []
  selectedWardCode.value = ''

  if (!selectedDistrictCode.value) return
  try {
    const res = await request('/locations/wards', {
      method: 'GET',
      params: { districtCode: selectedDistrictCode.value },
    })
    const data = res?.data ?? res
    wards.value = (Array.isArray(data) ? data : []).map(x => ({
      code: String(x.code ?? x.id ?? x.wardCode),
      name: x.name
    }))
  } catch {
    wards.value = []
  }
}

// ====== Khi chọn phường ======
function onWardChange() {
  const w = wards.value.find(w => w.name === form.value.ward)
  selectedWardCode.value = w?.code || ''
}

// ====== Popup toggle ======
const toggleRegion = ref(false)
const regionLabel = computed(() => {
  const { province, district, ward } = form.value
  return [province, district, ward].filter(Boolean).join(', ')
})

// ====== Đóng popup ======
const emit = defineEmits(['close', 'updated'])
function onClose() {
  emit('close')
}

// ====== Validate ======
const canSubmit = computed(() => {
  const f = form.value
  return (
    f.fullName &&
    f.phone &&
    f.addressLine &&
    selectedProvinceCode.value &&
    selectedDistrictCode.value &&
    selectedWardCode.value
  )
})

async function onSubmit() {
  if (submitting.value) return
  submitting.value = true
  error.value = ''

  try {
    if (!form.value.fullName || !form.value.phone || !form.value.addressLine) {
      error.value = 'Vui lòng nhập đầy đủ họ tên, SĐT và địa chỉ.'
      return
    }
    if (!/^0\d{9,10}$/.test(form.value.phone)) {
      error.value = 'Số điện thoại phải 10–11 số và bắt đầu bằng 0.'
      return
    }

    // Lấy code theo tên nếu người dùng đang lưu name
    let provinceCode =
      selectedProvinceCode.value ||
      provinces.value.find(p => p.name === form.value.province)?.code || '01'

    let districtCode =
      selectedDistrictCode.value ||
      districts.value.find(d => d.name === form.value.district)?.code || '001'

    let wardCode =
      selectedWardCode.value ||
      wards.value.find(w => w.name === form.value.ward)?.code || ''

    // Nếu vẫn chưa có wardCode => tải ward theo district và lấy item đầu (fallback)
    if (!wardCode && districtCode) {
      try {
        const res = await request('/locations/wards', {
          method: 'GET',
          params: { districtCode }
        })
        const data = res?.data ?? res
        const ws = (Array.isArray(data) ? data : []).map(x => ({
          code: String(x.code ?? x.id ?? x.wardCode),
          name: x.name
        }))
        wardCode = ws.find(w => w.name === form.value.ward)?.code || ws[0]?.code || '00001'
      } catch {
        wardCode = '00001'
      }
    }

    if (!wardCode) {
      error.value = 'Vui lòng chọn phường/xã.'
      return
    }

    const payload = {
      fullName: form.value.fullName.trim(),
      phone: (form.value.phone || '').replace(/\s+/g, ''),

      // các trường text BE yêu cầu
      addressLine: form.value.addressLine.trim(),
      province: form.value.province || '',
      city: form.value.district || '',
      ward: form.value.ward || '',

      // code phải là string
      provinceCode: String(provinceCode),
      districtCode: String(districtCode),
      wardCode: String(wardCode),

      isDefault: !!form.value.isDefault,
    }

    console.log('📦 Payload gửi lên BE:', payload)
    await createAddress(payload)
    emit('updated')
    onClose()
  } catch (e) {
    console.error('❌ Lỗi khi thêm địa chỉ:', e)
    error.value = e?.response?.data?.message || e?.message || 'Không thể lưu địa chỉ.'
  } finally {
    submitting.value = false
  }
}

// ====== ESC để đóng ======
function handleKeydown(e) {
  if (e.key === 'Escape') onClose()
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  loadProvinces()
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
