<!-- src/views/client/CartPage.vue -->
<template>
  <div class="cart-page">
    <!-- Header -->
    <CartHeader />

    <main class="cart-container">
      <!--  Page head  -->
      <header class="page-head" aria-label="Tiêu đề trang giỏ hàng">
        <div class="page-title-wrap">
          <span class="bag-icon" aria-hidden="true">
            <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 50L50 43.75C50 29.9429 61.1929 18.75 75 18.75C88.8071 18.75 100 29.9429 100 43.75L100 50" stroke="#4C80E6" stroke-width="10" stroke-linecap="round"/>
              <path d="M91.25 43.75C110.106 43.75 119.535 43.7496 125.393 49.6074C131.25 55.4653 131.25 64.8938 131.25 83.75V97.5C131.25 116.356 131.25 125.785 125.393 131.643C119.535 137.5 110.106 137.5 91.25 137.5H58.75C39.8938 137.5 30.4653 137.5 24.6074 131.643C18.7496 125.785 18.75 116.356 18.75 97.5V83.75C18.75 64.8938 18.7496 55.4653 24.6074 49.6074C30.4653 43.7496 39.8938 43.75 58.75 43.75H91.25ZM56.25 70C53.4886 70 51.25 72.2386 51.25 75V98.5C51.25 101.261 53.4886 103.5 56.25 103.5C59.0114 103.5 61.25 101.261 61.25 98.5V75C61.25 72.2386 59.0114 70 56.25 70ZM93.75 70C90.9886 70 88.75 72.2386 88.75 75V98.5C88.75 101.261 90.9886 103.5 93.75 103.5C96.5114 103.5 98.75 101.261 98.75 98.5V75C98.75 72.2386 96.5114 70 93.75 70Z" fill="#4C80E6"/>
            </svg>
          </span>
          <h1 class="page-title">Giỏ Hàng</h1>
        </div>

        <!-- Search -->
        <div class="search-wrap">
          <input
            v-model.trim="search"
            type="text"
            class="search-input"
            placeholder="Tìm kiếm sản phẩm trong giỏ hàng"
            aria-label="Tìm kiếm sản phẩm trong giỏ hàng"
          />
          <button class="search-btn" type="button" aria-label="Tìm">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="7" stroke="#6B7280" stroke-width="2"/>
              <path d="M20 20L16.65 16.65" stroke="#6B7280" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </header>

      <!-- Bảng sản phẩm -->
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
              <img
                :src="getItemImage(item) || '/placeholder.png'"
                class="thumb"
                alt="Sản phẩm"
                :title="getItemImage(item)"
                @error="e => (e.target.src = '/placeholder.png')"
              />
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
                <button type="button" @click="increase(item)">−</button>
                <input type="text" :value="item.quantity" @change="updateQty(item, $event)" />
                <button type="button" @click="decrease(item)">+</button>
              </div>
            </div>

            <div class="col col-total red">
              {{ vnd(item.price * item.quantity) }}
            </div>

            <div class="col col-del">
              <button
                class="delete-btn"
                type="button"
                aria-label="Xóa sản phẩm"
                @click="confirmRemoveOne(item)"
                title="Xóa sản phẩm này"
              >
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M10 8.33366C9.77899 8.33366 9.56702 8.42146 9.41074 8.57774C9.25446 8.73402 9.16667 8.94598 9.16667 9.16699V10.8337C9.16666 11.0535 9.25354 11.2645 9.40838 11.4206C9.56322 11.5767 9.77348 11.6652 9.99333 11.667H30.0067C30.2265 11.6652 30.4368 11.5767 30.5916 11.4206C30.7465 11.2645 30.8333 11.0535 30.8333 10.8337V9.16699C30.8333 8.94598 30.7455 8.73402 30.5893 8.57774C30.433 8.42146 30.221 8.33366 30 8.33366H10ZM7.5 10.8337C7.49991 11.3618 7.66711 11.8765 7.97761 12.3037C8.28811 12.731 8.72595 13.049 9.22833 13.212L9.54167 16.667H8.33333C8.11232 16.667 7.90036 16.7548 7.74408 16.9111C7.5878 17.0673 7.5 17.2793 7.5 17.5003C7.5 17.7213 7.5878 17.9333 7.74408 18.0896C7.90036 18.2459 8.11232 18.3337 8.33333 18.3337H9.69333L10.7817 30.302C10.8569 31.1302 11.239 31.9003 11.853 32.4612C12.4669 33.0222 13.2684 33.3333 14.1 33.3337H25.8967C26.7286 33.3337 27.5304 33.0228 28.1447 32.4618C28.759 31.9009 29.1414 31.1305 29.2167 30.302L30.3067 18.3337H31.6667C31.8877 18.3337 32.0996 18.2459 32.2559 18.0896C32.4122 17.9333 32.5 17.7213 32.5 17.5003C32.5 17.2793 32.4122 17.0673 32.2559 16.9111C32.0996 16.7548 31.8877 16.667 31.6667 16.667H30.4583L30.7717 13.212C31.274 13.049 31.7119 12.731 32.0224 12.3037C32.3329 11.8765 32.5001 11.3618 32.5 10.8337V9.16699C32.5 8.50395 32.2366 7.86807 31.7678 7.39922C31.2989 6.93038 30.663 6.66699 30 6.66699H10C9.33696 6.66699 8.70107 6.93038 8.23223 7.39922C7.76339 7.86807 7.5 8.50395 7.5 9.16699V10.8337ZM12.4417 30.1503L10.9133 13.3337H29.0883L27.5583 30.1503C27.5209 30.5647 27.3298 30.9501 27.0226 31.2308C26.7154 31.5114 26.3144 31.667 25.8983 31.667H14.1017C13.6856 31.667 13.2846 31.5114 12.9774 31.2308C12.6702 30.9501 12.4791 30.5647 12.4417 30.1503ZM18.3333 17.5003C18.3333 17.2793 18.2455 17.0673 18.0893 16.9111C17.933 16.7548 17.721 16.667 17.5 16.667C17.279 16.667 17.067 16.7548 16.9107 16.9111C16.7545 17.0673 16.6667 17.2793 16.6667 17.5003V27.5003C16.6667 27.7213 16.7545 27.9333 16.9107 28.0896C17.067 28.2459 17.279 28.3337 17.5 28.3337C17.721 28.3337 17.933 28.2459 18.0893 28.0896C18.2455 27.9333 18.3333 27.7213 18.3333 27.5003V17.5003ZM23.3333 17.5003C23.3333 17.2793 23.2455 17.0673 23.0893 16.9111C22.933 16.7548 22.721 16.667 22.5 16.667C22.279 16.667 22.067 16.7548 21.9107 16.9111C21.7545 17.0673 21.6667 17.2793 21.6667 17.5003V27.5003C21.6667 27.7213 21.7545 27.9333 21.9107 28.0896C22.067 28.2459 22.279 28.3337 22.5 28.3337C22.721 28.3337 22.933 28.2459 23.0893 28.0896C23.2455 27.9333 23.3333 27.7213 23.3333 27.5003V17.5003Z"
                    fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!--  Footer  -->
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

        <button
          class="delete-all-btn"
          type="button"
          aria-label="Xóa các sản phẩm đã chọn"
          :disabled="selectedCount === 0"
          @click="confirmRemoveSelected"
          title="Xóa các sản phẩm đã chọn"
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M10 8.33366C9.77899 8.33366 9.56702 8.42146 9.41074 8.57774C9.25446 8.73402 9.16667 8.94598 9.16667 9.16699V10.8337C9.16666 11.0535 9.25354 11.2645 9.40838 11.4206C9.56322 11.5767 9.77348 11.6652 9.99333 11.667H30.0067C30.2265 11.6652 30.4368 11.5767 30.5916 11.4206C30.7465 11.2645 30.8333 11.0535 30.8333 10.8337V9.16699C30.8333 8.94598 30.7455 8.73402 30.5893 8.57774C30.433 8.42146 30.221 8.33366 30 8.33366H10Z"
              fill="currentColor"/>
          </svg>
        </button>

        <div class="spacer"></div>

        <div class="total">
          <span>Tổng cộng ({{ selectedCount }} sản phẩm):</span>
          <b class="red">{{ vnd(totalSelected) }}</b>
        </div>

        <button class="buy-btn" type="button" :disabled="selectedCount === 0" @click="goCheckout">
          Mua hàng
        </button>
      </footer>

      <!--  Popup xác nhận xóa  -->
      <div v-if="confirm.show" class="modal-overlay" @keydown.esc.prevent="closeConfirm" tabindex="0">
        <div class="modal-box" role="dialog" aria-modal="true">
          <h3 class="modal-title">
            {{ confirm.mode === 'one' ? 'Bạn có chắc muốn xóa sản phẩm này?' : 'Bạn có chắc muốn xóa các sản phẩm đã chọn?' }}
          </h3>
          <div class="modal-actions">
            <button class="btn btn-light" type="button" @click="closeConfirm">Hủy</button>
            <button class="btn btn-danger" type="button" @click="doConfirm">Xác nhận</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import CartHeader from "../../components/client/CartHeader.vue";
