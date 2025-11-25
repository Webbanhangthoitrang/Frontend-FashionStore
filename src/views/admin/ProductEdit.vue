<!-- src/views/admin/ProductEdit.vue -->
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
      <h1 class="pc-title">Chỉnh sửa sản phẩm</h1>
    </header>

    <!-- MAIN CONTENT -->
    <main class="pc-main">
      <!-- ẢNH -->
      <section class="pc-block pc-block--full">
        <h2 class="pc-block-title">Ảnh</h2>

        <div class="pe-image-row">
          <!-- ẢNH PHỤ -->
          <div class="pe-extra">
            <button type="button" class="pe-add-btn" @click="openExtraPicker">
              <!-- SVG ô thêm ảnh -->
              <svg
                width="150"
                height="150"
                viewBox="0 0 150 150"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="0.5" y="0.5" width="149" height="149" rx="19.5" fill="white" />
                <rect x="0.5" y="0.5" width="149" height="149" rx="19.5" stroke="#666666" />
                <mask
                  id="mask0_2229_1565"
                  style="mask-type:alpha"
                  maskUnits="userSpaceOnUse"
                  x="56"
                  y="56"
                  width="38"
                  height="38"
                >
                  <path
                    d="M56.25 64.25C56.25 60.4788 56.25 58.5931 57.4216 57.4216C58.5931 56.25 60.4788 56.25 64.25 56.25H85.75C89.5212 56.25 91.4069 56.25 92.5784 57.4216C93.75 58.5931 93.75 60.4788 93.75 64.25V85.75C93.75 89.5212 93.75 91.4069 92.5784 92.5784C91.4069 93.75 89.5212 93.75 85.75 93.75H64.25C60.4788 93.75 58.5931 93.75 57.4216 92.5784C56.25 91.4069 56.25 89.5212 56.25 85.75V64.25Z"
                    fill="black"
                  />
                </mask>
                <g mask="url(#mask0_2229_1565)">
                  <path
                    d="M85.7627 48.3604C89.5279 48.1512 91.4108 48.0466 92.6455 49.1514C93.88 50.2562 93.9842 52.1392 94.1934 55.9043L95.7285 83.5215C95.7857 84.5504 94.966 85.416 93.9355 85.416C93.8167 85.4159 93.7022 85.3692 93.6182 85.2852L88.2451 79.9111C86.912 78.5781 86.2452 77.9113 85.417 77.9111C84.5886 77.9111 83.9212 78.5778 82.5879 79.9111L80.6436 81.8555C79.9501 82.5489 79.6035 82.8958 79.1768 82.8867C78.7499 82.8774 78.4177 82.5161 77.7549 81.793L70.3223 73.6846C69.1033 72.3548 68.4938 71.6899 67.7412 71.6104C66.9886 71.5308 66.2085 72.0857 64.6484 73.1953C62.1598 74.9653 58.6754 77.083 56.25 77.083V57.5654C56.25 53.9832 56.25 52.1918 57.3438 51.0352C58.4379 49.8785 60.2281 49.7789 63.8066 49.5801L85.7627 48.3604ZM84.375 62.5C82.6491 62.5 81.25 63.8991 81.25 65.625C81.2502 67.3507 82.6492 68.75 84.375 68.75C86.1008 68.75 87.4998 67.3507 87.5 65.625C87.5 63.8991 86.1009 62.5 84.375 62.5Z"
                    fill="#666666"
                  />
                </g>
                <path
                  d="M75 93.75H89.75C91.9591 93.75 93.75 91.9591 93.75 89.75V60.25C93.75 58.0409 91.9591 56.25 89.75 56.25H60.25C58.0409 56.25 56.25 58.0409 56.25 60.25V75"
                  stroke="#666666"
                  stroke-width="3"
                  stroke-linecap="round"
                />
                <path
                  d="M66.6666 83.334V81.834H68.1666V83.334H66.6666ZM57.3106 94.8113C56.7248 95.3971 55.7751 95.3971 55.1893 94.8113C54.6035 94.2255 54.6035 93.2758 55.1893 92.69L56.25 93.7507L57.3106 94.8113ZM66.6666 93.7507H65.1666V83.334H66.6666H68.1666V93.7507H66.6666ZM66.6666 83.334V84.834H56.25V83.334V81.834H66.6666V83.334ZM66.6666 83.334L67.7273 84.3946L57.3106 94.8113L56.25 93.7507L55.1893 92.69L65.606 82.2733L66.6666 83.334Z"
                  fill="#666666"
                />
              </svg>
            </button>

            <input
              ref="extraInput"
              type="file"
              accept="image/*"
              multiple
              class="pe-extra-input"
              @change="onExtraFilesChange"
            />

            <div class="pe-extra-list" v-if="extraPreviews.length">
              <div
                v-for="(img, index) in extraPreviews"
                :key="index"
                class="pe-extra-thumb"
              >
                <img :src="img" alt="Ảnh phụ" />
                <button
                  type="button"
                  class="pe-remove"
                  @click.stop="removeExtra(index)"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          <!-- ẢNH CHÍNH -->
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
        </div>
      </section>

      <!-- HAI CỘT: THÔNG TIN + DANH MỤC -->
      <section class="pc-grid-2">
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

        <div class="pc-variant-box">
          <!-- CÁC BLOCK BIẾN THỂ 1, 2,... -->
          <div
            v-for="(vForm, idx) in variantForms"
            :key="vForm.id"
            class="pc-variant-row"
          >
            <div class="pc-variant-row-header">
              <span class="pc-label">Biến thể {{ idx + 1 }}</span>

              <button
                v-if="variantForms.length > 1"
                type="button"
                class="pc-variant-remove"
                @click="removeVariantForm(idx)"
                aria-label="Xoá biến thể"
              >
                <svg viewBox="0 0 24 24" class="pc-variant-remove-icon">
                  <circle cx="12" cy="12" r="11" />
                  <rect x="7" y="11" width="10" height="2" rx="1" />
                </svg>
              </button>
            </div>

            <!-- ĐÃ LƯU -->
            <template v-if="vForm.saved">
              <div class="pc-field">
                <div class="pc-input pc-input--readonly">
                  {{ vForm.name }}
                </div>
              </div>

              <div class="pc-field">
                <label class="pc-label">Giá trị biến thể</label>
                <div class="pc-tags">
                  <span v-for="val in vForm.values" :key="val" class="pc-tag">
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

          <!-- BẢNG BIẾN THỂ -->
          <div class="pc-variant-card">
            <div class="pc-variant-top">
              <div class="pc-select-wrap pc-select-small">
                <select v-model="filterVariant" class="pc-select">
                  <option value="">Tất cả biến thể</option>
                  <option v-for="row in variants" :key="row.id" :value="row.id">
                    {{ formatVariantName(row) }}
                  </option>
                </select>
              </div>
            </div>

            <div class="pc-table-wrap">
              <table class="pc-table">
                <thead>
                  <tr>
                    <th class="pc-col-check"></th>
                    <th class="pc-col-name">{{ variantHeaderLabel }}</th>
                    <th class="pc-col-price">Giá vốn</th>
                    <th class="pc-col-price">Giá bán</th>
                    <th class="pc-col-price">Số lượng</th>
                    <th class="pc-col-action"></th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="row in filteredVariantRows" :key="row.localId">
                    <td class="pc-cell-center">
                      <input type="checkbox" class="pc-checkbox" />
                    </td>

                    <td class="pc-cell-name">
                      {{
                        row.color && row.size
                          ? row.color + '/ ' + row.size
                          : (row.color || row.size || 'Biến thể')
                      }}
                    </td>

                    <td>
                      <div class="pc-price-input-wrap">
                        <input
                          v-model.number="row.costPrice"
                          type="text"
                          inputmode="decimal"
                          class="pc-input-sm pc-price-input"
                        />
                        <span class="pc-price-suffix">đ</span>
                      </div>
                    </td>

                    <td>
                      <div class="pc-price-input-wrap">
                        <input
                          v-model.number="row.salePrice"
                          type="number"
                          readonly
                          class="pc-input-sm pc-price-input"
                        />
                      </div>
                    </td>

                    <!-- SỐ LƯỢNG -->
                    <td>
                      <div class="pc-price-input-wrap">
                        <input
                          v-model.number="row.stock"
                          type="number"
                          min="0"
                          class="pc-input-sm pc-price-input"
                        />
                      </div>
                    </td>

                    <td class="pc-cell-center">
                      <button
                        type="button"
                        class="pc-icon-btn"
                        aria-label="Xoá biến thể"
                        @click="removeVariantRow(row.localId)"
                      >
                        <svg
                          width="30"
                          height="30"
                          viewBox="0 0 35 35"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M8.75 7.29232C8.55661 7.29232 8.37115 7.36914 8.2344 7.50589C8.09766 7.64263 8.02083 7.8281 8.02083 8.02148V9.47982C8.02083 9.6722 8.09685 9.85679 8.23233 9.99336C8.36782 10.1299 8.55179 10.2074 8.74417 10.209H26.2558C26.4482 10.2074 26.6322 10.1299 26.7677 9.99336C26.9032 9.85679 26.9792 9.6722 26.9792 9.47982V8.02148C26.9792 7.8281 26.9023 7.64263 26.7656 7.50589C26.6289 7.36914 26.4434 7.29232 26.25 7.29232H8.75Z"
                            fill="#5F5F5F"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>

                  <!-- EMPTY -->
                  <tr v-if="!filteredVariantRows.length">
                    <td colspan="6" class="pc-empty-cell">
                      <div class="pc-empty-inner">
                        <p>Tạo biến thể của bạn</p>
                      </div>
                    </td>
                  </tr>

                  <!-- Footer: Cài đặt giá cho tất cả -->
                  <tr v-if="variants.length">
                    <td></td>
                    <td class="pc-footer-label">Cài đặt giá cho tất cả</td>
                    <td>
                      <div class="pc-price-input-wrap">
                        <input
                          v-model.number="allCost"
                          type="number"
                          min="0"
                          class="pc-input-sm pc-price-input"
                          @input="applyAllCost"
                        />
                        <span class="pc-price-suffix">đ</span>
                      </div>
                    </td>
                    <td>
                      <div class="pc-price-input-wrap">
                        <input
                          v-model.number="allSale"
                          type="text"
                          inputmode="decimal"
                          class="pc-input-sm pc-price-input"
                          @input="applyAllSale"
                        />
                        <span class="pc-price-suffix">đ</span>
                      </div>
                    </td>
                    <td>
                      <div class="pc-price-input-wrap">
                        <input
                          v-model.number="allStock"
                          type="number"
                          min="0"
                          class="pc-input-sm pc-price-input"
                          @input="applyAllStock"
                        />
                      </div>
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <!-- NÚT HÀNH ĐỘNG -->
      <div class="pc-actions">
        <button type="button" class="btn btn--ghost" @click="goBack">
          Trở lại
        </button>
        <button
          type="button"
          class="btn btn--primary"
          :disabled="saving"
          @click="onSubmit"
        >
          <span v-if="!saving">Lưu</span>
          <span v-else>Đang lưu...</span>
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { request, API_BASE_URL } from "../../services/http";

