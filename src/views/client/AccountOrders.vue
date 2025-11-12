<!-- src/views/client/AccountOrders.vue -->
<template>
  <div class="account">
    <ClientHeader />

    <main class="page" role="main">
      <div class="container">
        <div class="grid">
          <!-- Sidebar -->
          <AccountSidebar />

          <!-- Đơn Mua -->
          <section class="orders-card" aria-labelledby="orders-title">
            <!-- Tabs -->
            <div class="orders-tabs">
              <h2 id="orders-title" class="orders-tabs__title">Đơn Mua</h2>
              <nav class="orders-tabs__nav" role="tablist" aria-label="Trạng thái đơn">
                <button
                  v-for="t in tabs"
                  :key="t.key"
                  class="orders-tab"
                  :class="{ 'is-active': activeTab === t.key }"
                  @click="goTab(t.key)"
                >
                  {{ t.label }}
                </button>
              </nav>
            </div>

            <!-- Nội dung -->
            <div class="orders-body">
              <p v-if="loading" class="state">Đang tải đơn hàng…</p>
              <p v-else-if="errorMessage" class="state state--error">{{ errorMessage }}</p>

              <ul v-else class="olist" role="list">
                <li v-for="o in orders" :key="o.id" class="oitem">
                  <!-- Danh sách sản phẩm trong đơn hàng -->
                  <div v-for="(product, idx) in o.products" :key="idx" class="product-row">
                    <div class="oitem__row oitem__row--top">
                      <img :src="product.image || '/placeholder.png'" :alt="product.name" class="thumb" />
                      <div class="meta">
                        <h3 class="name">{{ product.name }}</h3>
                        <p class="sub">Phân loại: {{ product.category || 'Không có' }}</p>
                        <p class="sub">x{{ product.quantity }}</p>
                      </div>
                      <div class="price-right">{{ formatVND(product.price * product.quantity) }}</div>
                    </div>
                    <div v-if="idx < o.products.length - 1" class="divider"></div>
                  </div>

                  <div class="divider divider--thick"></div>

                  <!-- Hàng 2: Trạng thái và tổng tiền -->
                  <div class="oitem__row oitem__row--bot">
                    <div class="status-left">
                      <span class="ship">
                        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M3 7h13v10H3zM16 10h4l1 2v5h-5z"
                                fill="none" stroke="currentColor" stroke-width="2"/>
                        </svg>
                        {{ getDeliveryStatus(o.status) }}
                      </span>
                      <span class="dot"></span>
                      <span class="status-text" :class="`st--${o.status?.toLowerCase()}`">
                        {{ statusText(o.status) }}
                      </span>
                    </div>

                    <div class="actions">
                      <button
                        v-if="o.status === 'COMPLETED'"
                        class="btn-rate"
                        @click="onRate(o)"
                      >
                        Đánh giá
                      </button>
                      <button
                        v-if="['ORDERED', 'PENDING'].includes(o.status)"
                        class="btn-cancel"
                        @click="onCancel(o)"
                      >
                        Hủy đơn
                      </button>
                    </div>

                    <div class="total">
                      <span class="total__label">Thành Tiền:</span>
                      <strong class="total__val">{{ formatVND(o.total) }}</strong>
                    </div>
                  </div>
                </li>

                <li v-if="orders.length === 0" class="empty">
                  Không có đơn nào trong mục này.
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </main>

    <ClientFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
/* Dùng HTTP module sẵn có của bạn */
import { request } from "../../services/http";

import ClientHeader from "../../components/client/ClientHeaderLogged.vue";
import ClientFooter from "../../components/client/ClientFooter.vue";
import AccountSidebar from "../../components/client/AccountSidebar.vue";

/* ========== CONFIG: Chỉ hiển thị đơn của chính user ==========
   Đổi endpoint này cho khớp BE nếu cần:
   - "/orders/me"        hoặc
   - "/users/me/orders"  hoặc
   - "/orders/customer"
=============================================================== */
const ORDERS_ENDPOINT = "/orders/mine";

const route = useRoute();
const router = useRouter();

/* Tabs theo thiết kế - Map lowercase sang UPPERCASE cho backend */
const STATUS_MAP = {
  pending: 'PENDING',
  shipping: 'SHIPPING', 
  completed: 'COMPLETED',
  cancelled: 'CANCELLED',
  returned: 'RETURNED'
};

const tabs = [
  { key: "all",        label: "Tất cả" },
  { key: "pending",    label: "Chờ xác nhận" },
  { key: "shipping",   label: "Vận Chuyển" },
  { key: "completed",  label: "Hoàn thành" },
  { key: "cancelled",  label: "Đã hủy" },
  { key: "returned",   label: "Trả hàng" },
];
const activeTab = ref(route.query.tab?.toString() || "all");

const loading = ref(false);
const errorMessage = ref("");
const orders = ref([]);

watch(
  () => route.query.tab,
  () => {
    activeTab.value = route.query.tab?.toString() || "all";
    fetchOrders();
  }
);

