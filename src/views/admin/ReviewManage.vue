<!-- src/views/admin/ReviewManage.vue -->
<template>
  <div class="admin-layout">
    <!-- SIDEBAR -->
    <AdminSidebar />

    <!-- CONTENT PHẢI -->
    <div class="admin-content">
      <main class="page">
        <!-- HEADER BAND -->
        <div class="header-band">
          <div class="page-head">
            <h2 class="page-title">Quản lý đánh giá</h2>

            <!-- HÀNG FILTER: Lịch (Hôm nay) + Dropdown trạng thái -->
            <div class="rv-tabs" role="tablist">
              <!-- FILTER THỜI GIAN (DASHBOARDCALENDAR) -->
              <div class="rv-filter-wrapper" @click.stop>
                <button
                  type="button"
                  class="rv-tab-btn"
                  :class="{ 'rv-tab-btn--active': openCalendar }"
                  @click="toggleCalendar"
                >
                  <svg
                    class="rv-tab-icon"
                    :class="{ 'rv-tab-icon--up': openCalendar }"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M6 12L10 8L14 12"
                      stroke="currentColor"
                      stroke-width="2"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <span>{{ periodLabel }}</span>
                </button>

                <!-- POPUP LỊCH DÙNG CHUNG -->
                <DashboardCalendar
                  v-if="openCalendar"
                  v-model="period"
                  :options="periodOptions"
                  @apply="handleCalendarApply"
                  @cancel="handleCalendarCancel"
                />
              </div>

              <!-- DROPDOWN TRẠNG THÁI (TẤT CẢ / ĐÃ / CHƯA) -->
              <div class="rv-dropdown" ref="statusDropdownRef">
                <button
                  type="button"
                  class="rv-tab-btn"
                  @click.stop="toggleStatusDropdown"
                >
                  <svg
                    class="rv-tab-icon"
                    :class="{ 'rv-tab-icon--up': statusDropdownOpen }"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M6 12L10 8L14 12"
                      stroke="currentColor"
                      stroke-width="2"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <span>{{ statusLabel }}</span>
                </button>

                <!-- POPUP LIST TRẠNG THÁI -->
                <transition name="rv-dd">
                  <div v-if="statusDropdownOpen" class="rv-dd-panel">
                    <button
                      type="button"
                      class="rv-dd-item"
                      :class="{ 'rv-dd-item--active': reviewFilter === 'all' }"
                      @click="setReviewFilter('all')"
                    >
                      Tất cả
                    </button>
                    <button
                      type="button"
                      class="rv-dd-item"
                      :class="{ 'rv-dd-item--active': reviewFilter === 'replied' }"
                      @click="setReviewFilter('replied')"
                    >
                      Đã phản hồi
                    </button>
                    <button
                      type="button"
                      class="rv-dd-item"
                      :class="{ 'rv-dd-item--active': reviewFilter === 'unreplied' }"
                      @click="setReviewFilter('unreplied')"
                    >
                      Chưa phản hồi
                    </button>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </div>

        <!-- KHỐI TRẮNG CHÍNH (THỐNG KÊ + BẢNG) -->
        <section class="rv-panel">
          <!-- HÀNG THỐNG KÊ -->
          <section class="rv-stat-row">
            <article class="rv-stat-card">
              <h3 class="rv-stat-label">Tổng đánh giá</h3>
              <p class="rv-stat-value">{{ stats.total }}</p>
            </article>

            <article class="rv-stat-card">
              <h3 class="rv-stat-label">Trung bình sao</h3>
              <p class="rv-stat-value">{{ stats.avg.toFixed(1) }}</p>
            </article>

            <article class="rv-stat-card">
              <h3 class="rv-stat-label">Chưa phản hồi</h3>
              <p class="rv-stat-value">{{ stats.pending }}</p>
            </article>
          </section>

          <!-- STATE -->
          <p v-if="loading" class="state">Đang tải danh sách đánh giá…</p>
          <p v-else-if="errorMessage" class="state state--error">
            {{ errorMessage }}
          </p>

          <!-- BẢNG DANH SÁCH -->
          <div v-else class="rv-table-wrap">
            <table class="rv-table">
              <thead>
                <tr>
                  <th class="rv-col-check">
                    <input
                      type="checkbox"
                      class="rv-checkbox"
                      :checked="isAllSelected"
                      @change="toggleSelectAll"
                    />
                  </th>
                  <th class="rv-col-img">Ảnh</th>
                  <th class="rv-col-name">Tên</th>
                  <th class="rv-col-customer">Khách hàng</th>
                  <th class="rv-col-rating">Điểm</th>
                  <th class="rv-col-time">Thời gian đặt</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="(item, index) in filteredReviews"
                  :key="item.id || index"
                  class="rv-row"
                >
                  <td class="rv-col-check">
                    <input
                      type="checkbox"
                      class="rv-checkbox"
                      v-model="selectedIds"
                      :value="item.id"
                    />
                  </td>

                  <td class="rv-col-img">
                    <div class="rv-img-wrap">
                      <img
                        :src="item.imageUrl || item.product?.thumbnail || placeholderImg"
                        alt="Ảnh sản phẩm"
                        class="rv-img"
                      />
                    </div>
                  </td>

                  <td class="rv-col-name">
                    <div class="rv-prod-name">
                      {{ item.product?.name || '—' }}
                    </div>
                    <div
                      v-if="item.comment"
                      class="rv-prod-sub"
                    >
                      {{ item.comment }}
                    </div>
                  </td>

                  <td class="rv-col-customer">
                    {{ item.user?.name || '—' }}
                  </td>

                  <td class="rv-col-rating">
                    <div class="rv-stars">
                      <span
                        v-for="i in 5"
                        :key="i"
                        class="rv-star"
                        :class="{ 'rv-star--fill': i <= (item.rating || 0) }"
                      >
                        ★
                      </span>
                    </div>
                  </td>

                  <td class="rv-col-time">
                    {{ formatDateTime(item.createdAt) }}
                  </td>
                </tr>

                <tr v-if="!filteredReviews.length">
                  <td colspan="6" class="rv-empty">
                    Không có đánh giá nào.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- FOOTER NÚT PHẢN HỒI (STICKY) -->
          <div v-if="filteredReviews.length" class="rv-footer">
            <button
              type="button"
              class="rv-footer-btn"
              :disabled="!selectedIds.length"
              @click="handleBulkReply"
            >
              Phản hồi đánh giá
            </button>
          </div>
        </section>
      </main>
    </div>

    <!-- POPUP PHẢN HỒI ĐÁNH GIÁ -->
    <teleport to="body">
      <transition name="rv-modal">
        <div
          v-if="modalOpen && activeReview"
          class="rv-modal-overlay"
          @click.self="closeModal"
        >
          <div class="rv-modal" role="dialog" aria-modal="true">
            <!-- HEADER -->
            <header class="rv-modal-header">
              <h2 class="rv-modal-title">Chi tiết đánh giá</h2>
              <button type="button" class="rv-modal-close" @click="closeModal">
                ✕
              </button>
            </header>

            <!-- BODY -->
            <section class="rv-modal-body">
              <!-- USER + SAO + THỜI GIAN -->
              <div class="rv-modal-top">
                <div class="rv-modal-user">
                  <div class="rv-modal-name">
                    {{ activeReview.user?.name || 'Khách hàng' }}
                  </div>
                  <div class="rv-modal-meta">
                    <div class="rv-stars rv-stars--modal">
                      <span
                        v-for="i in 5"
                        :key="i"
                        class="rv-star rv-star--sm"
                        :class="{
                          'rv-star--fill': i <= (activeReview.rating || 0),
                        }"
                      >
                        ★
                      </span>
                    </div>
                    <span class="rv-modal-time">
                      {{ formatDateTime(activeReview.createdAt) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- COMMENT + ẢNH -->
              <div class="rv-modal-main">
                <p v-if="activeReview.comment" class="rv-modal-comment">
                  {{ activeReview.comment }}
                </p>

                <div class="rv-modal-product">
                  <div class="rv-img-wrap rv-img-wrap--lg">
                    <img
                      :src="
                        activeReview.imageUrl ||
                        activeReview.product?.thumbnail ||
                        placeholderImg
                      "
                      alt="Ảnh sản phẩm"
                      class="rv-img"
                    />
                  </div>
                  <div class="rv-modal-product-text">
                    <div class="rv-prod-name">
                      {{ activeReview.product?.name || '—' }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- PHẢN HỒI -->
              <div class="rv-modal-reply">
                <p class="rv-modal-reply-label">Phản hồi đánh giá</p>
                <textarea
                  v-model="replyContent"
                  class="rv-modal-textarea"
                  rows="4"
                  placeholder="Nhập nội dung phản hồi cho khách hàng…"
                ></textarea>
              </div>
            </section>

            <!-- FOOTER BUTTONS -->
            <footer class="rv-modal-footer">
              <button
                type="button"
                class="rv-modal-btn rv-modal-btn--ghost"
                @click="closeModal"
              >
                Đóng
              </button>
              <button
                type="button"
                class="rv-modal-btn rv-modal-btn--primary"
                :disabled="replySubmitting || !replyContent.trim()"
                @click="submitReply"
              >
                {{ replySubmitting ? 'Đang gửi…' : 'Gửi phản hồi' }}
              </button>
            </footer>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import AdminSidebar from '../../components/admin/AdminSidebar.vue'
import DashboardCalendar from '../../components/admin/DashboardCalendar.vue'
import { request } from '../../services/http'

/* ===== STATE ===== */
const reviews = ref([])
const loading = ref(false)
const errorMessage = ref('')

const period = ref('today') // today | week | month | year | all
const reviewFilter = ref('all') // all | replied | unreplied
const selectedIds = ref([])

const activeReview = ref(null)
const replyContent = ref('')
const replySubmitting = ref(false)
const modalOpen = ref(false)

const openCalendar = ref(false)
const statusDropdownOpen = ref(false)
const statusDropdownRef = ref(null)

// nhớ tạo file này: public/images/placeholder-80.png
const placeholderImg = '/images/placeholder-80.png'

/* ===== LABELS ===== */
const periodOptions = [
  { label: 'Hôm nay', value: 'today' },
  { label: 'Tuần này', value: 'week' },
  { label: 'Tháng này', value: 'month' },
  { label: 'Năm nay', value: 'year' },
  { label: 'Tất cả', value: 'all' },
]

const periodLabel = computed(
  () =>
    periodOptions.find((o) => o.value === period.value)?.label || 'Hôm nay',
)

const statusLabel = computed(() => {
  switch (reviewFilter.value) {
    case 'replied':
      return 'Đã phản hồi'
    case 'unreplied':
      return 'Chưa phản hồi'
    default:
      return 'Tất cả'
  }
})

/* ===== FETCH ===== */
const fetchReviews = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const res = await request('/reviews', { method: 'GET' })

    const list =
      res?.data?.items ||
      res?.data?.reviews ||
      res?.data ||
      res?.reviews ||
      []

    reviews.value = Array.isArray(list) ? list : []
  } catch (err) {
    console.error('GET /reviews error', err)
    errorMessage.value =
      err?.response?.data?.message ||
      err?.message ||
      'Không tải được danh sách đánh giá.'
  } finally {
    loading.value = false
  }
}

/* ===== FILTER THỜI GIAN ===== */
const isSameDay = (d1, d2) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate()

const isSameMonth = (d1, d2) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth()

const isSameYear = (d1, d2) => d1.getFullYear() === d2.getFullYear()

const isInCurrentWeek = (d) => {
  const today = new Date()
  const start = new Date(today)
  start.setDate(today.getDate() - today.getDay() + 1) // Thứ 2
  start.setHours(0, 0, 0, 0)

  const end = new Date(start)
  end.setDate(start.getDate() + 7)

  return d >= start && d < end
}

const filteredReviews = computed(() => {
  let list = Array.isArray(reviews.value) ? [...reviews.value] : []

  const today = new Date()

  list = list.filter((r) => {
    const raw = r.createdAt
    if (!raw) return false
    const d = new Date(raw)
    if (Number.isNaN(d.getTime())) return false

    switch (period.value) {
      case 'today':
        return isSameDay(d, today)
      case 'week':
        return isInCurrentWeek(d)
      case 'month':
        return isSameMonth(d, today)
      case 'year':
        return isSameYear(d, today)
      case 'all':
      default:
        return true
    }
  })

  if (reviewFilter.value === 'replied') {
    list = list.filter((r) => !!r.adminReply)
  } else if (reviewFilter.value === 'unreplied') {
    list = list.filter((r) => !r.adminReply)
  }

  return list
})

/* ===== STATS ===== */
const stats = computed(() => {
  const list = filteredReviews.value
  if (!list.length) {
    return { total: 0, avg: 0, pending: 0 }
  }

  let sum = 0
  let pending = 0
  list.forEach((r) => {
    const rate = Number(r.rating || 0)
    sum += rate
    if (!r.adminReply) pending += 1
  })

  return {
    total: list.length,
    avg: sum / list.length || 0,
    pending,
  }
})

/* ===== SELECT ALL ===== */
const isAllSelected = computed(() => {
  const ids = filteredReviews.value
    .map((r) => r.id)
    .filter(Boolean)
  return ids.length > 0 && ids.every((id) => selectedIds.value.includes(id))
})

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    const ids = filteredReviews.value.map((r) => r.id)
    selectedIds.value = selectedIds.value.filter((id) => !ids.includes(id))
  } else {
    const ids = filteredReviews.value
      .map((r) => r.id)
      .filter(Boolean)
    selectedIds.value = Array.from(new Set([...selectedIds.value, ...ids]))
  }
}

