<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="open" class="overlay" @click.self="close">
        <div class="modal" role="dialog" aria-modal="true">
        

          <!-- Nội dung -->
          <div class="modal__body">
            <p class="modal__desc">
              Bạn có chắc chắn muốn xoá sản phẩm này?
            </p>
          </div>

          <!-- Footer -->
          <div class="modal__footer">
            <button type="button" class="btn btn--ghost" @click="close" :disabled="loading">
              Hủy
            </button>
            <button type="button" class="btn btn--danger" @click="confirm" :disabled="loading">
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
import { onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },      // v-model:open
  loading: { type: Boolean, default: false }    // đang xoá
})

const emit = defineEmits(['update:open', 'confirm', 'cancel'])

function confirm() {
  emit('confirm')
}
function close() {
  emit('cancel')
  emit('update:open', false)
}

/* Đóng popup bằng phím ESC */
function onKeydown(e) {
  if (!props.open) return
  if (e.key === 'Escape') close()
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .18s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.overlay {
  position: fixed; inset: 0;
  background: rgba(17,24,39,0.45);
  display: grid; place-items: center;
  z-index: 60; padding: 16px;
}

.modal {
  width: 420px; max-width: 100%;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 20px 50px rgba(15,23,42,0.18);
  overflow: hidden;
}



.modal__body { padding: 8px 20px 16px; color: #111827; font-size: 14px; }
.modal__desc {  font-size :30px ; text-align: center;}

.modal__footer {
  display: flex; justify-content: center; gap: 30px;
  padding: 14px 20px 18px;
  background: #fafafa;
  border-top: 1px solid #eef2f7;
}

/* Buttons */
.btn {
  height: 38px;
  padding: 0 16px;
  border-radius: 5px;
  border: 1px solid transparent;
  font-size: 14px;
  cursor: pointer;

}
.btn:disabled { opacity: .7; cursor: not-allowed; }

.btn--ghost {
  background: #fff;
  border-color: #e5e7eb;
  color: #111827;
}
.btn--ghost:hover { background: #f9fafb; }

.btn--danger {
  background: #ef4444;
  color: #fff;
  box-shadow: 0 6px 14px rgba(239,68,68,0.25);
}
.btn--danger:hover { filter: brightness(0.96); }
</style>
