<!-- src/views/admin/OrderReturnUpdate.vue -->
<template>
  <div class="admin-layout">
    <!-- SIDEBAR -->
    <AdminSidebar />

    <!-- CONTENT -->
    <div class="admin-content">
      <main class="page">
        <!-- HEADER -->
        <div class="od-header">
          <h1 class="od-title">Quản lý đơn hàng</h1>

          <div class="od-subrow" @click="goBack">
            <span class="od-subrow__icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 18L9 12L15 6"
                  stroke="#111827"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>

            <span class="od-subtitle">Cập nhật đơn hàng</span>
          </div>
        </div>

        <!-- STATE -->
        <p v-if="loading" class="state">Đang tải thông tin đơn hàng…</p>
        <p v-else-if="errorMessage" class="state state--error">
          {{ errorMessage }}
        </p>

        <!-- PANEL CHÍNH -->
        <section v-else class="od-panel">
          <!-- CỘT TRÁI: THÔNG TIN -->
          <div class="od-left">
            <!-- Thông tin khách hàng -->
            <div class="card info-card">
              <h2 class="card-title">Thông tin khách hàng</h2>
              <p class="info-line">{{ customerName }}</p>
              <p class="info-line">{{ customerEmail }}</p>
              <p class="info-line">{{ customerPhone }}</p>
              <p class="info-line info-line--addr">
                {{ customerAddress }}
              </p>
            </div>

            <!-- Thông tin đơn hàng -->
            <div class="card info-card">
              <h2 class="card-title">Thông tin đơn hàng</h2>

              <div class="info-row">
                <span class="info-label">Mã đơn hàng:</span>
                <span class="info-value">{{ orderCode }}</span>
              </div>

              <div class="info-row">
                <span class="info-label">Ngày đặt hàng:</span>
                <span class="info-value">{{ orderDate }}</span>
              </div>

              <div class="info-row">
                <span class="info-label">Phương thức thanh toán:</span>
                <span class="info-value">
                  {{ paymentMethodLabel }}
                </span>
              </div>
            </div>
          </div>

          <!-- CỘT PHẢI: SẢN PHẨM + LÝ DO TRẢ HÀNG + HÀNH ĐỘNG -->
          <div class="od-right">
            <!-- Danh sách sản phẩm -->
            <div class="card product-card">
              <h2 class="card-title">Danh sách sản phẩm</h2>

              <table class="prod-table">
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th class="col-center">Số lượng</th>
                    <th class="col-right">Đơn giá</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="items.length === 0">
                    <td colspan="3" class="empty-row">
                      Không có sản phẩm trong đơn hàng.
                    </td>
                  </tr>
                  <tr v-for="(item, idx) in items" :key="idx">
                    <td>{{ itemName(item) }}</td>
                    <td class="col-center">{{ item.quantity || 1 }}</td>
                    <td class="col-right">
                      {{ formatCurrency(item.price || item.unitPrice || 0) }}
                    </td>
                  </tr>
                  <tr v-if="items.length">
                    <td class="total-label">Tổng tiền</td>
                    <td></td>
                    <td class="col-right total-price">
                      {{ formatCurrency(totalPrice) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Lý do trả hàng + Hành động (y chang Figma) -->
            <div class="card return-card">
              <div class="return-grid">
                <!-- Lý do trả hàng -->
                <div class="return-left">
                  <h2 class="card-title">Lý do trả hàng</h2>
                  <input
                    v-model="returnReason"
                    type="text"
                    class="reason-input"
                    placeholder="Giao nhầm size"
                  />
                </div>

                <!-- Hành động -->
                <div class="return-right">
                  <h2 class="card-title">Hành động</h2>

                  <div class="action-list">
                    <label class="action-item">
                      <input
                        v-model="decision"
                        type="radio"
                        value="APPROVE"
                      />
                      <span>Chấp nhận</span>
                    </label>

                    <label class="action-item">
                      <input
                        v-model="decision"
                        type="radio"
                        value="REJECT"
                      />
                      <span>Từ chối</span>
                    </label>
                  </div>

                  <textarea
                    v-model="rejectReason"
                    class="reject-input"
                    :disabled="decision !== 'REJECT'"
                    placeholder="Lý do từ chối…"
                  ></textarea>
                </div>
              </div>

              <!-- BUTTONS -->
              <div class="btn-row">
                <button
                  type="button"
                  class="btn btn--primary"
                  :disabled="saving"
                  @click="handleSave"
                >
                  <span v-if="!saving">Lưu thay đổi</span>
                  <span v-else>Đang lưu…</span>
                </button>

                <button type="button" class="btn btn--ghost" @click="goBack">
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminSidebar from '../../components/admin/AdminSidebar.vue'
import { request } from '../../services/http'

const route = useRoute()
const router = useRouter()

const orderId = route.params.id

const loading = ref(false)
const saving = ref(false)
const errorMessage = ref('')
const order = ref(null)

// form trả hàng
const returnReason = ref('')
const decision = ref('APPROVE') // APPROYVE | REJECT
const rejectReason = ref('')

// ========== LẤY ĐƠN HÀNG ==========
const fetchOrder = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const res = await request(`/orders/${orderId}`, { method: 'GET' })
    // BE: { success, message, data: { id, customer, order, products, ... } }
    const payload = res.data?.data || res.data
    console.log('RETURN ORDER DETAIL = ', payload)

    order.value = payload

    // nếu BE có sẵn lý do trả hàng / trạng thái thì set vào:
    returnReason.value =
      payload.returnReason || payload.order?.returnReason || ''

    // TODO: nếu BE có field quyết định cũ thì map vào decision ở đây
  } catch (err) {
    console.error(err)
    errorMessage.value =
      err.message || 'Không tải được thông tin đơn hàng.'
  } finally {
    loading.value = false
  }
}