/* ===== MODAL / DETAIL ===== */
const openModalWith = (item) => {
  activeReview.value = item
  replyContent.value = item.adminReply || ''
  modalOpen.value = true
}

const closeModal = () => {
  modalOpen.value = false
  activeReview.value = null
  replyContent.value = ''
}

// bấm nút ở footer -> mở chi tiết review đầu tiên trong danh sách được chọn
const handleBulkReply = () => {
  if (!selectedIds.value.length) return
  const first = filteredReviews.value.find(
    (r) => r.id === selectedIds.value[0],
  )
  if (first) {
    openModalWith(first)
  }
}

const submitReply = async () => {
  if (!activeReview.value) return
  const reviewId = activeReview.value.id
  if (!reviewId) return

  replySubmitting.value = true
  try {
    await request(`/reviews/${reviewId}/reply`, {
      method: 'PATCH',
      data: { reply: replyContent.value.trim() },
    })

    activeReview.value.adminReply = replyContent.value.trim()

    const idx = reviews.value.findIndex((r) => r.id === reviewId)
    if (idx !== -1) {
      reviews.value[idx] = { ...reviews.value[idx], ...activeReview.value }
    }

    modalOpen.value = false
  } catch (err) {
    console.error('Reply review error', err)
    alert(
      err?.response?.data?.message ||
        'Gửi phản hồi thất bại, vui lòng thử lại.',
    )
  } finally {
    replySubmitting.value = false
  }
}

