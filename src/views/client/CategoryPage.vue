<template>
  <div class="catpage">
    <ClientHeader />

    <main class="container">
      <!-- Sidebar -->
      <aside class="sidebar" aria-label="Tất cả danh mục">
        <div class="sidebar__head">
          <span class="menu-icon" aria-hidden="true"></span>
          <h3 class="sidebar__title">Tất cả danh mục</h3>
        </div>

        <ul class="catlist">
          <li v-for="c in categories" :key="c.id || c.slug || c.name">
            <RouterLink
              class="catlink"
              :class="{ active: (c.slug || c.name) === slug }"
              :to="{ path: '/category/' + (c.slug || c.name), query: { page: 1 } }"
            >
              {{ c.name }}
            </RouterLink>
          </li>
        </ul>
      </aside>

      <!-- Content -->
      <section class="content">
        <h2 class="title">{{ pageTitle }}</h2>

        <div v-if="loading" class="state">Đang tải sản phẩm…</div>
        <div v-else-if="items.length === 0" class="state">Chưa có sản phẩm.</div>

        <div v-else class="grid">
          <ProductCard v-for="p in items" :key="p.id" :product="p" />
        </div>

        <!-- Pagination -->
        <nav v-if="totalPages > 1" class="pagination" aria-label="Phân trang">
          <button class="pgbtn" :disabled="page <= 1" @click="goPage(page - 1)">‹</button>

          <button
            v-if="pagesWindow.start > 1"
            class="pgbtn"
            :class="{ active: page === 1 }"
            @click="goPage(1)"
          >
            1
          </button>
          <span v-if="pagesWindow.start > 2" class="pgdots">…</span>

          <button
            v-for="n in pagesRange"
            :key="n"
            class="pgbtn"
            :class="{ active: n === page }"
            @click="goPage(n)"
          >
            {{ n }}
          </button>

          <span v-if="pagesWindow.end < totalPages - 1" class="pgdots">…</span>
          <button
            v-if="pagesWindow.end < totalPages"
            class="pgbtn"
            :class="{ active: page === totalPages }"
            @click="goPage(totalPages)"
          >
            {{ totalPages }}
          </button>

          <button class="pgbtn" :disabled="page >= totalPages" @click="goPage(page + 1)">›</button>
        </nav>
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
import ProductCard from "../../components/client/ProductCard.vue";

import { getCategories } from "../../services/categoryService";
import { getProductsByCategoryId } from "../../services/productService";

/* Router */
const route = useRoute();
const router = useRouter();

/* Params / Query */
const slug = computed(() => route.params.slug?.toString() || "");
const page = computed(() => (route.query.page ? Number(route.query.page) : 1));

/* State */
const categories = ref([]);
const items = ref([]);
const total = ref(0);
const limit = ref(12);
const loading = ref(false);

/* Tiêu đề theo danh mục */
const pageTitle = computed(() => {
  const found = categories.value.find((c) => (c.slug || c.name) === slug.value);
  return found ? found.name : "Sản phẩm";
});

/* Phân trang */
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit.value)));

const pagesWindow = computed(() => {
  const span = 5;
  const cur = page.value;
  const max = totalPages.value;
  let start = Math.max(1, cur - Math.floor(span / 2));
  let end = Math.min(max, start + span - 1);
  start = Math.max(1, Math.min(start, end - span + 1));
  return { start, end, max };
});

const pagesRange = computed(() => {
  const arr = [];
  for (let i = pagesWindow.value.start; i <= pagesWindow.value.end; i++) arr.push(i);
  return arr;
});