// ========== THÔNG TIN HIỂN THỊ ==========

const orderCode = computed(() => {
  const o = order.value || {}
  return o.order?.code || o._fullData?.code || o.code || o.id || ''
})

const orderDate = computed(() => {
  const o = order.value || {}
  const raw = o.order?.createdAt || o._fullData?.createdAt
  return formatDate(raw)
})

const customerName = computed(() => {
  const o = order.value || {}
  const c = o.customer || {}
  const addr = o._fullData?.address || {}
  const user = o._fullData?.user || {}

  return (
    c.name ||
    addr.fullName ||
    user.name ||
    o._fullData?.receiverName ||
    'Khách lẻ'
  )
})

const customerEmail = computed(() => {
  const o = order.value || {}
  const c = o.customer || {}
  const user = o._fullData?.user || {}

  return c.email || user.email || '—'
})

const customerPhone = computed(() => {
  const o = order.value || {}
  const c = o.customer || {}
  const addr = o._fullData?.address || {}

  return c.phone || addr.phone || o._fullData?.receiverPhone || '—'
})

const customerAddress = computed(() => {
  const o = order.value || {}
  const c = o.customer || {}
  const addr = o._fullData?.address || {}

  return (
    c.address ||
    addr.addressLine ||
    o._fullData?.receiverAddress ||
    'Chưa có địa chỉ giao hàng'
  )
})

// danh sách sản phẩm
const items = computed(() => {
  const o = order.value || {}
  if (Array.isArray(o.products)) return o.products
  if (Array.isArray(o._fullData?.orderItems)) return o._fullData.orderItems
  return []
})

const itemName = (item) => {
  if (!item) return 'Sản phẩm'

  if (item.name && item.variant) return `${item.name} (${item.variant})`

  if (item.productVariant?.product?.name) {
    const base = item.productVariant.product.name
    const color = item.productVariant.color || item.productVariant?.color
    const size = item.productVariant.size
    const variant = [color, size].filter(Boolean).join(', ')
    return variant ? `${base} (${variant})` : base
  }

  return item.name || 'Sản phẩm'
}

// Tổng tiền
const totalPrice = computed(() => {
  const o = order.value || {}
  if (o.order?.total) return Number(o.order.total)
  if (o.total) return Number(o.total)
  if (o.subtotal) return Number(o.subtotal)

  return items.value.reduce((sum, it) => {
    const q = it.quantity || 1
    const p = Number(it.price || 0)
    return sum + q * p
  }, 0)
})

// Phương thức thanh toán
const paymentMethodLabel = computed(() => {
  const o = order.value || {}
  const method = String(
    o.order?.paymentMethod ||
      o._fullData?.paymentMethod ||
      o.paymentMethod ||
      ''
  ).toUpperCase()

  if (method.includes('COD')) return 'Thanh toán khi nhận hàng (COD)'
  if (method.includes('ONLINE')) return 'Thanh toán online'
  if (method.includes('BANK')) return 'Chuyển khoản ngân hàng'
  return method || 'Không rõ'
})

