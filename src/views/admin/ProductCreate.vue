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

    <!-- MAIN CONTENT -->
    <main class="pc-main">
      <!-- ẢNH -->
      <section class="pc-block pc-block--full">
        <h2 class="pc-block-title">Ảnh</h2>

        <label class="pc-upload">
          <input
            type="file"
            accept="image/*"
            class="pc-upload-input"
            @change="onFileChange"
          />

          <!-- Có ảnh -->
          <div v-if="imagePreview" class="pc-upload-preview">
            <img :src="imagePreview" alt="Ảnh sản phẩm" />
          </div>

          <!-- Placeholder -->
          <div v-else class="pc-upload-placeholder">
            <div class="pc-upload-icon">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_2324_1188" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="10" y="10" width="60" height="60">
                <path d="M10 18C10 14.2288 10 12.3431 11.1716 11.1716C12.3431 10 14.2288 10 18 10H62C65.7712 10 67.6569 10 68.8284 11.1716C70 12.3431 70 14.2288 70 18V62C70 65.7712 70 67.6569 68.8284 68.8284C67.6569 70 65.7712 70 62 70H18C14.2288 70 12.3431 70 11.1716 68.8284C10 67.6569 10 65.7712 10 62V18Z" fill="black"/>
                </mask>
                <g mask="url(#mask0_2324_1188)">
                <path d="M62.0127 -2.88965C65.7779 -3.09883 67.6608 -3.20338 68.8955 -2.09863C70.13 -0.993815 70.2342 0.889167 70.4434 4.6543L73.165 53.6348C73.2565 55.2808 71.9464 56.6658 70.2979 56.666C70.1075 56.666 69.9247 56.5906 69.79 56.4561L59.4951 46.1611C58.1621 44.8281 57.4952 44.1613 56.667 44.1611C55.8386 44.1611 55.1712 44.8278 53.8379 46.1611L48.1436 51.8564C47.4503 52.5497 47.1034 52.8958 46.6768 52.8867C46.2499 52.8774 45.9177 52.5161 45.2549 51.793L30.9473 36.1846C29.7192 34.8449 29.1051 34.1747 28.335 34.1045C27.5647 34.0344 26.8122 34.6027 25.3086 35.7393C21.394 38.6982 14.5385 43.333 10 43.333V7.55859C10 3.98093 9.99997 2.19183 11.0938 1.03516C12.1879 -0.121504 13.9781 -0.221112 17.5566 -0.419922L62.0127 -2.88965ZM55 20C52.2386 20 50 22.2386 50 25C50.0002 27.7613 52.2387 30 55 30C57.7613 30 59.9998 27.7613 60 25C60 22.2386 57.7614 20 55 20Z" fill="#666666"/>
                </g>
                <path d="M40 70H66C68.2091 70 70 68.2091 70 66V14C70 11.7909 68.2091 10 66 10H14C11.7909 10 10 11.7909 10 14V40" stroke="#666666" stroke-width="3" stroke-linecap="round"/>
                <path d="M26.6666 53.333V51.833H28.1666V53.333H26.6666ZM11.0606 71.0603C10.4748 71.6461 9.52508 71.6461 8.9393 71.0603C8.35351 70.4746 8.35351 69.5248 8.9393 68.939L9.99996 69.9997L11.0606 71.0603ZM26.6666 69.9997H25.1666V53.333H26.6666H28.1666V69.9997H26.6666ZM26.6666 53.333V54.833H9.99996V53.333V51.833H26.6666V53.333ZM26.6666 53.333L27.7273 54.3937L11.0606 71.0603L9.99996 69.9997L8.9393 68.939L25.606 52.2723L26.6666 53.333Z" fill="#666666"/>
            </svg>

            </div>
            <span class="pc-upload-text">Tải ảnh lên</span>
          </div>
        </label>
      </section>

      <!-- HAI CỘT: THÔNG TIN + DANH MỤC -->
      <section class="pc-grid-2">
        <!-- THÔNG TIN SẢN PHẨM -->
        <div class="pc-block">
          <h2 class="pc-block-title">Thông tin sản phẩm</h2>
        <div class="pc-info-box">
            <div class="pc-field">
              <label class="pc-label">Tên sản phẩm</label>
              <input
                v-model.trim="form.name"
                type="text"
                class="pc-input"
                placeholder="Tên sản phẩm..."
              />
            </div>

            <div class="pc-field">
              <label class="pc-label">Mô tả</label>
              <textarea
                v-model.trim="form.description"
                rows="4"
                class="pc-textarea"
                placeholder="Mô tả chi tiết sản phẩm..."
              ></textarea>
            </div>
          </div>
        </div>
        <!-- THÊM VÀO DANH MỤC -->
        <div class="pc-block">
          <h2 class="pc-block-title">Thêm vào danh mục</h2>

          <div class="pc-field">
            <label class="pc-label sr-only">Danh mục</label>
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

      <!-- BIẾN THỂ -->
      <section class="pc-block">
        <h2 class="pc-block-title">Biến thể</h2>

        <!-- DÒNG INPUT BIẾN THỂ -->
        <div class="pc-variant-box">
        <div class="pc-variant-row">
          <div class="pc-field">
            <label class="pc-label">Biến thể 1</label>
            <input
              v-model.trim="variantName"
              type="text"
              class="pc-input"
              placeholder='VD: "Size"'
            />
          </div>

          <div class="pc-field">
            <label class="pc-label">Giá trị biến thể</label>
            <input
              v-model.trim="variantValuesText"
              type="text"
              class="pc-input"
              placeholder='VD: "S"'
            />
        
          </div>
        </div>

        <button type="button" class="pc-link-add" @click="addVariants">
          + Thêm biến thể
        </button>

        <!-- BẢNG BIẾN THỂ -->
        <div class="pc-variant-card">
          <!-- Dropdown: Tất cả biến thể -->
          <div class="pc-variant-top">
            <div class="pc-select-wrap pc-select-small">
              <select v-model="filterVariant" class="pc-select">
                <option value="">Tất cả biến thể</option>
                <option v-for="v in variants" :key="v.id" :value="v.id">
                  {{ v.name }}
                </option>
              </select>
            
            </div>
          </div>

          <!-- TABLE -->
          <div class="pc-table-wrap">
            <table class="pc-table">
              <thead>
                <tr>
                  <th>Biến thể</th>
                  <th>Giá vốn</th>
                  <th>Giá bán</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in filteredVariantRows" :key="row.id">
                  <td>{{ row.name }}</td>
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
                </tr>

                <!-- EMPTY STATE -->
                <tr v-if="!filteredVariantRows.length">
                  <td colspan="3" class="pc-empty-cell">
                    <div class="pc-empty-inner">
                      <div class="pc-empty-icon">
                        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.6666 24.834C16.6666 22.9484 16.6666 22.0056 17.2524 21.4198C17.8382 20.834 18.781 20.834 20.6666 20.834H31.639C32.4482 20.834 32.8528 20.834 33.1325 21.071C33.4123 21.3079 33.4788 21.707 33.6118 22.5052L35.1381 31.6628C35.2711 32.4609 35.3376 32.86 35.6174 33.097C35.8971 33.334 36.3017 33.334 37.1109 33.334H62.889C63.6982 33.334 64.1028 33.334 64.3825 33.097C64.6623 32.86 64.7288 32.4609 64.8618 31.6628L66.3881 22.5052C66.5211 21.707 66.5876 21.3079 66.8674 21.071C67.1471 20.834 67.5517 20.834 68.3609 20.834H79.3333C81.2189 20.834 82.1617 20.834 82.7475 21.4198C83.3333 22.0056 83.3333 22.9484 83.3333 24.834V83.5007C83.3333 85.3863 83.3333 86.3291 82.7475 86.9149C82.1617 87.5006 81.2189 87.5006 79.3333 87.5006H20.6666C18.781 87.5006 17.8382 87.5006 17.2524 86.9149C16.6666 86.3291 16.6666 85.3863 16.6666 83.5006V24.834Z" fill="#7E869E" fill-opacity="0.25"/>
                        <rect x="16.6666" y="20.834" width="66.6667" height="66.6667" rx="5" stroke="#7E7E7E" stroke-width="3"/>
                        <path d="M66.6666 8.33398L66.6666 23.334C66.6666 28.048 66.6666 30.405 65.2022 31.8695C63.7377 33.334 61.3807 33.334 56.6666 33.334L43.3333 33.334C38.6193 33.334 36.2622 33.334 34.7978 31.8695C33.3333 30.405 33.3333 28.048 33.3333 23.334L33.3333 8.33401" stroke="#7E7E7E" stroke-width="3" stroke-linecap="round"/>
                        <path d="M37.5 58.334L62.5 58.334" stroke="#7E7E7E" stroke-width="3" stroke-linecap="round"/>
                        </svg>

                      </div>
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
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { request } from "../../services/http"; 

