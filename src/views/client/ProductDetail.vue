<template>
  <div class="detail">
    <ClientHeader />

    <main class="container">
  <div v-if="loading" class="state">Đang tải…</div>
  <div v-else-if="error" class="state state--error">{{ error }}</div>
  <div v-else-if="!product" class="state">Không tìm thấy sản phẩm.</div>

      <div v-else class="grid">
        <!-- Bên trái: Ảnh sản phẩm -->
        <section class="media">
          <div class="main-img">
            <img :src="activeImage" :alt="product?.name || 'Sản phẩm'" />
          </div>

          <div class="thumbs" v-if="gallery.length > 0">
            <button class="nav" @click="prevThumb">‹</button>

            <div class="thumbs-list">
              <img
                v-for="(img, i) in gallery"
                :key="i"
                :src="img"
                :class="{ active: i === thumbIndex }"
                @click="selectThumb(i)"
              />
            </div>

            <button class="nav" @click="nextThumb">›</button>
          </div>
        </section>

        <!-- Bên phải: Thông tin -->
        <section class="info">
          <h1 class="title">{{ product.name }}</h1>

          <div class="divider"></div>

          <div class="price">{{ formatCurrencyVND(displayPrice) }}</div>

          <ul class="meta">
            <li v-if="productBrand"><span>Thương hiệu:</span> {{ productBrand }}</li>
            <li v-if="product.categoryName"><span>Danh mục:</span> {{ product.categoryName }}</li>
            <li v-if="selectedVariant?.sku"><span>SKU:</span> {{ selectedVariant.sku }}</li>
            <li v-if="stockLabel"><span>Tình trạng:</span> {{ stockLabel }}</li>
          </ul>

          <div v-if="colorOptions.length" class="group">
            <label>Phân loại</label>
            <div class="chips">
              <button
                v-for="c in colorOptions"
                :key="c"
                :class="['chip', { active: c === color }]"
                @click="color = c"
              >
                {{ c }}
              </button>
            </div>
          </div>

          <div v-if="sizeOptions.length" class="group">
            <label>Size</label>
            <div class="chips">
              <button
                v-for="s in sizeOptions"
                :key="s"
                :class="['chip', { active: s === size }]"
                @click="size = s"
              >
                {{ s }}
              </button>
            </div>
          </div>

          <div class="group">
            <label>Số lượng</label>
            <div class="qty">
              <button @click="dec" :disabled="disableDec">–</button>
              <input type="number" v-model.number="qty" min="1" :max="maxQty" />
              <button @click="inc" :disabled="disableInc">+</button>
            </div>
            <p v-if="maxQty !== null" class="qty__hint">
              <span v-if="maxQty > 0">Còn lại {{ maxQty }} sản phẩm</span>
              <span v-else>Biến thể đang tạm hết hàng</span>
            </p>
          </div>

          <div v-if="actionStatus.message" :class="['alert', `alert--${actionStatus.type}`]">
            {{ actionStatus.message }}
          </div>

          <div class="actions">
            <button class="btn outline" @click="addToCart" :disabled="actionLoading">
              🛒 Thêm vào giỏ hàng
            </button>
            <button class="btn primary" @click="buyNow" :disabled="actionLoading">Mua ngay</button>
          </div>
        </section>
      </div>


       <!-- MÔ TẢ SẢN PHẨM -->
    <section class="desc">
      <h2 class="desc__title">MÔ TẢ SẢN PHẨM</h2>
      <div v-if="descriptionParagraphs.length" class="desc__content">
        <p v-for="(line, index) in descriptionParagraphs" :key="index">{{ line }}</p>
      </div>
      <p v-else class="desc__empty">Chưa có mô tả chi tiết cho sản phẩm này.</p>

      <h3 v-if="variants.length" class="desc__subtitle">Các phiên bản</h3>
      <table v-if="variants.length" class="variants">
        <thead>
          <tr>
            <th>Màu sắc</th>
            <th>Size</th>
            <th>Giá</th>
            <th>Tồn kho</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="variant in variants" :key="variant.id">
            <td>{{ variant.color || '—' }}</td>
            <td>{{ variant.size || '—' }}</td>
            <td>{{ formatCurrencyVND(variant.price) }}</td>
            <td>{{ variant.stock ?? '—' }}</td>
          </tr>
        </tbody>
      </table>
    </section>
    </main>

    <ClientFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import ClientHeader from "../../components/client/ClientHeaderLogged.vue";
