<template>
  <div class="home">
    <!-- Header -->
    <ClientHeader />

    <!-- Banner (fade, không trượt) -->
    <section class="banner" @mouseenter="pause" @mouseleave="play">
      <div class="banner__fade">
        <img
          v-for="(img, i) in banners"
          :key="i"
          :src="img"
          :alt="`banner ${i + 1}`"
          class="banner__img"
          :class="{ active: i === currentIndex }"
        />
      </div>

      <div class="banner__dots">
        <span
          v-for="(img, i) in banners"
          :key="i"
          :class="['dot', { active: i === currentIndex }]"
          @click="go(i)"
        />
      </div>
    </section>

    <!-- Danh mục (đã kết nối API + polling + RouterLink) -->
    <section class="category">
      <h2 class="category__title">Danh mục</h2>

      <div v-if="categoryLoading" class="state">Đang tải danh mục…</div>
      <div v-else-if="categories.length === 0" class="state">Chưa có danh mục nào.</div>

      <div v-else class="category__list">
        <!-- Ô 'Tất cả' -->
        <RouterLink
          class="category__item"
          :to="{ name: 'Category', params: {}, query: { page: 1 } }"
          aria-label="Tất cả sản phẩm"
        >
          <img :src="fallbackIcon" alt="Tất cả" class="category__icon" loading="lazy" />
          <p class="category__name">Tất cả</p>
        </RouterLink>

        <!-- Các danh mục từ API -->
        <RouterLink
          v-for="item in categories"
          :key="item.id || item.name"
          class="category__item"
          :to="{ name: 'Category', params: item.slug ? { slug: item.slug } : {}, query: { page: 1 } }"
          :aria-label="`Danh mục ${item.name}`"
        >
          <img
            :src="item.icon || fallbackIcon"
            :alt="item.name"
            class="category__icon"
            loading="lazy"
          />
          <p class="category__name">{{ item.name }}</p>
        </RouterLink>
      </div>
    </section>

    <!-- Gợi ý sản phẩm -->
    <section class="product">
      <h2 class="product__title">
        {{ searchTerm ? `Kết quả tìm kiếm cho "${searchTerm}"` : 'Gợi ý sản phẩm' }}
      </h2>

      <div v-if="productLoading" class="state">Đang tải sản phẩm…</div>
      <div v-else-if="products.length === 0" class="state">
        {{ searchTerm ? 'Không tìm thấy sản phẩm phù hợp.' : 'Không có sản phẩm để hiển thị.' }}
      </div>
      <div v-else class="product__grid">
        <ProductCard v-for="p in products" :key="p.id" :product="p" />
      </div>
    </section>

    <div class="more-btn">
      <button>Gợi ý thêm sản phẩm</button>
    </div>

    <!-- Footer -->
    <ClientFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useRoute } from "vue-router";
import ClientHeader from "../../components/client/ClientHeaderLogged.vue";
import ClientFooter from "../../components/client/ClientFooter.vue";
import ProductCard from "../../components/client/ProductCard.vue";
import { getCategories } from "../../services/categoryService";
import { getProducts } from "../../services/productService";

import banner1 from "../../assets/banner1.png";
import banner2 from "../../assets/banner2.png";
import banner3 from "../../assets/banner3.png";
import banner4 from "../../assets/banner4.png";

/* ---------------- Danh mục: state + logic (giữ nguyên, thêm slugify) ---------------- */
const categories = ref([]);
const categoryLoading = ref(false);

// fallback icon nhỏ (data URI SVG xám 54x54)
const fallbackIcon =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="%2399A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>';

let categoryPollTimer = null; // polling để tự cập nhật khi admin thêm mới