const router = useRouter();

/* ========= FORM CƠ BẢN ========= */
const form = ref({
  name: "",
  description: "",
  categoryId: "",
});

/* ========= ẢNH ========== */
const imagePreview = ref("");

const onFileChange = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  imagePreview.value = URL.createObjectURL(file);
};

/* ========= DANH MỤC (GỌI API) ========= */
const categories = ref([]);
const loadingCategories = ref(false);
const categoryError = ref("");

const fetchCategories = async () => {
  loadingCategories.value = true;
  categoryError.value = "";
  try {
    // baseURL đã có /api trong http.js rồi, nên chỉ cần "/categories"
    const res = await request("/categories", { method: "GET" });
    // http.js trả về { data, raw }
    categories.value = Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error("Lỗi load categories:", err);
    categoryError.value =
      err?.message || "Không thể tải danh mục. Vui lòng thử lại.";
  } finally {
    loadingCategories.value = false;
  }
};

onMounted(() => {
  fetchCategories();
});

/* ========= BIẾN THỂ ========= */
let seed = 1;
const variants = ref([]);
const variantName = ref("Size");
const variantValuesText = ref("");
const filterVariant = ref("");

const addVariants = () => {
  const name = variantName.value.trim();
  const values = variantValuesText.value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

  if (!name || !values.length) return;

  values.forEach((val) => {
    variants.value.push({
      id: seed++,
      name: `${name}: ${val}`,
      costPrice: 0,
      salePrice: 0,
    });
  });

  variantValuesText.value = "";
};

