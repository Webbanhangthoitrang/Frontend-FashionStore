<!-- src/views/client/AccountAddress.vue -->
<template>
  <div class="account">
    <ClientHeader />

    <main class="page" role="main">
      <div class="container">
        <div class="grid">
          <!-- Sidebar -->
          <AccountSidebar :username="username" />

          <!-- Nội dung phải -->
          <section class="card" aria-labelledby="address-title">
            <div class="card__header">
              <h2 id="address-title" class="card__title">Địa Chỉ Của Tôi</h2>
              <button type="button" class="btn btn--primary" @click="onAdd">+ Thêm địa chỉ mới</button>
            </div>

            <div class="card__body">
              <h3 class="section-title">Địa chỉ</h3>

              <p v-if="loading" class="state">Đang tải địa chỉ…</p>
              <p v-else-if="errorMessage" class="state state--error">{{ errorMessage }}</p>

              <div v-else class="addr-list">
                <article v-for="a in addresses" :key="a.id" class="addr-item">
                  <div class="addr-left">
                    <div class="addr-name">
                      <strong class="addr-fullname">{{ a.fullName || a.name }}</strong>
                      <span class="addr-phone">(+84) {{ formatPhone(a.phone) }}</span>
                    </div>

                    <p class="addr-text">{{ displayAddress(a) }}</p>
                    <span v-if="a.isDefault" class="tag tag--default">Mặc định</span>
                  </div>

                  <div class="addr-right">
                    <div class="addr-links">
                      <button type="button" class="link" @click="openEdit(a)">Cập nhật</button>
                      <span class="sep">|</span>
                      <button type="button" class="link danger" @click="onDelete(a)">Xóa</button>
                    </div>

                    <button
                      type="button"
                      class="btn btn--outline"
                      :disabled="a.isDefault"
                      @click="onSetDefault(a)"
                    >
                      Thiết lập mặc định
                    </button>
                  </div>
                </article>

                <p v-if="addresses.length === 0" class="muted empty">
                  Chưa có địa chỉ nào.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>

    <!-- Popup -->
    <AddressPopup
      v-if="showPopup"
      @close="showPopup = false"
      @updated="handleUpdated"
    />

    <ClientFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import ClientHeader from '../../components/client/ClientHeaderLogged.vue'
import ClientFooter from '../../components/client/ClientFooter.vue'
import AccountSidebar from '../../components/client/AccountSidebar.vue'
import AddressPopup from '../../components/client/AddressPopup.vue'
import { getMyAddresses, updateAddress, deleteAddress } from '../../services/addressService'
import { useAuthStore } from '../../stores/auth'
import { request } from '../../services/http'   // 👈 dùng để tra tên theo code

const auth = useAuthStore()
const username = computed(() => auth?.state?.user?.name || 'Người dùng')

const addresses = ref([])
const showPopup = ref(false)
const loading = ref(false)
const errorMessage = ref('')

/* ====== Cache map code -> name (địa giới) ====== */
const provinceMap = ref({})  // provinceCode -> provinceName
const districtMap  = ref({}) // districtCode  -> districtName
const wardMap      = ref({}) // wardCode      -> wardName

async function ensureProvinces() {
  if (Object.keys(provinceMap.value).length) return
  try {
    const res = await request('/locations/provinces', { method: 'GET' })
    const data = res?.data ?? res ?? []
    provinceMap.value = Object.fromEntries(
      (Array.isArray(data) ? data : []).map(x => [
        String(x.code ?? x.id ?? x.provinceCode),
        x.name
      ])
    )
  } catch {
    // bỏ qua: nếu lỗi sẽ hiển thị theo dữ liệu có sẵn
  }
}

async function getDistrictName(districtCode, provinceCode) {
  const dCode = String(districtCode || '')
  if (!dCode) return ''
  if (districtMap.value[dCode]) return districtMap.value[dCode]
  try {
    const res = await request('/locations/districts', {
      method: 'GET',
      params: { provinceCode: String(provinceCode || '') }
    })
    const list = res?.data ?? res ?? []
    for (const x of (Array.isArray(list) ? list : [])) {
      const code = String(x.code ?? x.id ?? x.districtCode)
      districtMap.value[code] = x.name
    }
    return districtMap.value[dCode] || ''
  } catch {
    return ''
  }
}

async function getWardName(wardCode, districtCode) {
  const wCode = String(wardCode || '')
  if (!wCode) return ''
  if (wardMap.value[wCode]) return wardMap.value[wCode]
  try {
    const res = await request('/locations/wards', {
      method: 'GET',
      params: { districtCode: String(districtCode || '') }
    })
    const list = res?.data ?? res ?? []
    for (const x of (Array.isArray(list) ? list : [])) {
      const code = String(x.code ?? x.id ?? x.wardCode)
      wardMap.value[code] = x.name
    }
    return wardMap.value[wCode] || ''
  } catch {
    return ''
  }
}

