<template>
  <li class="oitem">
    <!-- SẢN PHẨM TRONG ĐƠN -->
    <div
      v-for="(product, idx) in order.products"
      :key="idx"
      class="product-wrap"
    >
      <div class="oitem__row oitem__row--top">
        <img
          :src="product.image || '/placeholder.png'"
          :alt="product.name"
          class="thumb"
        />
        <div class="meta">
          <h3 class="name">{{ product.name }}</h3>

          <p class="sub">
            Phân loại:
            <span>{{ product.category || "Không có" }}</span>
          </p>
          <p class="sub">x{{ product.quantity }}</p>
        </div>

        <div class="price-right">
          {{ formatVND(product.price * product.quantity) }}
        </div>
      </div>

      <div
        v-if="idx < order.products.length - 1"
        class="divider divider--light"
      />
    </div>

    <div class="divider divider--thick"></div>

    <!-- ================= HÀNG DƯỚI ================= -->
    <div class="oitem__row oitem__row--bot">
      <!-- ===== CHỜ XÁC NHẬN ===== -->
      <template v-if="isPending">
        <div class="pending-left">
          <span class="status-link">Chờ xác nhận</span>

          <!-- CHẶN BUBBLE Ở ĐÂY -->
          <button
            class="btn-cancel"
            @click.stop="$emit('cancel', order)"
          >
            Hủy đơn hàng
          </button>
        </div>

        <div class="total total--pending">
          <span class="total__label">Thành Tiền:</span>
          <strong class="total__val">
            {{ formatVND(order.total) }}
          </strong>
        </div>
      </template>

      <!-- ===== ĐÃ HỦY ===== -->
      <template v-else-if="isCancelled">
        <span class="status-cancelled">ĐÃ HỦY</span>

        <div class="total">
          <span class="total__label">Thành Tiền:</span>
          <strong class="total__val">{{ formatVND(order.total) }}</strong>
        </div>
      </template>

      <!-- ===== HOÀN THÀNH / VẬN CHUYỂN / TRẢ HÀNG ===== -->
      <template v-else>
        <div class="status-left">
          <span class="ship">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                d="M3 7h13v10H3zM16 10h4l1 2v5h-5z"
                fill="none"
                stroke="#2F80ED"
                stroke-width="2"
              />
            </svg>
            {{ deliveryText(order.status) }}
          </span>

          <span class="dot"></span>

          <span class="status-text" :class="statusClass">
            {{ statusText(order.status) }}
          </span>
        </div>

        <div class="bot-right">
          <!-- Đánh giá (chỉ khi hoàn thành & chưa đánh giá) -->
          <button
            v-if="canRate"
            class="btn-rate"
            @click.stop="$emit('rate', order)"
          >
            Đánh giá
          </button>

          <!-- Trả hàng (khi đơn đã hoàn thành & chưa ở trạng thái RETURNED) -->
          <button
            v-if="canReturn"
            class="btn-return"
            @click.stop="$emit('return', order)"
          >
            Trả hàng
          </button>

          <div class="total">
            <span class="total__label">Thành Tiền:</span>
            <strong class="total__val">{{ formatVND(order.total) }}</strong>
          </div>
        </div>
      </template>
    </div>
  </li>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  order: { type: Object, required: true },
});

const emit = defineEmits(["rate", "cancel", "return"]);


const isPending = computed(() => {
  const u = props.order.status?.toUpperCase();
  return u === "PENDING" || u === "ORDERED";
});

const isCancelled = computed(
  () => props.order.status?.toUpperCase() === "CANCELLED"
);

const isCompleted = computed(
  () => props.order.status?.toUpperCase() === "COMPLETED"
);

// nếu backend có flag isRated thì dùng luôn
const isRated = computed(() => !!props.order.isRated);

// chỉ cho đánh giá khi hoàn thành và chưa đánh giá
const canRate = computed(() => isCompleted.value && !isRated.value);

// cho phép Trả hàng khi đơn đã hoàn thành và chưa ở trạng thái RETURNED
const canReturn = computed(() => {
  const u = props.order.status?.toUpperCase();
  if (u !== "COMPLETED") return false;
  if (props.order.isReturned === true) return false;
  return true;
});