// ========== HÀM DÙNG CHUNG ==========
const formatDate = (value) => {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

const formatCurrency = (value) => {
  const num = Number(value || 0)
  return num.toLocaleString('vi-VN') + '₫'
}

// ========== LƯU TRẠNG THÁI TRẢ HÀNG ==========
const handleSave = async () => {
  if (!order.value) return

  try {
    saving.value = true

    // TODO: Chỉnh endpoint & body cho đúng backend của bạn
    await request(`/orders/${orderId}/return`, {
      method: 'PUT',
      data: {
        action: decision.value, // APPPROVE | REJECT
        returnReason: returnReason.value,
        rejectReason: decision.value === 'REJECT' ? rejectReason.value : '',
      },
    })

    window.alert('Cập nhật trạng thái trả hàng thành công.')
    router.back()
  } catch (err) {
    console.error(err)
    window.alert('Cập nhật trạng thái trả hàng thất bại.')
  } finally {
    saving.value = false
  }
}

const goBack = () => {
  router.back()
}

onMounted(fetchOrder)
</script>

<style scoped>
/* giống layout order list */
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f5f5f7;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text',
    'Segoe UI', sans-serif;
}

.admin-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.page {
  padding: 24px 32px 32px;
}

/* ========== HEADER ========== */
.od-header {
  margin-bottom: 8px;
}

.od-title {
  font-size: 26px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.od-subrow {
  margin-top: 20px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.od-subrow__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
}

.od-subtitle {
  font-size: 14px;
  font-weight: 600;
}

/* ========== STATE ========== */
.state {
  margin-top: 12px;
  font-size: 14px;
  color: #4b5563;
}

.state--error {
  color: #b91c1c;
}

/* PANEL CHÍNH (khung trắng giữa nền xám) */
.od-panel {
  margin-top: 12px;
  background: #f7f7f7;
  border-radius: 20px;
  padding: 32px;
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1.1fr);
  gap: 24px;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.06);
}

/* CARD CHUNG */
.card {
  background: #ffffff;
  border-radius: 20px;
  padding: 20px 24px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px;
  color: #111827;
}

/* INFO CARD */
.info-card + .info-card {
  margin-top: 16px;
}

.info-line {
  margin: 2px 0;
  font-size: 14px;
  color: #111827;
}

.info-line--addr {
  margin-top: 6px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin: 4px 0;
  font-size: 14px;
}

.info-label {
  color: #6b7280;
}

.info-value {
  color: #111827;
}

/* PRODUCT CARD */
.prod-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.prod-table th,
.prod-table td {
  padding: 8px 4px;
}

.prod-table thead th {
  font-weight: 500;
  color: #111827;
  border-bottom: 1px solid #e5e7eb;
}

.col-center {
  text-align: center;
}

.col-right {
  text-align: right;
}

.total-label {
  padding-top: 8px;
  border-top: 1px solid #e5e7eb;
  font-weight: 500;
}

.total-price {
  padding-top: 8px;
  border-top: 1px solid #e5e7eb;
  font-weight: 600;
  color: #ef4444;
}

.empty-row {
  text-align: center;
  padding: 12px 0;
  color: #6b7280;
}

/* RETURN CARD */
.return-card {
  margin-top: 16px;
}

.return-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: 16px;
}

/* INPUT LÝ DO TRẢ HÀNG */
.reason-input {
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  font-size: 14px;
}

/* ACTION – RADIO TO MÀU #6BCA79 */
.action-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.action-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #111827;
  cursor: pointer;
}

/* radio lớn 27px, viền 2px, full màu khi checked */
.action-item input[type='radio'] {
  appearance: none;
  -webkit-appearance: none;
  width: 27px;
  height: 27px;
  border-radius: 50%;
  border: 2px solid #6bca79;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.action-item input[type='radio']:checked {
  background-color: #6bca79;
  border-color: #6bca79;
}

/* textarea lý do từ chối */
.reject-input {
  width: 100%;
  min-height: 70px;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  font-size: 14px;
  resize: vertical;
}

.reject-input:disabled {
  background: #f9fafb;
  color: #9ca3af;
}

/* BUTTONS */
.btn-row {
  margin-top: 20px;
  display: flex;
  gap: 12px;
}

.btn {
  min-width: 120px;
  height: 36px;
  border-radius: 8px;
  font-size: 14px;
  border: none;
  cursor: pointer;
}

.btn--primary {
  background: #2563eb;
  color: #ffffff;
}

.btn--primary:disabled {
  opacity: 0.7;
  cursor: default;
}

.btn--ghost {
  background: #ffffff;
  border: 1px solid #d1d5db;
  color: #111827;
}
</style>
