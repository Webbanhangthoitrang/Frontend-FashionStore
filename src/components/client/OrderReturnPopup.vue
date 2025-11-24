<!-- src/components/client/ReturnOrderPopup.vue -->
<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="open" class="overlay" @click.self="handleClose">
        <div class="modal" role="dialog" aria-modal="true">
          <header class="modal__header">
            <h3 class="modal__title">Yêu cầu trả hàng</h3>
          </header>

          <div class="modal__body">
            <p class="modal__subtitle">Chọn lý do trả hàng</p>

            <ul class="reason-list">
              <li
                v-for="(item, idx) in reasons"
                :key="idx"
                class="reason-item"
                :class="{ 'reason-item--active': selectedReason === item.value }"
                @click="selectReason(item.value)"
              >
                <span class="reason-radio">
                  <span
                    v-if="selectedReason === item.value"
                    class="reason-radio__dot"
                  />
                </span>
                <span class="reason-text">{{ item.label }}</span>
              </li>
            </ul>

            <div v-if="selectedReason === 'OTHER'" class="note-box">
              <label class="note-label" for="return-note">
                Mô tả chi tiết hơn
              </label>
              <textarea
                id="return-note"
                v-model="note"
                class="note-textarea"
                placeholder="Nhập mô tả lý do trả hàng..."
              />
            </div>

            <p v-if="errorMessage" class="error-text">
              {{ errorMessage }}
            </p>
          </div>

          <footer class="modal__footer">
            <button
              type="button"
              class="btn btn--ghost"
              @click="handleClose"
              :disabled="loading"
            >
              Thoát
            </button>

            <button
              type="button"
              class="btn btn--primary"
              @click="handleSubmit"
              :disabled="loading"
            >
              {{ loading ? 'Đang gửi...' : 'YÊU CẦU TRẢ HÀNG' }}
            </button>
          </footer>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  orderId: { type: [Number, String], required: true },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'confirm'])

const reasons = [
  { value: 'WRONG_PRODUCT', label: 'Nhận sai sản phẩm / thiếu sản phẩm' },
  { value: 'DEFECTIVE', label: 'Sản phẩm lỗi, hư hỏng, kém chất lượng' },
  { value: 'NOT_AS_DESCRIPTION', label: 'Sản phẩm không giống mô tả / hình ảnh' },
  { value: 'CHANGE_MIND', label: 'Đổi ý, không muốn sử dụng nữa' },
  { value: 'OTHER', label: 'Khác' },
]

const selectedReason = ref('')
const note = ref('')
const errorMessage = ref('')

watch(
  () => props.open,
  (val) => {
    if (val) {
      selectedReason.value = ''
      note.value = ''
      errorMessage.value = ''
    }
  }
)

const handleClose = () => {
  if (props.loading) return
  emit('close')
}

const selectReason = (value) => {
  selectedReason.value = value
  errorMessage.value = ''
}

const handleSubmit = () => {
  if (!selectedReason.value) {
    errorMessage.value = 'Vui lòng chọn lý do trả hàng.'
    return
  }
  if (!props.orderId) {
    errorMessage.value = 'Không tìm thấy mã đơn hàng.'
    return
  }

  emit('confirm', {
    reason: selectedReason.value,
    note: note.value,
  })
}
</script>




<style scoped>
/* overlay + fade giống popup hủy */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal {
  width: 480px;
  max-width: calc(100% - 32px);
  background: #ffffff;
  border-radius: 6px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal__header {
  padding: 16px 24px 8px;
  border-bottom: 1px solid #f0f0f0;
}

.modal__title {
  font-size: 16px;
  font-weight: 600;
  color: #333333;
}

.modal__body {
  padding: 16px 24px 4px;
}

.modal__subtitle {
  font-size: 14px;
  color: #555555;
  margin-bottom: 12px;
}

/* danh sách lý do */
.reason-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.reason-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  cursor: pointer;
  border-bottom: 1px solid #f5f5f5;
}

.reason-item:last-child {
  border-bottom: none;
}

.reason-item--active .reason-text {
  color: #111111;
  font-weight: 500;
}

.reason-radio {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid #c4c4c4;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  flex-shrink: 0;
}

.reason-radio__dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #ff4d4f; 
}

.reason-text {
  font-size: 14px;
  color: #555555;
}

/* ghi chú */
.note-box {
  margin-top: 12px;
}

.note-label {
  display: block;
  font-size: 13px;
  color: #666666;
  margin-bottom: 6px;
}

.note-textarea {
  width: 100%;
  min-height: 80px;
  padding: 8px 10px;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  font-size: 13px;
  resize: vertical;
}

.note-textarea:focus {
  outline: none;
  border-color: #1890ff;
}

.error-text {
  margin-top: 8px;
  font-size: 13px;
  color: #ff4d4f;
}

/* footer */
.modal__footer {
  padding: 12px 24px 16px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* buttons */
.btn {
  min-width: 120px;
  height: 36px;
  padding: 0 16px;
  border-radius: 3px;
  border: none;
  font-size: 13px;
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.7;
  cursor: default;
}

.btn--ghost {
  background: #ffffff;
  border: 1px solid #d9d9d9;
  color: #333333;
}

.btn--ghost:hover:not(:disabled) {
  background: #fafafa;
}

.btn--primary {
  background: #ff4d4f; 
  color: #ffffff;
}

.btn--primary:hover:not(:disabled) {
  filter: brightness(0.95);
}
</style>
