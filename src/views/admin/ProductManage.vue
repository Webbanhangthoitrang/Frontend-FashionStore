<!-- src/views/admin/ProductManage.vue -->
<template>
  <div class="admin-layout">
    <AdminSidebar />

    <div class="admin-content">
      <main class="page">
        <!-- HEADER -->
        <div class="header-band">
          <div class="page-head">
            <h2 class="page-title">Sản Phẩm</h2>
            <router-link class="btn btn--primary" :to="{ name: 'AdminProductCreate' }">
              + Tạo sản phẩm
            </router-link>
          </div>

          <!-- HÀNG 2: Tìm kiếm + Show/Hide Filters -->
          <div class="search-row">
            <div class="search-group">
              <div class="search">
                <span class="search__icon">
                  <svg viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.4" fill="none"/>
                    <line x1="16" y1="16" x2="21" y2="21" stroke="currentColor" stroke-width="1.4"/>
                  </svg>
                </span>
                <input
                  v-model.trim="searchTerm"
                  class="search__input"
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                />
              </div>

              <button class="btn btn--filter" @click="showFilters = !showFilters">
                {{ showFilters ? 'Hide Filters' : 'Show Filters' }}
              </button>
            </div>
          </div>
        </div>

        <!-- STATE / TABLE -->
        <p v-if="loading" class="state">Đang tải sản phẩm…</p>
        <p v-else-if="errorMessage" class="state state--error">{{ errorMessage }}</p>

        <div v-else class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th class="col-check">
                  <input type="checkbox" :checked="isAllSelected" @change="toggleSelectAll" />
                </th>
                <th>Ảnh</th>
                <th>Tên</th>
                <th>Giá</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="product in filteredProducts" :key="product.id">
                <!-- Chọn -->
                <td class="col-check">
                  <input
                    type="checkbox"
                    :value="product.id"
                    :checked="selectedIds.includes(product.id)"
                    @change="toggleSelect(product.id)"
                  />
                </td>

                <!-- Ảnh -->
                <td>
                  <div class="thumb-wrap">
                    <img v-if="product.thumbnail" :src="product.thumbnail" alt="" class="thumb" />
                    <div v-else class="thumb thumb--placeholder">No image</div>
                  </div>
                </td>

                <!-- Tên + trạng thái (CHỈ hiện khi Inactive) -->
                <td class="col-name">
                  <div class="name-row">
                    <span class="name-text">{{ product.name }}</span>
                    <span
                      v-if="product.status === 'inactive' || product.isActive === false"
                      class="status status--inactive"
                    >
                      Inactive
                    </span>
                  </div>
                </td>

                <!-- Giá + nút edit (hover mới hiện) -->
                <td class="col-price">
                  <div class="cell-right">
                    <span class="price">{{ formatPrice(product.price) }}đ</span>
                    <button class="icon-btn edit-btn" @click="goEdit(product.id)" aria-label="Chỉnh sửa">
                      <svg width="15" height="15" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.0081 5.58008C12.2836 7.58939 13.9988 9.29371 16.0315 10.5566L7.02368 19.5654C6.59864 19.9905 6.38536 20.203 6.12427 20.3428C5.86333 20.4823 5.56863 20.5414 4.97974 20.6592L0.652588 21.5244C0.319978 21.5909 0.153446 21.6239 0.0588379 21.5293C-0.0356501 21.4347 -0.00277848 21.268 0.0637207 20.9355L0.928955 16.6094C1.04685 16.0199 1.1066 15.725 1.24634 15.4639C1.38607 15.2028 1.59865 14.9905 2.02368 14.5654L11.0081 5.58008ZM17.054 0.0332031C17.2937 -0.0110234 17.5398 -0.011008 17.7795 0.0332031C18.3912 0.146015 18.9002 0.653909 19.9172 1.6709C20.9342 2.6879 21.4421 3.19699 21.5549 3.80859C21.5992 4.04842 21.5992 4.29436 21.5549 4.53418C21.4421 5.14579 20.9342 5.65487 19.9172 6.67188L17.4895 9.09863C15.4059 7.89996 13.6761 6.18273 12.4622 4.12598L14.9172 1.67188C15.9342 0.654954 16.4424 0.146109 17.054 0.0332031Z" fill="#222222"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="!filteredProducts.length">
                <td colspan="4" class="empty">Không có sản phẩm phù hợp.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- BOTTOM BAR -->
        <div class="bottom-bar">
          <div class="bulk-status" v-if="selectedIds.length">
            <button class="pill pill--active"  @click="onBulkSetStatus('active')">Active</button>
            <button class="pill pill--inactive" @click="onBulkSetStatus('inactive')">Inactive</button>
          </div>

          <div class="bulk-actions">
            <button
              class="btn btn--secondary"
              type="button"
              :disabled="!selectedIds.length"
              @click="onAddToCategory"
            >
              Thêm vào danh mục
            </button>
            <button
              class="btn btn--danger"
              type="button"
              :disabled="!selectedIds.length"
              @click="onDeleteSelected"
            >
              Delete
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>

  <!-- Drawer Filter chỉ UI -->
  <FilterPanel
    v-model:open="filterOpen"
    :init="filters"
    :bounds="priceBounds"
    :step="1000"
    @apply="onApplyFilters"
    @reset="onResetFilters"
  />

  <!-- Popup chọn danh mục -->
  <AddToCategoryPopup
    v-model:open="showCategoryPopup"
    @submit="handleAddToCategory"
  />

  <!-- Popup xác nhận xoá -->
  <DeleteConfirmPopup
    v-model:open="showDelete"
    :count="selectedIds.length"
    :names="selectedNames"
    :loading="deleting"
    title="Xoá sản phẩm đã chọn"
    description="Bạn chắc chắn muốn xoá những sản phẩm này?"
    confirm-text="Xoá"
    cancel-text="Đóng"
    @confirm="confirmDelete"
    @cancel="showDelete = false"
  />
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import AdminSidebar from "../../components/admin/AdminSidebar.vue";
import FilterPanel from "../../components/admin/FilterPanel.vue";
import AddToCategoryPopup from "../../components/admin/AddToCategoryPopup.vue";
import DeleteConfirmPopup from "../../components/admin/DeleteConfirmPopup.vue";
import { request, API_BASE_URL } from "../../services/http";

