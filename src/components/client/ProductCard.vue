<template>
  <RouterLink
    v-if="hasId"
    class="card"
    :to="{ name: 'ProductDetail', params: { id: idStr } }"
    :aria-label="`Xem chi tiết ${title}`"
  >
    <!-- Ảnh -->
    <div class="thumb">
      <img :src="imageSrc" :alt="title" data-pin-nopin="true" />
    </div>

    <!-- Thân card -->
    <div class="body">
      <h3 class="title">{{ title }}</h3>

      <!-- Dải màu (ẩn nếu không có) -->
      <div v-if="swatches.length" class="swatches" aria-label="Màu sắc">
        <span
          v-for="(c, i) in swatches"
          :key="i"
          class="dot"
          :style="{ background: c }"
          :title="c"
        />
      </div>

      <!-- Giá -->
      <div class="price">
        <template v-if="priceNumber > 0">{{ priceText }}</template>
        <template v-else>Liên hệ</template>
      </div>
    </div>
  </RouterLink>

  <div v-else class="card card--disabled" role="article" aria-disabled="true" tabindex="-1">
    <div class="thumb">
      <img :src="imageSrc" :alt="title" data-pin-nopin="true" />
    </div>

    <div class="body">
      <h3 class="title">{{ title }}</h3>

      <div v-if="swatches.length" class="swatches" aria-label="Màu sắc">
        <span
          v-for="(c, i) in swatches"
          :key="i"
          class="dot"
          :style="{ background: c }"
          :title="c"
        />
      </div>

      <div class="price">
        <template v-if="priceNumber > 0">{{ priceText }}</template>
        <template v-else>Liên hệ</template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import fallbackAsset from "../../assets/image1.png";

const props = defineProps({
  product: { type: Object, required: true },
});

const toNumberSafe = (v) => {
  const n = Number(String(v ?? 0).replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

const PRICE_KEYS_PRIORITY = [
  "salePrice", "sellingPrice", "currentPrice", "discountPrice", "finalPrice",
  "price", "unitPrice", "basePrice", "listPrice", "originalPrice",
  "priceVND", "priceVN", "amount", "value", "cost",
  "priceMin", "minPrice", "maxPrice",
];

function findPrice(obj, depth = 0) {
  if (!obj || typeof obj !== "object") return 0;

  // 1) Ưu tiên theo các key phổ biến
  for (const k of PRICE_KEYS_PRIORITY) {
    if (k in obj) {
      const num = toNumberSafe(obj[k]);
      if (num > 0) return num;
    }
  }

  // 2) priceRange / prices
  let num =
    toNumberSafe(obj?.priceRange?.min ?? obj?.priceRange?.from) ||
    toNumberSafe(Array.isArray(obj?.prices) ? obj.prices[0] : 0);
  if (num > 0) return num;

  // 3) variants / skus / options
  num =
    toNumberSafe(obj?.variants?.[0]?.price) ||
    toNumberSafe(obj?.skus?.[0]?.price) ||
    toNumberSafe(obj?.options?.[0]?.price);
  if (num > 0) return num;

  // 4) Quét shallow các key gợi ý giá
  const HINT = /(price|gia|cost|amount|value)/i;
  for (const [k, v] of Object.entries(obj)) {
    if (HINT.test(k)) {
      const flat = toNumberSafe(v);
      if (flat > 0) return flat;
      if (v && typeof v === "object") {
        const fromText = toNumberSafe(v.text ?? v.display ?? v.value);
        if (fromText > 0) return fromText;
      }
    }
  }

  // 5) Đào sâu tối đa 3 lớp
  if (depth < 3) {
    for (const v of Object.values(obj)) {
      if (Array.isArray(v)) {
        for (const it of v) {
          const nested = findPrice(it, depth + 1);
          if (nested > 0) return nested;
        }
      } else if (v && typeof v === "object") {
        const nested = findPrice(v, depth + 1);
        if (nested > 0) return nested;
      }
    }
  }

  return 0;
}

const formatVND = (n) => `${Number(n).toLocaleString("vi-VN")}đ`;

/* ---------------- Derived fields ---------------- */
const p = computed(() => props.product || {});

// Lấy id theo nhiều khả năng, ép về string để khớp router param
const productId = computed(() => p.value.id ?? p.value._id ?? p.value.code ?? "");
const idStr = computed(() => String(productId.value || ""));
const hasId = computed(() => idStr.value.length > 0);

const title = computed(() => p.value.name ?? "Sản phẩm");

const imageSrc = computed(
  () =>
    p.value.image ??
    p.value.imageUrl ??
    p.value.thumbnail ??
    p.value.images?.[0] ??
    fallbackAsset
);

// Màu sắc (tối đa 5 chấm), ẩn nếu rỗng
const swatches = computed(() => {
  const colors = Array.isArray(p.value.colors) ? p.value.colors : [];
  const fromVariants = Array.isArray(p.value.variants)
    ? p.value.variants
        .map((v) => v.color || v.colour || v?.options?.color)
        .filter(Boolean)
    : [];
  const merged = [...colors, ...fromVariants]
    .map((c) => (typeof c === "string" ? c : c?.value || c?.name))
    .filter(Boolean);
  return merged.slice(0, 5);
});

const priceNumber = computed(() => findPrice(p.value));
const priceText = computed(() => formatVND(priceNumber.value));
</script>

<style scoped>
/* Card tổng (bo góc, viền nhạt, hover nổi) */
.card {
  display: flex;
  flex-direction: column;
  border: 1px solid #d6defb;
  border-radius: 10px;
  background: #ffffff;
  overflow: hidden;
  transition: box-shadow 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
}
.card:hover {
  border-color: #4f7ee6;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

/* Card bị disable (không có id) */
.card--disabled {
  cursor: default;
  pointer-events: none;
  opacity: 0.85;
}

/* Ảnh trên nền xám */
.thumb {
  background: #d9d9d9;
  aspect-ratio: 2 / 3;
  display: flex;
  align-items: center;
  justify-content: center;
}
.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Thân card */
.body {
  background: #ffffff;
  padding: 8px 8px 10px;
  text-align: center;
}

/* Tên 2 dòng */
.title {
  color: #000;
  font-weight: 700;
  font-size: 13px;
  line-height: 1.35;
  margin: 2px 0 6px;
  min-height: 36px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Dải màu */
.swatches {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
  margin: 0 0 6px;
}
.dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid #c7c7c7;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.05);
}

/* Giá */
.price {
  color: #000;
  font-weight: 700;
  font-size: 14px;
}
</style>