import ClientFooter from "../../components/client/ClientFooter.vue";
import { getProductById } from "../../services/productService";
import { addItem } from "../../services/cartService";
import { formatCurrencyVND } from "../../utils/format";
import { useAuthStore } from "../../stores/auth";

const route = useRoute();
const router = useRouter();
const product = ref(null);
const loading = ref(true);
const error = ref("");
const color = ref("");
const size = ref("");
const qty = ref(1);
const thumbIndex = ref(0);
const actionStatus = ref({ type: "info", message: "" });
const actionLoading = ref(false);

const { isLoggedIn, role } = useAuthStore();
const isCustomerAccount = computed(() => {
  const value = role.value;
  return value === 'user' || value === 'customer' || value === 2;
});

const gallery = computed(() => product.value?.gallery || []);

const activeImage = computed(() => {
  if (gallery.value.length > 0) {
    return gallery.value[thumbIndex.value] || gallery.value[0];
  }
  const selected = selectedVariant.value;
  return selected?.imageUrl || "";
});

const colorOptions = computed(() => product.value?.colors || []);

watch(colorOptions, (options) => {
  if (!options || options.length === 0) {
    color.value = '';
    return;
  }
  if (!options.includes(color.value)) {
    color.value = options[0];
  }
});

const sizeOptions = computed(() => {
  if (!product.value?.variants) return [];
  if (!color.value) return product.value.sizes || [];
  const sizes = product.value.variants
    .filter((variant) => !variant.color || variant.color === color.value)
    .map((variant) => variant.size)
    .filter((val, idx, arr) => val && arr.indexOf(val) === idx);
  return sizes.length ? sizes : product.value.sizes || [];
});

const variants = computed(() => product.value?.variants || []);

const productBrand = computed(() => product.value?.brand || product.value?.categoryName || null);

const selectedVariant = computed(() => {
  if (!variants.value.length) return null;
  return (
    variants.value.find((variant) => {
      const matchColor = color.value ? variant.color === color.value : true;
      const matchSize = size.value ? variant.size === size.value : true;
      return matchColor && matchSize;
    }) || variants.value[0]
  );
});

const displayPrice = computed(() => selectedVariant.value?.price || product.value?.price || 0);

const maxQty = computed(() => {
  const stock = selectedVariant.value?.stock;
  if (typeof stock === "number" && stock >= 0) {
    return stock;
  }
  return null;
});

const stockLabel = computed(() => {
  if (maxQty.value === 0) return "Hết hàng";
  if (typeof maxQty.value === "number" && maxQty.value > 0) {
    return `${maxQty.value} sản phẩm`;
  }
  return selectedVariant.value ? "Còn hàng" : "";
});

const disableInc = computed(() => maxQty.value !== null && qty.value >= maxQty.value);
const disableDec = computed(() => qty.value <= 1);

const descriptionParagraphs = computed(() => {
  const desc = product.value?.description;
  if (!desc) return [];
  return desc
    .split(/\r?\n/) 
    .map((line) => line.trim())
    .filter(Boolean);
});

watch(sizeOptions, (options) => {
  if (!options || options.length === 0) {
    size.value = '';
    return;
  }
  if (!options.includes(size.value)) {
    size.value = options[0];
  }
});

function selectThumb(i) {
  thumbIndex.value = i;
}
function prevThumb() {
  const len = gallery.value.length;
  if (!len) return;
  thumbIndex.value = (thumbIndex.value - 1 + len) % len;
}
function nextThumb() {
  const len = gallery.value.length;
  if (!len) return;
  thumbIndex.value = (thumbIndex.value + 1) % len;
}
function dec() {
  if (qty.value > 1) qty.value--;
}
function inc() {
  if (maxQty.value !== null && qty.value >= maxQty.value) return;
  qty.value++;
}
function resetActionStatus() {
  actionStatus.value = { type: "info", message: "" };
}

