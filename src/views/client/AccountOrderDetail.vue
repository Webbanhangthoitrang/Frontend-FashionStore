<!-- src/views/client/AccountOrderDetail.vue -->
<template>
  <div class="account">
    <ClientHeader />

    <main class="page" role="main">
      <div class="container">
        <div class="grid">
          <!-- SIDEBAR -->
          <AccountSidebar />

          <!-- CHI TIẾT ĐƠN HÀNG -->
          <section class="order-detail" aria-label="Chi tiết đơn hàng">
            <!-- TOP BAR: ← TRỞ LẠI | MÃ ĐƠN HÀNG | TRẠNG THÁI ĐỎ -->
            <div class="od-topbar">
              <button type="button" class="od-back-link" @click="goBack">
                <span class="od-back-icon">
                  <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12.5 4.16602L7.5 9.16602L12.5 14.166"
                      fill="none"
                      stroke="#585858"
                      stroke-width="1.7"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
                <span class="od-back-text">TRỞ LẠI</span>
              </button>

              <div class="od-topbar-code">
                MÃ ĐƠN HÀNG:
                <span class="od-topbar-code__value">
                  {{ displayOrderCode(order) }}
                </span>
              </div>

              <div v-if="order" class="od-topbar-status">
                {{ headerStatusText }}
              </div>
            </div>

            <!-- STATE -->
            <p v-if="loading" class="od-state">Đang tải chi tiết đơn hàng…</p>
            <p v-else-if="errorMessage" class="od-state od-state--error">
              {{ errorMessage }}
            </p>

            <!-- CARD CHÍNH -->
            <div v-else-if="order" class="od-card">
              <!-- HÀNG TRÊN: ĐỊA CHỈ + CỘT TRẠNG THÁI -->
              <div class="od-top">
                <!-- ĐỊA CHỈ NHẬN HÀNG -->
                <div class="od-top-left">
                  <h2 class="od-block-title">Địa chỉ nhận hàng</h2>
                  <p class="od-name">{{ receiverName }}</p>
                  <p v-if="receiverPhone || receiverEmail" class="od-line">
                    <span v-if="receiverPhone">{{ receiverPhone }}</span>
                    <span v-if="receiverPhone && receiverEmail"> · </span>
                    <span v-if="receiverEmail">{{ receiverEmail }}</span>
                  </p>
                  <p class="od-line">
                    {{ fullAddress }}
                  </p>
                </div>

                <!-- CỘT TRẠNG THÁI / THỜI GIAN -->
                <div class="od-top-right">
                  <div class="od-time-row">
                    <div class="od-time-icon">
                      <svg
                        width="50"
                        height="50"
                        viewBox="0 0 50 50"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M32.292 10.417C35.218 10.417 36.6809 10.417 37.7319 11.1192C38.1868 11.4232 38.5775 11.8138 38.8814 12.2688C39.5837 13.3197 39.5837 14.7827 39.5837 17.7087V37.5003C39.5837 41.4287 39.5837 43.3929 38.3633 44.6133C37.1429 45.8337 35.1787 45.8337 31.2503 45.8337H18.7503C14.822 45.8337 12.8578 45.8337 11.6374 44.6133C10.417 43.3929 10.417 41.4287 10.417 37.5003V17.7087C10.417 14.7827 10.417 13.3197 11.1192 12.2688C11.4232 11.8138 11.8138 11.4232 12.2688 11.1192C13.3197 10.417 14.7827 10.417 17.7087 10.417"
                          stroke="#4C80E6"
                          stroke-width="3"
                        />
                        <path
                          d="M18.75 10.4167C18.75 8.11548 20.6155 6.25 22.9167 6.25H27.0833C29.3845 6.25 31.25 8.11548 31.25 10.4167C31.25 12.7179 29.3845 14.5833 27.0833 14.5833H22.9167C20.6155 14.5833 18.75 12.7179 18.75 10.4167Z"
                          stroke="#4C80E6"
                          stroke-width="3"
                        />
                        <path
                          d="M18.75 25L31.25 25"
                          stroke="#4C80E6"
                          stroke-width="3"
                          stroke-linecap="round"
                        />
                        <path
                          d="M18.75 33.333L27.0833 33.333"
                          stroke="#4C80E6"
                          stroke-width="3"
                          stroke-linecap="round"
                        />
                      </svg>
                    </div>

                    <div class="od-time-text">
                      <div class="od-time-main">
                        {{ formatDateTime(mainOrder.createdAt || mainOrder.orderDate) }}
                      </div>

                      <!-- DÒNG TRẠNG THÁI CHÍNH -->
                      <div class="od-status-main" :class="statusClass('MAIN')">
                        {{ statusMainText }}
                      </div>

                      <!-- DÒNG "Đơn hàng đã được đặt" -->
                      <button
                        type="button"
                        class="od-status-sub"
                        :class="statusClass('PLACED')"
                      >
                        Đơn hàng đã được đặt
                      </button>
                    </div>
                  </div>

                  <!-- CÁC BƯỚC TRẠNG THÁI -->
                  <div class="od-steps">
                    <span :class="statusClass('SHIPPING')">Vận chuyển</span>
                    <span :class="statusClass('DONE')">Hoàn thành</span>
                  </div>
                </div>
              </div>

              <!-- CARD SẢN PHẨM + TỔNG TIỀN -->
              <div class="od-product-card" v-if="items.length > 0">
                <!-- HÀNG SẢN PHẨM -->
                <div class="od-product-row">
                  <img
                    :src="firstItem.image || firstItem.img || firstItem.product?.imageUrl"
                    alt=""
                    class="od-product-img"
                  />
                  <div class="od-product-main">
                    <div class="od-product-name">
                      {{ firstItem.productName || firstItem.name || firstItem.product?.name }}
                    </div>
                    <div class="od-product-meta">
                      <span>Số lượng: x{{ firstItem.quantity }}</span>
                    </div>
                  </div>

                  <div class="od-product-price">
                    {{ formatCurrency(firstItem.unitPrice || firstItem.price) }}
                  </div>
                </div>

                <!-- HÀNG DƯỚI: TỔNG TIỀN + PHƯƠNG THỨC THANH TOÁN -->
                <div class="od-bottom-row">
                  <div class="od-money-block">
                    <div class="od-row">
                      <span>Tổng tiền hàng</span>
                      <span>{{ formatCurrency(subtotal) }}</span>
                    </div>
                    <div class="od-row od-row--total">
                      <span>Thành tiền</span>
                      <span class="od-money">
                        {{ formatCurrency(totalAmount) }}
                      </span>
                    </div>

                    <!-- Phương thức thanh toán NGAY DƯỚI dòng Thành tiền -->
                    <p class="od-pay-method">
                      Phương Thức Thanh Toán:
                      <strong>{{ paymentMethodLabel }}</strong>
                    </p>
                  </div>
                </div>
              </div>

              <div v-else class="od-no-item">
                Không có sản phẩm trong đơn hàng.
              </div>
            </div>

            <!-- Không có order -->
            <p v-else class="od-state">Không tìm thấy đơn hàng.</p>
          </section>
        </div>
      </div>
    </main>

    <ClientFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ClientHeader from '../../components/client/ClientHeaderLogged.vue'