/* Router */
const router = useRouter();

/* State */
const products = ref([]);
const loading = ref(false);
const errorMessage = ref("");
const searchTerm = ref("");

/* Filter drawer (UI only) */
const showFilters = ref(false);
const filterOpen = ref(false);
watch(showFilters, v => (filterOpen.value = v));
watch(filterOpen, v => (showFilters.value = v));

/* Popup "Thêm vào danh mục" */
const showCategoryPopup = ref(false);

/* Popup "Xoá" */
const showDelete = ref(false);
const deleting = ref(false);
const selectedNames = ref([]);

/* Filters (demo) */
const filters = ref({
  priceMode: "between",
  minPrice: null,
  maxPrice: null,
  statuses: [],
});
function onApplyFilters(payload) {
  filters.value = { ...filters.value, ...payload };
  filterOpen.value = false;
}
function onResetFilters() {
  filters.value = { priceMode: "between", minPrice: null, maxPrice: null, statuses: [] };
}

/* Helpers */
const normalizePrice = (p) => {
  if (Array.isArray(p.variants) && p.variants.length) {
    const v0 = p.variants[0];
    if (v0 && v0.price != null && Number.isFinite(Number(v0.price))) {
      return Number(v0.price);
    }
  }
  const candidates = [p.price, p.unit_price, p.unitPrice, p.productPrice, p.salePrice, p.priceSale, p.productDetail?.price];
  for (const c of candidates) {
    const n = Number(c);
    if (Number.isFinite(n) && n >= 0) return n;
  }
  return 0;
};
const formatPrice = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n.toLocaleString("vi-VN") : "0";
};

/* Bounds giá cho slider (hiển thị) */
const priceBounds = computed(() => {
  if (!products.value.length) return { min: 0, max: 0 };
  let min = Infinity, max = -Infinity;
  for (const p of products.value) {
    const val = Number(p.price) || 0;
    if (val < min) min = val;
    if (val > max) max = val;
  }
  if (!isFinite(min) || !isFinite(max)) return { min: 0, max: 0 };
  const round1000 = (n) => Math.round(n / 1000) * 1000;
  return { min: Math.max(0, round1000(min)), max: round1000(max) };
});