async function performCartAction(redirectToCart = false) {
  if (!product.value) return;
  resetActionStatus();

  if (!isLoggedIn.value) {
    actionStatus.value = { type: "warning", message: "Vui lòng đăng nhập để mua hàng." };
    router.push({ name: "login", query: { redirect: route.fullPath } });
    return;
  }

  if (!isCustomerAccount.value) {
    actionStatus.value = {
      type: "error",
      message: "Tài khoản quản trị không thể sử dụng giỏ hàng. Vui lòng đăng nhập bằng tài khoản khách hàng.",
    };
    return;
  }

  const variantId = selectedVariant.value?.id;
  if (!variantId) {
    actionStatus.value = { type: "error", message: "Không tìm thấy biến thể phù hợp." };
    return;
  }

  if (maxQty.value === 0) {
    actionStatus.value = { type: "error", message: "Biến thể này đã hết hàng." };
    return;
  }

  const safeQty = qty.value < 1 ? 1 : qty.value;
  const quantity = maxQty.value !== null ? Math.min(safeQty, maxQty.value || 1) : safeQty;

  actionLoading.value = true;
  try {
    await addItem({ productVariantId: variantId, quantity });
    actionStatus.value = { type: "success", message: "Sản phẩm đã được thêm vào giỏ hàng." };
    if (redirectToCart) {
      router.push({ path: "/cart" });
    }
  } catch (err) {
    if (err?.status === 403) {
      actionStatus.value = {
        type: "error",
        message: "Giỏ hàng chỉ khả dụng cho tài khoản khách hàng. Vui lòng đăng nhập bằng tài khoản khách hàng.",
      };
    } else {
      const message = err?.message || "Không thể thêm vào giỏ hàng.";
      actionStatus.value = { type: "error", message };
    }
  } finally {
    actionLoading.value = false;
  }
}

function addToCart() {
  performCartAction(false);
}
function buyNow() {
  performCartAction(true);
}

async function loadProduct() {
  loading.value = true;
  error.value = "";
  product.value = null;
  color.value = "";
  size.value = "";
  thumbIndex.value = 0;

  try {
    const id = route.params.id;
    const data = await getProductById(id);
    product.value = data;
    if (data?.colors?.length) {
      color.value = data.colors[0];
    }
    if (data?.sizes?.length) {
      size.value = data.sizes[0];
    }
    resetActionStatus();
  } catch (err) {
    console.error("Không tải được sản phẩm", err);
    error.value = err.message || "Không tải được sản phẩm.";
  } finally {
    loading.value = false;
  }
}

watch(
  () => route.params.id,
  () => {
    loadProduct();
  }
);

onMounted(() => {
  loadProduct();
});

watch(selectedVariant, () => {
  qty.value = 1;
  resetActionStatus();
}, { immediate: true });

watch(qty, (value, oldValue) => {
  if (value === oldValue) return;
  if (value < 1) qty.value = 1;
  if (maxQty.value !== null && qty.value > maxQty.value) {
    qty.value = maxQty.value || 1;
  }
  resetActionStatus();
});