import ClientFooter from '../../components/client/ClientFooter.vue'
import AccountSidebar from '../../components/client/AccountSidebar.vue'
import { request } from '../../services/http'

const props = defineProps({
  id: {
    type: [Number, String],
    required: true,
  },
})

const router = useRouter()

const order = ref(null)
const loading = ref(false)
const errorMessage = ref('')

const normalizeStatus = (value) => {
  if (!value) return ''
  return String(value).toUpperCase().trim()
}

const mainOrder = computed(() => {
  const o = order.value || {}
  return o.order || o
})

const fetchOrderDetail = async () => {
  if (!props.id) {
    errorMessage.value = 'Không tìm thấy ID đơn hàng.'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const res = await request(`/orders/${props.id}`, { method: 'GET' })
    order.value = res.data?.data || res.data || null
    console.log('ORDER DETAIL (CLIENT):', order.value)
  } catch (err) {
    console.error(err)
    errorMessage.value = err.message || 'Không tải được chi tiết đơn hàng.'
  } finally {
    loading.value = false
  }
}

const displayOrderCode = (o) => {
  const root = o || {}
  const m = root.order || root
  return m.orderCode || m.code || root.id || ''
}

const receiverName = computed(() => {
  const root = order.value || {}
  const m = mainOrder.value || {}
  return (
    m.receiverName ||
    m.customerName ||
    m.shippingName ||
    root.customer?.fullName ||
    root.customer?.name ||
    root.user?.fullName ||
    'Khách hàng'
  )
})

