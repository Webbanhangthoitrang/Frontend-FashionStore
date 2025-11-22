<!-- src/views/admin/ProductCreate.vue -->
<template>
  <div class="pc-page">
    <!-- HEADER -->
    <header class="pc-header">
      <button class="pc-back-btn" type="button" @click="goBack">
        <svg viewBox="0 0 20 20" class="pc-back-icon" aria-hidden="true">
          <path
            d="M12.5 4.16602L7.5 9.16602L12.5 14.166"
            fill="none"
            stroke="#111827"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <h1 class="pc-title">Tạo Sản Phẩm</h1>
    </header>

    <main class="pc-main">
      <!-- ============ ẢNH ============ -->
      <section class="pc-block pc-block--full">
        <h2 class="pc-block-title">Ảnh</h2>

        <label class="pc-upload">
          <input
            type="file"
            accept="image/*"
            class="pc-upload-input"
            @change="onFileChange"
          />

          <div v-if="imagePreview" class="pc-upload-preview">
            <img :src="imagePreview" alt="Ảnh sản phẩm" />
          </div>

          <div v-else class="pc-upload-placeholder">
            <span class="pc-upload-text">Tải ảnh lên</span>
          </div>
        </label>
      </section>

      <!-- ============ GRID 2 CỘT ============ -->
      <section class="pc-grid-2">
        <!-- THÔNG TIN -->
        <div class="pc-block">
          <h2 class="pc-block-title">Thông tin sản phẩm</h2>

          <div class="pc-info-box">
            <div class="pc-field">
              <label class="pc-label">Tên sản phẩm</label>
              <input
                v-model="form.name"
                type="text"
                class="pc-input"
                placeholder="Tên sản phẩm..."
              />
            </div>

            <div class="pc-field">
              <label class="pc-label">Mô tả</label>
              <textarea
                v-model="form.description"
                rows="4"
                class="pc-textarea"
                placeholder="Mô tả chi tiết sản phẩm..."
              ></textarea>
            </div>

            <!-- 👇 THÊM GIÁ SẢN PHẨM -->
            <div class="pc-field">
              <label class="pc-label">Giá sản phẩm</label>
              <input
                v-model.number="form.price"
                type="number"
                min="0"
                class="pc-input"
                placeholder="VD: 120000"
              />
            </div>
          </div>
        </div>

        <!-- DANH MỤC -->
        <div class="pc-block">
          <h2 class="pc-block-title">Thêm vào danh mục</h2>

          <div class="pc-field">
            <div class="pc-select-wrap">
              <select v-model="form.categoryId" class="pc-select">
                <option disabled value="">Chọn danh mục</option>
                <option v-for="c in categories" :key="c.id" :value="c.id">
                  {{ c.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <!-- ============ BIẾN THỂ ============ -->
      <section class="pc-block">
        <h2 class="pc-block-title">Biến thể</h2>

        <div class="pc-variant-box">
          <!-- CÁC BLOCK BIẾN THỂ 1, 2, ... -->
          <div
            v-for="(vForm, idx) in variantForms"
            :key="vForm.id"
            class="pc-variant-row"
          >
            <div class="pc-variant-row-header">
              <span class="pc-label">Biến thể {{ idx + 1 }}</span>

              <!-- icon xoá khi có >= 2 biến thể -->
              <button
                v-if="variantForms.length > 1"
                type="button"
                class="pc-variant-remove"
                @click="removeVariantForm(idx)"
                aria-label="Xóa biến thể"
              >
                <svg viewBox="0 0 24 24" class="pc-variant-remove-icon">
                  <circle cx="12" cy="12" r="11" />
                  <rect x="7" y="11" width="10" height="2" rx="1" />
                </svg>
              </button>
            </div>

            <!-- ĐÃ LƯU (readonly + chip) -->
            <template v-if="vForm.saved">
              <div class="pc-field">
                <div class="pc-input pc-input--readonly">
                  {{ vForm.name }}
                </div>
              </div>

              <div class="pc-field">
                <label class="pc-label">Giá trị biến thể</label>
                <div class="pc-tags">
                  <span
                    v-for="val in vForm.values"
                    :key="val"
                    class="pc-tag"
                  >
                    {{ val }}
                  </span>
                </div>
              </div>
            </template>

            <!-- ĐANG NHẬP -->
            <template v-else>
              <div class="pc-field">
                <input
                  v-model="vForm.name"
                  type="text"
                  class="pc-input"
                  placeholder='VD: "Màu"'
                />
              </div>

              <div class="pc-field">
                <label class="pc-label">Giá trị biến thể</label>
                <input
                  v-model="vForm.valuesText"
                  type="text"
                  class="pc-input"
                  placeholder='VD: "Hồng, Trắng"'
                />
                <p class="pc-hint">
                  Nhập nhiều giá trị, cách nhau bằng dấu phẩy.
                </p>
              </div>

              <button
                type="button"
                class="pc-variant-save"
                @click="saveVariantForm(idx)"
              >
                Lưu biến thể
              </button>
            </template>
          </div>

          <!-- Thêm biến thể -->
          <button type="button" class="pc-link-add" @click="addVariantForm">
            + Thêm biến thể
          </button>

          <!-- BẢNG BIẾN THỂ (tổ hợp như Figma) -->
          <div class="pc-variant-card">
            <div class="pc-variant-top">
              <div class="pc-select-wrap pc-select-small">
                <select class="pc-select">
                  <option>Tất cả biến thể</option>
                </select>
              </div>
            </div>

            <div class="pc-table-wrap">
              <table class="pc-table">
                <thead>
                  <tr>
                    <th class="pc-col-checkbox"></th>
                    <th>{{ variantHeaderLabel }}</th>
                    <th>Giá vốn</th>
                    <th>Giá bán</th>
                    <th class="pc-col-trash"></th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="row in variants" :key="row.id">
                    <td>
                      <input type="checkbox" class="pc-checkbox" />
                    </td>
                    <td>
                      {{
                        row.color && row.size
                          ? row.color + '/ ' + row.size
                          : (row.color || row.size || 'Biến thể')
                      }}
                    </td>
                    <td>
                      <input
                        v-model.number="row.costPrice"
                        type="number"
                        min="0"
                        class="pc-input pc-input-sm"
                      />
                    </td>
                    <td>
                      <input
                        v-model.number="row.salePrice"
                        type="number"
                        min="0"
                        class="pc-input pc-input-sm"
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        class="pc-trash-btn"
                        @click="removeVariantRow(row.id)"
                      >
                        <!-- icon thùng rác -->
                      </button>
                    </td>
                  </tr>

                  <!-- CÀI ĐẶT GIÁ CHO TẤT CẢ -->
                  <tr v-if="variants.length">
                    <td></td>
                    <td class="pc-all-label">Cài đặt giá cho tất cả</td>
                    <td>
                      <input
                        v-model.number="allCost"
                        type="number"
                        min="0"
                        class="pc-input pc-input-sm"
                        @input="applyAllCost"
                      />
                    </td>
                    <td>
                      <input
                        v-model.number="allSale"
                        type="number"
                        min="0"
                        class="pc-input pc-input-sm"
                        @input="applyAllSale"
                      />
                    </td>
                    <td></td>
                  </tr>

                  <!-- EMPTY -->
                  <tr v-if="!variants.length">
                    <td colspan="5" class="pc-empty-cell">
                      <div class="pc-empty-inner">
                        <p>Tạo biến thể của bạn</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <!-- ============ FOOTER ACTIONS ============ -->
      <div class="pc-footer-actions">
        <button type="button" class="pc-primary-btn" @click="handleCreate">
          Lưu sản phẩm
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { request } from "../../services/http";

const router = useRouter();

/* ========= FORM SẢN PHẨM ========= */
const form = ref({
  name: "",
  description: "",
  categoryId: "",
  price: null,
});

/* ========= ẢNH ========= */
const imagePreview = ref("");
const imageFile = ref(null);

const onFileChange = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  imageFile.value = file;
  imagePreview.value = URL.createObjectURL(file);
};

/* ========= DANH MỤC ========= */
const categories = ref([]);

const fetchCategories = async () => {
  const res = await request("/categories", { method: "GET" });
  categories.value = Array.isArray(res.data) ? res.data : [];
};

onMounted(fetchCategories);

/* ========= BIẾN THỂ ========= */
// Các nhóm biến thể: ví dụ [ {name: "Màu", values:["Đen","Trắng"]}, ... ]
const variantForms = ref([
  { id: 1, name: "", valuesText: "", values: [], saved: false },
]);

// Danh sách tổ hợp biến thể sau khi build
const variants = ref([]);
let seed = 1;

const allCost = ref(null);
const allSale = ref(null);

const savedVariantForms = computed(() =>
  variantForms.value.filter((v) => v.saved && v.values.length)
);

const variantHeaderLabel = computed(() => {
  const saved = savedVariantForms.value;
  if (!saved.length) return "Biến thể";
  if (saved.length === 1) return saved[0].name;
  return saved.slice(0, 2).map((v) => v.name).join(" / ");
});

/* ========= BUILD COMBO BIẾN THỂ ========= */
const rebuildVariantRows = () => {
  const saved = savedVariantForms.value;
  const rows = [];

  if (!saved.length) {
    variants.value = rows;
    return;
  }

  const first = saved[0];   // Màu
  const second = saved[1];  // Size (nếu có)

  if (!second) {
    first.values.forEach((color) => {
      rows.push({
        id: seed++,
        color,
        size: null,
        costPrice: 0,
        salePrice: 0,
      });
    });
  } else {
    first.values.forEach((color) => {
      second.values.forEach((size) => {
        rows.push({
          id: seed++,
          color,
          size,
          costPrice: 0,
          salePrice: 0,
        });
      });
    });
  }

  variants.value = rows;
};

const addVariantForm = () => {
  variantForms.value.push({
    id: Date.now(),
    name: "",
    valuesText: "",
    values: [],
    saved: false,
  });
};

const saveVariantForm = (index) => {
  const vForm = variantForms.value[index];

  if (!vForm.name || !vForm.valuesText) {
    alert("Tên biến thể và giá trị không được để trống.");
    return;
  }

  const values = vForm.valuesText
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

  if (!values.length) {
    alert("Giá trị biến thể không hợp lệ.");
    return;
  }

  vForm.values = values;
  vForm.saved = true;

  rebuildVariantRows();
};

const removeVariantForm = (index) => {
  variantForms.value.splice(index, 1);
  rebuildVariantRows();
};

const removeVariantRow = (id) => {
  variants.value = variants.value.filter((r) => r.id !== id);
};

const applyAllCost = () => {
  variants.value.forEach((r) => (r.costPrice = allCost.value || 0));
};

const applyAllSale = () => {
  variants.value.forEach((r) => (r.salePrice = allSale.value || 0));
};

/* ========= UPLOAD ẢNH ========= */
const uploadProductImage = async () => {
  if (!imageFile.value) return null;

  const formData = new FormData();
  formData.append("image", imageFile.value);

  const { data } = await request("/uploads/product-image", {
    method: "POST",
    data: formData,
  });

  return data?.url || null;
};

/* ========= TỰ ĐỘNG LƯU BIẾN THỂ ========= */
const normalizeVariantFormsBeforeSubmit = () => {
  if (variants.value.length) return;

  variantForms.value.forEach((f) => {
    if (f.name && f.valuesText && !f.saved) {
      const values = f.valuesText
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);

      if (values.length) {
        f.values = values;
        f.saved = true;
      }
    }
  });

  rebuildVariantRows();
};

