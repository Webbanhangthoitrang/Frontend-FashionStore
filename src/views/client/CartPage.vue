<template>
  <div class="cart-page">
    <!-- Header riêng -->
    <CartHeader />

    <main class="cart-container">
      <!-- === Page head: Icon (trái) + Title (phải) + Search === -->
      <header class="page-head" aria-label="Tiêu đề trang giỏ hàng">
        <div class="page-title-wrap">
          <span class="bag-icon" aria-hidden="true">
            <!-- SVG túi/giỏ màu xanh (giữ nguyên) -->
            <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 50L50 43.75C50 29.9429 61.1929 18.75 75 18.75C88.8071 18.75 100 29.9429 100 43.75L100 50" stroke="#4C80E6" stroke-width="10" stroke-linecap="round"/>
              <path d="M91.25 43.75C110.106 43.75 119.535 43.7496 125.393 49.6074C131.25 55.4653 131.25 64.8938 131.25 83.75V97.5C131.25 116.356 131.25 125.785 125.393 131.643C119.535 137.5 110.106 137.5 91.25 137.5H58.75C39.8938 137.5 30.4653 137.5 24.6074 131.643C18.7496 125.785 18.75 116.356 18.75 97.5V83.75C18.75 64.8938 18.7496 55.4653 24.6074 49.6074C30.4653 43.7496 39.8938 43.75 58.75 43.75H91.25ZM56.25 70C53.4886 70 51.25 72.2386 51.25 75V98.5C51.25 101.261 53.4886 103.5 56.25 103.5C59.0114 103.5 61.25 101.261 61.25 98.5V75C61.25 72.2386 59.0114 70 56.25 70ZM93.75 70C90.9886 70 88.75 72.2386 88.75 75V98.5C88.75 101.261 90.9886 103.5 93.75 103.5C96.5114 103.5 98.75 101.261 98.75 98.5V75C98.75 72.2386 96.5114 70 93.75 70Z" fill="#4C80E6"/>
            </svg>
          </span>
          <h1 class="page-title">Giỏ Hàng</h1>
        </div>

        <!-- Ô tìm kiếm (icon nằm trong ô, giống mẫu) -->
        <div class="search-wrap">
          <input
            v-model.trim="search"
            type="text"
            class="search-input"
            placeholder="Tìm kiếm sản phẩm trong giỏ hàng"
            aria-label="Tìm kiếm sản phẩm trong giỏ hàng"
          />
          <button class="search-btn" type="button" aria-label="Tìm">
            <!-- icon mảnh, xám, nhỏ -->
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="7" stroke="#6B7280" stroke-width="2"/>
              <path d="M20 20L16.65 16.65" stroke="#6B7280" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </header>

      <!-- === Bảng sản phẩm === -->
      <section class="cart-table">
        <div class="cart-table__head">
          <label class="chk">
            <input
              type="checkbox"
              :checked="allSelected"
              :indeterminate.prop="isIndeterminate"
              @change="toggleSelectAll"
            />
          </label>
          <div class="col col-name">Sản phẩm</div>
          <div class="col col-price">Đơn giá</div>
          <div class="col col-qty">Số lượng</div>
          <div class="col col-total">Số tiền</div>
          <div class="col col-del"></div>
        </div>

        <div class="cart-table__body">
          <div class="cart-row" v-for="item in filteredItems" :key="item.id">
            <label class="chk">
              <input
                type="checkbox"
                :checked="selectedIds.has(item.id)"
                @change="onToggleItem(item.id, $event)"
              />
            </label>

            <div class="col col-name">
              <img :src="item.image" class="thumb" alt="" />
              <div class="info">
                <p class="title">{{ item.name }}</p>
                <p class="variant">Phân loại: {{ item.variant }}</p>
              </div>
            </div>

            <div class="col col-price">
              {{ vnd(item.price) }}
            </div>

            <div class="col col-qty">
              <div class="qty-control">
                <button type="button" @click="decrease(item)">−</button>
                <input
                  type="text"
                  :value="item.quantity"
                  @change="updateQty(item, $event)"
                />
                <button type="button" @click="increase(item)">+</button>
              </div>
            </div>

            <div class="col col-total red">
              {{ vnd(item.price * item.quantity) }}
            </div>

            <div class="col col-del">
              <button class="delete-btn" type="button" @click="remove(item)">
                <i class="pi pi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- === Footer === -->
      <footer class="cart-footer">
        <label class="chk">
          <input
            type="checkbox"
            :checked="allSelected"
            :indeterminate.prop="isIndeterminate"
            @change="toggleSelectAll"
          />
          <span>Chọn tất cả ({{ items.length }})</span>
        </label>

        <div class="spacer"></div>

        <div class="total">
          <span>Tổng cộng ({{ selectedCount }} sản phẩm):</span>
          <b class="red">{{ vnd(totalSelected) }}</b>
        </div>

        <button class="buy-btn" type="button" :disabled="selectedCount === 0">
          Mua hàng
        </button>
      </footer>
    </main>
  </div>
</template>

<script setup>
import CartHeader from "../../components/client/CartHeader.vue";
import { computed, reactive, ref } from "vue";
import { useCart } from "../../services/cartService"; // KHÔNG dùng Pinia