const receiverPhone = computed(() => {
  const root = order.value || {}
  const m = mainOrder.value || {}
  return (
    m.receiverPhone ||
    m.phone ||
    root.customer?.phone ||
    root.user?.phone ||
    ''
  )
})

const receiverEmail = computed(() => {
  const root = order.value || {}
  const m = mainOrder.value || {}
  return (
    m.receiverEmail ||
    m.email ||
    root.customer?.email ||
    root.user?.email ||
    ''
  )
})

const fullAddress = computed(() => {
  const root = order.value || {}
  const m = mainOrder.value || {}
  const fullData = root._fullData || {}
  const addrObj = fullData.address || {}

  const composedFromAddressObj = [
    addrObj.addressLine,
    addrObj.wardName,
    addrObj.districtName,
    addrObj.city,
    addrObj.province,
    addrObj.country,
  ]
    .filter(Boolean)
    .join(', ')

  const combined =
    m.shippingAddress ||
    m.address ||
    root.shippingAddress ||
    root.address ||
    root.customer?.address ||
    fullData.receiverAddress ||
    composedFromAddressObj

  return combined || 'Chưa có địa chỉ giao hàng'
})

const items = computed(() => {
  const root = order.value || {}
  const m = mainOrder.value || {}

  const candidates = [
    root.products,
    m.items,
    m.orderItems,
    m.orderDetails,
    m.orderDetail,
    m.detail,
  ]
  const found = candidates.find((c) => Array.isArray(c))
  return found || []
})

const firstItem = computed(() => items.value[0] || {})

const subtotal = computed(() => {
  const root = order.value || {}
  if (root.subtotal != null) return Number(root.subtotal)
  return items.value.reduce((sum, it) => sum + itemTotal(it), 0)
})

const shippingFee = computed(() => {
  const root = order.value || {}
  const m = mainOrder.value || {}
  return root.shippingFee || m.shippingFee || m.shipFee || 0
})

const totalAmount = computed(() => {
  const root = order.value || {}
  const m = mainOrder.value || {}
  return (
    root.totalAmount ||
    root.total ||
    m.totalAmount ||
    m.totalPrice ||
    subtotal.value + shippingFee.value
  )
})

const paymentMethodLabel = computed(() => {
  const m = mainOrder.value || {}
  const pm = String(m.paymentMethod || m.paymentType || 'COD').toUpperCase()

  if (pm.includes('COD')) return 'Thanh toán khi nhận hàng (COD)'
  if (pm.includes('VNPAY')) return 'Thanh toán VNPay'
  if (pm.includes('BANK')) return 'Chuyển khoản ngân hàng'
  return m.paymentMethod || 'Khác'
})

const headerStatusText = computed(() => {
  const m = mainOrder.value || {}
  const uiStatus = normalizeStatus(m.status)

  switch (uiStatus) {
    case 'PENDING':
    case 'ORDERED':
      return 'Người bán đang chuẩn bị đơn hàng'
    case 'SHIPPING':
      return 'Đơn hàng đang được vận chuyển'
    case 'COMPLETED':
      return 'Đơn hàng đã hoàn thành'
    case 'CANCELLED':
      return 'Đơn hàng đã bị hủy'
    case 'RETURNED':
      return 'Đơn hàng đã trả hàng'
    default:
      return 'Trạng thái đơn hàng không rõ'
  }
})

