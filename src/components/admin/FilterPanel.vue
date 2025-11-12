<template>
  <transition name="slide-fade">
    <div v-if="open" class="overlay" @click.self="close">
      <aside class="panel">
        <!-- Header -->
        <header class="panel__head">
          <h1>Filter</h1>
          <button class="close" @click="close">×</button>
        </header>

        <!-- ===== GIÁ (KHOẢNG) ===== -->
        <section class="block">
          <h2 class="block__title">Giá</h2>

          <!-- Dual slider -->
          <div class="range">
            <div class="track"></div>
            <div
              class="progress"
              :style="{ left: percent(minPrice)+'%', right: (100 - percent(maxPrice))+'%' }"
            ></div>

            <input
              type="range"
              class="thumb"
              :min="bounds.min"
              :max="bounds.max"
              :step="step"
              v-model.number="minPrice"
              @input="keepOrder('min')"
            />
            <input
              type="range"
              class="thumb"
              :min="bounds.min"
              :max="bounds.max"
              :step="step"
              v-model.number="maxPrice"
              @input="keepOrder('max')"
            />
          </div>

          <div class="inputs">
            <label class="field">
              <span>Từ</span>
              <input
                type="number"
                :min="bounds.min" :max="bounds.max" :step="step"
                v-model.number="minPrice"
                @blur="clampAll"
              />
            </label>

            <label class="field">
              <span>Đến</span>
              <input
                type="number"
                :min="bounds.min" :max="bounds.max" :step="step"
                v-model.number="maxPrice"
                @blur="clampAll"
              />
            </label>
          </div>
        </section>

        <!-- ===== TRẠNG THÁI (2 NÚT RIÊNG) ===== -->
        <section class="block">
          <h2 class="block__title">Status</h2>

          <div class="status-row">
            <!-- ACTIVE button -->
            <button
              class="status-btn status-btn--active"
              :class="{ 'is-on': localStatuses.includes('active') }"
              @click="toggleStatus('active')"
            >
              Active
            </button>

            <!-- INACTIVE button -->
            <button
              class="status-btn status-btn--inactive"
              :class="{ 'is-on': localStatuses.includes('inactive') }"
              @click="toggleStatus('inactive')"
            >
              Inactive
            </button>
          </div>
        </section>

        <!-- Actions -->
        <footer class="actions">
          <button class="btn btn--ghost" @click="onReset">Xóa</button>
          <button class="btn btn--primary" @click="onApply">Apply</button>
        </footer>
      </aside>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  open: Boolean,
  init: { type: Object, default: () => ({}) }, // { minPrice?, maxPrice?, statuses? }
  bounds: { type: Object, default: () => ({ min: 0, max: 0 }) },
  step: { type: Number, default: 1000 },
});
const emit = defineEmits(["update:open", "apply", "reset"]);

const minPrice = ref(0);
const maxPrice = ref(0);
const localStatuses = ref([]); // ['active','inactive']

watch(
  () => [props.init, props.bounds],
  () => {
    const s = Number(props.step) || 1;
    const minB = Number(props.bounds.min) || 0;
    const maxB = Number(props.bounds.max) || 0;

    minPrice.value = Math.round((props.init?.minPrice ?? minB) / s) * s;
    maxPrice.value = Math.round((props.init?.maxPrice ?? maxB) / s) * s;
    localStatuses.value = Array.isArray(props.init?.statuses) ? [...props.init.statuses] : [];
  },
  { deep: true, immediate: true }
);

function close() { emit("update:open", false); }
function clampAll() {
  const lo = props.bounds.min, hi = props.bounds.max;
  if (minPrice.value < lo) minPrice.value = lo;
  if (maxPrice.value > hi) maxPrice.value = hi;
  if (minPrice.value > maxPrice.value) minPrice.value = maxPrice.value;
}
function keepOrder(which) {
  if (minPrice.value > maxPrice.value) {
    if (which === "min") maxPrice.value = minPrice.value;
    else minPrice.value = maxPrice.value;
  }
}
function percent(v) {
  const lo = props.bounds.min, hi = props.bounds.max || lo + 1;
  return ((v - lo) * 100) / (hi - lo);
}

