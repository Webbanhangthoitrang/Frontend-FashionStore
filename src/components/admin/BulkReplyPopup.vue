<template>
  <teleport to="body">
    <transition name="rv-modal">
      <div v-if="open" class="rv-modal-overlay" @click.self="onClose">
        <div class="rv-modal bulk-modal" role="dialog" aria-modal="true">
          
          <!-- HEADER -->
          <header class="bulk-header">
            <h2 class="bulk-title">Phản hồi đánh giá</h2>
          </header>

          <!-- BODY -->
          <section class="bulk-body">
            <p class="bulk-text">
              Cảm ơn bạn đã ủng hộ FashionStore! <br />
              Shop sẽ ghi nhận ý kiến và cải thiện tốt hơn…
            </p>
          </section>

          <!-- FOOTER -->
          <footer class="bulk-footer">
            <button class="bulk-btn bulk-btn--primary" @click="onSubmit">
              Gửi phản hồi hàng loạt
            </button>

            <button class="bulk-btn bulk-btn--ghost" @click="onClose">
              Đóng
            </button>
          </footer>

        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
const props = defineProps({
  open: Boolean,
})

const emit = defineEmits(["close", "submit"])

const onClose = () => emit("close")
const onSubmit = () => emit("submit")
</script>

<style scoped>
.rv-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.bulk-modal {
  width: 580px;
  background: #fff;
  border-radius: 18px;
  padding: 20px 22px 18px;
  box-shadow: 0 25px 60px rgba(15,23,42,0.35);
  display: flex;
  flex-direction: column;
}

/* HEADER */
.bulk-header {
  margin-bottom: 12px;
}
.bulk-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

/* BODY */
.bulk-body {
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #f9fafb;
  padding: 16px 18px 14px;
}
.bulk-text {
  font-size: 13px;
  color: #4b5563;
  line-height: 1.5;
}

/* FOOTER */
.bulk-footer {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.bulk-btn {
  padding: 8px 20px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: none;
}
.bulk-btn--primary {
  background: #2563eb;
  color: white;
  box-shadow: 0 4px 10px rgba(37,99,235,0.3);
}
.bulk-btn--primary:hover {
  background: #1d4ed8;
}
.bulk-btn--ghost {
  background: #f3f4f6;
  color: #111827;
  border: 1px solid #d1d5db;
}
.bulk-btn--ghost:hover {
  background: #e5e7eb;
}
</style>
