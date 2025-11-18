<!-- src/views/admin/OrderManage.vue -->
<template>
  <div class="admin-layout">
    <!-- SIDEBAR -->
    <AdminSidebar />

    <!-- CONTENT PHẢI -->
    <div class="admin-content">
      <main class="page">
        <!-- HEADER GIỐNG TRANG SẢN PHẨM -->
        <div class="header-band">
          <div class="page-head">
            <h2 class="page-title">Quản lý đơn hàng</h2>

            <!-- Bên phải tạm để trống, sau này thêm nút khác nếu cần -->
            <div class="page-head__right"></div>
          </div>

          <!-- HÀNG 2: Tìm kiếm + Lọc trạng thái -->
          <div class="search-row">
            <div class="search-group">
              <!-- SEARCH -->
              <div class="search">
                <span class="search__icon">
                  <svg viewBox="0 0 24 24">
                    <circle
                      cx="11"
                      cy="11"
                      r="7"
                      stroke="currentColor"
                      stroke-width="1.4"
                      fill="none"
                    />
                    <line
                      x1="16"
                      y1="16"
                      x2="21"
                      y2="21"
                      stroke="currentColor"
                      stroke-width="1.4"
                    />
                  </svg>
                </span>
                <input
                  v-model.trim="searchTerm"
                  class="search__input"
                  type="text"
                  placeholder="Tìm kiếm đơn hàng..."
                />
              </div>

              <!-- FILTER STATUS -->
              <div class="filter-group">
                <span class="filter-label">Lọc trạng thái</span>
                <select
                v-model="statusFilter"
                class="filter-select"
              >
                <option value="">Tất cả</option>
                <option value="PENDING">Chờ xác nhận</option>
                <option value="SHIPPING">Vận chuyển</option>
                <option value="RETURN_REQUEST">Yêu cầu trả hàng</option>
                <option value="COMPLETED">Hoàn thành</option>
                <option value="CANCELLED">Đã hủy</option>
              </select>

              </div>
            </div>
          </div>
        </div>

        <!-- STATE -->
        <p v-if="loading" class="state">Đang tải danh sách đơn hàng…</p>
        <p v-else-if="errorMessage" class="state state--error">
          {{ errorMessage }}
        </p>

        <!-- TABLE -->
        <div v-else class="table-wrap orders-wrap">
          <table class="table orders-table">
            <thead>
              <tr>
                <th class="col-id">ID</th>
                <th class="col-customer">Khách hàng</th>
                <th class="col-date">Ngày đặt</th>
                <th class="col-status">Trạng thái</th>
                <th class="col-action"></th>
              </tr>
            </thead>

            <tbody>
              <tr v-if="filteredOrders.length === 0">
                <td colspan="5" class="empty-row">
                  Không tìm thấy đơn hàng phù hợp.
                </td>
              </tr>

              <tr v-for="order in filteredOrders" :key="order.id">
                <td>{{ displayOrderCode(order) }}</td>
                <td>{{ displayCustomerName(order) }}</td>
                <td>{{ formatDate(order.createdAt || order.orderDate) }}</td>
                <td>
                  <span class="badge" :class="statusClass(order.status)">
                    {{ statusLabel(order.status) }}
                  </span>
                </td>
                <td class="col-action">
                  <button
                    type="button"
                    class="link-btn"
                    @click="handleUpdateStatus(order)"
                  >
                    Cập nhật
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminSidebar from '../../components/admin/AdminSidebar.vue'
import { request } from '../../services/http'
import { useRouter } from 'vue-router' 

// ===== STATE CƠ BẢN =====
const router = useRouter() 
const orders = ref([])          // danh sách đơn từ API
const loading = ref(false)      // trạng thái loading
const errorMessage = ref('')    // thông báo lỗi

const searchTerm = ref('')      // ô tìm kiếm
const statusFilter = ref('')    // lọc trạng thái (giá trị enum: ORDERED, PENDING,...)

// ===== HÀM CHUẨN HÓA TRẠNG THÁI (về UPPERCASE) =====
const normalizeStatus = (value) => {
  if (!value) return ''
  return String(value).toUpperCase().trim()
}

// ===== 1. GỌI API LẤY DANH SÁCH ĐƠN =====
const fetchOrders = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const res = await request('/orders', { method: 'GET' })
    console.log('GET /orders res:', res)

    // backend: { success, message, data }  hoặc { data: { orders: [...] } }
    const list = Array.isArray(res.data)
      ? res.data
      : Array.isArray(res.data?.orders)
      ? res.data.orders
      : []

    orders.value = list

    if (orders.value.length) {
      console.log('🔍 SAMPLE ORDER:', orders.value[0])
    }
  } catch (err) {
    console.error(err)
    errorMessage.value = err.message || 'Không tải được danh sách đơn hàng.'
    orders.value = []
  } finally {
    loading.value = false
  }
}

// ===== 2. LỌC THEO TỪ KHÓA + TRẠNG THÁI =====
const filteredOrders = computed(() => {
  const term = searchTerm.value.trim().toLowerCase()
  const status = statusFilter.value          // enum: ORDERED, PENDING, ...
  const list = Array.isArray(orders.value) ? orders.value : []

  return list.filter((o) => {
    const code = (displayOrderCode(o) || '').toLowerCase()
    const name = (displayCustomerName(o) || '').toLowerCase()
    const uiStatus = normalizeStatus(o.status)

    const matchSearch = !term || code.includes(term) || name.includes(term)
    const matchStatus = !status || uiStatus === status

    return matchSearch && matchStatus
  })
})

