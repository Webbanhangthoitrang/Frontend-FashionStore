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
              <div class="pc-upload-icon">
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 80 80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask
                    id="mask0_edit"
                    style="mask-type:alpha"
                    maskUnits="userSpaceOnUse"
                    x="10"
                    y="10"
                    width="60"
                    height="60"
                  >
                    <path
                      d="M10 18C10 14.2288 10 12.3431 11.1716 11.1716C12.3431 10 14.2288 10 18 10H62C65.7712 10 67.6569 10 68.8284 11.1716C70 12.3431 70 14.2288 70 18V62C70 65.7712 70 67.6569 68.8284 68.8284C67.6569 70 65.7712 70 62 70H18C14.2288 70 12.3431 70 11.1716 68.8284C10 67.6569 10 65.7712 10 62V18Z"
                      fill="black"
                    />
                  </mask>
                  <g mask="url(#mask0_edit)">
                    <path
                      d="M62.0127 -2.88965C65.7779 -3.09883 67.6608 -3.20338 68.8955 -2.09863C70.13 -0.993815 70.2342 0.889167 70.4434 4.6543L73.165 53.6348C73.2565 55.2808 71.9464 56.6658 70.2979 56.666C70.1075 56.666 69.9247 56.5906 69.79 56.4561L59.4951 46.1611C58.1621 44.8281 57.4952 44.1613 56.667 44.1611C55.8386 44.1611 55.1712 44.8278 53.8379 46.1611L48.1436 51.8564C47.4503 52.5497 47.1034 52.8958 46.6768 52.8867C46.2499 52.8774 45.9177 52.5161 45.2549 51.793L30.9473 36.1846C29.7192 34.8449 29.1051 34.1747 28.335 34.1045C27.5647 34.0344 26.8122 34.6027 25.3086 35.7393C21.394 38.6982 14.5385 43.333 10 43.333V7.55859C10 3.98093 9.99997 2.19183 11.0938 1.03516C12.1879 -0.121504 13.9781 -0.221112 17.5566 -0.419922L62.0127 -2.88965ZM55 20C52.2386 20 50 22.2386 50 25C50.0002 27.7613 52.2387 30 55 30C57.7613 30 59.9998 27.7613 60 25C60 22.2386 57.7614 20 55 20Z"
                      fill="#666666"
                    />
                  </g>
                  <path
                    d="M40 70H66C68.2091 70 70 68.2091 70 66V14C70 11.7909 68.2091 10 66 10H14C11.7909 10 10 11.7909 10 14V40"
                    stroke="#666666"
                    stroke-width="3"
                    stroke-linecap="round"
                  />
                  <path
                    d="M26.6666 53.333V51.833H28.1666V53.333H26.6666ZM11.0606 71.0603C10.4748 71.6461 9.52508 71.6461 8.9393 71.0603C8.35351 70.4746 8.35351 69.5248 8.9393 68.939L9.99996 69.9997L11.0606 71.0603ZM26.6666 69.9997H25.1666V53.333H26.6666H28.1666V69.9997H26.6666ZM26.6666 53.333V54.833H9.99996V53.333V51.833H26.6666V53.333ZM26.6666 53.333L27.7273 54.3937L11.0606 71.0603L9.99996 69.9997L8.9393 68.939L25.606 52.2723L26.6666 53.333Z"
                    fill="#666666"
                  />
                </svg>
              </div>
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
          <!-- Dòng khai báo biến thể -->
          <div class="pc-variant-row">
            <div class="pc-field">
              <label class="pc-label">Biến thể 1</label>
              <input
                v-model.trim="variantName"
                type="text"
                class="pc-input"
                placeholder='VD: "Màu/ Size"'
              />
            </div>

            <div class="pc-field">
              <label class="pc-label">Giá trị biến thể</label>
              <input
                v-model.trim="variantValuesText"
                type="text"
                class="pc-input"
                placeholder='VD: "Trắng/ S, Trắng/ M"'
              />
            </div>
          </div>

          <button type="button" class="pc-link-add" @click="addVariants">
            + Thêm biến thể
          </button>

          <!-- Card + Bảng biến thể -->
          <div class="pc-variant-card">
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

            <div class="pc-table-wrap">
              <table class="pc-table">
                <thead>
                  <tr>
                    <th class="pc-col-check">
                      <input
                        type="checkbox"
                        class="pc-checkbox"
                        :checked="isAllChecked"
                        @change="toggleCheckAll($event)"
                      />
                    </th>
                    <th class="pc-col-name">Màu/ Size</th>
                    <th class="pc-col-price">Giá vốn</th>
                    <th class="pc-col-price">Giá bán</th>
                    <th class="pc-col-action"></th>
                  </tr>
                </thead>

                <tbody>
                  <!-- Hàng biến thể -->
                  <tr v-for="row in filteredVariantRows" :key="row.id">
                    <td class="pc-cell-center">
                      <input
                        type="checkbox"
                        class="pc-checkbox"
                        v-model="row.checked"
                      />
                    </td>
                    <td class="pc-cell-name">
                      {{ row.name }}
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
                        type="text"
                        inputmode="decimal"
                        class="pc-input-sm pc-price-input"
                        />
                        <span class="pc-price-suffix">đ</span>
                      </div>
                    </td>
                    <td class="pc-cell-center">
                      <button
                        type="button"
                        class="pc-icon-btn"
                        aria-label="Xoá biến thể"
                        @click="removeVariant(row.id)"
                      >
                        <svg width="30" height="30" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8.75 7.29232C8.55661 7.29232 8.37115 7.36914 8.2344 7.50589C8.09766 7.64263 8.02083 7.8281 8.02083 8.02148V9.47982C8.02083 9.6722 8.09685 9.85679 8.23233 9.99336C8.36782 10.1299 8.55179 10.2074 8.74417 10.209H26.2558C26.4482 10.2074 26.6322 10.1299 26.7677 9.99336C26.9032 9.85679 26.9792 9.6722 26.9792 9.47982V8.02148C26.9792 7.8281 26.9023 7.64263 26.7656 7.50589C26.6289 7.36914 26.4434 7.29232 26.25 7.29232H8.75ZM6.5625 9.47982C6.56242 9.94197 6.70872 10.3923 6.98041 10.7661C7.25209 11.14 7.63521 11.4182 8.07479 11.5609L8.34896 14.584H7.29167C7.09828 14.584 6.91281 14.6608 6.77607 14.7976C6.63932 14.9343 6.5625 15.1198 6.5625 15.3132C6.5625 15.5065 6.63932 15.692 6.77607 15.8287C6.91281 15.9655 7.09828 16.0423 7.29167 16.0423H8.48167L9.43396 26.5146C9.49981 27.2393 9.83416 27.9132 10.3714 28.404C10.9086 28.8948 11.6098 29.167 12.3375 29.1673H22.6596C23.3875 29.1674 24.0891 28.8953 24.6266 28.4044C25.1642 27.9136 25.4987 27.2395 25.5646 26.5146L26.5183 16.0423H27.7083C27.9017 16.0423 28.0872 15.9655 28.2239 15.8287C28.3607 15.692 28.4375 15.5065 28.4375 15.3132C28.4375 15.1198 28.3607 14.9343 28.2239 14.7976C28.0872 14.6608 27.9017 14.584 27.7083 14.584H26.651L26.9252 11.5609C27.3648 11.4182 27.7479 11.14 28.0196 10.7661C28.2913 10.3923 28.4376 9.94197 28.4375 9.47982V8.02148C28.4375 7.44132 28.207 6.88492 27.7968 6.47469C27.3866 6.06445 26.8302 5.83398 26.25 5.83398H8.75C8.16984 5.83398 7.61344 6.06445 7.2032 6.47469C6.79297 6.88492 6.5625 7.44132 6.5625 8.02148V9.47982ZM10.8865 26.3819L9.54917 11.6673H25.4523L24.1135 26.3819C24.0808 26.7445 23.9136 27.0817 23.6448 27.3273C23.376 27.5728 23.0251 27.709 22.661 27.709H12.339C11.9749 27.709 11.624 27.5728 11.3552 27.3273C11.0864 27.0817 10.9192 26.7445 10.8865 26.3819ZM16.0417 15.3132C16.0417 15.1198 15.9648 14.9343 15.8281 14.7976C15.6914 14.6608 15.5059 14.584 15.3125 14.584C15.1191 14.584 14.9336 14.6608 14.7969 14.7976C14.6602 14.9343 14.5833 15.1198 14.5833 15.3132V24.0632C14.5833 24.2565 14.6602 24.442 14.7969 24.5787C14.9336 24.7155 15.1191 24.7923 15.3125 24.7923C15.5059 24.7923 15.6914 24.7155 15.8281 24.5787C15.9648 24.442 16.0417 24.2565 16.0417 24.0632V15.3132ZM20.4167 15.3132C20.4167 15.1198 20.3398 14.9343 20.2031 14.7976C20.0664 14.6608 19.8809 14.584 19.6875 14.584C19.4941 14.584 19.3086 14.6608 19.1719 14.7976C19.0352 14.9343 18.9583 15.1198 18.9583 15.3132V24.0632C18.9583 24.2565 19.0352 24.442 19.1719 24.5787C19.3086 24.7155 19.4941 24.7923 19.6875 24.7923C19.8809 24.7923 20.0664 24.7155 20.2031 24.5787C20.3398 24.442 20.4167 24.2565 20.4167 24.0632V15.3132Z" fill="#5F5F5F"/>
                        </svg>



                      </button>
                    </td>
                  </tr>

                  <!-- Empty -->
                  <tr v-if="!filteredVariantRows.length">
                    <td colspan="5" class="pc-empty-cell">
                      <div class="pc-empty-inner">
                        <div class="pc-empty-icon">
                          <svg
                            width="100"
                            height="100"
                            viewBox="0 0 100 100"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M16.6666 24.834C16.6666 22.9484 16.6666 22.0056 17.2524 21.4198C17.8382 20.834 18.781 20.834 20.6666 20.834H31.639C32.4482 20.834 32.8528 20.834 33.1325 21.071C33.4123 21.3079 33.4788 21.707 33.6118 22.5052L35.1381 31.6628C35.2711 32.4609 35.3376 32.86 35.6174 33.097C35.8971 33.334 36.3017 33.334 37.1109 33.334H62.889C63.6982 33.334 64.1028 33.334 64.3825 33.097C64.6623 32.86 64.7288 32.4609 64.8618 31.6628L66.3881 22.5052C66.5211 21.707 66.5876 21.3079 66.8674 21.071C67.1471 20.834 67.5517 20.834 68.3609 20.834H79.3333C81.2189 20.834 82.1617 20.834 82.7475 21.4198C83.3333 22.0056 83.3333 22.9484 83.3333 24.834V83.5007C83.3333 85.3863 83.3333 86.3291 82.7475 86.9149C82.1617 87.5006 81.2189 87.5006 79.3333 87.5006H20.6666C18.781 87.5006 17.8382 87.5006 17.2524 86.9149C16.6666 86.3291 16.6666 85.3863 16.6666 83.5006V24.834Z"
                              fill="#7E869E"
                              fill-opacity="0.25"
                            />
                            <rect
                              x="16.6666"
                              y="20.834"
                              width="66.6667"
                              height="66.6667"
                              rx="5"
                              stroke="#7E7E7E"
                              stroke-width="3"
                            />
                            <path
                              d="M37.5 58.334L62.5 58.334"
                              stroke="#7E7E7E"
                              stroke-width="3"
                              stroke-linecap="round"
                            />
                          </svg>
                        </div>
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
                        v-model.number="allCostPrice"
                        type="number"
                        min="0"
                        class="pc-input-sm pc-price-input"
                        @input="applyAllCostPrice"
                        />
                        <span class="pc-price-suffix">đ</span>
                      </div>
                    </td>
                    <td>
                      <div class="pc-price-input-wrap">
                        <input
                        v-model.number="allSalePrice"
                        type="text"
                        inputmode="decimal"
                        class="pc-input-sm pc-price-input"
                        @input="applyAllSalePrice"
                        />
                        <span class="pc-price-suffix">đ</span>
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
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { request, API_BASE_URL } from "../../services/http";

