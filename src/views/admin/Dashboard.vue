<template>
  <div class="admin-layout">
    <AdminSidebar />

    <div class="admin-content">
      <main class="page">

        <!-- HEADER -->
        <div class="dash-header">
          <h1 class="dash-title">Hiệu suất nền tảng</h1>

          <div class="filter-wrapper" @click.stop>
            <button class="filter-trigger" @click="toggleFilter">
              <svg class="chevron" width="16" height="16" viewBox="0 0 20 20">
                <path d="M5 7.5L10 12.5L15 7.5" stroke="#111827"
                  stroke-width="1.6" stroke-linecap="round" />
              </svg>
              <span>{{ activeLabel }}</span>
            </button>

            <DashboardCalendar
              v-if="openFilter"
              v-model="period"
              :options="filterOptions"
              @apply="handleApply"
              @cancel="handleCancel"
            />
          </div>
        </div>

        <!-- PANEL -->
        <section class="dash-panel">

          <!-- 3 Ô THỐNG KÊ -->
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

          <!-- BIỂU ĐỒ -->
          <section class="card chart-card">
            <p class="card-title">Doanh thu theo thời gian</p>
            <canvas ref="revChart" height="120"></canvas>
          </section>

          <!-- TOP SẢN PHẨM -->
          <section class="card best-sell-card">
            <p class="card-title">Sản phẩm hàng đầu</p>

            <div class="best-list">
              <div
                v-for="(item, i) in bestSelling"
                :key="i"
                class="best-row"
                :title="`Tên: ${item.name}\nĐã bán: ${item.quantity}`"
              >
                <p class="best-name">{{ item.name }}</p>

                <div class="bar-wrap">
                  <div class="bar" :style="{ width: item.percent + '%' }"></div>
                </div>

                <span class="qty">{{ item.quantity }}</span>
              </div>
            </div>

            <!-- TRỤC SỐ -->
            <div class="best-axis">
              <span>0</span>
              <span>100</span>
              <span>200</span>
              <span>300</span>
              <span>400</span>
              <span>500</span>
            </div>
          </section>
        </section>
      </main>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, nextTick, onBeforeUnmount } from "vue";
import AdminSidebar from "../../components/admin/AdminSidebar.vue";
import DashboardCalendar from "../../components/admin/DashboardCalendar.vue";
import { request } from "../../services/http";
import Chart from "chart.js/auto";

const overview = ref({
  revenue: 0,
  profit: 0,
  totalOrders: 0,
});

const bestSelling = ref([]);
const revenueData = ref([]);
const period = ref("today");

const filterOptions = [
  { label: "Hôm nay", value: "today" },
  { label: "Tuần này", value: "week" },
  { label: "Tháng này", value: "month" },
  { label: "Năm nay", value: "year" },
  { label: "Tất cả", value: "all" },
];

const activeLabel = computed(() =>
  filterOptions.find((o) => o.value === period.value)?.label || "Hôm nay"
);

const formatMoney = (n) =>
  n ? n.toLocaleString("vi-VN") + " VND" : "0 VND";

// ==== API ====

const loadOverview = async () => {
  const res = await request("/dashboard/overview");
  const payload = res.data || {};

  overview.value = {
    revenue: Number(payload.totalRevenue ?? payload.revenue ?? 0),
    profit: Number(payload.totalProfit ?? payload.profit ?? 0),
    totalOrders: Number(payload.totalOrders ?? 0),
    completedOrders: Number(payload.completedOrders ?? 0),
    pendingOrders: Number(payload.pendingOrders ?? 0),
    profitMargin: typeof payload.profitMargin === "string"
      ? payload.profitMargin
      : payload.profitMargin != null
        ? `${Number(payload.profitMargin) * 100}%`
        : null,
  };
};

const loadRevenue = async () => {
  const res = await request(`/dashboard/revenue?period=${period.value}`);
  revenueData.value = res.data;
  await renderChart();
};