// ===== 3. HIỂN THỊ LABEL + MÀU TRẠNG THÁI =====
// 6 trạng thái chuẩn backend: ORDERED, PENDING, SHIPPING, COMPLETED, CANCELLED, RETURNED
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
      return 'Hoàn thành'
    case 'CANCELLED':
      return 'Đã hủy'
    case 'RETURNED':
      return 'Đã trả hàng'
    default:
      return 'Không rõ'
  }
}

const statusClass = (status) => {
  const uiStatus = normalizeStatus(status)

  switch (uiStatus) {
    case 'ORDERED':
    case 'PENDING':
      return 'badge--pending'   // vàng
    case 'SHIPPING':
      return 'badge--shipping'  // xanh lá nhạt
    case 'COMPLETED':
      return 'badge--done'      // xanh dương
    case 'CANCELLED':
    case 'RETURNED':
      return 'badge--cancel'    // đỏ / hồng
    default:
      return 'badge--default'
  }
}

// ===== 4. HÀM PHỤ: CODE, TÊN KHÁCH, NGÀY =====
const displayOrderCode = (order) =>
  order.orderCode || order.code || order.id

const displayCustomerName = (order) => {
  const c = order.customer || {}
  const u = order.user || {}

  return (
    order.customerName ||  
    order.receiverName ||     

    c.fullName ||
    c.fullname ||
    c.name ||
    c.username ||
    c.email ||

    u.fullName ||
    u.fullname ||
    u.name ||
    u.username ||
    u.email ||

    'Khách lẻ'
  )
}

const formatDate = (value) => {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

// ===== 5. CẬP NHẬT TRẠNG THÁI ĐƠN =====
const ALLOWED_STATUSES = ['ORDERED', 'PENDING', 'SHIPPING', 'COMPLETED', 'CANCELLED', 'RETURNED']

const handleUpdateStatus = (order) => {
  const uiStatus = normalizeStatus(order.status)

  // Nếu là đơn "trả hàng" thì tạm chưa cho vào màn này
  if (uiStatus === 'RETURN_REQUEST' || uiStatus === 'RETURNED') {
    window.alert('Đơn trả hàng sẽ xử lý ở màn khác.')
    return
  }

  // Điều hướng sang màn chi tiết cập nhật đơn
  router.push({
    name: 'admin-order-update',
    params: { id: order.id },
  })
}


// Lấy dữ liệu khi component mount
onMounted(fetchOrders)
</script>

<style scoped>
/* --- LAYOUT GIỐNG Y TRANG PRODUCT --- */
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
  padding: 0 32px 16px;
}

/* HEADER BAND */
.header-band {
  background: #f6f7fb;
  border-bottom: 1px solid #e9ecf3;
}

.page-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0 8px;
}

.page-title {
  font-size: 26px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

/* SEARCH + FILTER ROW */
.search-row {
  display: flex;
  align-items: center;
  padding-bottom: 16px;
}

.search-group {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search {
  position: relative;
  width: 360px;
}

.search__icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: #b2b6c6;
}

.search__input {
  border: 1px solid #e3e6ef;
  height: 44px;
  width: 100%;
  padding: 0 14px 0 40px;
  border-radius: 18px;
  background: #fff;
  font-size: 14px;
  color: #111827;
}

.search__input::placeholder {
  color: #a9afc2;
}

.search__input:focus {
  border-color: #cbd2ff;
  box-shadow: 0 0 0 3px rgba(91, 108, 255, 0.12);
}

/* FILTER STATUS */
.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 14px;
  color: #4b5563;
}

.filter-select {
  min-width: 140px;
  height: 40px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid #e3e6ef;
  background: #ffffff;
  font-size: 14px;
}

/* STATE */
.state {
  margin-top: 12px;
  font-size: 14px;
  color: #4b5563;
}

.state--error {
  color: #b91c1c;
}

/* TABLE GIỐNG PRODUCT */
.table-wrap {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.04);
  overflow: hidden;
  margin-top: 12px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 15px;
}

.table thead {
  background: #fafafa;
}

.table th,
.table td {
  padding: 14px 18px;
  text-align: left;
}

.table th {
  font-weight: 500;
  color: #111827;
}

.table tbody tr {
  transition: background-color 0.2s ease;
}

.table tbody tr:hover {
  background-color: #f3f4f6;
}

/* CỘT */
.col-id {
  width: 190px;
}

.col-customer {
  width: 180px;
}

.col-date {
  width: 160px;
}

.col-status {
  width: 160px;
}

.col-action {
  width: 120px;
  text-align: right;
}

.empty-row {
  text-align: center;
  padding: 24px 0;
  color: #6b7280;
}

/* BADGE STATUS */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
}

.badge--pending {
  background: #fef3c7;
  color: #92400e;
}

.badge--shipping {
  background: #dbeafe;
  color: #1d4ed8;
}

.badge--return {
  background: #ede9fe;
  color: #4c1d95;
}

.badge--done {
  background: #dcfce7;
  color: #166534;
}

.badge--cancel {
  background: #fee2e2;
  color: #b91c1c;
}

.badge--default {
  background: #e5e7eb;
  color: #374151;
}

/* LINK "Cập nhật" */
.link-btn {
  border: none;
  background: none;
  padding: 0;
  font-size: 14px;
  font-weight: 500;
  color: #2563eb;
  cursor: pointer;
}

.link-btn:hover {
  text-decoration: underline;
}
</style>
