<!-- src/components/admin/CategoryProductPopup.vue (ví dụ) -->
<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="open" class="overlay" @click.self="handleClose">
        <div class="modal" role="dialog" aria-modal="true">
          <!-- HEADER -->
          <header class="modal__header">
            <!-- nút đóng -->
            <button type="button" class="modal__close" @click="handleClose">
              ✕
            </button>
          </header>

          <!-- BODY -->
          <div class="modal__body">
            <!-- Thanh tìm kiếm -->
            <div class="search">
              <span class="search__icon">
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 35 35"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="16.0417"
                    cy="16.0423"
                    r="10.2083"
                    stroke="#9C9C9C"
                    stroke-width="2"
                  />
                  <path
                    d="M29.1667 29.166L24.7917 24.791"
                    stroke="#9C9C9C"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </svg>
              </span>
              <input
                v-model="keyword"
                type="text"
                class="search__input"
                placeholder="Tìm kiếm sản phẩm..."
              />
            </div>

            <!-- Danh sách sản phẩm -->
            <div class="list">
              <p v-if="loading" class="state">Đang tải sản phẩm…</p>
              <p v-else-if="errorMessage" class="state state--error">
                {{ errorMessage }}
              </p>
              <p
                v-else-if="filteredProducts.length === 0"
                class="state state--empty"
              >
                Không có sản phẩm phù hợp.
              </p>

              <!-- mỗi sản phẩm -->
              <div
                v-for="item in filteredProducts"
                v-else
                :key="item.id"
                class="row"
              >
                <div class="row__inner">
                  <!-- checkbox -->
                  <label class="row__checkbox">
                    <input
                      type="checkbox"
                      :value="item.id"
                      v-model="selectedIds"
                    />
                    <span class="checkbox-ui"></span>
                  </label>

                  <!-- ảnh -->
                  <div class="row__thumb">
                    <img :src="item.thumbnail || item.image" :alt="item.name" />
                  </div>

                  <!-- tên + trạng thái -->
                  <div class="row__info">
                    <p class="row__name">
                      {{ item.name }}
                    </p>

                    <span
                      v-if="item.status === 'inactive' || item.isInactive"
                      class="badge badge--inactive"
                    >
                      Inactive
                    </span>
                  </div>

                  <!-- giá -->
                  <div class="row__price">
                    {{ formatPrice(item.price) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- FOOTER -->
          <footer class="modal__footer">
            <div class="footer-inner">
              <!-- CHECKBOX GIỐNG FIGMA -->
              <label class="footer-check">
                <input type="checkbox" v-model="footerChecked" />
                <span class="footer-check-ui"></span>
                <span class="footer-check-label">Chọn</span>
              </label>

              <!-- BUTTON -->
              <button
                type="button"
                class="btn btn--primary"
                :disabled="selectedIds.length === 0 || loading"
                @click="handleConfirm"
              >
                Thêm vào danh mục
              </button>
            </div>
          </footer>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { request, API_BASE_URL } from '../../services/http'

/* ==========================
   PROPS & EMITS
========================== */
const props = defineProps({
  open: { type: Boolean, default: false }, // hỗ trợ v-model:open
  category: { type: Object, default: null }, // parent có truyền nên khai báo để khỏi warning
})

const emit = defineEmits(['update:open', 'close', 'confirm', 'submit'])

/* ==========================
   STATE
========================== */
const keyword = ref('')
const selectedIds = ref([])
const footerChecked = ref(false) // checkbox ở footer

const products = ref([])
const loading = ref(false)
const errorMessage = ref('')

/* ==========================
   HELPER TÍNH GIÁ & FORMAT
========================== */
const normalizePrice = (p) => {
  if (Array.isArray(p.variants) && p.variants.length) {
    const v0 = p.variants[0]
    if (v0 && v0.price != null && Number.isFinite(Number(v0.price))) {
      return Number(v0.price)
    }
  }

  const candidates = [
    p.price,
    p.unit_price,
    p.unitPrice,
    p.productPrice,
    p.salePrice,
    p.priceSale,
    p.productDetail?.price,
  ]

  for (const c of candidates) {
    const n = Number(c)
    if (Number.isFinite(n) && n >= 0) return n
  }

  return 0
}

const formatPrice = (v) => {
  const n = Number(v)
  return Number.isFinite(n) ? n.toLocaleString('vi-VN') : '0'
}

/* ==========================
   FETCH DANH SÁCH SẢN PHẨM
========================== */
const fetchProducts = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const { data } = await request('/products', {
      params: {
        page: 1,
        limit: 100,
      },
    })

    const list = Array.isArray(data) ? data : data.items || data.data || []

    products.value = list.map((p) => {
      const rawThumb =
        p.thumbnail ||
        p.image ||
        p.imageUrl ||
        (Array.isArray(p.images) && p.images[0]?.url) ||
        p.img ||
        p.photo ||
        null

      const fullThumb =
        rawThumb && !/^https?:\/\//.test(rawThumb)
          ? `${API_BASE_URL || ''}${rawThumb}`
          : rawThumb

      return {
        ...p,
        thumbnail: fullThumb,
        price: normalizePrice(p),
      }
    })
  } catch (err) {
    console.error('🔥 Lỗi load products:', err)
    errorMessage.value = err?.message || 'Không tải được danh sách sản phẩm.'
  } finally {
    loading.value = false
  }
}

