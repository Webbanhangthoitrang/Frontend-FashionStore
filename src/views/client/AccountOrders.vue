<!-- src/views/client/AccountOrders.vue -->
<template>
  <div class="account">
    <ClientHeader />

    <main class="page" role="main">
      <div class="container">
        <div class="grid">

          <!-- SIDEBAR -->
          <AccountSidebar />

          <!-- ĐƠN MUA -->
          <section class="orders-card" aria-labelledby="orders-title">

            <!-- TABS -->
            <div class="orders-tabs">
              <h2 id="orders-title" class="orders-tabs__title">Đơn Mua</h2>

              <nav class="orders-tabs__nav" role="tablist">
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

            <!-- LIST -->
            <div class="orders-body">
              <p v-if="loading" class="state">Đang tải đơn hàng…</p>
              <p v-else-if="errorMessage" class="state state--error">
                {{ errorMessage }}
              </p>

              <!-- CÓ ĐƠN -->
              <ul v-else-if="orders.length > 0" class="olist">
                <li
                  v-for="o in orders"
                  :key="o.id"
                  class="olist__item"
                  @click="goDetail(o)"
                >
                  <OrderItem
                    :order="o"
                    @rate="onRate"
                    @cancel="onCancel"
                    @return="onReturn"
                  />
                </li>
              </ul>

              <!-- KHÔNG CÓ ĐƠN -->
              <div v-else class="empty-state">
                <div class="empty-state__icon">
                  <svg width="106" height="112" viewBox="0 0 206 212" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <rect width="206" height="212" fill="url(#pattern0_2200_1690)"/>
                  <defs>
                  <pattern id="pattern0_2200_1690" patternContentUnits="objectBoundingBox" width="1" height="1">
                  <use xlink:href="#image0_2200_1690" transform="scale(0.00485437 0.00471698)"/>
                  </pattern>
                  <image id="image0_2200_1690" width="206" height="212" preserveAspectRatio="none" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAM4AAADUCAMAAADjjOwLAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAMAUExURUdwTNjY1ujo6Pn//////+fn58/k4ebo5+jo6Ofn5+jo6Ia8tOfn5+/OjIi7tejo6Ofn5+jo6Ojo6Orq6oi8tYi8tOjo6P//z+fn54a7tOfn5+bm5ujo6Ojo6Ojo6M/k4Ofn5//MlYe8tOjo6Ofn5/+aLf+aK+Tk3Onp6ejr6oe6s4e8tIe8tOfo6P/f0ufn5+jo6Ojo6Ojo6Ofq6f/Mlc/k4f/MlM7k4fDOjYa7s+jo6Ie8s+jo6Ofn54Oysujo6P+aK+fn58/k4P+aK+fn5/DOjOjo6Ia8s+jo6Ojo6Mrb4M7k4f+aLOjo6PHQkOHm5fDOjIS6scfW3vHx8cfW3sfW3Ya8tIe8tOfn5+np6Ye8tIi7tejo6P+ZLoe8tP/Mlf+aK/+aK+fn5/+aLMbV3efn587l383i4v+aLP+dKv+ZLP+bLPDOi/DOjMXV387j4PDOi4a8tNDk4ejo6M7i4u/OjIa8tPDOi4LBrejo6Ojo6PDNjOjo6Ofn58/k4M/k4f/Mlf/Lk4a7s//MlcfW3v/MlIe7s8fW3Ye8tP+ZLP+aLM/k4f/Mlefn5+fn5+/Oi+fn5/DNi+7Oi8fW3oe7s8zMzOjo6Nvr6M/k4f+aLP///////+719fnu2Nfp5fDOis7k4Ie7s+/MifLMjIe7tfDNjPDOjPDOi+fn54W8s4a9tP/LlP////////DOjP///39/f8/k4f7+/ujo6PDOjIe8tObm5t/f3+7u7s/k4VyUjP+aLO/Un//Mlf///8fW3o++sZ7HwZLCu46/uIq+tZfFvvPdsaTKxPL499/l5OfNj+jz8e/Xp/vy4rTQzKvOyL7Gn5/ArPj7+tPJl5S/r/39/ERERMPZ1eTs683ImfHQkO/RldPe3fXkwffoyvz48cnc2bvU0LTFpazDqdzi4djPpffr0r7JqeDRouzUoN7Kld7e3nNtYvbhuMXLq+nl3Obn59nKlfnt1tji4FdVTuLo5+vfyOvfx+7m1WNfWL63prq3r5aRhpmSgpSHbtW+ketXjoAAAACydFJOUwAG8AQB/vFk+f0skyb9CkiAZ+IapzXjAo5oQR/XtUTS3ef21fwJyApTOBTr+XIDo+But5GroDtUXt/NOuprBd780uznTXPDLpb0Sc/4h99ghyDxEof22CmwXeVaySD9mJN65dC/vCckix14F7v4UP2bzHKLNeiwsw1ZWyN9pnXolEVBnLungsHy7cXV/eiX7KLQTk1WBVr9m8Nwi7/FgkTjvjIoU1fN0oJ2dP6v3tGkAuh6gaj/AAAKL0lEQVR42u3dd3QU1RoA8Nklm+wmhLRNSO8QAqbzJIEQSeiB0JSogKgRfFYQFQgIHhvqe/ae13uveHdI9iVEQgIIBFBiAj5AQUV9gN3Xm1uy2Zndmcnevd+duRPy/UfOYWZ/587c+906HBdoGGqbMkLtoRlNtQZO92G4d7vdE9vDRuhcc2OGXRjzbtS1Jr/GLo6au/VcNqF236jRb/kYMuz+Me8FvXLutUvFnTrV5NVIcrbrtL6eZJeOSfrkfE2G06RPzmMynAx9ckJlOKH65Mho7GuHVunUDL87wzXbcLujnLIRZgXjk6z12TyfXW9NGq/7nG18hIPiieyIRn1n1FOW8aKomMJkf2f71wP6n/GP8j6RHa+95+4ge6NV9bxf1I9ib6wgsLLhktyCSyLiGxunRFzi/lcSC9Xbnd6RnB8uDHQkZ53r9y+b7f7XbPd7tI6N+npS07yatTXzmiYF3G8b7y6bKwfeJHf5UK+ur7l+7PRp08defw3sZR9w/foI7x8iXH94gC5mzHXTWt0x7boxkBde7vr1gqpsiusPy6lqbr2h1Rs33Ap4ZXdNIKjJRtGvC8aMbRXGWMDy+ZU052GanJtaxXET3KWt0g+blaLm5vk+nPk3Q126aoJ0VTCBYkN6S6tv3AL76vDZAxX1bPoN6bf8ON8EuvLiCZ60U9yM8vyjV1LjTPfjfAPmwvEVA2maI8kZNSrek+Q48wRqefV8P04r+UUbF//UupJXiJXW5xc3Mls6VcutFdk8QWRXbFhepd27M7r8tvWRNk/0vMEDxBs9AxeMXL+xfLR6Nds9P7cJoocHijeFV33mHrXanZ+sF973wC4ozq4Dwus+FZQHPyso/L3wrrbXeLB4TXThXxSqkrOVi25qex2O87r4yuWqZNQbxTfdBcfZJb7ybar0dxaIb8oDhvjKT6nSG41Ui2NTZdTANsxhn/Nyf0ByPNcc5lwMnNqHlix5qHaocK54xRVXDA1O7Sv98dyQ4KzycFZhcP4EGLCcJR7O0mEOe5yBh+2RIcF5zsNZg8GhERpW1AxzuDWrli59ZA2nL879E7N+kzXxfpgkR2uO4cGd7njQMBQ41+70xLVDgHPpTm9cqn/ONgFnm/45WQJOlv45As3Ox4dLJ44tzkQBZyK+Jjx2KNVsUUbkw9khDpk/BxS+nHTa7c5mM1KRY94cwE8qvK9fcx/2jEOMBanJQZaYgJ63bVmPZ23Df9IKTEhdDjIV0BtgK0AocA5EVeC8GzVPmEkLjimGjmZzLtKCg3I309Akm5E2HGROhteEG5FWHGQMh9bEJSDtOCghDlZjmIW05KBZsLs6yxA2R7FdweWgOZCaq5HWHHQ1nGbkXO05c0eCvTjVSHsOmgz1+tyFFDkU+zui29bBaPItbHAs+SCPWg5ig4NyIB63aMQKB0UD1Gpmdjhm8totDbHDQaWkmijEEgdFkWlGpLLFSSU7cCgGscVBRF1TQyxrnFiSynoqYo2DphIUTkMgHKoDU37REHzxhCH2OCgsWE1IDoucnBDANkd7TtBtTykRh1JVEHRqkGJhk2NJAUql2eAEl1iPTmCVkxDMzpFkxCoHBTPI+yS7nCeDyKUr2eVU4ufV6YiQAz0wJYx0bE4Zy5xEbE4my5xU7BEPxDIHpUB0Q1no7wTXKS1im1OEySlmm1OMOXeI2OYgvNnFcaxzxsFk06xwfonFuYp1zlVYnMtY51yGo8kzsc4x5eEs8UCsc1A4VMXGBgenaivA4ag9MOUOnGVuiexzcPoIW9nnbMXgrGafsxqDMxmAQ7kqmAzTFWWFg9OOJrDPacDgGNnnGC9ejoV9juni5RgptTs6fncY4iSwz2lQuRlV5Pzzwn//dehtEk4mrSQnmLjQ1/dlW1v33lPvS6Ngk5zVtDn/6ev7X5snHKgjB3E5OCloEW3Ov/u+PNfmjb/wnccxOVtpdd+CifMX/t8m4vBdL+FxcLpvJdTHCvYKNW0f8g6PHYtTgsGZQZ3zlojzgevMn7U4nBksDUz1HhJqzna5zzA6TWlgiv6w4dteyzveoyuP0Rk2VG5HITjt3R7Ou8Izps700hjUVWHI/ZSnUhOfw3m4l8aQO/0Jkc9FtYA3jhwNiIO3zIj+dJXz5ek+++EHfmea7TsKP11FfzKx11k0kge+drwKPpmoOMEDM+TubEilz7He8+qgHLyaQI2JeEdDelbmDL09B6En4gNYJtFCFv/o/lj2cOHd54CXSaRQ57S0fNEpf/TxZ7CLWLhU+pyW/btlPV09oEuMlPoIYBwlj+tgd7lfcBeF5XkAnJa/7lH0wC3PK6xUg9NyvEPpZHe5xZNBLNWdowpH2SPzA4LZTz7owuNmmDiv4DkMt/B4dKw6nObz++Q9Rz6VuH9sUB+wiFaJ09ys4Nn3KdCifS7Oohan+Yi8p2OH35aKIE/KSFONc/6wgme/z+3T6GxHaoYMBc+e/TDbkQbZLAbKaT4j79n9HshmMW6hIgc43lTwfCG4+0JKGy2ho0f+YySdJyE2WipvgwWPz+Q9XScBtsFyhmI1ObZzCp7TAJuUpTfCUuPYDsh/BKvrGNkm2EE3+FOISAUPf4x8g7/S8Qt0ykfhW0tniI9fkEwNTmjlOZxGqpE6uqSbJscW+a68x/pHYs8WP87fbdp5iD/dN6Laz9NG12N7R96zgfhbpfm5vpxPTmjn+RHxlyPr/IrnE9rlo/BpvHWkn8k2SCwC+Vs31RI68bH8tz3rST0+x82pEse6ZEEViwk9L6rPQaflPctIP46bqIHnpLxnQjxhbT1LC4/sDEPnS98n81xerIFHbsak83h7+7fJPOFGDTzvSc4wdB5sd8R3Qog8yWYNPPslZhh2uzTt7X8gOxtwU64Wng45Te/e75E9b2EmDTw7OqQ1L++1Rf6MzFOiAQcVbBBP0g9oHLn3TEKP6uVjKuGqrBKaj9x9iUWEz5vK70+uc6gjJMK7IMStaf/I0ze6g6x+26Rq/Wbe5L7rwz6aU95klfB5S1ex/TEOTOn+eqVTc7Rf85Yg915AmL6Fq5YfFAsWSCat5PdJaWy3k/bm4lTK32aJpqWeH9C8D/AtbFE+WqaGpsxnhPC7/ZrPRZrbf8yRx4vUX6C5/t9yKOt1ag79WaT5AQcRI1fQ1ayQOgw4/3e+mshnOZgYUUexBcqtkx6Kvvy3PppyDizyq2lpqmWPBQ9ZQEvDcYYtVJpU8xaFxD9vow2sBfV/g0rhNaXKR2gX3jGgWcSBR1QOLCZn0BmPkEX0NI4qISwWDhMbFshs1MxIp4Yw95R/haY2wGAapgbYW372mcgFMylpnKCFAJVcdZiBYyVCotIsJBZLWlQIx1SkRAf9EsVGp3DsRWHynEp8S+Wc5EKO0ShMT0zFsaQmpjNr8Tx1MUWZgVAyi2JSOH1E3Li6UoVOa2xp3bg4TmeRFz6jJPHptBWZTxgd3SOj8YnMFWlPJ5bMCM+jd8+vALQTy2rEQtOIAAAAAElFTkSuQmCC"/>
                  </defs>
                  </svg>

                </div>
                <p class="empty-state__text">Chưa có đơn hàng</p>
              </div>
            </div>

            <!-- POPUP ĐÁNH GIÁ -->
            <OrderReviewPopup
              :open="showReview"
              :order="selectedOrder"
              :submitting="submittingReview"
              @close="showReview = false"
              @submit="handleReviewSubmit"
            />
          <ReturnOrderPopup
          :open="returnOpen"
          :order-id="returnOrder?.id"
          :loading="returnLoading"
          @close="returnOpen = false"
          @confirm="handleReturnConfirm"
        />

          </section>

        </div>
      </div>
    </main>

    <ClientFooter />
  </div>
  <OrderCancelPopup
  :open="cancelOpen"
  :order="cancelOrder"
  :loading="cancelLoading"
  @close="cancelOpen = false"
  @confirm="handleCancelConfirm"
