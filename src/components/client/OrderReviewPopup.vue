<!-- src/components/client/OrderReviewPopup.vue -->
<template>
  <teleport to="body">
    <transition name="fade">
      <div
        v-if="open"
        class="rvp-overlay"
        @click.self="handleClose"
      >
        <div class="rvp-modal" role="dialog" aria-modal="true">
          <!-- HEADER: ẢNH + THÔNG TIN SẢN PHẨM -->
          <header class="rvp-header">
            <div class="rvp-thumb-wrap">
              <img
                :src="product.image || '/placeholder.png'"
                :alt="product.name || 'Sản phẩm'"
                class="rvp-thumb"
              />
            </div>

            <div class="rvp-info">
              <h3 class="rvp-name">
                {{ product.name || 'Tên sản phẩm' }}
              </h3>
              <p class="rvp-sub">
                Phân loại:
                <span>{{ product.category || 'Không có' }}</span>
              </p>
              <p class="rvp-sub">x{{ product.quantity || 1 }}</p>
            </div>
          </header>

          <!-- BODY: SAO + COMMENT -->
          <section class="rvp-body">
            <div class="rvp-row rvp-row--rating">
              <span class="rvp-label">Chất lượng sản phẩm</span>

              <div class="rvp-stars">
                <button
                  v-for="n in 5"
                  :key="n"
                  type="button"
                  class="rvp-star"
                  :class="{ 'rvp-star--active': n <= rating }"
                  @click="setRating(n)"
                >
                  ★
                </button>
              </div>
            </div>

            <div class="rvp-row rvp-row--textarea">
              <textarea
                v-model="comment"
                class="rvp-textarea"
                rows="4"
                placeholder="Hãy chia sẻ những điều bạn thích về sản phẩm này với người mua khác nhé..."
              ></textarea>
            </div>
          </section>

          <!-- DANH SÁCH ẢNH ĐÃ CHỌN -->
          <section v-if="imagePreviews.length" class="rvp-images">
            <div class="rvp-img-list">
              <div
                v-for="(img, idx) in imagePreviews"
                :key="idx"
                class="rvp-img-item"
              >
                <img :src="img.url" alt="Ảnh đánh giá" />
              </div>
            </div>
          </section>

          <!-- FOOTER: THÊM HÌNH + NÚT -->
          <footer class="rvp-footer">
            <button
              type="button"
              class="rvp-add-img"
              @click="triggerFile"
            >
              <span class="rvp-add-img__icon">
                <svg width="20" height="20" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.25 20.5295C6.25 18.3962 7.9794 16.6668 10.1127 16.6668C11.5758 16.6668 12.9133 15.8402 13.5676 14.5316L15.5611 10.5446C16.099 9.46881 16.368 8.93089 16.8513 8.63219C17.3346 8.3335 17.936 8.3335 19.1388 8.3335H30.8612C32.064 8.3335 32.6654 8.3335 33.1487 8.63219C33.632 8.93089 33.901 9.46881 34.4389 10.5446L36.4324 14.5316C37.0867 15.8402 38.4242 16.6668 39.8873 16.6668C42.0206 16.6668 43.75 18.3962 43.75 20.5295V35.6668C43.75 38.4953 43.75 39.9095 42.8713 40.7881C41.9926 41.6668 40.5784 41.6668 37.75 41.6668H12.25C9.42157 41.6668 8.00736 41.6668 7.12868 40.7881C6.25 39.9095 6.25 38.4953 6.25 35.6668V20.5295Z" stroke="#4C80E6" stroke-width="2"/>
                  <circle cx="24.9993" cy="27.0833" r="7.33333" stroke="#4C80E6" stroke-width="2"/>
                </svg>
              </span>
              <span>Thêm hình ảnh</span>
            </button>

            <input
              ref="fileInput"
              type="file"
              class="rvp-file"
              accept="image/*"
              @change="onFilesChange"
            />

            <div class="rvp-actions">
              <button
                type="button"
                class="rvp-btn rvp-btn--ghost"
                @click="handleClose"
              >
                Trở lại
              </button>

              <button
                type="button"
                class="rvp-btn rvp-btn--primary"
                :disabled="submitting || !rating"
                @click="handleSubmit"
              >
                <span v-if="submitting">Đang gửi...</span>
                <span v-else>Hoàn thành</span>
              </button>
            </div>
          </footer>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { computed, ref, watch } from "vue";

const props = defineProps({
  open: { type: Boolean, default: false },
  order: { type: Object, default: () => ({}) },
  submitting: { type: Boolean, default: false },
});

const emit = defineEmits(["close", "submit"]);

// sản phẩm đầu tiên trong đơn
const product = computed(() => {
  return props.order?.products?.[0] || {};
});