const statusClass = computed(() => {
  const s = props.order.status?.toLowerCase();
  return `st--${s}`;
});

function statusText(s) {
  const u = s?.toUpperCase();
  return (
    {
      ORDERED: "CHỜ XỬ LÝ",
      PENDING: "CHỜ XÁC NHẬN",
      SHIPPING: "ĐANG VẬN CHUYỂN",
      COMPLETED: "HOÀN THÀNH",
      CANCELLED: "ĐÃ HỦY",
      RETURNED: "TRẢ HÀNG",
    }[u] || ""
  );
}

function deliveryText(s) {
  const u = s?.toUpperCase();
  if (u === "COMPLETED") return "Giao hàng thành công";
  if (u === "SHIPPING") return "Đang giao hàng";
  if (u === "CANCELLED") return "Đã hủy";
  if (u === "RETURNED") return "Đã trả hàng";
  return "Chờ xử lý";
}

function formatVND(n) {
  return Number(n).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });
}
</script>

<style scoped>
/* CARD */
.oitem {
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 3px;
}

/* HÀNG TRÊN */
.oitem__row {
  display: flex;
  align-items: center;
  padding: 16px 24px;
}

.oitem__row--top {
  gap: 16px;
}

.thumb {
  width: 130px;
  height: 160px;
  object-fit: cover;
  border: 1px solid #e5e5e5;
  background: #f8f8f8;
}

.meta {
  flex: 1;
}

.name {
  margin: 0 0 6px 0;
  color: #222222;
  font-weight: 600;
  font-size: 16px;
}

.sub {
  margin: 0;
  font-size: 13px;
  color: #777777;
}

.sub span {
  color: #777777;
}

.price-right {
  margin-left: auto;
  color: #ff0000;
  font-weight: 600;
  font-size: 15px;
}

/* DIVIDER */
.divider {
  height: 1px;
  background: #ececec;
}

.divider--light {
  background: #f0f0f0;
}

.divider--thick {
  height: 2px;
  background: #e0e0e0;
}

/* HÀNG DƯỚI CHUNG */
.oitem__row--bot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  padding-bottom: 12px;
  gap: 16px;
}

/* ===== CHỜ XÁC NHẬN ===== */
.pending-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.status-link {
  color: #2f80ed;
  font-weight: 600;
  font-size: 13px;
}

/* NÚT */
.btn-cancel {
  height: 32px;
  padding: 0 14px;
  background: #ffffff;
  border: 1px solid #bfbfbf;
  border-radius: 4px;
  color: #555555;
  cursor: pointer;
}

.btn-rate {
  height: 36px;
  padding: 0 18px;
  background: #ff0000;
  border: 1px solid #ff0000;
  color: #ffffff;
  border-radius: 4px;
  cursor: pointer;
}

.btn-return {
  height: 36px;
  padding: 0 18px;
  background: #ffffff;
  border: 1px solid #ff0000;
  color: #ff0000;
  border-radius: 4px;
  cursor: pointer;
}

/* TRẠNG THÁI – CÁC LOẠI KHÁC */
.status-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ship {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #2f80ed;
  font-weight: 600;
  font-size: 13px;
}

.dot {
  width: 1px;
  height: 16px;
  background: #cccccc;
}

.status-text {
  font-weight: 700;
  font-size: 13px;
  text-transform: uppercase;
}

.st--completed {
  color: #ff0000;
}
.st--shipping {
  color: #2f80ed;
}
.st--returned {
  color: #777777;
}
.st--cancelled {
  color: #ff0000;
}

/* TỔNG TIỀN */
.total {
  display: flex;
  align-items: center;
  gap: 6px;
}

.total__label {
  color: #777777;
  font-size: 13px;
}

.total__val {
  color: #ff0000;
  font-weight: 700;
  font-size: 17px;
}

.total--pending {
  margin-left: auto;
}

/* nhóm nút bên phải */
.bot-right {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