const filteredVariantRows = computed(() => {
  if (!filterVariant.value) return variants.value;
  return variants.value.filter((v) => v.id === filterVariant.value);
});

/* ========= QUAY LẠI ========= */
const goBack = () => {
  try {
    router.back();
  } catch (e) {
    console.warn("Không thể back router:", e);
  }
};
</script>


<style scoped>
/* PAGE */
.pc-main {
width: 1400px;        

}
.pc-page {
  min-height: 100vh;
  background: #f7f7f7;
  padding: 24px 40px 40px;
  box-sizing: border-box;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text",
    "Segoe UI", sans-serif;
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

}

.pc-block-title {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 12px;
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

.pc-upload-placeholder {
  height: 100%;
  display: flex;
  flex-direction: row;
  gap: 6px;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  margin-top: 50px;
}

.pc-upload-icon svg {
  width: 40px;
  height: 40px;
}

.pc-upload-text {
  font-size: 13px;
  font-weight: 500;
  color: #3b82f6;
}

.pc-upload-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* GRID 2 CỘT */
.pc-grid-2 {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1.3fr);
  gap: 16px;
  
}

/* FIELD */
.pc-info-box {
  border: 1px solid #E5E7EB;
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

.pc-hint {
  margin-top: 4px;
  font-size: 11px;
  color: #9ca3af;
}

/* SELECT CUSTOM */
.pc-select-wrap {
  position: relative;
  width: 200px;
}

.pc-select {
  padding-right: 28px;
}



.pc-select-small .pc-select {
  height: 34px;
  padding-top: 6px;
  padding-bottom: 6px;
}

/* BIẾN THỂ */
.pc-variant-box {
  border: 1px solid #E5E7EB;
  border-radius: 16px;
  padding: 16px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.pc-variant-row {
  display: flex;
  flex-direction: column;  
  gap: 16px;
  margin-bottom: 6px;
}

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
  border: 1px solid #E5E7EB;
  border-radius: 16px;
}

.pc-table thead {
  background: #ffffff;
  border: 1px solid #e5e7eb;
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

.pc-input-sm {
  height: 32px;
  font-size: 12px;
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
  margin-left: 400px;
  gap: 6px;
  font-size: 13px;
  color: #6b7280;
}

.pc-empty-icon svg {
  width: 40px;
  height: 40px;
}


</style>