const rating = ref(0);
const comment = ref("");


const imagePreviews = ref([]); 
const fileInput = ref(null);

function resetState() {
  
  imagePreviews.value.forEach((p) => URL.revokeObjectURL(p.url));
  imagePreviews.value = [];
  rating.value = 0;
  comment.value = "";
  if (fileInput.value) fileInput.value.value = "";
}

watch(
  () => props.open,
  (val) => {
    if (val) {
      resetState();
    }
  }
);

function setRating(n) {
  rating.value = n;
}

function triggerFile() {
  fileInput.value?.click();
}

function onFilesChange(e) {
  const files = Array.from(e.target.files || []);
  if (!files.length) return;

  const file = files[0]; 

  
  imagePreviews.value.forEach((p) => URL.revokeObjectURL(p.url));
  imagePreviews.value = [
    {
      file,
      url: URL.createObjectURL(file),
    },
  ];
}


function handleClose() {
  resetState();
  emit("close");
}

function handleSubmit() {
  if (!rating.value || props.submitting) return;

  emit("submit", {
    orderId: props.order?.id,
    rating: rating.value,
    comment: comment.value.trim(),
    // chỉ emit File[] cho API
    images: imagePreviews.value.map((p) => p.file),
  });
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Khula:wght@400;600;700&display=swap");

.rvp-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
  font-family: "Khula", system-ui, -apple-system, "Segoe UI", Roboto, Arial,
    sans-serif;
}

/* CARD POPUP */
.rvp-modal {
  width: 620px;
  max-width: calc(100% - 40px);
  background: #fffdf8;
  border-radius: 4px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  padding: 20px 24px 18px;
}

/* HEADER */
.rvp-header {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 14px;
}

.rvp-thumb-wrap {
  flex-shrink: 0;
}

.rvp-thumb {
  width: 110px;
  height: 130px;
  object-fit: cover;
  border: 1px solid #e5e5e5;
  background: #f7f7f7;
}

.rvp-info {
  flex: 1;
}

.rvp-name {
  margin: 0 0 6px 0;
  font-size: 16px;
  font-weight: 600;
  color: #222222;
}

.rvp-sub {
  margin: 0;
  font-size: 13px;
  color: #777777;
}

.rvp-sub span {
  color: #777777;
}

/* BODY */
.rvp-body {
  border-top: 1px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
  padding: 14px 0 12px;
}

.rvp-row {
  display: flex;
  align-items: center;
}

.rvp-row--rating {
  justify-content: space-between;
  margin-bottom: 10px;
}

.rvp-label {
  font-size: 14px;
  color: #333333;
  font-weight: 600;
}

/* STARS */
.rvp-stars {
  display: flex;
  gap: 4px;
}

.rvp-star {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
  color: #dddddd;
  padding: 0 2px;
}

.rvp-star--active {
  color: #f5a623;
}

/* TEXTAREA */
.rvp-row--textarea {
  margin-top: 4px;
}

.rvp-textarea {
  width: 100%;
  resize: none;
  border-radius: 3px;
  border: 1px solid #e3e3e3;
  padding: 8px 10px;
  font-size: 13px;
  font-family: inherit;
  color: #333333;
  background: #ffffff;
}

/* DANH SÁCH ẢNH ĐÃ CHỌN */
.rvp-images {
  padding-top: 8px;
}

.rvp-img-list {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}

.rvp-img-item {
  width: 70px;
  height: 70px;
  border-radius: 3px;
  overflow: hidden;
  border: 1px solid #e3e3e3;
  background: #f7f7f7;
}

.rvp-img-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* FOOTER */
.rvp-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
}

/* Thêm hình ảnh */
.rvp-add-img {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid #4c80e6;
  background: #ffffff;
  border-radius: 3px;
  padding: 6px 10px;
  font-size: 13px;
  color: #4c80e6;
  cursor: pointer;
}

.rvp-add-img__icon {
  font-size: 14px;
}

.rvp-file {
  display: none;
}

/* ACTION BUTTONS */
.rvp-actions {
  display: flex;
  gap: 10px;
}

.rvp-btn {
  min-width: 92px;
  height: 32px;
  padding: 0 14px;
  border-radius: 3px;
  font-size: 13px;
  cursor: pointer;
  font-family: inherit;
}

/* Trở lại */
.rvp-btn--ghost {
  border: 1px solid #bfbfbf;
  background: #ffffff;
  color: #555555;
}

/* Hoàn thành */
.rvp-btn--primary {
  border: 1px solid #ff0000;
  background: #ff0000;
  color: #ffffff;
  font-weight: 600;
}

.rvp-btn--primary:disabled {
  opacity: 0.6;
  cursor: default;
}

/* FADE TRANSITION */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