/* API */
const fetchProducts = async () => {
  loading.value = true;
  errorMessage.value = "";
  try {
    const { data } = await request("/products");
    const list = Array.isArray(data) ? data : data.items || data.data || [];
    products.value = list.map((p) => {
      const rawThumb =
        p.thumbnail || p.image || p.imageUrl ||
        (Array.isArray(p.images) && p.images[0]?.url) || p.img || p.photo || null;

      const fullThumb =
        rawThumb && !/^https?:\/\//.test(rawThumb)
          ? `${API_BASE_URL || ""}${rawThumb}`
          : rawThumb;

      return { ...p, thumbnail: fullThumb, price: normalizePrice(p) };
    });
  } catch (err) {
    console.error(err);
    errorMessage.value = err?.message || "Không tải được danh sách sản phẩm.";
  } finally {
    loading.value = false;
  }
};
onMounted(fetchProducts);

/* Danh sách hiển thị (search theo tên) */
const filteredProducts = computed(() => {
  const kw = (searchTerm.value || "").toLowerCase();
  return products.value.filter((p) => !kw || p.name?.toLowerCase().includes(kw));
});

/* Chọn nhiều + actions */
const selectedIds = ref([]);
const isAllSelected = computed(() => {
  if (!filteredProducts.value.length) return false;
  return filteredProducts.value.every((p) => selectedIds.value.includes(p.id));
});
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    const idsOnScreen = filteredProducts.value.map((p) => p.id);
    selectedIds.value = selectedIds.value.filter((id) => !idsOnScreen.includes(id));
  } else {
    const ids = filteredProducts.value.map((p) => p.id);
    selectedIds.value = Array.from(new Set([...selectedIds.value, ...ids]));
  }
};
const toggleSelect = (id) => {
  selectedIds.value = selectedIds.value.includes(id)
    ? selectedIds.value.filter((x) => x !== id)
    : [...selectedIds.value, id];
};

/* Bulk actions */
const onAddToCategory = () => {
  if (!selectedIds.value.length) return;
  showCategoryPopup.value = true;
};