async function fetchOrders() {
  try {
    loading.value = true;
    errorMessage.value = "";

    // ✅ Chuyển status sang UPPERCASE cho backend
    const params = activeTab.value === "all" 
      ? {} 
      : { status: STATUS_MAP[activeTab.value] || activeTab.value.toUpperCase() };

    const res = await request(ORDERS_ENDPOINT, { method: "GET", params });
    // Chuẩn hoá: BE có thể trả {data: [...]}, {orders: [...]}, hoặc array
    const list = res.data?.orders || res.data?.items || res.data || [];
    // FE chỉ hiển thị đúng danh sách của user (BE phải lọc theo token)
    orders.value = Array.isArray(list) ? list : [];
  } catch (err) {
    // Không kiểm tra login ở FE; chỉ hiển thị lỗi gọn gàng
    if (err.status === 403) {
      errorMessage.value = "Bạn không có quyền truy cập danh sách đơn hàng.";
    } else if (err.status === 404) {
      errorMessage.value = "Không tìm thấy endpoint dữ liệu đơn hàng.";
    } else {
      errorMessage.value = err.message || "Không thể tải đơn hàng.";
    }
    orders.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(fetchOrders);

function goTab(key) {
  router.replace({ query: { tab: key } });
}

function statusText(s) {
  const upperStatus = s?.toUpperCase();
  return (
    {
      ORDERED: "CHỜ XỬ LÝ",
      PENDING: "CHỜ XÁC NHẬN",
      SHIPPING: "ĐANG VẬN CHUYỂN",
      COMPLETED: "HOÀN THÀNH",
      CANCELLED: "ĐÃ HỦY",
      RETURNED: "TRẢ HÀNG",
    }[upperStatus] || "—"
  );
}

function getDeliveryStatus(s) {
  const upperStatus = s?.toUpperCase();
  if (upperStatus === 'COMPLETED') return 'Giao hàng thành công';
  if (upperStatus === 'SHIPPING') return 'Đang giao hàng';
  if (upperStatus === 'CANCELLED') return 'Đã hủy';
  if (upperStatus === 'RETURNED') return 'Đã trả hàng';
  return 'Chờ xử lý';
}

function formatVND(n) {
  if (n == null) return "0₫";
  return Number(n).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });
}

function onRate(o) {
  router.push({ name: "order-detail", params: { id: o.id }, query: { rate: 1 } });
}

function onCancel(o) {
  if (confirm(`Bạn có chắc muốn hủy đơn hàng #${o.code}?`)) {
    // TODO: Call API to cancel order
    console.log('Cancel order:', o.id);
  }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Khula:wght@400;600;700&display=swap");
:host, * { font-family: "Khula", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif; }

:root { --red:#EF4444; --blue:#4C80E6; --text:#111827; --muted:#6B7280; --border:#E5E7EB; --border-2:#E9E9E9; }

/* layout */
.page{padding:16px 0 32px}
.container{max-width:1100px;margin:0 auto;padding:0 12px}
.grid{display:grid;grid-template-columns:260px 1fr;gap:16px}

/* card + tabs */
.orders-card{background:#fff;border:1px solid var(--border);border-radius:8px;overflow:hidden}
.orders-tabs{display:flex;align-items:flex-end;gap:16px;padding:0 16px;border-bottom:1px solid var(--border-2);box-shadow:0 1px 0 rgba(0,0,0,.03)}
.orders-tabs__title{margin:0;padding:14px 0;font-weight:700;font-size:18px;color:var(--text)}
.orders-tabs__nav{display:flex;gap:28px;height:44px}
.orders-tab{position:relative;background:transparent;border:0;cursor:pointer;padding:0;margin:0;color:#222;font-weight:700;font-size:16px;line-height:44px}
.orders-tab.is-active{color:var(--red)}
.orders-tab.is-active::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:3px;background:var(--red);border-radius:2px}
.orders-tab:not(.is-active):hover{color:var(--red)}

.orders-body{padding:8px 0}
.state{padding:16px}
.state--error{color:#b91c1c}

/* list */
.olist{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:12px}
.oitem{border:1px solid var(--border);border-radius:6px;background:#fff}
.oitem__row{display:flex;align-items:center;padding:12px 16px}
.oitem__row--top{gap:12px}
.thumb{width:96px;height:120px;object-fit:cover;border:1px solid var(--border);border-radius:4px;background:#f3f4f6}
.meta{flex:1 1 auto;min-width:0}
.name{margin:0 0 4px 0;color:var(--text);font-weight:700;font-size:18px;line-height:1.25}
.sub{margin:0;color:var(--muted);font-size:14px}
.price-right{margin-left:auto;color:var(--red);font-weight:700;font-size:16px}
.divider{height:1px;background:#ECECEC}
.divider--thick{height:2px;background:#E0E0E0}

/* row bottom */
.oitem__row--bot{gap:12px;background:#fff}
.status-left{display:flex;align-items:center;gap:10px}
.ship{display:inline-flex;align-items:center;gap:6px;color:var(--blue);font-weight:600}
.dot{width:1px;height:14px;background:#E0E0E0;display:inline-block}
.status-text{font-weight:800;color:var(--red);text-transform:uppercase;letter-spacing:.2px}
.st--shipping{color:#2563EB}.st--pending{color:#D97706}.st--returned{color:#6B7280}.st--cancelled{color:var(--red)}.st--completed{color:var(--red)}
.actions{margin-left:16px;display:flex;gap:8px}
.btn-rate,.btn-cancel{height:34px;padding:0 14px;border-radius:8px;font-weight:700;cursor:pointer}
.btn-rate{border:1px solid var(--red);background:var(--red);color:#fff}
.btn-rate:hover{filter:brightness(.96)}
.btn-cancel{border:1px solid var(--muted);background:#fff;color:var(--muted)}
.btn-cancel:hover{background:#f9fafb}
.total{margin-left:auto;display:flex;align-items:center;gap:8px}
.total__label{color:var(--muted)}
.total__val{color:var(--red);font-size:22px;font-weight:800}

.empty{padding:16px;color:var(--muted)}

@media (max-width:900px){
  .grid{grid-template-columns:1fr}
  .orders-tabs__nav{gap:18px}
  .name{font-size:16px}
  .total__val{font-size:18px}
}
</style>