/* ===== DROPDOWN / CALENDAR ===== */
const toggleCalendar = () => {
  openCalendar.value = !openCalendar.value
}

const handleCalendarApply = () => {
  openCalendar.value = false
}

const handleCalendarCancel = () => {
  openCalendar.value = false
}

const toggleStatusDropdown = () => {
  statusDropdownOpen.value = !statusDropdownOpen.value
}

const setReviewFilter = (value) => {
  reviewFilter.value = value
  statusDropdownOpen.value = false
}

const handleClickOutside = (e) => {
  if (!(e.target.closest && e.target.closest('.rv-filter-wrapper'))) {
    openCalendar.value = false
  }
  const el = statusDropdownRef.value
  if (el && !el.contains(e.target)) {
    statusDropdownOpen.value = false
  }
}

/* ===== HELPERS ===== */
const pad2 = (n) => (n < 10 ? `0${n}` : `${n}`)

const formatDateTime = (value) => {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'

  const day = pad2(d.getDate())
  const month = pad2(d.getMonth() + 1)
  const year = d.getFullYear()
  const hour = pad2(d.getHours())
  const minute = pad2(d.getMinutes())

  return `${hour}:${minute} ${day}/${month}/${year}`
}

/* ===== LIFECYCLE ===== */
onMounted(() => {
  fetchReviews()
  window.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
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
  padding: 0 32px 16px;
}

/* HEADER */
.header-band {
  background: #f7f7f7;
  border-bottom: 1px solid #e5e5e5;
}

.page-head {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 8px;
  padding: 20px 0 8px;
}

.page-title {
  font-size: 26px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

/* TABS + FILTER */
.rv-tabs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rv-filter-wrapper {
  position: relative;
}

.rv-tab-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 96px;
  height: 36px;
  padding: 0 18px;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  background-color: #ffffff;
  font-size: 13px;
  font-weight: 500;
  color: #111827;
  cursor: pointer;
  outline: none;
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.rv-tab-icon {
  width: 16px;
  height: 16px;
  color: #6b7280;
  transition: transform 0.15s ease;
}

.rv-tab-icon--up {
  transform: rotate(180deg);
}

.rv-tab-btn--active {
  background-color: #ffffff;
  color: #111827;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.18);
}

.rv-tab-btn--active .rv-tab-icon {
  color: #111827;
}

.rv-tab-btn:not(.rv-tab-btn--active):hover {
  background-color: #f3f4f6;
}

/* DROPDOWN */
.rv-dropdown {
  position: relative;
}

.rv-dd-panel {
  position: absolute;
  top: 40px;
  right: 0;
  min-width: 160px;
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.18);
  padding: 6px 0;
  z-index: 30;
}

.rv-dd-item {
  width: 100%;
  padding: 8px 16px;
  border: none;
  background: transparent;
  font-size: 13px;
  color: #111827;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.rv-dd-item:hover {
  background-color: #f3f4f6;
}

.rv-dd-item--active {
  font-weight: 600;
}

.rv-dd-enter-active,
.rv-dd-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.rv-dd-enter-from,
.rv-dd-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* PANEL CHÍNH */
.rv-panel {
  background: #ffffff;
  border-radius: 20px;
  padding: 20px 24px 0;
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.04);
  margin-top: 16px;
  display: flex;
  flex-direction: column;
}