/* ====== Load & enrich dữ liệu địa chỉ ====== */
async function loadData() {
  loading.value = true
  errorMessage.value = ''
  try {
    await ensureProvinces()

    const res = await getMyAddresses()
    const raw = Array.isArray(res) ? res : (res?.data ?? [])

    // Làm giàu: nếu thiếu tên (chỉ có code) thì tra tên; đồng thời chuẩn hóa field
    const enriched = await Promise.all(
      raw.map(async (a) => {
        const province =
          a.province || a.provinceName || provinceMap.value[String(a.provinceCode)] || ''
        const district =
          a.district || a.city || a.districtName ||
          await getDistrictName(a.districtCode, a.provinceCode)
        const ward =
          a.ward || a.wardName || await getWardName(a.wardCode, a.districtCode)

        return {
          ...a,
          province,
          district,
          ward,
          addressLine: a.addressLine || a.detail || ''
        }
      })
    )

    addresses.value = enriched
  } catch (e) {
    errorMessage.value = e?.response?.data?.message || e?.message || 'Không tải được danh sách địa chỉ'
  } finally {
    loading.value = false
  }
}

/* ====== Actions ====== */
function onAdd() { showPopup.value = true }
function openEdit() { showPopup.value = true }

async function onDelete(a) {
  if (!confirm('Bạn có chắc muốn xóa địa chỉ này?')) return
  try {
    await deleteAddress(a.id)
    await loadData()
  } catch (e) {
    alert(e?.response?.data?.message || e?.message || 'Không xóa được địa chỉ')
  }
}

async function onSetDefault(a) {
  if (a.isDefault) return
  try {
    await updateAddress(a.id, { isDefault: true })
    await loadData()
  } catch (e) {
    alert(e?.response?.data?.message || e?.message || 'Không đặt được mặc định')
  }
}

async function handleUpdated() {
  showPopup.value = false
  await loadData()
}

/* ====== Helpers hiển thị ====== */
function displayAddress(a) {
  return [a.addressLine, a.ward, a.district, a.province]
    .filter(Boolean)
    .join(', ')
}

function formatPhone(p = '') {
  const s = String(p).replace(/\D/g, '').replace(/^0/, '')
  return s.replace(/(\d{3})(\d{3})(\d+)/, '$1 $2 $3')
}

onMounted(loadData)
</script>

<style scoped>
.account { background: #f3f4f6; }
.page { padding: 16px 0 32px; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.grid { display: grid; grid-template-columns: 260px 1fr; gap: 24px; }

/* Card */
.card { background:#fff; border:1px solid #e5e7eb; border-radius:6px; }
.card__header {
  padding: 14px 22px;
  border-bottom: 1px solid #e5e7eb;
  display: flex; align-items: center; justify-content: space-between;
}
.card__title { font-size: 18px; font-weight: 700; color:#111827; }
.card__body { padding: 16px 22px 22px; }
.section-title {
  font-size: 16px; font-weight: 700; color:#111827; margin: 2px 0 10px;
}

/* Buttons */
.btn { height: 36px; padding: 0 14px; border-radius: 6px; border: 1px solid #d1d5db; background: #fff; font-weight: 600; cursor: pointer; }
.btn--primary { background:#ef4444; border-color:#ef4444; color:#fff; }
.btn--primary:hover { background:#dc2626; border-color:#dc2626; }
.btn--outline {
  background:#fff; color:#111827; border-color:#d1d5db;
  height: 32px; padding: 0 12px; font-weight: 600;
}
.btn:disabled { opacity: .6; cursor: not-allowed; }

/* States */
.state { background:#eff6ff; color:#1d4ed8; padding:10px 14px; border-radius:8px; }
.state--error { background:#fee2e2; color:#991b1b; }
.muted { color:#64748b; }
.empty { margin-top: 12px; }

/* List */
.addr-list { display:flex; flex-direction:column; }
.addr-item{
  display: flex;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid #e5e7eb;
}
.addr-left { flex: 1; min-width: 0; }
.addr-name { display:flex; align-items:center; gap:12px; margin-bottom: 4px; }
.addr-fullname { font-weight: 700; color:#111827; }
.addr-phone { color:#475569; }
.addr-text { color:#475569; margin: 0; line-height: 1.5; }

/* Tag mặc định dưới địa chỉ */
.tag--default {
  display: inline-block;
  margin-top: 6px;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid #dbe4ff;
  background: #eef2ff;
  color: #4c6ef5;
}

/* Cột actions bên phải */
.addr-right{
  align-self: center;              /* căn giữa theo chiều dọc so với cột trái */
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  min-width: 220px;
}
.addr-links {
  display: flex;
  gap: 10px;
  align-items: center;
  line-height: 1;
}
.link { background:none; border:none; color:#2563eb; cursor:pointer; padding:0; height:auto; }
.link:hover { text-decoration: underline; }
.link.danger { color:#ef4444; }
.sep { color:#94a3b8; }
</style>
