<template>
  <div class="overlay" @click.self="onClose">
    <div class="modal list" role="dialog" aria-modal="true">
      <header class="modal__head">
        <h3>Địa Chỉ Của Tôi</h3>
        <button class="iconbtn" @click="onClose">✕</button>
      </header>

      <section class="modal__body">
        <ul class="addr-list">
          <li v-for="addr in addresses" :key="addr.id" class="addr-item">
            <label class="row">
              <input type="radio" name="addr" :value="addr.id" v-model="selectedId" />
              <div class="info">
                <div class="line">
                  <strong>{{ addr.fullName }}</strong>
                  <span class="sep">|</span>
                  <span>{{ addr.phone }}</span>
                  <span v-if="addr.isDefault" class="tag">Mặc định</span>
                  <a class="link small" @click.prevent="onEdit(addr)">Cập nhật</a>
                </div>
                <div class="sub">{{ formatAddress(addr) }}</div>
              </div>
            </label>
          </li>
        </ul>

        <button class="btn ghost" @click="$emit('add-new')">
          + Thêm Địa Chỉ Mới
        </button>
      </section>

      <footer class="modal__foot">
        <button class="btn ghost" @click="onClose">Hủy</button>
        <button class="btn primary" @click="onConfirm">Xác nhận</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  addresses: Array,
  modelValue: [String, Number],
})
const emit = defineEmits(['close', 'confirm', 'add-new', 'edit'])

const selectedId = ref(props.modelValue)

function onConfirm() {
  emit('confirm', selectedId.value)
  emit('close')
}
function onClose() {
  emit('close')
}
function onEdit(addr) {
  emit('edit', addr)
}
function formatAddress(a) {
  return `${a.addressLine}, ${a.ward}, ${a.district}, ${a.province}`
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 1000;
}
.modal.list {
  width: 540px;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  display: grid;
  grid-template-rows: auto 1fr auto;
}
.modal__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid #eee;
}
.modal__body {
  padding: 16px;
  max-height: 400px;
  overflow-y: auto;
}
.modal__foot {
  padding: 12px 16px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.addr-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.addr-item {
  border-bottom: 1px solid #f3f4f6;
}
.addr-item:last-child {
  border-bottom: none;
}
.row {
  display: flex;
  gap: 10px;
  padding: 10px 4px;
  cursor: pointer;
}
.info {
  flex: 1;
}
.line {
  display: flex;
  align-items: center;
  gap: 6px;
}
.sub {
  color: #6b7280;
}
.tag {
  background: #eef2ff;
  color: #4f46e5;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 12px;
}
.btn {
  height: 40px;
  padding: 0 18px;
  border-radius: 8px;
  border: 1px solid transparent;
  cursor: pointer;
}
.btn.ghost {
  background: #fff;
  border-color: #e5e7eb;
}
.btn.primary {
  background: #ef4444;
  color: #fff;
}
.link {
  color: #2563eb;
  cursor: pointer;
}
.link.small {
  font-size: 12px;
}
</style>