const loadBestSelling = async () => {
  const res = await request("/dashboard/best-selling");

  const rawList = Array.isArray(res.data) ? res.data : [];

  const normalized = rawList.map((item) => ({
    name: item.name || item.productName || "Sản phẩm",
    quantity: Number(item.quantity ?? item.value ?? 0),
    revenue: Number(item.revenue ?? 0),
    orderCount: Number(item.orderCount ?? 0),
  }));

  const sorted = normalized
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  const maxQty = sorted.length
    ? Math.max(...sorted.map((i) => i.quantity), 0)
    : 0;
  const divisor = maxQty > 0 ? maxQty : 1;

  bestSelling.value = sorted.map((i) => ({
    ...i,
    percent: maxQty > 0 ? Math.round((i.quantity / divisor) * 100) : 0,
  }));
};

// ==== CHART ====

const revChart = ref(null);
let chartInstance = null;

const renderChart = async () => {
  await nextTick();

  if (!revChart.value) return;

  const ctx = revChart.value.getContext("2d");
  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: revenueData.value.map((x) => x.label),
      datasets: [
        {
          data: revenueData.value.map((x) => x.value),
          borderColor: "#FF9900",
          backgroundColor: "transparent",
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title(items) {
              const label = items[0]?.label || "";
              return `Ngày ${label}`;
            },
            label(context) {
              const val = context.parsed.y || 0;
              return `Doanh thu (VND): ${val.toLocaleString("vi-VN")}`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: "rgba(148, 163, 184, 0.25)" },
        },
        x: {
          grid: { display: false },
        },
      },
    },
  });
};

// ==== DROPDOWN ====

const openFilter = ref(false);
const toggleFilter = () => (openFilter.value = !openFilter.value);
const handleCancel = () => (openFilter.value = false);

const handleApply = async () => {
  openFilter.value = false;
  await Promise.all([loadOverview(), loadRevenue()]);
};

// Click outside
const handleClickOutside = (e) => {
  if (!e.target.closest(".filter-wrapper")) {
    openFilter.value = false;
  }
};

// ==== LIFECYCLE ====
onMounted(async () => {
  window.addEventListener("click", handleClickOutside);
  await Promise.all([loadOverview(), loadRevenue(), loadBestSelling()]);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", handleClickOutside);
});
</script>
<style scoped>
/* ===== LAYOUT CHUNG ADMIN ===== */
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f3f4f6;
}

.admin-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Trang dashboard chiếm full width, không giới hạn max-width */
.page {
  width: 100%;
  max-width: none;
  padding: 24px 40px 32px;
}

/* ===== HEADER: TIÊU ĐỀ + FILTER ===== */
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

.filter-wrapper {
  position: relative;
}

.filter-trigger {
  min-width: 130px;
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  font-size: 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.filter-trigger .chevron {
  flex-shrink: 0;
}

/* ===== KHUNG PANEL CHÍNH ===== */
.dash-panel {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto; /* canh giữa như Figma */
  background: #ffffff;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.06);
}

/* ===== 3 Ô THỐNG KÊ ===== */
.stats-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.stat-box {
  flex: 1;
  padding: 16px 18px;
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
  color: #111827;
}

/* ===== CARD CHUNG (BIỂU ĐỒ + TOP SẢN PHẨM) ===== */
.card {
  width: 100%;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  padding: 20px 22px;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #111827;
}

/* Biểu đồ doanh thu full width */
.chart-card {
  width: 100%;
}

/* ===== TOP SẢN PHẨM HÀNG ĐẦU ===== */
.best-sell-card {
  width: 100%;
}

.best-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-right: 4px;
}

.best-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.best-name {
  width: 220px;
  font-size: 13px;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bar-wrap {
  flex: 1;
  height: 12px;
  background: #f3f0ff;
  border-radius: 999px;
  overflow: hidden;
}

.bar {
  height: 12px;
  background: #c9c2f9;
  border-radius: 999px;
}

.qty {
  width: 40px;
  text-align: right;
  font-size: 12px;
  color: #6b7280;
}

/* Trục số bên dưới giống Figma */
.best-axis {
  margin-top: 10px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #9ca3af;
  padding-top: 6px;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1024px) {
  .page {
    padding: 20px 16px 24px;
  }

  .dash-panel {
    padding: 20px;
  }

  .stats-row {
    flex-direction: column;
  }
}

@media (max-width: 640px) {
  .best-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .best-name {
    width: 100%;
  }

  .qty {
    align-self: flex-end;
  }
}
</style>