const route = useRoute();
const router = useRouter();
const productId = route.params.id;

/* ========= FORM CƠ BẢN ========= */
const form = ref({
  name: "",
  description: "",
  categoryId: "",
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

/* ========= ẢNH PHỤ ========= */
const extraInput = ref(null);
const extraFiles = ref([]);
const extraPreviews = ref([]);

const openExtraPicker = () => {
  extraInput.value?.click();
};

const onExtraFilesChange = (e) => {
  const files = Array.from(e.target.files || []);
  files.forEach((file) => {
    extraFiles.value.push(file);
    extraPreviews.value.push(URL.createObjectURL(file));
  });
  e.target.value = "";
};

const removeExtra = (index) => {
  extraFiles.value.splice(index, 1);
  extraPreviews.value.splice(index, 1);
};

/* ========= DANH MỤC ========= */
const categories = ref([]);

const fetchCategories = async () => {
  try {
    const res = await request("/categories", { method: "GET" });
    const data = res.data ?? res;
    categories.value = Array.isArray(data) ? data : data.data || data.items || [];
  } catch (err) {
    console.error("Lỗi load categories:", err);
  }
};

/* ========= BIẾN THỂ ========= */
let seed = 1;

/** Form “Biến thể 1 / 2…” ở trên */
const variantForms = ref([
  { id: 1, name: "", valuesText: "", values: [], saved: false },
]);

/** Các dòng trong bảng biến thể */
const variants = ref([]); // { localId, id(backend), color, size, costPrice, salePrice, stock, imageUrl }
const deletedVariantIds = ref([]);
const filterVariant = ref("");
const allCost = ref(null);
const allSale = ref(null);
const allStock = ref(null);

const savedVariantForms = computed(() =>
  variantForms.value.filter((v) => v.saved && v.values.length)
);

const variantHeaderLabel = computed(() => {
  const saved = savedVariantForms.value;
  if (!saved.length) return "Màu / Size";
  if (saved.length === 1) return saved[0].name;
  return saved
    .slice(0, 2)
    .map((v) => v.name)
    .join("/ ");
});

const makeKey = (color, size) => `${color || ""}__${size || ""}`;

const formatVariantName = (row) => {
  if (row.color && row.size) return `${row.color}/ ${row.size}`;
  if (row.color) return row.color;
  if (row.size) return row.size;
  return "Biến thể";
};

/** Dựng form “Màu/Size” từ danh sách variants của backend */
const initVariantFormsFromBackend = (backendVariants) => {
  const colors = new Set();
  const sizes = new Set();

  backendVariants.forEach((v) => {
    if (v.color) colors.add(v.color);
    if (v.size) sizes.add(v.size);
  });

  const forms = [];

  if (colors.size) {
    const values = Array.from(colors);
    forms.push({
      id: 1,
      name: "Màu",
      valuesText: values.join(", "),
      values,
      saved: true,
    });
  }

  if (sizes.size) {
    const values = Array.from(sizes);
    forms.push({
      id: 2,
      name: "Size",
      valuesText: values.join(", "),
      values,
      saved: true,
    });
  }

  if (!forms.length) {
    forms.push({
      id: 1,
      name: "",
      valuesText: "",
      values: [],
      saved: false,
    });
  }

  variantForms.value = forms;
};

/** Khi bấm “Lưu biến thể” → sinh lại bảng từ variantForms */
const rebuildVariantRows = () => {
  const saved = savedVariantForms.value;
  if (!saved.length) {
    variants.value = [];
    return;
  }

  const oldMap = new Map();
  variants.value.forEach((v) => {
    const key = makeKey(v.color, v.size);
    oldMap.set(key, v);
  });

  const first = saved[0];
  const second = saved[1];

  const colors = first?.values || [];
  const sizes = second?.values?.length ? second.values : [null];

  const rows = [];

  colors.forEach((color) => {
    sizes.forEach((size) => {
      const key = makeKey(color, size);
      const existed = oldMap.get(key);

      rows.push({
        localId: existed?.localId ?? seed++,
        id: existed?.id ?? null,
        color,
        size,
        costPrice: existed?.costPrice ?? 0,
        salePrice: existed?.salePrice ?? 0,
        stock: existed?.stock ?? 0,
        imageUrl: existed?.imageUrl ?? null,
      });
    });
  });

  variants.value = rows;
};

/* Thêm / lưu / xoá form biến thể */
const addVariantForm = () => {
  variantForms.value.push({
    id: Date.now() + variantForms.value.length,
    name: "",
    valuesText: "",
    values: [],
    saved: false,
  });
};

const saveVariantForm = (index) => {
  const vForm = variantForms.value[index];
  if (!vForm.name || !vForm.valuesText) return;

  const values = vForm.valuesText
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

  if (!values.length) return;

  vForm.values = values;
  vForm.saved = true;

  rebuildVariantRows();
};

const removeVariantForm = (index) => {
  variantForms.value.splice(index, 1);
  rebuildVariantRows();
};

/* Lọc bảng – hiện đang trả lại toàn bộ */
const filteredVariantRows = computed(() => variants.value);

/* Xoá một dòng variant trong bảng */
const removeVariantRow = (localId) => {
  const row = variants.value.find((r) => r.localId === localId);
  if (row?.id) {
    deletedVariantIds.value.push(row.id);
  }
  variants.value = variants.value.filter((r) => r.localId !== localId);
};

/* Cài giá chung cho tất cả */
const applyAllCost = () => {
  variants.value.forEach((r) => {
    r.costPrice = allCost.value || 0;
  });
};

const applyAllSale = () => {
  variants.value.forEach((r) => {
    r.salePrice = allSale.value || 0;
  });
};

const applyAllStock = () => {
  variants.value.forEach((r) => {
    r.stock = allStock.value || 0;
  });
};

/* ========= LOAD PRODUCT ========= */
const loading = ref(false);

const fetchProduct = async () => {
  loading.value = true;
  try {
    const res = await request(`/products/${productId}`, { method: "GET" });
    const apiData = res.data ?? res;
    const p = apiData.data || apiData;

    form.value.name = p.name ?? "";
    form.value.description = p.description ?? "";
    form.value.categoryId = p.categoryId ?? p.category?.id ?? "";

    const mainImage =
      p.images?.find((img) => img.isPrimary)?.url ||
      p.imageUrl ||
      p.thumbnail ||
      null;

    if (mainImage) {
      imagePreview.value = /^https?:\/\//.test(mainImage)
        ? mainImage
        : `${API_BASE_URL}${mainImage}`;
    }

    const backendVariants = Array.isArray(p.variants) ? p.variants : [];
    variants.value = backendVariants.map((v) => ({
      localId: seed++,
      id: v.id,
      color: v.color,
      size: v.size,
      costPrice: v.costPrice ?? 0,
      salePrice: v.price ?? 0,
      stock: v.stock ?? 0,
      imageUrl: v.imageUrl || null,
    }));

    initVariantFormsFromBackend(backendVariants);
  } catch (err) {
    console.error("Lỗi load product:", err);
    alert(err?.message || "Không tải được thông tin sản phẩm.");
  } finally {
    loading.value = false;
  }
};

/* ========= LƯU LẠI ========= */
const saving = ref(false);

const onSubmit = async () => {
  try {
    saving.value = true;

    // 1. Cập nhật product cơ bản
    const productPayload = {
      name: form.value.name,
      description: form.value.description,
      categoryId: form.value.categoryId || null,
    };

    await request(`/products/${productId}`, {
      method: "PUT",
      data: productPayload,
    });

    // 2. Đồng bộ variants (update/create/delete)
    for (const v of variants.value) {
      const body = {
        color: v.color || null,
        size: v.size || null,
        price: v.salePrice ?? v.price ?? 0,
        stock: v.stock ?? 0,
        imageUrl: v.imageUrl,
      };

      if (v.id) {
        await request(`/products/${productId}/variants/${v.id}`, {
          method: "PUT",
          data: body,
        });
      } else {
        const createdRes = await request(`/products/${productId}/variants`, {
          method: "POST",
          data: body,
        });
        const createdData = createdRes.data ?? createdRes;
        const createdVariant = createdData.data || createdData;
        v.id = createdVariant.id ?? v.id;
      }
    }

    // 3. Xoá những variant đã bị remove
    for (const id of deletedVariantIds.value) {
      await request(`/products/${productId}/variants/${id}`, {
        method: "DELETE",
      });
    }

    alert("Cập nhật sản phẩm thành công!");
    router.push("/admin/products");
  } catch (err) {
    console.error("Lỗi lưu product:", err);
    alert(err?.message || "Cập nhật sản phẩm thất bại.");
  } finally {
    saving.value = false;
  }
};

/* ========= QUAY LẠI ========= */
const goBack = () => {
  router.back();
};

// Watch for changes in costPrice and update salePrice
watch(
  () => variants.value,
  (newVariants) => {
    newVariants.forEach((variant) => {
      if (variant.costPrice) {
        variant.salePrice = Math.round(variant.costPrice * 1.5);
      }
    });
  },
  { deep: true }
);

onMounted(async () => {
  await Promise.all([fetchCategories(), fetchProduct()]);
});
</script>

<style scoped>
/* PAGE */
.pc-page {
  min-height: 100vh;
  background: #f7f7f7;
  padding: 24px 40px 40px;
  box-sizing: border-box;
}

.pc-main {
  width: 1400px;
  margin: 0 auto;
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
  font-weight: 600;
  margin-bottom: 12px;
}

/* UPLOAD */
.pc-upload {
  display: block;
  width: 100%;
  max-width: 180px;
  height: 120px;
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
  align-items: center;
  justify-content: center;
}

.pc-upload-text {
  font-size: 13px;
  font-weight: 500;
  color: #3b82f6;
}

.pc-upload-preview,
.pc-upload-placeholder {
  width: 100%;
  height: 100%;
}

.pc-upload-preview img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* HÀNG ẢNH */
.pe-image-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

/* ẢNH PHỤ */
.pe-extra {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pe-extra-input {
  display: none;
}

.pe-add-btn {
  width: 150px;
  height: 150px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
}

.pe-add-btn svg {
  width: 100%;
  height: 100%;
  display: block;
}

.pe-extra-list {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}

.pe-extra-thumb {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 12px;
  overflow: hidden;
  background: #f5f5f5;
}

.pe-extra-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pe-remove {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  border: none;
  background: #ff4e6a;
  color: #fff;
  font-size: 11px;
  line-height: 18px;
  text-align: center;
  cursor: pointer;
}

/* GRID 2 CỘT */
.pc-grid-2 {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1.3fr);
  gap: 16px;
}

/* FIELD */
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
  font-weight: 600;
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

.pc-input--readonly {
  background: #f9fafb;
  cursor: default;
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

/* ===== BIẾN THỂ BOX ===== */
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
  border-radius: 12px;
}

.pc-variant-top {
  margin-bottom: 8px;
}

/* TABLE */
.pc-table-wrap {
  margin-top: 4px;
  border-radius: 16px;
}

.pc-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
  font-size: 13px;
}

.pc-table thead tr th {
  padding: 8px 16px 10px;
  font-weight: 500;
  color: #4b5563;
  border: none;
  background: transparent;
}

.pc-table thead tr {
  position: relative;
}

.pc-table thead tr::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -4px;
  height: 1px;
  background: #e5e7eb;
}