import { useCart } from "../../services/cartService";

// Cart services
const { cartState, fetchCart, increase: inc, decrease: dec, setQty, removeItem } = useCart();
const router = useRouter();

const search = ref("");
const selectedIds = reactive(new Set());

//  Helpers 
const vnd = (n) => `${(Number(n) || 0).toLocaleString("vi-VN")}đ`;

// Items & filter
const items = computed(() => Array.isArray(cartState.items) ? cartState.items : []);
const filteredItems = computed(() => {
  const base = Array.isArray(items.value) ? items.value : [];
  if (!search.value) return base;
  const q = String(search.value || "").toLowerCase();
  return base.filter(i =>
    String(i?.name || "").toLowerCase().includes(q) ||
    String(i?.variant || "").toLowerCase().includes(q)
  );
});

// Ảnh sản phẩm (nhiều kiểu payload)
function getItemImage(it) {
  if (!it) return "";
  if (it.image) return String(it.image);
  const variants = Array.isArray(it.product?.variants) ? it.product.variants : [];
  const v = variants.find(x => x?.id === (it.productVariantId ?? it.variantId)) || variants[0];
  return (
    it.imageUrl ||
    it.thumbnail ||
    v?.imageUrl ||
    it.product?.imageUrl ||
    (Array.isArray(it.images) ? it.images[0] : "") ||
    ""
  );
}

