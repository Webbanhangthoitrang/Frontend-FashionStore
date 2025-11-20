<!-- src/views/admin/Dashboard.vue -->
<template>
  <div class="admin-layout">
    <!-- SIDEBAR -->
    <AdminSidebar />

    <!-- CONTENT -->
    <div class="admin-content">
      <main class="page">
        <!-- HEADER: TIÊU ĐỀ + FILTER DROPDOWN -->
        <div class="dash-header">
          <h1 class="dash-title">Hiệu suất nền tảng</h1>

          <!-- FILTER DROPDOWN -->
          <div class="filter-wrapper" @click.stop>
            <button
              class="filter-trigger"
              type="button"
              @click="toggleFilter"
            >
              <!-- ICON BÊN TRÁI -->
              <svg
                class="chevron"
                width="16"
                height="16"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="#111827"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span>{{ activeLabel }}</span>
            </button>

            <!-- COMPONENT LỊCH RIÊNG -->
            <DashboardCalendar
              v-if="openFilter"
              v-model="period"
              :options="filterOptions"
              @apply="handleApply"
              @cancel="handleCancel"
            />
          </div>
        </div>

        <!-- KHUNG XÁM CHÍNH -->
        <section class="dash-panel">
          <!-- HÀNG 1: 3 Ô THỐNG KÊ -->
          <section class="stats-row">
            <div class="stat-box">
              <p class="stat-label">Tổng doanh thu</p>
              <h2 class="stat-value">{{ formatMoney(overview.revenue) }}</h2>
            </div>

            <div class="stat-box">
              <p class="stat-label">Lợi nhuận</p>
              <h2 class="stat-value">{{ formatMoney(overview.profit) }}</h2>
            </div>

            <div class="stat-box">
              <p class="stat-label">Tổng đơn hàng</p>
              <h2 class="stat-value">{{ overview.totalOrders }}</h2>
            </div>
          </section>

          <!-- HÀNG 2: BIỂU ĐỒ -->
          <section class="card chart-card">
            <p class="card-title">Doanh thu theo thời gian</p>
            <canvas ref="revChart" height="120"></canvas>
          </section>

          <!-- HÀNG 3: SẢN PHẨM BÁN CHẠY -->
          <section class="card best-sell-card">
            <p class="card-title">Sản phẩm bán chạy</p>

            <div class="best-list">
              <div
                v-for="(item, i) in bestSelling"
                :key="i"
                class="best-row"
              >
                <p class="best-name" :title="item.name">{{ item.name }}</p>
                <div class="bar-wrap">
                  <div class="bar" :style="{ width: item.percent + '%' }"></div>
                </div>
                <span class="qty">{{ item.quantity }}</span>
              </div>
            </div>
          </section>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  nextTick,
  onBeforeUnmount,
} from 'vue'
import AdminSidebar from '../../components/admin/AdminSidebar.vue'
import DashboardCalendar from '../../components/admin/DashboardCalendar.vue'
import { request } from '../../services/http'
import Chart from 'chart.js/auto'

// ===== STATE CHÍNH =====
const overview = ref({
  revenue: 0,
  profit: 0,
  totalOrders: 0,
})

const bestSelling = ref([])
const revenueData = ref([])
const period = ref('today')

// ===== FILTER OPTIONS =====
const filterOptions = [
  { label: 'Hôm nay', value: 'today' },
  { label: 'Tuần này', value: 'week' },
  { label: 'Tháng này', value: 'month' },
  { label: 'Năm nay', value: 'year' },
  { label: 'Tất cả', value: 'all' },
]

const activeLabel = computed(
  () => filterOptions.find((o) => o.value === period.value)?.label || 'Hôm nay',
)

const formatMoney = (n) =>
  n ? n.toLocaleString('vi-VN') + ' VND' : '0 VND'

