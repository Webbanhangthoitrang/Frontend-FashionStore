<template>
  <div class="detail">
    <ClientHeader />

    <main class="container">
      <div v-if="loading" class="state">Đang tải…</div>
      <div v-else-if="!product" class="state">Không tìm thấy sản phẩm.</div>

      <div v-else class="grid">
        <!-- Bên trái: Ảnh sản phẩm -->
        <section class="media">
          <div class="main-img">
            <img :src="activeImage" :alt="product.name" />
          </div>

          <div class="thumbs" v-if="(product.gallery?.length || 0) > 0">
            <button class="nav" @click="prevThumb">‹</button>

            <div class="thumbs-list">
              <img
                v-for="(img, i) in product.gallery"
                :key="i"
                :src="img"
                :class="{ active: i === thumbIndex }"
                @click="selectThumb(i)"
              />
            </div>

            <button class="nav" @click="nextThumb">›</button>
          </div>
        </section>

        <!-- Bên phải: Thông tin -->
        <section class="info">
          <h1 class="title">{{ product.name }}</h1>

          <div class="divider"></div>

          <div class="price">{{ formatVND(product.price) }}</div>

          <div class="group">
            <label>Phân loại</label>
            <div class="chips">
              <button
                v-for="c in product.colors"
                :key="c"
                :class="['chip', { active: c === color }]"
                @click="color = c"
              >
                {{ c }}
              </button>
            </div>
          </div>

          <div class="group">
            <label>Size</label>
            <div class="chips">
              <button
                v-for="s in product.sizes"
                :key="s"
                :class="['chip', { active: s === size }]"
                @click="size = s"
              >
                {{ s }}
              </button>
            </div>
          </div>

          <div class="group">
            <label>Số lượng</label>
            <div class="qty">
              <button @click="dec">–</button>
              <input type="number" v-model.number="qty" min="1" />
              <button @click="inc">+</button>
            </div>
          </div>

          <div class="actions">
            <button class="btn outline" @click="addToCart">
              🛒 Thêm vào giỏ hàng
            </button>
            <button class="btn primary" @click="buyNow">Mua ngay</button>
          </div>
        </section>
      </div>


       <!-- MÔ TẢ SẢN PHẨM -->
    <section class="desc">
      <h2 class="desc__title">MÔ TẢ SẢN PHẨM</h2>

      <ul class="desc__list">
        <li>Size: S: 46–52 kg / M: 52–58 kg</li>
        <li>(Size tính theo cân nặng tham khảo với mẫu cao 1m60. Thông số chi tiết vui lòng tham khảo trong phần ảnh sản phẩm).</li>
        <li>Chất liệu vải chính: vải sơ mi kẻ liên thân dáng dải phối dải lưng: Thô kẻ (mềm, mịn, mát, được ép màng mịn giúp định hình form váy).</li>
        <li>Chất liệu vải lót: Lụa Habutai (mềm, mịn, mát).</li>
        <li>Phụ kiện: Dải eo buộc bằng vải chính có đính, nơ váy tháo rời.</li>
        <li>Thiết kế đầm kiểu nơ form suông kèm nơ tiêu thư: Cúc sau cổ, khoá kéo sau lưng, tàu hẹp bên sườn.</li>
      </ul>

      <h3 class="desc__subtitle">HƯỚNG DẪN GIẶT ỦI:</h3>
      <ul class="desc__list">
        <li>Sản phẩm vải sơ mi kẻ liên thân dáng dải phối dải lưng nên được giặt tay và không giặt chung với các sản phẩm có màu khác (đặc biệt là sản phẩm tối màu với sản phẩm màu Trắng/ Kem).</li>
        <li>Không ngâm sản phẩm đầm lâu trong môi trường kèm tẩy rửa mạnh như bột giặt.</li>
        <li>Sản phẩm vải sơ mi kẻ liên thân dáng dải phối dải lưng nên ủi ở nhiệt độ thấp, tốt nhất ủi khô và được sử dụng bàn là nhiệt đối với sản phẩm.</li>
      </ul>

      <h3 class="desc__subtitle">CAM KẾT:</h3>
      <ul class="desc__list">
        <li>Mọi sản phẩm của Linly Store đều được chú trọng về mặt chất lượng. Nói không với việc cắt xén số lượng vải, bớt công đoạn để giảm chi phí và giá thành.</li>
        <li>Sản phẩm đảm bảo giống hình 99% (1% còn lại do góc chụp và sáng tối có sự sai lệch về màu sắc).</li>
        <li>Mỗi mặt hàng ra đều được kiểm tra kỹ lưỡng trước khi đến tay khách hàng.</li>
        <li>Cam kết mọi khi có vấn đề khách hàng thay đổi sẽ hết hài lòng.</li>
        <li>Thời gian xử lý đơn hàng nhanh chóng chỉ trong 7 ngày tới đảm nhận gọn, thuận tiện.</li>
        <li>Thêm sản phẩm vào giỏ hàng và hoàn thành đơn ngay để nhận được ưu đãi sớm nhất!</li>
      </ul>
    </section>
    </main>

    <ClientFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import ClientHeader from "../../components/client/ClientHeaderLogged.vue";