const route = useRoute();
const router = useRouter();
const productId = route.params.id;

/* FORM CƠ BẢN */
const form = ref({
  name: "",
  description: "",
  categoryId: "",
});

/* ẢNH CHÍNH */
const imagePreview = ref("");
const imageFile = ref(null);

const onFileChange = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  imageFile.value = file;
  imagePreview.value = URL.createObjectURL(file);
};

/* ẢNH PHỤ (UI) */
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

/* DANH MỤC */
const categories = ref([]);

const fetchCategories = async () => {
  try {
    const { data } = await request("/categories");
    categories.value = Array.isArray(data) ? data : data.items || [];
  } catch (err) {
    console.error("Lỗi load categories:", err);
  }
};

/* BIẾN THỂ */
let seed = 1;
const variants = ref([]);
const variantName = ref("Màu/ Size");
const variantValuesText = ref("");
const filterVariant = ref("");

const allCostPrice = ref(null);
const allSalePrice = ref(null);

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
      name: val, // ví dụ "Trắng/ S"
      costPrice: 0,
      salePrice: 0,
      checked: false,
    });
  });

  variantValuesText.value = "";
};

const filteredVariantRows = computed(() => {
  if (!filterVariant.value) return variants.value;
  const id = Number(filterVariant.value);
  return variants.value.filter((v) => v.id === id);
});

