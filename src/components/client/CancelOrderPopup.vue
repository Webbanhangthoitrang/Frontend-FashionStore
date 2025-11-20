<!-- src/components/client/OrderCancelPopup.vue -->
<template>
  <teleport to="body">
    <transition name="fade">
      <div
        v-if="open"
        class="oc-overlay"
        @click.self="handleClose"
      >
        <div class="oc-modal" role="dialog" aria-modal="true">
          <!-- HEADER -->
          <header class="oc-header">
            <h2 class="oc-title">Chọn lý do hủy</h2>
          </header>

          <!-- BODY -->
          <div class="oc-body">
            <label
              v-for="opt in reasonOptions"
              :key="opt.value"
              class="oc-option"
            >
              <span class="oc-radio-wrap">
                <span class="oc-radio">
                  <span
                    v-if="selectedReason === opt.value"
                    class="oc-radio-dot"
                  />
                </span>
              </span>

              <input
                v-model="selectedReason"
                class="oc-input-radio"
                type="radio"
                :value="opt.value"
              />

              <span class="oc-option-text">
                {{ opt.label }}
              </span>
            </label>

            <!-- LÝ DO KHÁC -->
            <div
              v-if="selectedReason === 'other'"
              class="oc-other-wrap"
            >
              <textarea
                v-model="otherText"
                class="oc-other-input"
                rows="3"
                placeholder="Nhập lý do hủy khác..."
              />
            </div>
          </div>

          <!-- FOOTER -->
          <footer class="oc-footer">
            <button
              type="button"
              class="oc-btn oc-btn--ghost"
              @click="handleClose"
            >
              Thoát
            </button>

            <button
              type="button"
              class="oc-btn oc-btn--danger"
              :disabled="!canSubmit || loading"
              @click="handleConfirm"
            >
              {{ loading ? "Đang xử lý..." : "HỦY ĐƠN HÀNG" }}
            </button>
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
  loading: { type: Boolean, default: false }, // parent truyền trạng thái call API
  order: { type: Object, default: null }
});

const emit = defineEmits(["close", "confirm"]);

const reasonOptions = [
  {
    value: "change_address",
    label: "Muốn thay đổi địa chỉ giao hàng"
  },
  {
    value: "change_product",
    label: "Muốn thay đổi sản phẩm trong đơn hàng"
  },
  {
    value: "better_price",
    label: "Tìm thấy giá rẻ hơn ở chỗ khác"
  },
  {
    value: "dont_want",
    label: "Đổi ý, không muốn mua nữa"
  },
  {
    value: "other",
    label: "Khác"
  }
];

const selectedReason = ref(reasonOptions[0].value);
const otherText = ref("");

watch(
  () => props.open,
  (val) => {
    if (val) {
      // reset mỗi lần mở popup
      selectedReason.value = reasonOptions[0].value;
      otherText.value = "";
    }
  }
);

const canSubmit = computed(() => {
  if (selectedReason.value !== "other") return true;
  return otherText.value.trim().length > 0;
});

const buildReasonText = () => {
  const base = reasonOptions.find(
    (o) => o.value === selectedReason.value
  )?.label;

  if (selectedReason.value === "other") {
    return otherText.value.trim();
  }

  return base || "Không rõ lý do";
};

const handleClose = () => {
  if (props.loading) return;
  emit("close");
};

const handleConfirm = () => {
  if (!canSubmit.value || props.loading) return;

  const reason = buildReasonText();
  emit("confirm", { order: props.order, reason });
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Khula:wght@400;600;700&display=swap");

* {
  font-family: "Khula", system-ui, -apple-system, "Segoe UI", Roboto, Arial,
    sans-serif;
}

/* OVERLAY */
.oc-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

/* MODAL */
.oc-modal {
  width: 420px;
  max-width: calc(100% - 32px);
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.18);
  overflow: hidden;
}

/* HEADER */
.oc-header {
  padding: 14px 20px 10px;
  border-bottom: 1px solid #f0f0f0;
}

.oc-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #222222;
}

/* BODY */
.oc-body {
  padding: 10px 20px 6px;
}

.oc-option {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 6px 0;
  cursor: pointer;
}

.oc-input-radio {
  display: none;
}

.oc-radio-wrap {
  margin-top: 2px;
}

.oc-radio {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid #c4c4c4;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.oc-radio-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #ff0000;
}

.oc-option-text {
  font-size: 13px;
  color: #444444;
}

.oc-other-wrap {
  padding: 4px 0 8px;
}

.oc-other-input {
  width: 100%;
  resize: vertical;
  min-height: 70px;
  font-size: 13px;
  padding: 6px 8px;
  border-radius: 3px;
  border: 1px solid #d4d4d4;
  outline: none;
}

.oc-other-input:focus {
  border-color: #2f80ed;
}

/* FOOTER */
.oc-footer {
  padding: 10px 20px 14px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.oc-btn {
  min-width: 96px;
  height: 34px;
  padding: 0 14px;
  font-size: 13px;
  border-radius: 3px;
  border: 1px solid transparent;
  cursor: pointer;
}

.oc-btn--ghost {
  background: #ffffff;
  border-color: #d4d4d4;
  color: #444444;
}

.oc-btn--ghost:hover {
  background: #f7f7f7;
}

.oc-btn--danger {
  background: #ff0000;
  border-color: #ff0000;
  color: #ffffff;
  font-weight: 600;
}

.oc-btn--danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* FADE ANIM */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