//  Selection logic 
const selectedCount = computed(() => {
  const list = Array.isArray(filteredItems.value) ? filteredItems.value : [];
  return list.reduce((c, i) => (selectedIds.has(i?.id) ? c + 1 : c), 0);
});
const selectedItems = computed(() => {
  const list = Array.isArray(filteredItems.value) ? filteredItems.value : [];
  return list.filter(i => selectedIds.has(i?.id));
});
const totalSelected = computed(() => {
  return selectedItems.value.reduce(
    (sum, i) => sum + (Number(i?.price || 0) * Number(i?.quantity || 0)), 0
  );
});
const allSelected = computed(() => {
  const list = Array.isArray(filteredItems.value) ? filteredItems.value : [];
  return list.length > 0 && list.every(i => selectedIds.has(i?.id));
});
const isIndeterminate = computed(() => {
  const len = Array.isArray(filteredItems.value) ? filteredItems.value.length : 0;
  return selectedCount.value > 0 && selectedCount.value < len;
});

function toggleSelectAll(e) {
  const checked = !!e.target.checked;
  const list = Array.isArray(filteredItems.value) ? filteredItems.value : [];
  list.forEach(i => {
    if (!i) return;
    if (checked) selectedIds.add(i.id);
    else selectedIds.delete(i.id);
  });
}
function onToggleItem(id, e) { e.target.checked ? selectedIds.add(id) : selectedIds.delete(id); }

//  Qty / Remove 
function increase(item) { inc(item.id); }
function decrease(item) { dec(item.id); }
function updateQty(item, e) {
  const n = parseInt(e.target.value);
  setQty(item.id, isNaN(n) ? 1 : n);
}

//  Xóa (popup confirm) 
const confirm = reactive({
  show: false,
  mode: "one",     // 'one' | 'multi'
  targetId: null,  // id item khi xóa 1
});
function confirmRemoveOne(item) {
  confirm.show = true;
  confirm.mode = "one";
  confirm.targetId = item?.id ?? null;
}
function confirmRemoveSelected() {
  confirm.show = true;
  confirm.mode = "multi";
  confirm.targetId = null;
}
function closeConfirm() {
  confirm.show = false;
  confirm.mode = "one";
  confirm.targetId = null;
}
async function doConfirm() {
  try {
    if (confirm.mode === "one" && confirm.targetId != null) {
      await removeItem(confirm.targetId);
      selectedIds.delete(confirm.targetId);
    } else if (confirm.mode === "multi") {
      const ids = Array.from(selectedIds);
      for (const id of ids) {
        await removeItem(id);
        selectedIds.delete(id);
      }
    }
  } finally {
    closeConfirm();
  }
}

//  Mua hàng -> Checkout 
function goCheckout() {
  // Nếu backend xử lý cả giỏ: chỉ cần điều hướng
  // Nếu muốn truyền danh sách item đã chọn: đưa id vào query `selected`
  const ids = selectedItems.value.map(i => i.id).join(",");
  router.push({ path: "/checkout", query: { source: "cart", selected: ids } });
}

