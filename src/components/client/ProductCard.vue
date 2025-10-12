<template>
  <!-- Bọc toàn card bằng RouterLink để điều hướng -->
  <RouterLink
    class="card-link"
    :to="`/product/${product.id}`"
    :aria-label="`Xem chi tiết ${product.name}`"
  >
    <article class="card">
      <!-- Ảnh sản phẩm -->
      <div class="card__thumb">
  <img :src="imageSrc" :alt="product.name" />
      </div>

      <!-- Thông tin sản phẩm -->
      <div class="card__body">
        <h3 class="card__title">{{ product.name }}</h3>
        <p v-if="brand" class="card__brand">{{ brand }}</p>
  <p class="card__price">{{ formatCurrencyVND(price) }}</p>
      </div>
    </article>
  </RouterLink>
</template>

<script setup>
import { computed } from 'vue'
import fallbackAsset from '../../assets/image1.png'
import { formatCurrencyVND } from '../../utils/format'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})
const imageSrc = computed(() => props.product?.imageUrl || fallbackAsset)
const price = computed(() => props.product?.price ?? 0)
const brand = computed(() => props.product?.categoryName || '')
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Khula:wght@400;600;700&display=swap");

/* Link bao quanh card */
.card-link {
  display: block;
  color: inherit;
  text-decoration: none;
}

/* Card */
.card {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 1px solid ;
  border-radius: 10px;
  overflow: hidden;
  height: 100%;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  font-family: "Khula", sans-serif;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  border-color: #1e2cff;
}

/* Ảnh */
.card__thumb {
  background: #d9d9d9;
  aspect-ratio: 2 / 3;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card__thumb img {
  width: 85%;
  height: auto;
  object-fit: contain;
}

/* Thông tin */
.card__body {
  background: #ffffff;
  text-align: center;
  padding: 12px 10px 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 6px;
}

/* Tên sản phẩm */
.card__title {
  color: #000000;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.4;
  margin-bottom: 6px;
  min-height: 38px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Giá sản phẩm */
.card__price {
  color: #000000;
  font-size: 14px;
  font-weight: 700;
}

.card__brand {
  color: #6b7280;
  font-size: 13px;
  margin: 0;
}
</style>