/* ========= HANDLE CREATE ========= */
const handleCreate = async () => {
  if (!form.value.name || !form.value.categoryId) {
    alert("Vui lòng nhập tên sản phẩm và chọn danh mục");
    return;
  }

  if (form.value.price == null || form.value.price === "") {
    alert("Vui lòng nhập giá sản phẩm");
    return;
  }

  // Tự động build variants
  normalizeVariantFormsBeforeSubmit();

  // CHỈ lấy biến thể hợp lệ
  const validVariantRows = variants.value.filter(
    (v) => v.color || v.size
  );

  if (!validVariantRows.length) {
    alert("Vui lòng tạo Màu / Size và bấm Lưu biến thể");
    return;
  }

  // Upload ảnh
  let imageUrl = null;
  try {
    imageUrl = await uploadProductImage();
  } catch (err) {
    alert("Upload ảnh thất bại, vui lòng thử lại");
    return;
  }

  // Payload
  const payload = {
    name: form.value.name.trim(),
    description: form.value.description.trim(),
    categoryId: form.value.categoryId,
    price: form.value.price,
    variants: validVariantRows.map((v, idx) => ({
      color: v.color,
      size: v.size,
      price: v.salePrice ?? form.value.price,
      stock: 0,
      imageUrl: imageUrl,
    })),
  };

  if (imageUrl) payload.imageUrl = imageUrl;

  try {
    console.log("CREATE PRODUCT PAYLOAD:", payload);

    const res = await request("/products", {
      method: "POST",
      data: payload,
    });

    console.log("CREATE PRODUCT RESPONSE:", res);
    alert("Tạo sản phẩm thành công!");
    router.push("/admin/products");
  } catch (err) {
    console.error(err);
    alert("Có lỗi xảy ra khi tạo sản phẩm!");
  }
};