const isAllChecked = computed(() => {
  const rows = filteredVariantRows.value;
  if (!rows.length) return false;
  return rows.every((r) => r.checked);
});

const toggleCheckAll = (event) => {
  const checked = event.target.checked;
  filteredVariantRows.value.forEach((row) => {
    row.checked = checked;
  });
};

const removeVariant = (id) => {
  variants.value = variants.value.filter((v) => v.id !== id);
};

const applyAllCostPrice = () => {
  variants.value.forEach((row) => {
    row.costPrice = allCostPrice.value || 0;
  });
};

const applyAllSalePrice = () => {
  variants.value.forEach((row) => {
    row.salePrice = allSalePrice.value || 0;
  });
};

/* LOAD PRODUCT */
const saving = ref(false);

const fetchProduct = async () => {
  try {
    const { data } = await request(`/products/${productId}`);
    const p = data;

    form.value.name = p.name ?? "";
    form.value.description = p.description ?? "";
    form.value.categoryId = p.categoryId ?? p.category?.id ?? "";

    const rawThumb =
      p.thumbnail ||
      p.image ||
      p.imageUrl ||
      (Array.isArray(p.images) && p.images[0]?.url) ||
      null;

    if (rawThumb) {
      imagePreview.value = /^https?:\/\//.test(rawThumb)
        ? rawThumb
        : `${API_BASE_URL}${rawThumb}`;
    }

    variants.value = Array.isArray(p.variants)
      ? p.variants.map((v) => {
          const localId = v.id ?? seed++;
          return {
            id: localId,
            name: v.name || v.optionName || v.value || "Biến thể",
            costPrice: Number(v.costPrice ?? v.importPrice ?? 0),
            salePrice: Number(v.salePrice ?? v.price ?? 0),
            checked: false,
          };
        })
      : [];
  } catch (err) {
    console.error("Lỗi load product:", err);
    alert(err?.message || "Không tải được thông tin sản phẩm.");
  }
};

