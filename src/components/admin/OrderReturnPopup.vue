<template>
  <teleport to="body">
    <transition name="fade">
      <div
        v-if="open"
        class="overlay"
        @click.self="handleClose"
      >
        <div class="modal" role="dialog" aria-modal="true">
          <!-- HEADER -->
          <header class="modal__header">
            <h3 class="modal__title">Chọn lý do trả hàng</h3>
          </header>

          <!-- BODY -->
          <div class="modal__body">
            <p class="modal__desc">
              Hãy chọn lý do bạn muốn trả đơn hàng
              <strong v-if="order">#{{ order.code || order.id }}</strong>.
            </p>

            <ul class="reason-list">
              <li
                v-for="opt in reasons"
                :key="opt.value"
                class="reason-item"
              >
                <label class="radio">
                  <input
                    type="radio"
                    class="radio__input"
                    v-model="selected"
                    :value="opt.value"
                  />
                  <span class="radio__label">{{ opt.label }}</span>
                </label>
              </li>
            </ul>

            <!-- LÝ DO KHÁC -->
            <textarea
              v-if="selected === 'other'"
              v-model="note"
              class="note-input"
              rows="3"
              placeholder="Mô tả thêm lý do trả hàng..."
            />
          </div>

          <!-- FOOTER -->
          <footer class="modal__footer">
            <button
              type="button"
              class="btn btn--ghost"
              @click="handleClose"
            >
              Thoát
            </button>

            <button
              type="button"
              class="btn btn--danger"
              :disabled="!selected"
              @click="handleSubmit"
            >
              GỬI YÊU CẦU TRẢ HÀNG
            </button>
          </footer>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  order: { type: Object, default: null },
})

const emit = defineEmits(['close', 'submit'])

const reasons = [
  { value: 'defect', label: 'Sản phẩm bị lỗi, hư hỏng' },
  {
    value: 'not_match',
    label: 'Sản phẩm không đúng mô tả / không vừa size',
  },
  { value: 'missing', label: 'Thiếu sản phẩm hoặc phụ kiện' },
  { value: 'wrong_order', label: 'Đã nhận nhầm đơn hàng' },
  { value: 'change_mind', label: 'Đổi ý, không muốn mua nữa' },
  { value: 'other', label: 'Khác' },
]

const selected = ref('')
const note = ref('')

// reset khi mở popup
watch(
  () => props.open,
  (val) => {
    if (val) {
      selected.value = ''
      note.value = ''
    }
  },
)

const payload = computed(() => ({
  orderId: props.order?.id,
  reason: selected.value,
  note: note.value,
}))

function handleClose() {
  emit('close')
}

function handleSubmit() {
  if (!selected.value) return
  emit('submit', payload.value)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* {
  font-family: 'Inter', sans-serif !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal {
  width: 344px;
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.15);
  padding: 16px;
}

/* HEADER */
.modal__header {
  margin-bottom: 8px;
}

.modal__title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

/* BODY */
.modal__body {
  padding: 4px 0 12px;
}

.modal__desc {
  margin: 0 0 8px 0;
  font-size: 13px;
  color: #4b5563;
}

.reason-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.reason-item + .reason-item {
  margin-top: 6px;
}

.radio {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.radio__input {
  width: 14px;
  height: 14px;
}

.radio__label {
  font-size: 13px;
  color: #111827;
}

.note-input {
  margin-top: 8px;
  width: 100%;
  border-radius: 3px;
  border: 1px solid #d1d5db;
  padding: 6px 8px;
  font-size: 13px;
  resize: vertical;
}

/* FOOTER */
.modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  border-top: 1px solid #e5e7eb;
  padding-top: 10px;
}

.btn {
  height: 32px;
  padding: 0 14px;
  border-radius: 3px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
}

.btn--ghost {
  background: #ffffff;
  color: #111827;
  border-color: #d1d5db;
}

.btn--danger {
  background: #ff0000;
  border-color: #ff0000;
  color: #ffffff;
}

.btn--danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