import ClientFooter from "../../components/client/ClientFooter.vue";

// ✅ Ảnh trong thư mục assets
const img1 = new URL("../../assets/image3.png", import.meta.url).href;
const img2 = new URL("../../assets/image4.png", import.meta.url).href;
const img3 = new URL("../../assets/image5.png", import.meta.url).href;
const img4 = new URL("../../assets/image6.png", import.meta.url).href;
const img5 = new URL("../../assets/image7.png", import.meta.url).href;

// Sản phẩm mẫu
const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "Váy Tơ Hoa Crep Cao Cấp Alice, Đầm Ngắn Xếp Ly Tăng Cạp Chung Tôn Eo.",
    price: 529000,
    gallery: [img1, img2, img3, img4, img5],
    colors: ["Vàng", "Xanh lá", "Hồng", "Đỏ"],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
];

const route = useRoute();
const product = ref(null);
const loading = ref(true);
const color = ref("");
const size = ref("");
const qty = ref(1);
const thumbIndex = ref(0);

const activeImage = computed(
  () => product.value?.gallery?.[thumbIndex.value] || ""
);

function selectThumb(i) {
  thumbIndex.value = i;
}
function prevThumb() {
  const len = product.value?.gallery?.length || 0;
  if (!len) return;
  thumbIndex.value = (thumbIndex.value - 1 + len) % len;
}
function nextThumb() {
  const len = product.value?.gallery?.length || 0;
  if (!len) return;
  thumbIndex.value = (thumbIndex.value + 1) % len;
}
function formatVND(n) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(n);
}
function dec() {
  if (qty.value > 1) qty.value--;
}
function inc() {
  qty.value++;
}
function addToCart() {
  alert(`Đã thêm: ${product.value.name}`);
}
function buyNow() {
  alert("Đi đến trang thanh toán (mock)");
}

function load() {
  loading.value = true;
  const id = String(route.params.id || "");
  product.value = MOCK_PRODUCTS.find((p) => String(p.id) === id) || null;
  if (product.value) {
    color.value = product.value.colors[0];
    size.value = product.value.sizes[0];
    thumbIndex.value = 0;
  }
  loading.value = false;
}

onMounted(load);
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Khula:wght@400;600;700&display=swap");

.detail {
  font-family: "Khula", sans-serif;
  background: #fff;
}

.container {
  max-width: 1200px;
  margin: 24px auto 40px;
  padding: 0 24px;
}