/**
 * TEXT TRẠNG THÁI CHÍNH (dòng màu xanh lớn)
 * ORDERED  -> "Đã đặt hàng thành công"
 * PENDING  -> "Chờ xác nhận"
 * SHIPPING -> "Vận chuyển"
 * COMPLETED/RETURNED -> "Hoàn thành"
 * CANCELLED -> "Hủy hàng"
 */
const statusMainText = computed(() => {
  const ui = normalizeStatus(mainOrder.value?.status)

  switch (ui) {
    case 'ORDERED':
      return 'Đã đặt hàng thành công'
    case 'PENDING':
      return 'Chờ xác nhận'
    case 'SHIPPING':
      return 'Vận chuyển'
    case 'COMPLETED':
    case 'RETURNED':
      return 'Hoàn thành'
    case 'CANCELLED':
      return 'Hủy hàng'
    default:
      return 'Không rõ'
  }
})

const currentStatus = computed(() => normalizeStatus(mainOrder.value?.status))

/**
 * Trả về class để tô màu xanh/xám theo từng "phần" hiển thị:
 * - MAIN    : dòng statusMainText (dòng to)
 * - PLACED  : dòng "Đơn hàng đã được đặt"
 * - SHIPPING: dòng "Vận chuyển"
 * - DONE    : dòng "Hoàn thành"
 */
const statusClass = (part) => {
  const ui = currentStatus.value
  let active = false

  switch (part) {
    case 'MAIN':
      // ORDERED: "Đã đặt hàng thành công"
      // CANCELLED: "Hủy hàng"
      active = ui === 'ORDERED' || ui === 'CANCELLED'
      break
    case 'PLACED':
      // PENDING: "Đơn hàng đã được đặt"
      active = ui === 'PENDING'
      break
    case 'SHIPPING':
      // SHIPPING: "Vận chuyển"
      active = ui === 'SHIPPING'
      break
    case 'DONE':
      // COMPLETED, RETURNED: "Hoàn thành"
      active = ui === 'COMPLETED' || ui === 'RETURNED'
      break
    default:
      active = false
  }

  return active ? 'step-active' : 'step-inactive'
}

const statusLabel = (status) => {
  const uiStatus = normalizeStatus(status)
  switch (uiStatus) {
    case 'ORDERED':
      return 'Đã đặt'
    case 'PENDING':
      return 'Chờ xác nhận'
    case 'SHIPPING':
      return 'Vận chuyển'
    case 'COMPLETED':
      return 'Đặt hàng thành công'
    case 'CANCELLED':
      return 'Đã hủy'
    case 'RETURNED':
      return 'Đã trả hàng'
    default:
      return 'Không rõ'
  }
}

const formatDateTime = (value) => {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  const hh = String(d.getHours()).padStart(2, '0')
  const mi = String(d.getMinutes()).padStart(2, '0')
  return `${hh}:${mi} ${dd}-${mm}-${yyyy}`
}

const formatCurrency = (num) => {
  const n = Number(num || 0)
  return n.toLocaleString('vi-VN') + '₫'
}

const itemTotal = (item) => {
  const price = Number(item.unitPrice || item.price || 0)
  const qty = Number(item.quantity || 0)
  return price * qty
}

const goBack = () => {
  router.back()
}

onMounted(fetchOrderDetail)
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Khula:wght@400;600;700&display=swap");

.account {
  font-family: "Khula", system-ui, -apple-system, "Segoe UI", Roboto, Arial,
    sans-serif;
  background: #f5f5f5;
}
.account * {
  font-family: inherit;
}

.page {
  padding: 24px 0 40px;
}
.container {
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 16px;
}
.grid {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 24px;
}

.order-detail {
  background: transparent;
  border: none;
}

