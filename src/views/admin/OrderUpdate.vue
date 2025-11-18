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
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 18L9 12L15 6"
                        stroke="#111827"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"/>
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
                <span class="info-value">
                    {{ formatDate(order?.createdAt || order?.orderDate) }}
                </span>
                </div>

              <div class="info-row">
                <span class="info-label">Phương thức thanh toán:</span>
                <span class="info-value">
                  {{ paymentMethodLabel }}
                </span>
              </div>
            </div>
          </div>

          <!-- CỘT PHẢI: SẢN PHẨM + CẬP NHẬT TRẠNG THÁI -->
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

            <!-- Cập nhật trạng thái -->
            <div class="card status-card">
              <h2 class="card-title">Cập nhật trạng thái</h2>

              <div class="status-list">
                <label class="status-item">
                  <input
                    v-model="selectedStatus"
                    type="radio"
                    value="ORDERED"
                  />
                  <span>Chờ xác nhận</span>
                </label>

                <label class="status-item">
                  <input
                    v-model="selectedStatus"
                    type="radio"
                    value="PENDING"
                  />
                  <span>Xác nhận</span>
                </label>

                <label class="status-item">
                  <input
                    v-model="selectedStatus"
                    type="radio"
                    value="SHIPPING"
                  />
                  <span>Vận chuyển</span>
                </label>

                <label class="status-item">
                  <input
                    v-model="selectedStatus"
                    type="radio"
                    value="COMPLETED"
                  />
                  <span>Hoàn thành</span>
                </label>
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

// trạng thái đang chọn
const selectedStatus = ref('ORDERED')

// ========== LẤY ĐƠN HÀNG ==========
const fetchOrder = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const res = await request(`/orders/${orderId}`, { method: 'GET' })
    // Tùy backend: có thể là res.data hoặc res.data.order
    const data = res.data?.order || res.data
    order.value = data

    selectedStatus.value = String(data.status || 'ORDERED').toUpperCase()
  } catch (err) {
    console.error(err)
    errorMessage.value =
      err.message || 'Không tải được thông tin đơn hàng.'
  } finally {
    loading.value = false
  }
}

// ========== THÔNG TIN HIỂN THỊ ==========

const orderCode = computed(
  () => order.value?.orderCode || order.value?.code || order.value?.id || ''
)

const customerName = computed(() => {
  const o = order.value || {}
  const c = o.customer || o.user || {}

  return (
    o.customerName ||
    o.receiverName ||
    c.fullName ||
    c.fullname ||
    c.name ||
    c.username ||
    'Khách lẻ'
  )
})

const customerEmail = computed(() => {
  const o = order.value || {}
  const c = o.customer || o.user || {}
  return o.email || c.email || '—'
})

const customerPhone = computed(() => {
  const o = order.value || {}
  return o.phone || o.phoneNumber || '—'
})

const customerAddress = computed(() => {
  const o = order.value || {}
  return (
    o.address ||
    o.shippingAddress ||
    o.deliveryAddress ||
    'Chưa có địa chỉ giao hàng'
  )
})

// danh sách item
const items = computed(() => {
  const o = order.value || {}
  if (Array.isArray(o.items)) return o.items
  if (Array.isArray(o.orderItems)) return o.orderItems
  if (Array.isArray(o.products)) return o.products
  return []
})

const itemName = (item) =>
  item.productName ||
  item.name ||
  item.title ||
  item.product?.name ||
  'Sản phẩm'

const totalPrice = computed(() => {
  const o = order.value || {}
  if (typeof o.totalPrice === 'number') return o.totalPrice
  if (typeof o.totalAmount === 'number') return o.totalAmount
  if (typeof o.total === 'number') return o.total

  // fallback: cộng từ items
  return items.value.reduce((sum, it) => {
    const q = it.quantity || 1
    const p = it.price || it.unitPrice || 0
    return sum + q * p
  }, 0)
})

const paymentMethodLabel = computed(() => {
  const method = String(order.value?.paymentMethod || '').toUpperCase()

  if (method.includes('COD')) return 'Thanh toán khi nhận hàng (COD)'
  if (method.includes('ONLINE')) return 'Thanh toán online'
  if (method.includes('BANK')) return 'Chuyển khoản ngân hàng'
  return order.value?.paymentMethod || 'Không rõ'
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

// ========== LƯU TRẠNG THÁI ==========
const handleSave = async () => {
  if (!order.value) return

  try {
    saving.value = true
    await request(`/orders/${orderId}/status`, {
      method: 'PUT',
      data: { status: selectedStatus.value },
    })
    window.alert('Cập nhật trạng thái thành công.')
    router.back()
  } catch (err) {
    console.error(err)
    window.alert('Cập nhật trạng thái thất bại.')
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
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text",
    "Segoe UI", sans-serif;
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

/* Tiêu đề "Quản lý đơn hàng" */
.od-title {
  font-size: 26px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

/* Hàng chứa icon back + chữ "Cập nhật đơn hàng" */
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



/* Text "Cập nhật đơn hàng" */
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

.info-value--price {
  font-weight: 600;
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

/* STATUS CARD */
.status-list {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #111827;
}

.status-item input[type='radio'] {
  width: 16px;
  height: 16px;
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