/* ===== Grid ===== */
.grid {
  display: grid;
  grid-template-columns: 520px 1fr;
  gap: 200px;
  align-items: start;
}
@media (max-width: 992px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

/* ===== Ảnh chính ===== */
.main-img {
  background: #18181b;
  padding: 8px;
  border-radius: 8px; 
}
.main-img img {
  width: 100%;
  display: block;
  border-radius: 6px;
  max-height: 480px;
}

/* ===== Gallery nhỏ ===== */
.thumbs {
  display: grid;
  grid-template-columns: 28px 1fr 28px;
  gap: 10px;
  align-items: center;
  margin-top: 12px;
}
.nav {
  height: 60px;
  border: none;
  background: #f3f4f6;
  border-radius: 8px;
  font-size: 22px;
  cursor: pointer;
}
.thumbs-list {
  display: grid;
  grid-auto-flow: column;
  gap: 8px;
  overflow: auto;
  padding: 6px 2px;
  background: #f8fafc;
  border-radius: 8px;
}
.thumbs-list img {
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  opacity: 0.75;
  cursor: pointer;
  border: 2px solid transparent;
}
.thumbs-list img.active {
  opacity: 1;
  border-color: #1e2cff;
}

/* ===== Thông tin ===== */
.title {
  font-weight: 700;
  font-size: 22px;
  color: #111827;
  margin: 6px 0 10px;
  line-height: 1.4;
}
.divider {
  height: 1.5px;
  background: #e5e7eb;
  margin: 8px 0 12px;
}
.price {
  font-size: 28px;
  font-weight: 800;
  color: #ef4444;
  background: #eef2ff;
  display: inline-block;
  padding: 6px 12px;
  border-radius: 6px;
}

/* ===== Chips ===== */
.group {
  margin-top: 18px;
}
.group label {
  display: block;
  margin-bottom: 6px;
  color: #374151;
  font-weight: 600;
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.chip {
  min-width: 72px;
  height: 40px;
  padding: 0 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  font-weight: 600;
}
.chip.active {
  border-color: #1e2cff;
  box-shadow: 0 0 0 3px rgba(30, 44, 255, 0.15);
}

/* ===== Số lượng ===== */
.qty {
  display: flex;
  align-items: center;
}
.qty input {
  width: 64px;
  height: 40px;
  border: 1px solid #e5e7eb;
  text-align: center;
  margin: 0 -1px;
}
.qty button {
  width: 40px;
  height: 40px;
  border: 1px solid #e5e7eb;
  background: #fff;
  cursor: pointer;
  border-radius: 6px;
}

/* ===== Nút hành động ===== */
.actions {
  margin-top: 22px;
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}
.btn {
  border: none;
  border-radius: 10px;
  height: 48px;
  padding: 0 22px;
  font-weight: 700;
  cursor: pointer;
}
.btn.outline {
  background: #fff;
  color: #1e2cff;
  border: 2px solid #1e2cff;
}
.btn.primary {
  background: #ef4444;
  color: #fff;
}
.btn.outline:hover {
  background: #f8fafc;
}
.btn.primary:hover {
  background: #dc2626;
}
/* ===== MÔ TẢ SẢN PHẨM ===== */
.desc {
  margin-top: 28px;
  padding-top: 20px;
  border-top: 2px solid #e5e7eb;
}

.desc__title {
  font-size: 18px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 14px;
  text-transform: uppercase;
  letter-spacing: .3px;
}

.desc__subtitle {
  font-size: 14.5px;
  font-weight: 800;
  color: #111827;
  margin: 18px 0 8px;
  text-transform: uppercase;
}

.desc__list {
  margin: 0 0 8px 0;
  padding-left: 18px;          /* lùi vào cho dễ đọc */
  list-style: none;            /* bỏ chấm mặc định */
}

.desc__list li {
  position: relative;
  margin: 6px 0;
  color: #374151;
  line-height: 1.6;
  font-size: 14px;
}

/* chấm tròn nhỏ thay bullet mặc định (nhẹ nhàng, đồng bộ) */
.desc__list li::before {
  content: "";
  position: absolute;
  left: -12px;
  top: 9px;
  width: 4px;
  height: 4px;
  border-radius: 999px;
  background: #9ca3af;
}

</style>