watch([color, size], () => {
  resetActionStatus();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Khula:wght@400;600;700&display=swap");

.detail {
  font-family: "Khula", sans-serif;
  background: #fff;
}

.container {
  max-width: 1200px;
  margin: 24px auto 40px;
  padding: 0 24px;
}

.state {
  text-align: center;
  padding: 24px 0;
  color: #4b5563;
}

.state--error {
  color: #b91c1c;
}

/* ===== Grid ===== */
.grid {
  display: grid;
  grid-template-columns: 520px 1fr;
  gap: 200px;
  align-items: start;
}
@media (max-width: 992px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

/* ===== Ảnh chính ===== */
.main-img {
  background: #18181b;
  padding: 8px;
  border-radius: 8px; 
}
.main-img img {
  width: 100%;
  display: block;
  border-radius: 6px;
  max-height: 480px;
}

/* ===== Gallery nhỏ ===== */
.thumbs {
  display: grid;
  grid-template-columns: 28px 1fr 28px;
  gap: 10px;
  align-items: center;
  margin-top: 12px;
}
.nav {
  height: 60px;
  border: none;
  background: #f3f4f6;
  border-radius: 8px;
  font-size: 22px;
  cursor: pointer;
}
.thumbs-list {
  display: grid;
  grid-auto-flow: column;
  gap: 8px;
  overflow: auto;
  padding: 6px 2px;
  background: #f8fafc;
  border-radius: 8px;
}
.thumbs-list img {
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  opacity: 0.75;
  cursor: pointer;
  border: 2px solid transparent;
}
.thumbs-list img.active {
  opacity: 1;
  border-color: #1e2cff;
}

/* ===== Thông tin ===== */
.title {
  font-weight: 700;
  font-size: 22px;
  color: #111827;
  margin: 6px 0 10px;
  line-height: 1.4;
}
.divider {
  height: 1.5px;
  background: #e5e7eb;
  margin: 8px 0 12px;
}
.price {
  font-size: 28px;
  font-weight: 800;
  color: #ef4444;
  background: #eef2ff;
  display: inline-block;
  padding: 6px 12px;
  border-radius: 6px;
}

.meta {
  list-style: none;
  margin: 16px 0 0;
  padding: 0;
  display: grid;
  gap: 6px;
  color: #4b5563;
  font-size: 14px;
}
.meta li span {
  font-weight: 600;
  color: #111827;
  margin-right: 6px;
}

/* ===== Chips ===== */
.group {
  margin-top: 18px;
}
.group label {
  display: block;
  margin-bottom: 6px;
  color: #374151;
  font-weight: 600;
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.chip {
  min-width: 72px;
  height: 40px;
  padding: 0 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  font-weight: 600;
}
.chip.active {
  border-color: #1e2cff;
  box-shadow: 0 0 0 3px rgba(30, 44, 255, 0.15);
}

/* ===== Số lượng ===== */
.qty {
  display: flex;
  align-items: center;
}
.qty input {
  width: 64px;
  height: 40px;
  border: 1px solid #e5e7eb;
  text-align: center;
  margin: 0 -1px;
}
.qty button {
  width: 40px;
  height: 40px;
  border: 1px solid #e5e7eb;
  background: #fff;
  cursor: pointer;
  border-radius: 6px;
}
.qty button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
.qty__hint {
  margin-top: 6px;
  color: #6b7280;
  font-size: 13px;
}

.alert {
  margin-top: 16px;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
}
.alert--success {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}
.alert--error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}
.alert--warning {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
}
.alert--info {
  background: #e0f2fe;
  color: #0c4a6e;
  border: 1px solid #bae6fd;
}

/* ===== Nút hành động ===== */
.actions {
  margin-top: 22px;
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}
.btn {
  border: none;
  border-radius: 10px;
  height: 48px;
  padding: 0 22px;
  font-weight: 700;
  cursor: pointer;
}
.btn.outline {
  background: #fff;
  color: #1e2cff;
  border: 2px solid #1e2cff;
}
.btn.primary {
  background: #ef4444;
  color: #fff;
}
.btn.outline:hover {
  background: #f8fafc;
}
.btn.primary:hover {
  background: #dc2626;
}
/* ===== MÔ TẢ SẢN PHẨM ===== */
.desc {
  margin-top: 28px;
  padding-top: 20px;
  border-top: 2px solid #e5e7eb;
}

.desc__title {
  font-size: 18px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 14px;
  text-transform: uppercase;
  letter-spacing: .3px;
}

.desc__subtitle {
  font-size: 14.5px;
  font-weight: 800;
  color: #111827;
  margin: 18px 0 8px;
  text-transform: uppercase;
}

.desc__content {
  display: grid;
  gap: 10px;
  color: #374151;
  line-height: 1.7;
  font-size: 14px;
}

.desc__empty {
  color: #9ca3af;
  font-style: italic;
  font-size: 14px;
}

.variants {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
  font-size: 14px;
}
.variants th,
.variants td {
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  text-align: left;
}
.variants th {
  background: #f9fafb;
  font-weight: 700;
  color: #111827;
}
.variants td {
  color: #374151;
}

</style>