// ===== GỌI API =====
const loadOverview = async () => {
  try {
    const res = await request('/dashboard/overview', { method: 'GET' })
    overview.value = res.data || res
  } catch (err) {
    console.error('loadOverview error:', err)
  }
}

const loadRevenue = async () => {
  try {
    const res = await request(`/dashboard/revenue?period=${period.value}`, {
      method: 'GET',
    })
    revenueData.value = res.data || res
    await renderChart()
  } catch (err) {
    console.error('loadRevenue error:', err)
  }
}

const loadBestSelling = async () => {
  try {
    const res = await request('/dashboard/best-selling', { method: 'GET' })
    const list = res.data || res

    const maxQty = Math.max(...list.map((i) => i.quantity || 0), 1)
    bestSelling.value = list.map((i) => ({
      ...i,
      percent: Math.round(((i.quantity || 0) / maxQty) * 100),
    }))
  } catch (err) {
    console.error('loadBestSelling error:', err)
  }
}

// ===== CHART.JS =====
const revChart = ref(null)
let chartInstance = null

const renderChart = async () => {
  await nextTick()
  if (!revChart.value) return

  const ctx = revChart.value.getContext('2d')
  if (chartInstance) chartInstance.destroy()

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: revenueData.value.map((x) => x.label),
      datasets: [
        {
          data: revenueData.value.map((x) => x.value),
          borderColor: '#FF9900',
          backgroundColor: 'transparent',
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      layout: { padding: { top: 12, bottom: 8, left: 8, right: 16 } },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(148, 163, 184, 0.25)' },
        },
        x: {
          grid: { display: false },
        },
      },
    },
  })
}

// ===== DROPDOWN FILTER =====
const openFilter = ref(false)

const toggleFilter = () => {
  openFilter.value = !openFilter.value
}

// user bấm Hủy
const handleCancel = () => {
  openFilter.value = false
}

// user bấm Áp dụng
const handleApply = async () => {
  openFilter.value = false
  await Promise.all([loadOverview(), loadRevenue()])
}

// click ngoài để đóng dropdown
const handleClickOutside = (e) => {
  if (!(e.target.closest && e.target.closest('.filter-wrapper'))) {
    openFilter.value = false
  }
}

// ===== LIFECYCLE =====
onMounted(async () => {
  window.addEventListener('click', handleClickOutside)
  await Promise.all([loadOverview(), loadRevenue(), loadBestSelling()])
})

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* ===== LAYOUT CHUNG ===== */
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

/* ===== HEADER TRÊN CÙNG ===== */
.dash-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 16px;
}

.dash-title {
  font-size: 26px;
  font-weight: 700;
  color: #111827;
}

/* ===== FILTER DROPDOWN TRIGGER ===== */
.filter-wrapper {
  position: relative;
}

.filter-trigger {
  min-width: 120px;
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  font-size: 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px; /* khoảng cách icon - chữ */
}

.filter-trigger .chevron {
  flex-shrink: 0;
}

/* ===== KHUNG XÁM CHÍNH ===== */
.dash-panel {
  margin-top: 8px;
  background: #f7f7f7;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.06);
}

/* ===== STAT BOXES ===== */
.stats-row {
  display: flex;
  gap: 16px;
}

.stat-box {
  flex: 1;
  padding: 16px;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
}

.stat-label {
  color: #6f6f6f;
  font-size: 13px;
}

.stat-value {
  font-size: 22px;
  margin-top: 6px;
  font-weight: 600;
}

/* ===== CARD CHUNG ===== */
.card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  padding: 16px 20px;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
}

/* ===== BEST SELLING ===== */
.best-list {
  padding-right: 4px;
}

.best-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.best-name {
  width: 220px;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bar-wrap {
  background: #f4f4fb;
  height: 10px;
  border-radius: 6px;
  flex: 1;
}

.bar {
  height: 10px;
  background: #c8c4fa;
  border-radius: 6px;
}

.qty {
  width: 40px;
  text-align: right;
  font-size: 12px;
  color: #6b7280;
}
</style>
