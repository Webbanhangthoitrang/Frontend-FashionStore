<template>
  <div v-if="open" class="popup-overlay" @click.self="closePopup">
    <div class="popup-box">
      <div class="popup-header">
        <h3>Tạo danh mục mới</h3>
        <button type="button" class="close-btn" @click="closePopup">×</button>
      </div>

      <form @submit.prevent="handleSubmit" class="popup-body">
        <!-- Tên danh mục -->
        <div class="form-group">
          <label for="categoryName">Tên danh mục <span class="required">*</span></label>
          <input
            id="categoryName"
            v-model.trim="form.name"
            type="text"
            placeholder="VD: Áo thun, Váy..."
            class="form-input"
            required
          />
        </div>

        <!-- Mô tả -->
        <div class="form-group">
          <label for="categoryDesc">Mô tả</label>
          <textarea
            id="categoryDesc"
            v-model.trim="form.description"
            placeholder="Mô tả ngắn về danh mục..."
            class="form-textarea"
            rows="3"
          ></textarea>
        </div>

        <!-- Danh mục cha (tùy chọn) -->
        <div class="form-group">
          <label for="parentCategory">Danh mục cha (tùy chọn)</label>
          <select
            id="parentCategory"
            v-model="form.parentId"
            class="form-select"
          >
            <option :value="null">-- Không có --</option>
            <option
              v-for="cat in categories"
              :key="cat.id"
              :value="cat.id"
            >
              {{ cat.name }}
            </option>
          </select>
        </div>

        <!-- Trạng thái -->
        <div class="form-group">
          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="form.isActive"
            />
            <span>Kích hoạt</span>
          </label>
        </div>

        <!-- Danh mục chính -->
        <div class="form-group">
          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="form.isPrimary"
            />
            <span>Đánh dấu là danh mục chính</span>
          </label>
        </div>

        <!-- Error message -->
        <p v-if="error" class="error-msg">{{ error }}</p>

        <!-- Actions -->
        <div class="popup-footer">
          <button
            type="button"
            class="btn btn-secondary"
            @click="closePopup"
            :disabled="loading"
          >
            Hủy
          </button>
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="loading || !form.name"
          >
            {{ loading ? 'Đang tạo...' : 'Tạo danh mục' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { createCategory } from '../../services/categoryService'

const props = defineProps({
  open: { type: Boolean, default: false },
  categories: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:open', 'created'])

const form = ref({
  name: '',
  description: '',
  parentId: null,
  isActive: true,
  isPrimary: false,
  sortOrder: 0
})

const loading = ref(false)
const error = ref('')

// Reset form khi mở popup
watch(() => props.open, (newVal) => {
  if (newVal) {
    form.value = {
      name: '',
      description: '',
      parentId: null,
      isActive: true,
      isPrimary: false,
      sortOrder: 0
    }
    error.value = ''
  }
})

function closePopup() {
  emit('update:open', false)
}

async function handleSubmit() {
  if (!form.value.name) {
    error.value = 'Vui lòng nhập tên danh mục'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const payload = {
      name: form.value.name,
      description: form.value.description || null,
      parentId: form.value.parentId || null,
      isActive: form.value.isActive,
      isPrimary: form.value.isPrimary,
      sortOrder: form.value.sortOrder || 0
    }

    const result = await createCategory(payload)
    
    emit('created', result)
    closePopup()
  } catch (err) {
    console.error('Create category error:', err)
    error.value = err?.response?.data?.message || err?.message || 'Tạo danh mục thất bại'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.popup-box {
  background: #fff;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.popup-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #111827;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 32px;
  line-height: 1;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: background 0.2s;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #111827;
}

.popup-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

.required {
  color: #ef4444;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  color: #111827;
  background: #fff;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #4c80e6;
  box-shadow: 0 0 0 3px rgba(76, 128, 230, 0.1);
}

.form-textarea {
  resize: vertical;
  font-family: inherit;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.checkbox-label span {
  font-size: 14px;
  color: #374151;
}

.error-msg {
  color: #ef4444;
  font-size: 14px;
  margin: 16px 0 0;
  padding: 10px 12px;
  background: #fef2f2;
  border-radius: 6px;
  border: 1px solid #fecaca;
}

.popup-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover:not(:disabled) {
  background: #e5e7eb;
}

.btn-primary {
  background: #4c80e6;
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  background: #3b6fd4;
}
</style>