/>

</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { request } from "../../services/http";

import ClientHeader from "../../components/client/ClientHeaderLogged.vue";
import ClientFooter from "../../components/client/ClientFooter.vue";
import AccountSidebar from "../../components/client/AccountSidebar.vue";
import OrderItem from "../../components/client/OrderItem.vue";
import OrderReviewPopup from "../../components/client/OrderReviewPopup.vue";
import OrderCancelPopup from "../../components/client/CancelOrderPopup.vue";
import ReturnOrderPopup from "../../components/client/OrderReturnPopup.vue";

const route = useRoute();
const router = useRouter();

const ORDERS_ENDPOINT = "/orders/mine";

/* ===== STATE POPUP HỦY ===== */
const cancelOpen = ref(false);
const cancelOrder = ref(null);
const cancelLoading = ref(false);

/* ===== STATE POPUP TRẢ HÀNG ===== */
const returnOpen = ref(false);
const returnOrder = ref(null);
const returnLoading = ref(false);

/* ===== STATE CHUNG ===== */
const loading = ref(false);
const errorMessage = ref("");
const orders = ref([]);

const activeTab = ref(route.query.tab?.toString() || "all");

const showReview = ref(false);
const selectedOrder = ref(null);
const submittingReview = ref(false);

/* ===== MAP TRẠNG THÁI ===== */
const STATUS_MAP = {
  pending: "PENDING",
  shipping: "SHIPPING",
  completed: "COMPLETED",
  cancelled: "CANCELLED",
  returned: "RETURNED",
};