function toggleStatus(opt) {
  const set = new Set(localStatuses.value);
  set.has(opt) ? set.delete(opt) : set.add(opt);
  localStatuses.value = Array.from(set);
}

function onReset() {
  minPrice.value = props.bounds.min;
  maxPrice.value = props.bounds.max;
  localStatuses.value = [];
  emit("reset");
}
function onApply() {
  clampAll();
  emit("apply", {
    minPrice: minPrice.value,
    maxPrice: maxPrice.value,
    statuses: localStatuses.value,
  });
  close();
}
</script>

<style scoped>
/* Overlay & Panel */
.overlay { position: fixed; inset: 0; background: rgba(0,0,0,.35); display: flex; justify-content: flex-end; z-index: 1000; }
.panel { width: 360px; height: 100%; background: #fff; padding: 24px; display: flex; flex-direction: column; box-shadow: -2px 0 10px rgba(0,0,0,.1); }
.panel__head { display: flex; justify-content: space-between; align-items: center; }
.panel__head h3 { margin: 0; font-size: 18px; font-weight: 800; }
.close { background: none; border: 0; font-size: 22px; cursor: pointer; line-height: 1; }

/* Blocks */
.block { margin-top: 18px; }
.block__title { font-weight: 700; margin-bottom: 10px; }

/* Dual range */
.range { position: relative; height: 36px; margin-bottom: 10px; }
.track { position: absolute; top: 16px; left: 0; right: 0; height: 6px; background: #e5e7eb; border-radius: 999px; }
.progress { position: absolute; top: 16px; height: 6px; background: #4c80e6; border-radius: 999px; }
.thumb {
  position: absolute; width: 100%;
  -webkit-appearance: none; appearance: none; background: transparent;
  pointer-events: none;
}
.thumb::-webkit-slider-thumb {
  -webkit-appearance: none; appearance: none;
  width: 18px; height: 18px; border-radius: 50%;
  background: #4c80e6; border: 2px solid #fff;
  box-shadow: 0 0 0 2px #4c80e6;
  cursor: pointer; pointer-events: auto;
}

/* Inputs */
.inputs { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
.field { display: grid; gap: 4px; }
.field span { font-size: 13px; color: #374151; font-weight: 600; }
.field input {
  height: 40px; padding: 0 10px; border-radius: 8px;
  border: 1px solid #e5e7eb; outline: none;
}
.field input:focus { border-color: #93c5fd; box-shadow: 0 0 0 3px rgba(59,130,246,.15); }

/* ===== Status buttons (giống thiết kế) ===== */
.status-row { display: flex; gap: 12px; flex-wrap: wrap; }

.status-btn {
  min-width: 84px; height: 34px; padding: 0 14px;
  border-radius: 8px; border: 1px solid transparent;
  font-weight: 700; cursor: pointer;
  transition: box-shadow .15s ease, transform .05s ease;
  color: #fff;
}

/* màu nền cố định như thiết kế */
.status-btn--active   { background: #acefbb; color: #1a9e55; }
.status-btn--inactive { background: #eaacac; color:#ff4e6a}





/* Actions */
.actions { margin-top: auto; display: flex; gap: 100px; }
.btn { height: 40px; padding: 0 16px; border-radius: 10px; cursor: pointer; font-weight: 700;margin-left: 20px;border: none;background: transparent ;  }
.btn--ghost {  color: #374151; }
.btn--primary { color: #4c80e6; }


/* Transition */
.slide-fade-enter-active, .slide-fade-leave-active { transition: all .18s ease; }
.slide-fade-enter-from, .slide-fade-leave-to { opacity: 0; transform: translateX(12px); }
</style>