/* ========= BACK ========= */
const goBack = () => router.back();
</script>

<style scoped>
/* PAGE & LAYOUT */
.pc-page {
  min-height: 100vh;
  background: #f7f7f7;
  padding: 24px 40px 40px;
  box-sizing: border-box;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text",
    "Segoe UI", sans-serif;
}

.pc-main {
  width: 1400px;
}

/* HEADER */
.pc-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.pc-back-btn {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: none;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.pc-back-btn:hover {
  background: #e5e7eb;
}

.pc-back-icon {
  width: 18px;
  height: 18px;
}

.pc-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
}

/* BLOCK CHUNG */
.pc-block,
.pc-block--full {
  border-radius: 12px;
  padding: 16px 18px 20px;
  box-sizing: border-box;
  margin-bottom: 18px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
}

.pc-block-title {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #111827;
}

/* UPLOAD */
.pc-upload {
  display: block;
  width: 100%;
  min-height: 140px;
  border-radius: 10px;
  border: 1px dashed #e5e7eb;
  background-color: #ffffff;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.pc-upload-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.pc-upload-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pc-upload-placeholder {
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pc-upload-text {
  font-size: 13px;
  font-weight: 500;
  color: #3b82f6;
}

/* GRID 2 CỘT */
.pc-grid-2 {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1.3fr);
  gap: 16px;
}