/* STATS */
.rv-stat-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.rv-stat-card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  padding: 16px;
}

.rv-stat-label {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
}

.rv-stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

/* STATE */
.state {
  font-size: 14px;
  color: #4b5563;
  margin: 8px 0;
}

.state--error {
  color: #b91c1c;
}

/* TABLE */
.rv-table-wrap {
  margin-top: 4px;
  border-radius: 12px 12px 0 0;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  background: #ffffff;
}

.rv-table {
  width: 100%;
  border-collapse: collapse;
}

.rv-table thead {
  background-color: #f9fafb;
}

.rv-table th,
.rv-table td {
  font-size: 13px;
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
  color: #111827;
}

.rv-table th {
  font-weight: 500;
  color: #6b7280;
}

.rv-row {
  height: 72px;
}

.rv-row:hover {
  background-color: #f9fafb;
}

/* CỘT */
.rv-col-check {
  width: 40px;
}

.rv-col-img {
  width: 90px;
}

.rv-col-name {
  width: 320px;
}

.rv-col-customer {
  width: 200px;
}

.rv-col-rating {
  width: 130px;
  text-align: center;
}

.rv-col-time {
  width: 170px;
  text-align: center;
  font-size: 12px;
  color: #6b7280;
}

/* CHECKBOX */
.rv-checkbox {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

/* ẢNH */
.rv-img-wrap {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  overflow: hidden;
  background: #f3f4f6;
}

.rv-img-wrap--lg {
  width: 96px;
  height: 96px;
}

.rv-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* TEXT */
.rv-prod-name {
  font-size: 13px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 2px;
}

.rv-prod-sub {
  font-size: 12px;
  color: #6b7280;
}

.rv-col-customer {
  font-size: 13px;
  color: #111827;
}

/* STARS */
.rv-stars {
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.rv-stars--modal {
  gap: 3px;
}

.rv-star {
  font-size: 14px;
  color: #e5e7eb;
}

.rv-star--fill {
  color: #f59e0b;
}

.rv-star--sm {
  font-size: 13px;
}

/* EMPTY */
.rv-empty {
  text-align: center;
  font-size: 13px;
  color: #6b7280;
  padding: 16px 0;
}

/* FOOTER BUTTON GIỐNG FIGMA (STICKY) */
.rv-footer {
  display: flex;
  justify-content: flex-end;
  padding: 12px 20px 16px;
  position: sticky;
  bottom: 0;
  background: #ffffff;
  border-top: 1px solid #e5e7eb;
  z-index: 5;
}

.rv-footer-btn {
  padding: 8px 20px;
  border-radius: 999px;
  border: none;
  background-color: #2563eb;
  color: #ffffff;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.35);
  transition: background-color 0.15s ease, box-shadow 0.15s ease,
    opacity 0.15s ease;
}

.rv-footer-btn:disabled {
  opacity: 0.5;
  box-shadow: none;
  cursor: default;
}

.rv-footer-btn:not(:disabled):hover {
  background-color: #1d4ed8;
}

/* ===== MODAL ===== */
.rv-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.rv-modal {
  width: 680px;
  max-width: 90vw;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 25px 60px rgba(15, 23, 42, 0.35);
  padding: 20px 24px 18px;
  display: flex;
  flex-direction: column;
}

/* HEADER */
.rv-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.rv-modal-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.rv-modal-close {
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
  color: #6b7280;
}

/* BODY */
.rv-modal-body {
  border-radius: 18px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  padding: 16px 18px 14px;
}

.rv-modal-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.rv-modal-user {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rv-modal-name {
  font-size: 13px;
  font-weight: 600;
  color: #111827;
}

.rv-modal-meta {
  display: flex;
  align-items: center;
  gap: 8px; /* SAO bên trái, thời gian bên phải */
}

.rv-modal-time {
  font-size: 11px;
  color: #9ca3af;
}

.rv-modal-main {
  margin-top: 4px;
}

.rv-modal-comment {
  font-size: 13px;
  color: #4b5563;
  margin-bottom: 10px;
}

.rv-modal-product {
  display: flex;
  gap: 12px;
  align-items: center;
}

.rv-modal-product-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* REPLY */
.rv-modal-reply {
  margin-top: 16px;
}

.rv-modal-reply-label {
  font-size: 13px;
  font-weight: 500;
  color: #111827;
  margin-bottom: 6px;
}

.rv-modal-textarea {
  width: 100%;
  min-height: 96px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  padding: 10px 12px;
  font-size: 13px;
  resize: vertical;
  outline: none;
  background: #ffffff;
}

.rv-modal-textarea::placeholder {
  color: #9ca3af;
}

.rv-modal-textarea:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 1px #2563eb20;
}

/* FOOTER */
.rv-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 14px;
}

.rv-modal-btn {
  min-width: 110px;
  padding: 8px 18px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background-color 0.15s ease, color 0.15s ease,
    box-shadow 0.15s ease, border-color 0.15s ease, opacity 0.15s ease;
}

.rv-modal-btn--ghost {
  background: #f3f4f6;
  color: #111827;
  border-color: #d1d5db;
}

.rv-modal-btn--ghost:hover {
  background: #e5e7eb;
}

.rv-modal-btn--primary {
  background: #2563eb;
  color: #ffffff;
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.35);
}

.rv-modal-btn--primary:hover {
  background: #1d4ed8;
}

.rv-modal-btn:disabled {
  opacity: 0.6;
  cursor: default;
  box-shadow: none;
}

/* SLIDE / FADE ANIMATION MODAL */
.rv-modal-enter-active,
.rv-modal-leave-active {
  transition: opacity 0.18s ease;
}

.rv-modal-enter-from,
.rv-modal-leave-to {
  opacity: 0;
}
</style>