/* slugify: chỉ dùng khi API không trả slug/code */
function slugify(str = "") {
  return String(str)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

/* Lấy danh mục */
async function fetchCategoriesList() {
  try {
    const raw = await getCategories();
    const arr =
      Array.isArray(raw) ? raw :
      Array.isArray(raw?.data) ? raw.data :
      Array.isArray(raw?.items) ? raw.items :
      Array.isArray(raw?.data?.items) ? raw.data.items : [];

    categories.value = arr.map((c) => ({
      id: c?.id ?? c?._id ?? c?.code ?? c?.name,
      name: c?.name ?? "",
      slug: c?.slug ?? c?.code ?? slugify(c?.name ?? ""),
    }));
  } catch (e) {
    categories.value = [];
    console.error("fetchCategoriesList error:", e);
  }
}

/* Lấy sản phẩm theo danh mục */
async function fetchProductsList() {
  loading.value = true;
  try {
    const current = categories.value.find((c) => c.slug === slug.value);
    const categoryId = current?.id;

    if (!categoryId) {
      items.value = [];
      total.value = 0;
      return;
    }

    const res = await getProductsByCategoryId(categoryId, {
      page: page.value,
      pageSize: limit.value,
    });

    items.value = Array.isArray(res?.data) ? res.data : [];
    total.value = Number(res?.total || 0);
    limit.value = Number(res?.limit || limit.value);
  } catch (e) {
    items.value = [];
    total.value = 0;
    console.error("fetchProductsList error:", e);
  } finally {
    loading.value = false;
  }
}

/* Chuyển trang */
function goPage(n) {
  if (n < 1 || n > totalPages.value) return;
  router.replace({ path: "/category/" + slug.value, query: { page: n } });
}

/* Lifecycle */
onMounted(async () => {
  await fetchCategoriesList();

  // Nếu vào /category (không có slug) -> chuyển vào danh mục đầu tiên
  if (!slug.value && categories.value.length) {
    router.replace({ path: "/category/" + categories.value[0].slug, query: { page: 1 } });
    return;
  }
  await fetchProductsList();
});

/* Tải lại khi slug hoặc page đổi */
watch(
  () => [slug.value, page.value],
  fetchProductsList
);
</script>

<style scoped>
/* Khung trang */
.catpage {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #fff;
}
.container {
  max-width: 1200px;
  margin: 16px auto 32px;
  padding: 0 16px;
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 20px;
}

/* Sidebar */
.sidebar {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
}
.sidebar__head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.menu-icon {
  width: 18px;
  height: 18px;
  position: relative;
  display: inline-block;
}
.menu-icon::before,
.menu-icon::after {
  content: "";
  position: absolute;
  left: 0; right: 0;
  height: 2px;
  background: #111827;
}
.menu-icon::before { top: 4px; }
.menu-icon::after { bottom: 4px; }
.sidebar__title {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
}
.catlist { list-style: none; padding: 0; margin: 0; }
.catlink {
  display: block;
  position: relative;
  padding: 6px 6px 6px 18px;
  color: #111827;
  text-decoration: none;
  font-size: 14px;
  border-radius: 6px;
  transition: background 0.15s ease;
}
.catlink.active { color: #1d4ed8; background: #eef2ff; font-weight: 600; }
.catlink:hover { background: #f3f4f6; }

/* Content */
.content { min-width: 0; }
.title {
  font-size: 18px;
  font-weight: 700;
  margin: 6px 0 14px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

/* Phân trang */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-top: 18px;
}
.pgbtn {
  min-width: 36px;
  height: 36px;
  padding: 0 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  color: #111827;
  cursor: pointer;
  font-weight: 600;
  transition: background .15s, border-color .15s;
}
.pgbtn:hover { background: #f9fafb; }
.pgbtn.active { background: #1f4fd6; border-color: #1f4fd6; color: #fff; }
.pgbtn:disabled { opacity: .5; cursor: not-allowed; }
.pgdots { padding: 0 4px; color: #6b7280; user-select: none; }

/* State text */
.state { text-align: center; color: #4b5563; padding: 24px 0; }

/* Responsive */
@media (max-width: 900px) {
  .container { grid-template-columns: 1fr; }
}
</style>