const tabs = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: "Chờ xác nhận" },
  { key: "shipping", label: "Vận Chuyển" },
  { key: "completed", label: "Hoàn thành" },
  { key: "cancelled", label: "Đã hủy" },
  { key: "returned", label: "Trả hàng" },
];

/* ================== API LẤY ĐƠN ================== */
async function fetchOrders() {
  try {
    loading.value = true;
    errorMessage.value = "";

    const params =
      activeTab.value === "all"
        ? {}
        : { status: STATUS_MAP[activeTab.value] };

    const res = await request(ORDERS_ENDPOINT, { method: "GET", params });

    // Backend trả về array trực tiếp trong res.data
    const list = Array.isArray(res.data) ? res.data : [];
    orders.value = list;
  } catch (err) {
    errorMessage.value = err.message || "Không thể tải đơn hàng.";
    orders.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(fetchOrders);

watch(
  () => route.query.tab,
  () => {
    activeTab.value = route.query.tab?.toString() || "all";
    fetchOrders();
  }
);

/* ================== ĐI CHI TIẾT ĐƠN ================== */
function goDetail(order) {
  router.push({
    name: "account.orders.detail",
    params: { id: order.id },
  });
}

/* ================== POPUP ĐÁNH GIÁ ================== */
function onRate(order) {
  selectedOrder.value = order;
  showReview.value = true;
}

async function handleReviewSubmit(payload) {
  try {
    submittingReview.value = true;

    const firstProduct = selectedOrder.value?.products?.[0];
    if (!firstProduct) throw new Error("Không tìm thấy sản phẩm.");

    const productId = firstProduct.productId || firstProduct.id;
    const url = `/products/${productId}/reviews`;

    const formData = new FormData();
    formData.append("rating", String(payload.rating));
    formData.append("comment", payload.comment || "");

if (payload.images && payload.images.length > 0) {
  formData.append("reviewImage", payload.images[0]); 
}


    await request(url, {
      method: "POST", 
      data: formData,
    });

    showReview.value = false;
  } catch (err) {
    console.error(err);
    alert(err.message || "Không thể gửi đánh giá.");
  } finally {
    submittingReview.value = false;
  }
}



/* ================== POPUP HỦY ================== */
const openCancelPopup = (order) => {
  cancelOrder.value = order;
  cancelOpen.value = true;
};

function onCancel(order) {
  openCancelPopup(order);
}

const handleCancelConfirm = async ({ order, reason }) => {
  if (!order) return;
  cancelLoading.value = true;

  try {
    await request(`/orders/${order.id}/cancel`, {
      method: "POST",
      data: { reason },
    });

    cancelOpen.value = false;
    await fetchOrders();
  } catch (err) {
    alert(err.message || "Không thể hủy đơn hàng.");
  } finally {
    cancelLoading.value = false;
  }
};

/* ================== POPUP TRẢ HÀNG ================== */
const openReturnPopup = (order) => {
  returnOrder.value = order;
  returnOpen.value = true;
};

function onReturn(order) {
  openReturnPopup(order);
}

/* **CHỈ NHẬN reason + note, KHÔNG NHẬN order** */
const handleReturnConfirm = async ({ reason, note }) => {
  const order = returnOrder.value;
  if (!order) return;

  returnLoading.value = true;

  try {
    await request(`/orders/${order.id}/return`, {
      method: "POST",
      data: {
        reason,
        note: note || "",
      },
    });

    returnOpen.value = false;
    await fetchOrders();
  } catch (err) {
    alert(err.message || "Không thể gửi yêu cầu trả hàng.");
  } finally {
    returnLoading.value = false;
  }
};

/* ================== ĐỔI TAB ================== */
function goTab(key) {
  activeTab.value = key;

  router.push({
    path: route.path,
    query: { tab: key },
  });
}
</script>


<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Khula:wght@400;600;700&display=swap");

/* FONT & NỀN TỔNG THỂ */
.account {
  font-family: "Khula", system-ui, -apple-system, "Segoe UI", Roboto, Arial,
    sans-serif;
  background: #f5f5f5;
}
.account * {
  font-family: inherit;
}

/* LAYOUT CHUNG */
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

/* CARD + TABS */
.orders-card {
  background: transparent;
  border: none;
}

/* Ẩn TITLE "Đơn Mua" – chỉ dùng cho screen reader */
.orders-tabs__title {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

/* THANH TAB TRÊN CÙNG */
.orders-tabs {
  background: #ffffff;
  border-top: 1px solid #e3e3e3;
  border-bottom: 1px solid #e3e3e3;
  padding: 0 32px;
}
.orders-tabs__nav {
  display: flex;
  gap: 40px;
  height: 60px;
  align-items: flex-end;
}

.orders-tab {
  position: relative;
  background: transparent;
  border: 0;
  outline: none;
  cursor: pointer;
  padding: 0;
  margin: 0;
  font-weight: 600;
  font-size: 15px;
  line-height: 60px;
  color: #555555;
  white-space: nowrap;
}
.orders-tab.is-active {
  color: #ff0000;
}
.orders-tab.is-active::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  background: #ff0000;
  border-radius: 2px;
}
.orders-tab:not(.is-active):hover {
  color: #ff0000;
}

/* NỀN LIST ĐƠN */
.orders-body {
  background: #f5f5f5;
  padding: 18px 0 24px;
}

.state {
  padding: 16px 32px;
  font-size: 14px;
  color: #444444;
}
.state--error {
  color: #b91c1c;
}

/* LIST ĐƠN */
.olist {
  list-style: none;
  margin: 0;
  padding: 0 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.olist__item {
  cursor: pointer;
}
.olist__item:hover {
  filter: brightness(0.98);
}

/* HÀNG “KHÔNG CÓ ĐƠN” */
.empty-state {
  margin: 0 32px;
  padding: 60px 0;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty-state__icon svg {
  display: block;
}

.empty-state__text {
  margin-top: 16px;
  font-size: 14px;
  color: #777777;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .orders-tabs {
    padding: 0 16px;
  }
  .orders-body {
    padding-top: 12px;
  }
  .olist {
    padding: 0 12px;
  }
}
</style>