function slugify(str = "") {
  return String(str)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function fetchCategories() {
  categoryLoading.value = true;
  try {
    const data = await getCategories();
    categories.value = (Array.isArray(data) ? data : []).map((c) => {
      const name = c.name ?? "";
      const slug = c.slug ?? c.code ?? slugify(name);
      return {
        id: c.id ?? c._id ?? name,
        name,
        icon: c.icon || "",
        slug, // <-- thêm slug để RouterLink dùng params
      };
    });
  } catch (error) {
    console.error("Không tải được danh mục", error);
    categories.value = [];
  } finally {
    categoryLoading.value = false;
  }
}

function startCategoryPolling(intervalMs = 20000) {
  if (categoryPollTimer) return;
  categoryPollTimer = setInterval(fetchCategories, intervalMs);
}
function stopCategoryPolling() {
  if (!categoryPollTimer) return;
  clearInterval(categoryPollTimer);
  categoryPollTimer = null;
}

/* ---------------- Sản phẩm: GIỮ NGUYÊN ---------------- */
const products = ref([]);
const productLoading = ref(false);
const route = useRoute();
const searchTerm = ref("");

async function fetchProducts(params = {}) {
  productLoading.value = true;
  try {
    const payload = { limit: 12, ...params };
    if (!payload.q) delete payload.q;
    const data = await getProducts(payload);
    products.value = data.items;
  } catch (error) {
    console.error("Không tải được sản phẩm", error);
    products.value = [];
  } finally {
    productLoading.value = false;
  }
}

/* ---------------- Banner: GIỮ NGUYÊN ---------------- */
const banners = [banner1, banner2, banner3, banner4];
const currentIndex = ref(0);
const intervalTime = 3000; // 3s
let timer = null;

function next() {
  currentIndex.value = (currentIndex.value + 1) % banners.length;
}
function go(i) {
  currentIndex.value = i;
}
function play() {
  if (timer) return;
  timer = setInterval(next, intervalTime);
}
function pause() {
  if (!timer) return;
  clearInterval(timer);
  timer = null;
}

/* ---------------- Lifecycle: giữ nguyên + polling danh mục ---------------- */
onMounted(() => {
  // preload banner
  banners.forEach((src) => {
    const im = new Image();
    im.src = src;
  });

  // Danh mục
  fetchCategories();
  startCategoryPolling(20000);

  // Sản phẩm
  const initial = route.query.q ? route.query.q.toString() : "";
  searchTerm.value = initial;
  fetchProducts({ q: initial });

  // Banner
  play();
});

onBeforeUnmount(() => {
  pause();
  stopCategoryPolling();
});

// cập nhật khi query tìm kiếm đổi (GIỮ NGUYÊN)
watch(
  () => route.query.q,
  (value) => {
    const term = value ? value.toString() : "";
    searchTerm.value = term;
    fetchProducts({ q: term });
  }
);
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #fff;
}

/* ---------- Banner (fade) ---------- */
.banner {
  width: 100%;
  height: 320px;
  overflow: hidden;
  position: relative;
}
.banner__fade {
  position: relative;
  width: 100%;
  height: 100%;
}
.banner__img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  opacity: 0;
  transition: opacity 800ms ease-in-out;
  pointer-events: none;
}
.banner__img.active {
  opacity: 1;
}
.banner__dots {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: transform 0.3s ease, background 0.3s ease;
}
.dot.active {
  background: #4f7ee6;
  transform: scale(1.2);
}

/* ---------- Danh mục ---------- */
.category {
  max-width: 1200px;
  margin-left: 20px;
  margin-right: 20px;
  padding: 0 40px;
}
.category__title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 18px;
}
.category__list {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 70px;
  align-items: stretch;
}
/* RouterLink được style như thẻ card */
.category__item {
  height: 130px;
  width: 170px;
  border: 1px solid #4f7ee6;
  border-radius: 12px;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  text-align: center;
  text-decoration: none;
  color: inherit;
}
.category__item:hover {
  background: #f6f8ff;
  transform: translateY(-3px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}
.category__icon {
  width: 54px;
  height: 54px;
  margin-bottom: 10px;
  object-fit: contain;
}
.category__name {
  font-weight: 600;
  font-size: 16px;
  color: #333;
}

/* Tablet */
@media (max-width: 1024px) {
  .category__list {
    grid-template-columns: repeat(3, 1fr);
    gap: 22px;
  }
}

/* Mobile */
@media (max-width: 640px) {
  .category__list {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    gap: 16px;
    padding-bottom: 10px;
    scroll-snap-type: x mandatory;
  }
  .category__item {
    flex: 0 0 150px;
    scroll-snap-align: center;
  }
}

/* ---------- Gợi ý thêm ---------- */
.more-btn {
  text-align: center;
  margin: 28px 0 48px;
}
.more-btn button {
  background: #4f7ee6;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 28px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.2s;
}
.more-btn button:hover {
  background: #3c69d1;
}

/* ---------- Footer ---------- */
footer {
  margin-top: auto;
}

/* ---------- Sản phẩm ---------- */
.product {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 32px;
}
.product__title {
  font-family: 'Khula', sans-serif;
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  color: #000;
  margin-top: 40px;
  margin-bottom: 28px;
  letter-spacing: 0.3px;
}
.product__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
  align-items: stretch;
}
@media (max-width: 1200px) {
  .product__grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 900px) {
  .product__grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 520px) {
  .product__grid { grid-template-columns: 1fr; }
}

/* ---------- State ---------- */
.state {
  text-align: center;
  color: #4b5563;
  padding: 24px 0;
}
.state--error {
  color: #b91c1c;
}
</style>
