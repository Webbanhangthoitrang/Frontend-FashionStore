<!-- src/components/admin/CategoryProductRemovePopup.vue -->
<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="open" class="overlay" @click.self="handleClose">
        <div class="modal" role="dialog" aria-modal="true">

          <!-- HEADER -->
          <header class="modal__header">
            <button type="button" class="modal__close" @click="handleClose">
              ✕
            </button>
          </header>

          <!-- BODY -->
          <div class="modal__body">

            <!-- SEARCH -->
            <div class="search">
              <span class="search__icon">
                <svg width="25" height="25" viewBox="0 0 35 35" fill="none">
                  <circle cx="16.0417" cy="16.0423" r="10.2083"
                    stroke="#9C9C9C" stroke-width="2" />
                  <path d="M29.1667 29.166L24.7917 24.791"
                    stroke="#9C9C9C" stroke-width="2" stroke-linecap="round" />
                </svg>
              </span>
              <input
                v-model="keyword"
                type="text"
                class="search__input"
                placeholder="Tìm kiếm sản phẩm..."
              />
            </div>

            <!-- LIST -->
            <div class="list">
              <p v-if="loading" class="state">Đang tải sản phẩm…</p>
              <p v-else-if="errorMessage" class="state state--error">{{ errorMessage }}</p>
              <p v-else-if="filteredProducts.length === 0" class="state state--empty">
                Không có sản phẩm trong danh mục.
              </p>

              <!-- ROW -->
              <div
                v-for="item in filteredProducts"
                v-else
                :key="item.id"
                class="row"
              >
                <div class="row__inner">

                  <!-- CHECKBOX -->
                  <label class="row__checkbox">
                    <input
                      type="checkbox"
                      class="row-check"
                      :value="item.id"
                      v-model="selectedIds"
                    />
                  </label>

                  <!-- THUMB -->
                  <div class="row__thumb">
                    <img :src="item.thumbnail" :alt="item.name" />
                  </div>

                  <!-- NAME -->
                  <div class="row__info">
                    <p class="row__name">{{ item.name }}</p>
                  </div>

                  <!-- PRICE -->
                  <div class="row__price">{{ formatPrice(item.price) }}</div>

                </div>
              </div>
            </div>
          </div>

          <!-- FOOTER -->
          <!-- FOOTER -->
        <footer class="modal__footer">
        <div class="footer-inner">
            <!-- Checkbox bên trái nếu muốn giữ UI -->
            <label class="footer-check">
            <input type="checkbox" v-model="footerChecked" />
            </label>

            <!-- Nút xoá -->
                    <button
                    type="button"
                    class="btn btn--danger"
                    :disabled="selectedIds.length === 0 || loading"
                    @click="openConfirm"
                    >
                    Xóa khỏi danh mục
                    </button>
                </div>
                </footer>

                <!-- POPUP XÁC NHẬN -->
                <ConfirmRemoveFromCategory
                v-model:open="confirmOpen"
                :loading="loading"
                @confirm="handleConfirmDelete"
        />

        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { request, API_BASE_URL } from '../../services/http'
import ConfirmRemoveFromCategory from './ConfirmRemoveFromCategory.vue'  //  Sửa path

/* PROPS & EMITS */
const props = defineProps({
  open: { type: Boolean, default: false },
  categoryId: { type: [Number, String], required: true },
})

const emit = defineEmits(['update:open', 'close', 'delete'])

/* STATE */
const keyword = ref('')
const selectedIds = ref([])
const footerChecked = ref(false)

const products = ref([])
const loading = ref(false)
const errorMessage = ref('')

const confirmOpen = ref(false)

/* OPEN CONFIRM POPUP */
const openConfirm = () => {
  if (selectedIds.value.length === 0) return
  confirmOpen.value = true
}

/* DELETE (emit lên cha) */
const handleDelete = () => {
  const ids = [...selectedIds.value]
  emit('delete', ids)
  emit('update:open', false) // đóng popup list
}

/* CONFIRM TRONG POPUP NHỎ */
const handleConfirmDelete = () => {
  handleDelete()
  confirmOpen.value = false   // đóng popup confirm
}

/* HELPERS */
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

const buildThumbnail = (p) => {
  const img =
    p.thumbnail ||
    p.image ||
    (Array.isArray(p.images) && p.images[0]?.url) ||
    null

  if (!img) return null
  if (img.startsWith('http')) return img
  return `${API_BASE_URL || ''}${img}`
}

/* LOAD PRODUCTS OF CATEGORY */
const fetchProducts = async () => {
  if (!props.categoryId) return

  loading.value = true
  errorMessage.value = ''

  try {
    const { data } = await request(`/categories/${props.categoryId}/products`)

    console.log('CATEGORY PRODUCTS API = ', data)

    const list = Array.isArray(data)
      ? data
      : data.items || data.data || data.products || data.rows || []

    products.value = list.map((p) => ({
      ...p,
      thumbnail: buildThumbnail(p),
      price: normalizePrice(p),
    }))
  } catch (err) {
    console.error(err)
    errorMessage.value = err?.message || 'Không tải được danh sách sản phẩm.'
  } finally {
    loading.value = false
  }
}

/* WATCH OPEN */
watch(
  () => props.open,
  (v) => {
    if (v) {
      keyword.value = ''
      selectedIds.value = []
      footerChecked.value = false
      fetchProducts()
    }
  }
)

/* FILTER */
const filteredProducts = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  if (!kw) return products.value
  return products.value.filter((p) =>
    (p.name || '').toLowerCase().includes(kw)
  )
})

/* CLOSE */
const handleClose = () => {
  emit('update:open', false)
  emit('close')
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
  margin-top: 20px;
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

/*  ROW ITEM (border full width)  */
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

/*  CHECKBOX  */
/* Checkbox trong list sản phẩm của popup (giống ProductManage.vue) */
.row-check {
  -webkit-appearance: none;
  appearance: none;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: 1.5px solid #999999;
  background-color: #ffffff;
  cursor: pointer;
}

.row-check:hover {
  border-color: #4C80E6;
}

.row-check:checked {
  background-color: #4C80E6;   /* nếu thích xanh lá thì đổi thành #42b444 */
  border-color: #4C80E6;
}


/*  THUMBNAIL  */
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

/*  INFO (NAME + BADGE)  */
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

.badge {
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
}
.badge--inactive {
  background: #ffe2e5;
  color: #ff4e6a;
}

/*  PRICE  */
.row__price {
  font-size: 14px;
  font-weight: 500;
  text-align: right;
  color: #111827;
}




/*  FOOTER  */
.modal__footer {
  padding: 16px 30px 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: center;
  
}

.footer-inner {
  display: flex;
  align-items: center;
  gap: 600px;      
}


.footer-check input[type="checkbox"] {
  -webkit-appearance: none;
  appearance: none;

  width: 22px;
  height: 22px;

  border-radius: 5px;
  border: 1.5px solid #999999;
  background: #ffffff;

  cursor: pointer;
}




.footer-check input[type="checkbox"]:checked {
  background-color: #4C80E6; 
  border-color: #4C80E6;
}

/*  BUTTON  */


.btn--danger {
  color: #ff4e6a;
  border: 1px solid #ff4e6a;
  border-radius: 10px;
  min-width: 180px;
  height: 44px;
  background: #ffffff;
}
</style>