// Lấy state + actions từ service
const { cartState, increase: inc, decrease: dec, setQty, remove: rm } = useCart();

const search = ref("");
const selectedIds = reactive(new Set());

// ===== Helpers =====
const vnd = (n) => `${(n || 0).toLocaleString("vi-VN")}đ`;

// Items hiển thị từ state reactive
const items = computed(() => cartState.items);

const filteredItems = computed(() => {
  if (!search.value) return items.value;
  const q = search.value.toLowerCase();
  return items.value.filter(
    (i) =>
      i.name.toLowerCase().includes(q) ||
      (i.variant || "").toLowerCase().includes(q)
  );
});

// ===== Selection logic =====
const selectedCount = computed(() =>
  filteredItems.value.reduce((c, i) => (selectedIds.has(i.id) ? c + 1 : c), 0)
);
const totalSelected = computed(() =>
  filteredItems.value.reduce(
    (sum, i) => (selectedIds.has(i.id) ? sum + i.price * i.quantity : sum),
    0
  )
);
const allSelected = computed(
  () =>
    filteredItems.value.length > 0 &&
    filteredItems.value.every((i) => selectedIds.has(i.id))
);
const isIndeterminate = computed(
  () => selectedCount.value > 0 && selectedCount.value < filteredItems.value.length
);

function toggleSelectAll(e) {
  const checked = e.target.checked;
  filteredItems.value.forEach((i) =>
    checked ? selectedIds.add(i.id) : selectedIds.delete(i.id)
  );
}
function onToggleItem(id, e) {
  if (e.target.checked) selectedIds.add(id);
  else selectedIds.delete(id);
}

// ===== Quantity / Remove =====
function increase(item) {
  inc(item.id);
}
function decrease(item) {
  dec(item.id);
}
function updateQty(item, e) {
  const n = parseInt(e.target.value);
  setQty(item.id, isNaN(n) ? 1 : n);
}
function remove(item) {
  rm(item.id);
  selectedIds.delete(item.id);
}
</script>

<style scoped>
.cart-container {
  width: 960px;
  margin: 20px auto 40px;
}

/* ===== Page head ===== */
.page-head {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 24px;
  margin-bottom: 14px;
}

/* Icon + chữ hàng ngang */
.page-title-wrap {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}
.page-title {
  font-size: 25px;
  color: #4f7cff;
  margin: 0;
}
.bag-icon {
  width: 100px;
  height:100px;
  color: #4f7cff;
  display: inline-flex;
}
.bag-icon :where(svg) {
  width: 100%;
  height: 100%;
  display: block;
}

/* ===== Search (theo mẫu bạn gửi) ===== */
.search-wrap {
  position: relative;
  justify-self: center;
  width: 520px;
  max-width: 100%;
}
.search-input {
  width: 100%;
  height: 40px;
  padding: 0 40px 0 14px;   /* chừa chỗ cho icon */
  border: 1px solid #E5E7EB; /* viền xám nhạt */
  border-radius: 6px;        /* bo nhẹ */
  outline: none;
  background: #fff;
  font-size: 14px;
  color: #111827;
}
.search-input::placeholder {
  color: #9CA3AF;
}
.search-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  height: 24px;
  width: 24px;
  border: none;
  background: transparent;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.search-btn:active {
  transform: translateY(-50%) scale(0.98);
}

/* ===== Bảng ===== */
.cart-table {
  border: 1px solid #d1d5db;
  border-radius: 6px;
  overflow: hidden;
}
.cart-table__head,
.cart-row {
  display: grid;
  grid-template-columns: 36px 1.3fr 0.5fr 0.6fr 0.6fr 40px;
  align-items: center;
  gap: 6px;
  padding: 10px 8px;
}
.cart-table__head {
  background: #f8fafc;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}
.cart-row {
  border-top: 1px solid #f1f5f9;
}
.cart-row:hover {
  background: #fafafa;
}

.thumb {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #ddd;
}
.col-name {
  display: grid;
  grid-template-columns: 70px 1fr;
  gap: 8px;
  align-items: center;
}
.info .title {
  font-weight: 600;
  margin-bottom: 4px;
}
.info .variant {
  color: #666;
  font-size: 13px;
}

.qty-control {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
  width: fit-content;
}
.qty-control button {
  width: 28px;
  height: 28px;
  border: none;
  background: #f3f4f6;
  cursor: pointer;
  font-size: 16px;
}
.qty-control input {
  width: 40px;
  text-align: center;
  border: none;
  outline: none;
}

.red {
  color: #e11d48;
  font-weight: 600;
}

.delete-btn {
  border: none;
  background: transparent;
  color: #ef4444;
  cursor: pointer;
}

/* ===== Footer ===== */
.cart-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 10px 16px;
  background: #fff;
}
.chk {
  display: flex;
  align-items: center;
  gap: 6px;
}
.total {
  display: flex;
  align-items: baseline;
  gap: 6px;
}
.buy-btn {
  background: #e11d48;
  color: #fff;
  border: none;
  border-radius: 8px;
  height: 40px;
  width: 120px;
  font-weight: 700;
  cursor: pointer;
}
.buy-btn:disabled {
  background: #f1f5f9;
  color: #94a3b8;
  cursor: not-allowed;
}
.spacer {
  flex: 1;
}
</style>
