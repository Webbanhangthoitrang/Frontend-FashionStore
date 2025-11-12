<template>
  <transition name="fade">
    <div v-if="open" class="overlay" @click.self="close" role="presentation">
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="dlg-title">
        <!-- Search -->
        <header class="modal__head">
          <input
            v-model.trim="keyword"
            class="search"
            type="text"
            placeholder="Tìm kiếm danh mục..."
            aria-label="Tìm kiếm danh mục"
          />
        </header>

        <!-- Table -->
        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th class="col-check">
                  <input type="checkbox" :checked="isAllChecked" @change="toggleAll" />
                </th>
                <th class="col-name">Tên danh mục</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="cat in filteredCategories"
                :key="cat.id"
                class="row"
                @click="toggleOne(cat.id)"
              >
                <td class="col-check">
                  <input
                    type="checkbox"
                    :checked="selectedIds.includes(cat.id)"
                    @change.stop="toggleOne(cat.id)"
                  />
                </td>
                <td class="col-name">{{ cat.name }}</td>
              </tr>

              <tr v-if="!loading && !filteredCategories.length">
                <td class="empty" colspan="2">Không có danh mục phù hợp.</td>
              </tr>
            </tbody>
          </table>

          <div v-if="loading" class="state">Đang tải…</div>
          <div v-if="errorMessage" class="state state--error">{{ errorMessage }}</div>
        </div>

        <!-- Footer -->
        <footer class="modal__foot">
          <button class="btn" type="button" @click="close">Đóng</button>
          <button
            class="btn btn--primary"
            type="button"
            :disabled="!selectedIds.length"
            @click="submit"
          >
            Thêm
          </button>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { request } from "../../services/http";

/**
 * Props
 * - open:            điều khiển hiển/ẩn popup (dùng v-model:open)
 * - api:             endpoint lấy danh mục (mặc định: '/categories')
 * - categories:      nếu đã có danh sách bên ngoài thì truyền vào, sẽ không fetch
 * - modelValue:      danh sách id đã chọn sẵn (nếu có)
 * - fetchOnOpen:     tự fetch khi mở popup (true)
 */
const props = defineProps({
  open: { type: Boolean, default: false },
  api: { type: String, default: "/categories" },
  categories: { type: Array, default: () => [] },
  modelValue: { type: Array, default: () => [] },
  fetchOnOpen: { type: Boolean, default: true },
});

const emit = defineEmits(["update:open", "submit"]);

/* State */
const list = ref([]);
const loading = ref(false);
const errorMessage = ref("");
const keyword = ref("");

const selectedIds = ref([]);

/* Đồng bộ dữ liệu khi mở popup */
watch(
  () => props.open,
  async (v) => {
    if (!v) return;
    // copy selected ban đầu (nếu có)
    selectedIds.value = Array.isArray(props.modelValue) ? [...props.modelValue] : [];

    if (props.categories?.length) {
      list.value = [...props.categories];
      return;
    }
    if (props.fetchOnOpen) await fetchCategories();
  },
  { immediate: true }
);

watch(
  () => props.categories,
  (v) => {
    if (v?.length) list.value = [...v];
  },
  { immediate: true }
);

/* API */
async function fetchCategories() {
  loading.value = true;
  errorMessage.value = "";
  try {
    const { data } = await request(props.api);
    list.value = Array.isArray(data) ? data : data.items || data.data || [];
  } catch (err) {
    console.error(err);
    errorMessage.value = err?.message || "Không tải được danh mục.";
  } finally {
    loading.value = false;
  }
}

/* Filter */
const filteredCategories = computed(() => {
  const kw = (keyword.value || "").toLowerCase();
  return list.value.filter((c) => !kw || c.name?.toLowerCase().includes(kw));
});

/* Checkboxes */
const isAllChecked = computed(() => {
  const ids = filteredCategories.value.map((c) => c.id);
  return ids.length > 0 && ids.every((id) => selectedIds.value.includes(id));
});

function toggleAll() {
  const ids = filteredCategories.value.map((c) => c.id);
  if (isAllChecked.value) {
    selectedIds.value = selectedIds.value.filter((id) => !ids.includes(id));
  } else {
    selectedIds.value = Array.from(new Set([...selectedIds.value, ...ids]));
  }
}
function toggleOne(id) {
  if (selectedIds.value.includes(id)) {
    selectedIds.value = selectedIds.value.filter((x) => x !== id);
  } else {
    selectedIds.value.push(id);
  }
}

/* Actions */
function close() {
  emit("update:open", false);
}
function submit() {
  emit("submit", [...selectedIds.value]); // trả về mảng id danh mục
  close();
}
</script>

<style scoped>
/* ===== Overlay & modal ===== */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: grid;
  place-items: center;
  z-index: 1000;
}
.modal {
  width: 720px;
  max-width: calc(100vw - 32px);
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

/* Head (search) */
.modal__head {
  padding: 16px 18px 10px;
  border-bottom: 1px solid #eee;
}
.search {
  width: 100%;
  height: 38px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  outline: none;
  padding: 0 14px;
}
.search:focus {
  border-color: #cbd2ff;
  box-shadow: 0 0 0 3px rgba(91, 108, 255, 0.16);
}

/* Table */
.table-wrap {
  max-height: 360px;
  overflow: auto;
}
.table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 14px;
}
.table thead th {
  background: #fafafa;
  font-weight: 600;
  color: #111827;
  text-align: left;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
}
.table tbody td {
  padding: 12px 16px;
  border-bottom: 1px solid #f1f1f1;
}
.row:hover {
  background: #f8fafc;
}
.col-check {
  width: 44px;
  text-align: center;
}
.empty {
  text-align: center;
  color: #6b7280;
  padding: 20px 8px;
}

/* Footer */
.modal__foot {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 12px 18px 16px;
  border-top: 1px solid #eee;
}
.btn {
  height: 36px;
  padding: 0 16px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  background: #fff;
  color: #111827;
  cursor: pointer;
}
.btn:hover {
  background: #f8fafc;
}
.btn--primary {
  border-color: #ef4444;
  background: #ef4444;
  color: #fff;
}
.btn--primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.16s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