/* Khi mở popup thì load lại list */
watch(
  () => props.open,
  (val) => {
    if (val) {
      keyword.value = ''
      selectedIds.value = []
      footerChecked.value = false
      fetchProducts()
    }
  }
)

/* Filter theo tên */
const filteredProducts = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  if (!kw) return products.value
  return products.value.filter((p) =>
    (p.name || '').toLowerCase().includes(kw)
  )
)

/* (tuỳ chọn) nếu muốn checkbox footer = chọn tất cả sản phẩm đang hiển thị */
watch(footerChecked, (val) => {
  if (val) {
    selectedIds.value = filteredProducts.value.map((p) => p.id)
  } else {
    selectedIds.value = []
  }
})

/* ==========================
   EVENT HANDLERS
========================== */
const handleClose = () => {
  emit('update:open', false)
  emit('close')
}

const handleConfirm = () => {
  const ids = [...selectedIds.value]
  emit('confirm', ids)
  emit('submit', ids)
  emit('update:open', false)
}
</script>

<style scoped>
/* ===== OVERLAY ===== */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;
}

/* ===== TRANSITION ===== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ===== MODAL WRAPPER ===== */
.modal {
  width: 880px;
  max-width: calc(100% - 48px);
  max-height: calc(100vh - 80px);
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ===== HEADER ===== */
.modal__header {
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal__title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.modal__close {
  border: none;
  background: #ffffff;
  font-size: 20px;
  cursor: pointer;
  margin-left: 30px;
  margin-bottom: 20px;
}

/* ===== BODY ===== */
.modal__body {
  background: #ffffff;
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* ===== SEARCH ===== */
.search {
  position: relative;
  margin-bottom: 16px;
  width: 100%;
  max-width: 420px;
  margin-left: 30px;
}

.search__icon {
  position: absolute;
  inset-y: 0;
  left: 14px;
  display: flex;
  align-items: center;
  color: #9ca3af;
  margin-top: 5px;
}

.search__input {
  width: 100%;
  height: 40px;
  padding: 0 14px 0 42px;
  border-radius: 999px;
  border: 1px solid #999999;
  font-size: 14px;
  background: #ffffff;
}

/* ===== LIST WRAPPER ===== */
.list {
  margin-top: -5px;
  background: #ffffff;
  flex: 1;
  display: flex;
  flex-direction: column;
  max-height: 420px;
  overflow-y: auto;
  overflow-x: hidden;
}

.state {
  padding: 16px;
  font-size: 14px;
  color: #6b7280;
}
.state--empty {
  text-align: center;
}
.state--error {
  color: #b91c1c;
}

/* ===== ROW ITEM (border full width) ===== */
.row {
  width: 100%;
  border-bottom: 1px solid #999999;
  background: #ffffff;
}

.row:last-child {
  border-bottom: none;
}

/* phần nội dung bên trong row */
.row__inner {
  display: grid;
  grid-template-columns: 56px 96px 1fr minmax(120px, auto);
  align-items: center;
  padding: 16px 24px;
  column-gap: 16px;
  background: #ffffff;
}

/* ===== CHECKBOX ===== */
.row__checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
}

.row__checkbox input {
  display: none;
}

.checkbox-ui {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid #999999;
  background: #ffffff;
  box-sizing: border-box;
  position: relative;
}

.row__checkbox input:checked + .checkbox-ui {
  border-color: #6366f1;
  background: #6366f1;
}

.row__checkbox input:checked + .checkbox-ui::after {
  content: '';
  position: absolute;
  inset: 3px;
  border-radius: 2px;
  background: #ffffff;
}

/* ===== THUMBNAIL ===== */
.row__thumb {
  width: 76px;
  height: 76px;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
}

.row__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ===== INFO (NAME + BADGE) ===== */
.row__info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.row__name {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
}

/* badge Inactive giống Figma */
.badge {
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
}
.badge--inactive {
  background: #ffe2e5;
  color: #ff4e6a;
}

/* ===== PRICE ===== */
.row__price {
  font-size: 14px;
  font-weight: 500;
  text-align: right;
  color: #111827;
}

/* ===== FOOTER ===== */
.modal__footer {
  background: #ffffff;
  padding: 16px 30px 24px;   /* căn theo lề search/rows */
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: center;
}

.footer-inner {
  width: 100%;
  max-width: 360px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f7f7ff;
  border-radius: 999px;
  padding: 6px 10px;
}

/* Checkbox ở footer */
.footer-check {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.footer-check input {
  display: none;
}

.footer-check-ui {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 1px solid #999;
  background: #fff;
  position: relative;
}

.footer-check input:checked + .footer-check-ui {
  border-color: #6366f1;
  background: #6366f1;
}

.footer-check input:checked + .footer-check-ui::after {
  content: '';
  position: absolute;
  inset: 4px;
  background: #fff;
  border-radius: 3px;
}

.footer-check-label {
  color: #111827;
  font-size: 14px;
  font-weight: 500;
}

/* ===== BUTTONS ===== */
.btn {
  min-width: 180px;
  height: 44px;
  border-radius: 999px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.btn--ghost {
  color: #4b5563;
}

.btn--primary {
  background: #b9b9ff;
  color: #ffffff;
  box-shadow: 0 4px 10px rgba(103, 114, 255, 0.35);
}

.btn--primary:disabled {
  opacity: 0.6;
  cursor: default;
  box-shadow: none;
}
</style>