/* TOP BAR */
.od-topbar {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  column-gap: 16px;
  margin-bottom: 8px;
  padding: 0 4px;
}

.od-back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  background: transparent;
  padding: 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  cursor: pointer;
}

.od-back-icon {
  width: 24px;
  height: 24px;
  border-radius: 3px;
  border: 1px solid #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.od-back-icon svg {
  width: 14px;
  height: 14px;
  display: block;
}

.od-back-text {
  line-height: 1;
}

.od-topbar-code {
  font-size: 14px;
  color: #374151;
  text-align: center;
}
.od-topbar-code__value {
  font-weight: 600;
}

.od-topbar-status {
  font-size: 13px;
  font-weight: 500;
  color: #ff0000;
  white-space: nowrap;
}

/* STATE */
.od-state {
  font-size: 14px;
  color: #4b5563;
  padding: 8px 4px;
}
.od-state--error {
  color: #b91c1c;
}

/* CARD CHÍNH */
.od-card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
}

/* HÀNG TRÊN */
.od-top {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 12px;
}

.od-top-left {
  flex: 2;
  padding-right: 24px;
}

.od-top-right {
  flex: 1.5;
  border-left: 1px solid #e5e7eb;
  padding-left: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
}

.od-block-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 6px;
  color: #111827;
}

.od-name {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 2px;
}

.od-line {
  font-size: 13px;
  margin: 2px 0;
}

/* CỘT THỜI GIAN & TRẠNG THÁI */
.od-time-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.od-time-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.od-time-icon svg {
  width: 28px;
  height: 28px;
}

.od-time-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.od-time-main {
  font-size: 13px;
  color: #111827;
}

.od-status-main {
  font-size: 14px;
  font-weight: 600;
  /* màu mặc định là xám, màu xanh set bằng .step-active */
  color: #6b7280;
}

.od-status-sub {
  margin-top: 0;
  padding: 0;
  border: none;
  background: none;
  font-size: 13px;
  color: #6b7280; /* mặc định xám */
  text-decoration: none;
  cursor: default;
}

/* CÁC BƯỚC TRẠNG THÁI */
.od-steps {
  margin-top: 8px;
  margin-left: 45px;
  font-size: 13px;
  color: #6b7280;
  display: flex;
  flex-direction: column;
  gap: 4px;
  line-height: 1.4;
}

/* CLASS CHUNG CHO ACTIVE / INACTIVE */
.step-active {
  color: #2563eb;
  font-weight: 600;
}

.step-inactive {
  color: #6b7280;
}

/* CARD SẢN PHẨM */
.od-product-card {
  margin-top: 12px;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
  padding: 12px 14px 14px;
  background: #ffffff;
}

.od-product-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f3f4f6;
}

.od-product-img {
  width: 72px;
  height: 72px;
  border-radius: 3px;
  object-fit: cover;
  background: #f3f4f6;
}

.od-product-main {
  flex: 1;
}

.od-product-name {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
}

.od-product-meta {
  font-size: 13px;
  color: #6b7280;
  margin-top: 2px;
}

.od-product-price {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

/* KHỐI TIỀN */
.od-bottom-row {
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
}

.od-money-block {
  flex: 0 0 auto;
  font-size: 15px;
  min-width: 260px;
}

.od-row {
  display: flex;
  justify-content: flex-end;
  margin: 2px 0;
  column-gap: 24px;
}
.od-row span:last-child {
  text-align: right;
  min-width: 100px;
}

.od-row--total {
  margin-top: 4px;
  font-weight: 600;
}

.od-money {
  color: #ff0000;
}

/* PHƯƠNG THỨC THANH TOÁN (ngay dưới Thành tiền) */
.od-pay-method {
  margin-top: 6px;
  font-size: 13px;
  color: #4b5563;
  text-align: right;
}
.od-pay-method strong {
  font-weight: 600;
}

/* NO ITEMS */
.od-no-item {
  padding: 12px 0;
  font-size: 13px;
  color: #6b7280;
}
</style>
