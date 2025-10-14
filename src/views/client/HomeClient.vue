<template>
  <div class="home">
    <!-- Header -->
    <ClientHeader />

    <!-- Banner -->
    <section class="banner">
      <img src="../../assets/banner.png" alt="Banner thời trang" class="banner__img" />
    </section>

    <!-- Danh mục -->
    <section class="category">
      <h2 class="category__title">Danh mục</h2>
      <div v-if="categoryLoading" class="state">Đang tải danh mục…</div>
      <div v-else-if="categories.length === 0" class="state">Chưa có danh mục nào.</div>
      <div v-else class="category__list">
        <div
          v-for="item in categories"
          :key="item.id || item.name"
          class="category__item"
        >
          <img :src="item.icon" :alt="item.name" class="category__icon" />
          <p class="category__name">{{ item.name }}</p>
        </div>
      </div>
    </section>

    <!-- Gợi ý thêm -->
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
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import ClientHeader from "../../components/client/ClientHeaderLogged.vue";
import ClientFooter from "../../components/client/ClientFooter.vue";
import ProductCard from "../../components/client/ProductCard.vue";
import { getCategories } from "../../services/categoryService";
import { getProducts } from "../../services/productService";

const categories = ref([]);
const categoryLoading = ref(false);
const products = ref([]);
const productLoading = ref(false);
const route = useRoute();
const searchTerm = ref("");



async function fetchCategories() {
  categoryLoading.value = true;
  try {
    const data = await getCategories();
    categories.value = data.map((item) => ({
      ...item,
      icon: iconMap[item.name] || sale,
    }));
  } catch (error) {
    console.error("Không tải được danh mục", error);
    categories.value = [];
  } finally {
    categoryLoading.value = false;
  }
}

async function fetchProducts(params = {}) {
  productLoading.value = true;
  try {
    const payload = { limit: 12, ...params };
    if (!payload.q) {
      delete payload.q;
    }
    const data = await getProducts(payload);
    products.value = data.items;
  } catch (error) {
    console.error("Không tải được sản phẩm", error);
    products.value = [];
  } finally {
    productLoading.value = false;
  }
}

onMounted(() => {
  fetchCategories();
  const initial = route.query.q ? route.query.q.toString() : "";
  searchTerm.value = initial;
  fetchProducts({ q: initial });
});

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

/* ---------- Banner ---------- */
.banner {
  width: 100%;
  height: 300px;
  overflow: hidden;
}
.banner__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

/* ✅ Trải đều toàn hàng, không còn trống hai mép */
.category__list {
  display: grid;
  grid-template-columns: repeat(6, 1fr); /* 6 cột bằng nhau, giãn hết chiều ngang */
  gap: 70px;                              /* khoảng cách giữa các ô */
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
}
.category__name {
  font-weight: 600;
  font-size: 16px;
  color: #333;
}

/* Tablet: 3×2, vẫn đều và đẹp */
@media (max-width: 1024px) {
  .category__list {
    grid-template-columns: repeat(3, 1fr);
    gap: 22px;
  }
}

/* Mobile: 1 hàng cuộn ngang */
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
.product{
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 32px;    /* ít hơn để nhìn thoáng */
}
.product__title{
  font-family: 'Khula', sans-serif;
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  color: #000;
  margin-top: 40px;
  margin-bottom: 28px;
  letter-spacing: 0.3px;
}
.product__grid{
  display:grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;          /* khoảng cách đều nhau */
  align-items: stretch;
}
@media (max-width: 1200px){ .product__grid{ grid-template-columns: repeat(3,1fr);} }
@media (max-width: 900px){  .product__grid{ grid-template-columns: repeat(2,1fr);} }
@media (max-width: 520px){  .product__grid{ grid-template-columns: 1fr; } }

.state {
  text-align: center;
  color: #4b5563;
  padding: 24px 0;
}
.state--error {
  color: #b91c1c;
}

</style>