/* SUBMIT */
const onSubmit = async () => {
  try {
    saving.value = true;

    const payload = {
      name: form.value.name,
      description: form.value.description,
      categoryId: form.value.categoryId || null,
      variants: variants.value.map((v) => ({
        id: v.id,
        name: v.name,
        costPrice: v.costPrice,
        salePrice: v.salePrice,
      })),
      // TODO: xử lý imageFile + extraFiles nếu backend hỗ trợ upload file
    };

    await request(`/products/${productId}`, {
      method: "PUT",
      data: payload,
    });

    alert("Cập nhật sản phẩm thành công!");
    router.push({ name: "AdminProductManage" });
  } catch (err) {
    console.error("Lỗi lưu product:", err);
    alert(err?.message || "Cập nhật sản phẩm thất bại.");
  } finally {
    saving.value = false;
  }
};

/* QUAY LẠI */
const goBack = () => {
  router.back();
};

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
  flex-direction: row;
  gap: 6px;
  align-items: center;
  justify-content: center;
  color: #6b7280;
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
    background: #ffffff;
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
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
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

/* ===== BIẾN THỂ & BẢNG – giống Figma ===== */
.pc-variant-box {
  border: 1px solid #e5e7eb;
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

/* header */
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

/* body – từng hàng là pill */
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
  width: 180px;
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
  -webkit-appearance: none;
  appearance: none;          /* tắt style mặc định của browser */
  width: 20px;
  height: 20px;
  border-radius: 5px;      /* tròn hẳn */
  border: 1.5px solid #999999;
  background: #ffffff;
  cursor: pointer;
}

/* trạng thái được chọn */
.pc-checkbox:checked {
  background-color: #4f46e5; /* màu nền khi tick (giống figma) */
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

.pc-icon-btn {
  background: transparent;   /* bỏ màu nền */
  border: none;              /* bỏ viền */
  padding: 0;                /* sát icon */
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

.pc-empty-icon {
  margin-bottom: 4px;
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
