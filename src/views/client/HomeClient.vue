<template>
  <div class="home">
    <!-- Header -->
    <ClientHeader />

    <!-- Banner (fade) -->
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
          v-for="(_, i) in banners"
          :key="i"
          :class="['dot', { active: i === currentIndex }]"
          @click="go(i)"
        />
      </div>
    </section>

    <!-- Danh mục -->
    <section class="category">
      <h2 class="category__title">Danh mục</h2>

      <div v-if="categoryLoading" class="state">Đang tải danh mục…</div>

      <div v-else>
        <div class="category__list">
          <RouterLink
            v-for="item in categories"
            :key="item.id || item.name"
            class="category__item"
            :to="{ path: '/category/' + item.slug, query: { page: 1 } }"
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

        <div v-if="!categories.length" class="state">Chưa có danh mục nào.</div>
      </div>
    </section>

    <!-- Gợi ý sản phẩm -->
    <section class="product">
      <h2 class="product__title">{{ pageTitle }}</h2>

      <div v-if="productLoading" class="state">Đang tải sản phẩm…</div>
      <div v-else-if="products.length === 0" class="state">
        {{ searchTerm ? 'Không tìm thấy sản phẩm phù hợp.' : 'Không có sản phẩm để hiển thị.' }}
      </div>
      <div v-else class="product__grid">
        <ProductCard v-for="p in products" :key="p.id" :product="p" />
      </div>
    </section>

    <div class="more-btn">
      <button @click="loadMore" :disabled="productLoading">Gợi ý thêm sản phẩm</button>
    </div>

    <!-- Footer -->
    <ClientFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useRoute } from "vue-router";
import ClientHeader from "../../components/client/ClientHeaderLogged.vue";
import ClientFooter from "../../components/client/ClientFooter.vue";
import ProductCard from "../../components/client/ProductCard.vue";
import { getCategories } from "../../services/categoryService";
import { getAllProducts } from "../../services/productService";

import banner1 from "../../assets/banner1.png";
import banner2 from "../../assets/banner2.png";
import banner3 from "../../assets/banner3.png";
import banner4 from "../../assets/banner4.png";

/* ---------- Danh mục ---------- */
const categories = ref([]);
const categoryLoading = ref(false);

// icon mặc định (data URL)
const fallbackIcon =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="%2399A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>';

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
    const raw = await getCategories();
    const arr = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.data)
      ? raw.data
      : Array.isArray(raw?.items)
      ? raw.items
      : Array.isArray(raw?.data?.items)
      ? raw.data.items
      : [];

    categories.value = arr.map((c) => {
      const name = c?.name ?? "";
      return {
        id: c?.id ?? c?._id ?? name,
        name,
        icon: c?.icon || "",
        slug: c?.slug ?? c?.code ?? slugify(name),
      };
    });
  } catch (e) {
    console.error("Không tải được danh mục", e);
    categories.value = [];
  } finally {
    categoryLoading.value = false;
  }
}

/* ---------- Sản phẩm (gợi ý) ---------- */
const route = useRoute();
const products = ref([]);
const productLoading = ref(false);
const searchTerm = ref("");
const page = ref(1);
const pageSize = ref(12);

const pageTitle = computed(() =>
  searchTerm.value ? `Kết quả cho “${searchTerm.value}”` : "Gợi ý sản phẩm"
);

async function fetchProducts(append = false) {
  productLoading.value = true;
  try {
    const res = await getAllProducts({
      page: page.value,
      pageSize: pageSize.value,
      q: searchTerm.value || undefined,
    });
    const data = res?.data || [];
    products.value = append ? [...products.value, ...data] : data;
  } catch (e) {
    console.error("Không tải được sản phẩm", e);
    if (!append) products.value = [];
  } finally {
    productLoading.value = false;
  }
}

function loadMore() {
  page.value += 1;
  fetchProducts(true);
}

/* ---------- Banner ---------- */
const banners = [banner1, banner2, banner3, banner4];
const currentIndex = ref(0);
const intervalTime = 3000;
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

/* ---------- Lifecycle ---------- */
onMounted(() => {
  // preload banner
  banners.forEach((src) => {
    const im = new Image();
    im.src = src;
  });

  // nạp danh mục 1 lần
  fetchCategories();

  // sản phẩm (khởi tạo theo query?q)
  searchTerm.value = route.query.q ? route.query.q.toString() : "";
  page.value = 1;
  fetchProducts();

  // banner
  play();
});

onBeforeUnmount(() => {
  pause();
});

// khi query q đổi -> nạp lại sản phẩm
watch(
  () => route.query.q,
  () => {
    searchTerm.value = route.query.q ? route.query.q.toString() : "";
    page.value = 1;
    fetchProducts();
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
  inset: 0;
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
.category__item:hover,
.category__item.active {
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
  font-family: "Khula", sans-serif;
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
  .product__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 900px) {
  .product__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 520px) {
  .product__grid {
    grid-template-columns: 1fr;
  }
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