/* FIELD CƠ BẢN */
.pc-info-box {
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 16px;
  background: #ffffff;
}

.pc-field {
  margin-bottom: 12px;
}

.pc-label {
  display: block;
  font-size: 12px;
  margin-bottom: 6px;
  color: #111827;
}

.pc-input,
.pc-textarea,
.pc-select {
  width: 100%;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  padding: 9px 11px;
  font-size: 13px;
  color: #111827;
  background: #ffffff;
  outline: none;
  box-sizing: border-box;
}

.pc-textarea {
  resize: vertical;
  min-height: 88px;
}

.pc-input::placeholder,
.pc-textarea::placeholder {
  color: #9ca3af;
}

.pc-input:focus,
.pc-textarea:focus,
.pc-select:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.12);
}

.pc-input--readonly {
  background: #f9fafb;
  color: #111827;
  border-color: #e5e7eb;
}

.pc-hint {
  margin-top: 4px;
  font-size: 11px;
  color: #9ca3af;
}

/* SELECT */
.pc-select-wrap {
  position: relative;
  width: 220px;
}

.pc-select {
  padding-right: 28px;
}

.pc-select-small .pc-select {
  height: 34px;
  padding-top: 6px;
  padding-bottom: 6px;
}

/* BIẾN THỂ BOX */
.pc-variant-box {
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  padding: 16px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.pc-variant-row {
  padding-bottom: 12px;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pc-variant-row:last-of-type {
  border-bottom: none;
}

.pc-variant-row-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* NÚT LƯU BIẾN THỂ */
.pc-variant-save {
  align-self: flex-start;
  margin-top: 2px;
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 999px;
  border: none;
  background: #111827;
  color: #ffffff;
  cursor: pointer;
}

.pc-variant-save:hover {
  background: #000000;
}

/* NÚT XÓA BIẾN THỂ */
.pc-variant-remove {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: none;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.pc-variant-remove-icon {
  width: 22px;
  height: 22px;
}

.pc-variant-remove-icon circle {
  fill: #f97373;
}

.pc-variant-remove-icon rect {
  fill: #ffffff;
}

/* LINK THÊM BIẾN THỂ */
.pc-link-add {
  margin-top: 4px;
  margin-bottom: 8px;
  border: none;
  background: transparent;
  font-size: 12px;
  font-weight: 500;
  color: #4f46e5;
  cursor: pointer;
  text-align: left;
}

.pc-link-add:hover {
  text-decoration: underline;
}

/* CHIP GIÁ TRỊ BIẾN THỂ */
.pc-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.pc-tag {
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  font-size: 12px;
}

/* CARD BẢNG BIẾN THỂ */
.pc-variant-card {
  background: #ffffff;
  padding: 10px 12px 12px;
  box-sizing: border-box;
}

.pc-variant-top {
  margin-bottom: 8px;
}

/* TABLE */
.pc-table-wrap {
  border-radius: 8px;
  overflow: hidden;
  background: #ffffff;
}

.pc-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
}

.pc-table thead {
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.pc-table th,
.pc-table td {
  padding: 8px 12px;
  text-align: left;
}

.pc-table th {
  font-weight: 500;
  color: #4b5563;
}

.pc-col-checkbox {
  width: 36px;
}

.pc-col-trash {
  width: 40px;
}

.pc-checkbox {
  width: 14px;
  height: 14px;
}

/* Input nhỏ trong bảng */
.pc-input-sm {
  height: 32px;
  font-size: 12px;
}

/* Nút thùng rác trong bảng */
.pc-trash-btn {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  border: none;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.pc-trash-icon {
  width: 16px;
  height: 16px;
  color: #9ca3af;
}

.pc-trash-btn:hover .pc-trash-icon {
  color: #ef4444;
}

/* DÒNG CÀI ĐẶT GIÁ CHUNG */
.pc-all-label {
  font-size: 13px;
  font-weight: 500;
}

/* EMPTY STATE */
.pc-empty-cell {
  text-align: center;
  padding: 24px 12px;
  background: #ffffff;
}

.pc-empty-inner {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #6b7280;
}

/* FOOTER ACTIONS */
.pc-footer-actions {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}

.pc-primary-btn {
  padding: 8px 18px;
  border-radius: 999px;
  border: none;
  background: #111827;
  color: #ffffff;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}

.pc-primary-btn:hover {
  background: #000000;
}
</style>