.pc-table tbody tr td {
  padding: 10px 16px;
  background: #ffffff;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
}

.pc-table tbody tr td:first-child {
  border-left: 1px solid #e5e7eb;
  border-radius: 8px 0 0 8px;
}

.pc-table tbody tr td:last-child {
  border-right: 1px solid #e5e7eb;
  border-radius: 0 8px 8px 0;
}

.pc-col-check {
  width: 44px;
}

.pc-col-name {
  text-align: left;
}

.pc-col-price {
  width: 160px;
}

.pc-col-action {
  width: 40px;
}

.pc-cell-center {
  text-align: center;
}

.pc-cell-name {
  color: #111827;
}

/* checkbox */
.pc-checkbox {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 5px;
  border: 1.5px solid #999999;
  background: #ffffff;
  cursor: pointer;
}

.pc-checkbox:checked {
  background-color: #4f46e5;
  border-color: #4f46e5;
}

/* input giá */
.pc-price-input-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.pc-input-sm {
  width: 120px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  padding: 6px 26px 6px 10px;
  font-size: 13px;
  outline: none;
  box-sizing: border-box;
}

.pc-input-sm:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 1px rgba(79, 70, 229, 0.2);
}

.pc-price-suffix {
  position: absolute;
  right: 10px;
  font-size: 12px;
  color: #6b7280;
}

/* icon nút xoá */
.pc-icon-btn {
  background: transparent;
  border: none;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

/* EMPTY */
.pc-empty-cell {
  text-align: center;
  padding: 24px 16px;
}

.pc-empty-inner {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-size: 13px;
}

/* footer row */
.pc-footer-label {
  font-size: 13px;
  color: #111827;
}

/* NÚT DƯỚI */
.pc-actions {
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn {
  min-width: 96px;
  height: 40px;
  padding: 0 16px;
  border-radius: 8px;
  border: 1px solid transparent;
  font-size: 14px;
  cursor: pointer;
}

.btn--ghost {
  background: #ffffff;
  border-color: #e5e7eb;
}

.btn--primary {
  background: #4f46e5;
  color: #ffffff;
}
</style>