const handleAddToCategory = async (categoryIds) => {
  try {
    if (!categoryIds?.length || !selectedIds.value.length) {
      showCategoryPopup.value = false;
      return;
    }
    loading.value = true;

    // Swagger: POST /categories/{categoryId}/products  body: { productId }
    for (const productId of selectedIds.value) {
      for (const categoryId of categoryIds) {
        await request(`/categories/${categoryId}/products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
      }
    }
    alert(`Đã thêm ${selectedIds.value.length} sản phẩm vào ${categoryIds.length} danh mục.`);
  } catch (err) {
    console.error(err);
    alert(err?.message || "Lỗi khi thêm vào danh mục!");
  } finally {
    loading.value = false;
    showCategoryPopup.value = false;
  }
};

/* Mở popup Xoá */
const onDeleteSelected = () => {
  if (!selectedIds.value.length) return;
  selectedNames.value = products.value
    .filter(p => selectedIds.value.includes(p.id))
    .map(p => p.name || `#${p.id}`);
  showDelete.value = true;
};

/* Confirm xoá từ popup */
const confirmDelete = async () => {
  try {
    deleting.value = true;
    for (const id of selectedIds.value) {
      await request(`/products/${id}`, { method: "DELETE" });
    }
    await fetchProducts();
    selectedIds.value = [];
  } catch (e) {
    alert(e?.message || "Xoá thất bại. Vui lòng thử lại.");
  } finally {
    deleting.value = false;
    showDelete.value = false;
  }
};

/* Edit */
const goEdit = (id) => {
  try {
    router.push({ name: "AdminProductEdit", params: { id } });
  } catch {
    router.push(`/admin/products/${id}/edit`);
  }
};
</script>

<style scoped>
.admin-layout { display: flex; min-height: 100vh; background: #f5f5f7; font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif; }
.admin-content { flex: 1; display: flex; flex-direction: column; }
.page { padding: 0 32px 16px; }

/* Header */
.header-band { background: #f6f7fb; border-bottom: 1px solid #e9ecf3; }
.page-head { display: flex; justify-content: space-between; align-items: center; padding: 20px 0 8px; }
.page-title { font-size: 26px; font-weight: 700; color: #0f172a; margin: 0; }

/* Tìm kiếm + filter */
.search-row { display: flex; align-items: center; padding-bottom: 16px; }
.search-group { display: flex; align-items: center; gap: 10px; }
.search { position: relative; width: 360px; }
.search__icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; color: #b2b6c6; }
.search__input { border: 1px solid #e3e6ef; height: 44px; width: 100%; padding: 0 14px 0 40px; border-radius: 18px; background: #fff; font-size: 14px; color: #111827; }
.search__input::placeholder { color: #a9afc2; }
.search__input:focus { border-color: #cbd2ff; box-shadow: 0 0 0 3px rgba(91,108,255,0.12); }

.btn { height: 44px; padding: 0 16px; border-radius: 12px; border: none; font-size: 14px; font-weight: 400; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.btn--filter { background: #DFDFFE; border: 1px solid #e2deff; }
.btn--primary { background: #4C80E6; color: #fff; box-shadow: 0 6px 14px rgba(63,99,255,0.25); text-decoration: none; }

/* Table */
.table-wrap { background: #fff; border-radius: 14px; box-shadow: 0 4px 10px rgba(15,23,42,0.04); overflow: hidden; max-height: 400px; overflow-y: auto; }
.table { width: 100%; border-collapse: collapse; font-size: 17px; }
.table thead { background: #fafafa; position: sticky; top: 0; z-index: 1;}
.table th, .table td { padding: 14px 18px; text-align: left; }
.table th { font-weight: 500; }

/* Hover đổi nền */
.table tbody tr { transition: background-color .2s ease; cursor: pointer; }
.table tbody tr:hover { background-color: #f1f1f1; }

/* Checkbox */
.col-check { width: 35px; text-align: center; }
.table input[type="checkbox"] {
  -webkit-appearance: none; appearance: none;
  width: 22px; height: 22px; border-radius: 6px;
  cursor: pointer; background-color: #ffffff; border: 1.5px solid #999999;
}
.table input[type="checkbox"]:hover { border-color: #4C80E6; }
.table input[type="checkbox"]:checked { background-color: #42b444; border-color: #42b444; }

/* Ảnh */
.thumb { width: 56px; height: 56px; object-fit: cover; border-radius: 8px; }
.thumb--placeholder { display: flex; align-items: center; justify-content: center; font-size: 10px; background: #f1f1f5; color: #9b9bb4; }

/* Tên + trạng thái */
.col-name { display: flex; align-items: center; }
.name-row { display: flex; align-items: center; gap: 10px; }
.name-text { font-weight: 500; color: #222; }
.status { display: inline-flex; align-items: center; padding: 2px 10px; font-size: 11px; border-radius: 999px; }
.status--inactive { background: #ffe6e8; color: #ff4e6a; }

/* Giá + nút edit bên phải */
.col-price { font-weight: 500; }
.cell-right { display: flex; align-items: center; justify-content: flex-end; gap: 8px; }
.icon-btn { width: 28px; height: 28px; border: 0; background: transparent; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; padding: 0; cursor: pointer; }
.edit-btn { opacity: 0; pointer-events: none; transition: opacity .15s ease, background-color .15s ease; }
.table tbody tr:hover .edit-btn { opacity: 1; pointer-events: auto; }
.icon-btn:hover { background: rgba(0,0,0,0.06); }

/* Bottom bar */
.bottom-bar {
  position: sticky; bottom: 12px;
  margin-top: 12px; padding: 12px 18px;
  display: flex; align-items: center; gap: 16px;
  background: #fff; border-radius: 14px; box-shadow: 0 -2px 8px rgba(15,23,42,0.02);
}
.bulk-status { display: flex; gap: 12px; }
.bulk-actions { display: flex; gap: 12px; margin-left: auto; }
.pill {
  min-width: 92px; height: 38px; padding: 0 14px;
  border-radius: 9px; border: 1px solid transparent;
  font-weight: 700; cursor: pointer;
}
.pill--active  { background: #318d33; color: #fff; border-color: #16a34a; }
.pill--inactive{ background: #ef4444; color: #fff; border-color: #dc2626; }

.btn--secondary { color: #4c80e6; border: 1.5px solid #5b6cff; }
.btn--danger { color: #ff4e6a; }
</style>