// Load giỏ
onMounted(async () => {
  await fetchCart();
});
</script>

<style scoped>
.cart-container { width: 960px; margin: 20px auto 40px; }

/* Page head */
.page-head { display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 24px; margin-bottom: 14px; }
.page-title-wrap { display: flex; flex-direction: row; align-items: center; gap: 10px; flex-shrink: 0; }
.page-title { font-size: 25px; color: #4f7cff; margin: 0; }
.bag-icon { width: 100px; height: 100px; color: #4f7cff; display: inline-flex; }
.bag-icon :where(svg){ width: 100%; height: 100%; display: block; }

/* Search */
.search-wrap { position: relative; justify-self: center; width: 520px; max-width: 100%; }
.search-input { width: 100%; height: 40px; padding: 0 40px 0 14px; border: 1px solid #E5E7EB; border-radius: 6px; outline: none; background: #fff; font-size: 14px; color: #111827; }
.search-input::placeholder { color: #9CA3AF; }
.search-btn { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); height: 24px; width: 24px; border: none; background: transparent; padding: 0; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; }
.search-btn:active { transform: translateY(-50%) scale(0.98); }

/* Table */
.cart-table { border: 1px solid #d1d5db; border-radius: 6px; overflow: hidden; }
.cart-table__head, .cart-row { display: grid; grid-template-columns: 36px 1.3fr 0.5fr 0.6fr 0.6fr 40px; align-items: center; gap: 6px; padding: 10px 8px; }
.cart-table__head { background: #f8fafc; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb; }
.cart-row { border-top: 1px solid #f1f5f9; }
.cart-row:hover { background: #fafafa; }

.thumb { width: 70px; height: 70px; object-fit: cover; border-radius: 6px; border: 1px solid #ddd; }
.col-name { display: grid; grid-template-columns: 70px 1fr; gap: 8px; align-items: center; }
.info .title { font-weight: 600; margin-bottom: 4px; }
.info .variant { color: #666; font-size: 13px; }

.qty-control { display: flex; align-items: center; border: 1px solid #ddd; border-radius: 6px; overflow: hidden; width: fit-content; }
.qty-control button { width: 28px; height: 28px; border: none; background: #f3f4f6; cursor: pointer; font-size: 16px; }
.qty-control input { width: 40px; text-align: center; border: none; outline: none; }

.red { color: #e11d48; font-weight: 600; }

/* Delete buttons */
.col-del { display: flex; justify-content: center; }
.delete-btn, .delete-all-btn {
  width: 40px; height: 40px; border: none; background: transparent; color: #5F5F5F;
  border-radius: 8px; display: inline-flex; align-items: center; justify-content: center;
  cursor: pointer; transition: color .15s ease, background-color .15s ease, transform .05s ease;
}
.delete-btn:hover, .delete-all-btn:hover { color: #EF4444; background: #F9FAFB; }
.delete-btn:active, .delete-all-btn:active { transform: scale(0.98); }
.delete-all-btn:disabled { color: #cbd5e1; cursor: not-allowed; }

/* Footer */
.cart-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 16px; border: 1px solid #e5e7eb; border-radius: 6px; padding: 10px 16px; background: #fff; }
.chk { display: flex; align-items: center; gap: 6px; }
.total { display: flex; align-items: baseline; gap: 6px; }
.buy-btn { background: #e11d48; color: #fff; border: none; border-radius: 8px; height: 40px; width: 120px; font-weight: 700; cursor: pointer; }
.buy-btn:disabled { background: #f1f5f9; color: #94a3b8; cursor: not-allowed; }
.spacer { flex: 1; }

/* Modal */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.35);
  display: grid; place-items: center; z-index: 1000;
}
.modal-box {
  width: 360px; max-width: calc(100% - 32px);
  background: #fff; border-radius: 10px; padding: 20px 16px; box-shadow: 0 10px 30px rgba(0,0,0,.15);
}
.modal-title { font-size: 16px; font-weight: 700; text-align: center; margin: 6px 0 16px; color: #111827; }
.modal-actions { display: flex; justify-content: center; gap: 10px; }
.btn { height: 36px; padding: 0 14px; border-radius: 8px; border: 1px solid transparent; cursor: pointer; font-weight: 600; }
.btn-light { background: #F3F4F6; color: #111827; border-color: #E5E7EB; }
.btn-danger { background: #EF4444; color: #fff; }
.btn:active { transform: translateY(1px); }
</style>
