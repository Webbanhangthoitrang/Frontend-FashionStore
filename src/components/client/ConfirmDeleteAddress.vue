<!-- src/components/client/ConfirmDeleteAddress.vue -->
<template>
  <teleport to="body">
    <transition name="fade">
      <div
        v-if="open"
        class="addr-overlay"
        @click.self="handleClose"
      >
        <div class="addr-dialog" role="dialog" aria-modal="true">
          <!-- TEXT -->
          <p class="addr-text">
            Bạn có chắc muốn xóa địa chỉ này?
          </p>

          <!-- ACTIONS -->
          <div class="addr-actions">
            <!-- Nút Hủy (bên trái) -->
            <button
              type="button"
              class="addr-btn addr-btn--ghost"
              :disabled="loading"
              @click="handleClose"
            >
              Hủy
            </button>

            <!-- Nút Xác nhận (bên phải) -->
            <button
              type="button"
              class="addr-btn addr-btn--danger"
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
.addr-overlay {
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
.addr-dialog {
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
.addr-text {
  margin: 0;
  font-size: 20px;
  line-height: 1.5;
  text-align: center;
  color: #111827;
}

/* ACTIONS */
.addr-actions {
  display: flex;
  justify-content: center; /* cho giống figma: 2 nút giữa popup */
  gap: 24px;
}

/* BUTTONS */
.addr-btn {
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

.addr-btn:disabled {
  opacity: 0.7;
  cursor: default;
}

/* Nút Hủy (viền xám, nền trắng, chữ đen) */
.addr-btn--ghost {
  background: #ffffff;
  color: #111827;
  border-color: #d1d5db;
}

/* Nút Xác nhận (nền đỏ giống Figma) */
.addr-btn--danger {
  background: #ff3b30;
  border-color: #ff3b30;
  color: #ffffff;
}
</style>
