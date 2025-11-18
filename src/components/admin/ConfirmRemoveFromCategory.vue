<!-- src/components/admin/ConfirmRemoveFromCategory.vue -->
<template>
  <teleport to="body">
    <transition name="fade">
      <div
        v-if="open"
        class="cr-overlay"
        @click.self="handleClose"
      >
        <div class="cr-dialog" role="dialog" aria-modal="true">
          <!-- TEXT -->
          <p class="cr-text">
            Bạn có chắc muốn xóa sản phẩm khỏi danh mục này?
          </p>

          <!-- ACTIONS -->
          <div class="cr-actions">
            <button
              type="button"
              class="cr-btn cr-btn--ghost"
              :disabled="loading"
              @click="handleClose"
            >
              Đóng
            </button>
            <button
              type="button"
              class="cr-btn cr-btn--danger"
              :disabled="loading"
              @click="handleConfirm"
            >
              <span v-if="!loading">Xác nhận</span>
              <span v-else>Đang xoá…</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },   // v-model:open
  loading: { type: Boolean, default: false } // trạng thái đang xoá
})

const emit = defineEmits(['update:open', 'close', 'confirm'])

const handleClose = () => {
  emit('update:open', false)
  emit('close')
}

const handleConfirm = () => {
  emit('confirm')
}
</script>

<style scoped>
/* OVERLAY */
.cr-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 80;
}

/* FADE */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.19s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* DIALOG */
.cr-dialog {
  min-width: 340px;
  max-width: 400px;
  background: #ffffff;
  border-radius: 16px;
  padding: 24px 32px 20px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.25);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* TEXT */
.cr-text {
  margin: 0;
  font-size: 20px;
  line-height: 1.5;
  text-align: center;
  color: #111827;
}

/* ACTIONS */
.cr-actions {
  display: flex;
  justify-content: flex-end;
  gap: 130px;
}

/* BUTTONS */
.cr-btn {
  min-width: 96px;
  height: 40px;
  padding: 0 18px;
  border-radius: 8px;
  font-size: 14px;
  border: 1px solid transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.cr-btn:disabled {
  opacity: 0.7;
  cursor: default;
}

/* Nút Đóng (viền xám, nền trắng) */
.cr-btn--ghost {
  background: #ffffff;
  color: #111827;
  border-color: #d1d5db;
}

/* Nút Xác nhận (nền đỏ giống Figma) */
.cr-btn--danger {
  background: #ff3b30;
  border-color: #ff3b30;
  color: #ffffff;
}
</style>
