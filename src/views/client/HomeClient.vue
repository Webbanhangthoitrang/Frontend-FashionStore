<template>
  <div class="home">
    <!-- Header -->
    <ClientHeader />

    <!-- Banner -->
    <section class="banner">
      <img src="../../assets/banner.png" alt="Banner thời trang" class="banner__img" />
    </section>

    <!-- Danh mục -->
    <section class="category">
      <h2 class="category__title">Danh mục</h2>
      <div class="category__list">
        <div v-for="item in categories" :key="item.name" class="category__item">
          <img :src="item.icon" :alt="item.name" class="category__icon" />
          <p class="category__name">{{ item.name }}</p>
        </div>
      </div>
    </section>

    <!-- Gợi ý thêm -->
     <!-- Gợi ý sản phẩm -->
    <section class="product">
      <h2 class="product__title">Gợi ý sản phẩm</h2>

      <div class="product__grid">
        <ProductCard v-for="p in products" :key="p.id" :product="p" />
      </div>
    </section>
    <div class="more-btn">
      <button>Gợi ý thêm sản phẩm</button>
    </div>

    <!-- Footer -->
    <ClientFooter />
  </div>
</template>

<script setup>
import ClientHeader from "../../components/client/ClientHeaderLogged.vue";
import ClientFooter from "../../components/client/ClientFooter.vue";

// icon danh mục (đường dẫn tương đối)
import dam from "../../assets/dam.png";
import ao from "../../assets/ao.png";
import quan from "../../assets/quan.png";
import chanvay from "../../assets/chanvay.png";
import aokhoac from "../../assets/aokhoac.png";
import sale from "../../assets/sale.png";

const categories = [
  { name: "Đầm", icon: dam },
  { name: "Áo", icon: ao },
  { name: "Quần", icon: quan },
  { name: "Chân váy", icon: chanvay },
  { name: "Áo khoác", icon: aokhoac },
  { name: "Sale", icon: sale },
];

// sản phẩm
import ProductCard from '../../components/client/ProductCard.vue'

// Ảnh sản phẩm mẫu
import sp1 from '../../assets/image1.png'
import sp2 from '../../assets/image2.png'
import sp3 from '../../assets/image3.png'

// Danh sách sản phẩm demo
const products = [
  { id: 1, name: 'Chân váy điều chỉ cạp bông', price: 425000, image: sp1 },
  { id: 2, name: 'Áo sơ mi cổ Đức, khăn choàng', price: 425000, image: sp2 },
  { id: 3, name: 'Áo dáng ôm', price: 425000, image: sp3 },
  { id: 4, name: 'Chân váy dáng chữ A', price: 425000, image: sp1 }
]
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #fff;
}

/* ---------- Banner ---------- */
.banner {
  width: 100%;
  height: 300px;
  overflow: hidden;
}
.banner__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ---------- Danh mục ---------- */
.category {
  max-width: 1200px;
  margin-left: 20px;
  margin-right: 20px;
  padding: 0 40px;
}
.category__title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 18px;
}

/* ✅ Trải đều toàn hàng, không còn trống hai mép */
.category__list {
  display: grid;
  grid-template-columns: repeat(6, 1fr); /* 6 cột bằng nhau, giãn hết chiều ngang */
  gap: 70px;                              /* khoảng cách giữa các ô */
  align-items: stretch;
}
.category__item {
  height: 130px;
  width: 170px;
  border: 1px solid #4f7ee6;
  border-radius: 12px;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  text-align: center;
}
.category__item:hover {
  background: #f6f8ff;
  transform: translateY(-3px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}
.category__icon {
  width: 54px;
  height: 54px;
  margin-bottom: 10px;
}
.category__name {
  font-weight: 600;
  font-size: 16px;
  color: #333;
}

/* Tablet: 3×2, vẫn đều và đẹp */
@media (max-width: 1024px) {
  .category__list {
    grid-template-columns: repeat(3, 1fr);
    gap: 22px;
  }
}

/* Mobile: 1 hàng cuộn ngang */
@media (max-width: 640px) {
  .category__list {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    gap: 16px;
    padding-bottom: 10px;
    scroll-snap-type: x mandatory;
  }
  .category__item {
    flex: 0 0 150px;
    scroll-snap-align: center;
  }
}

/* ---------- Gợi ý thêm ---------- */
.more-btn {
  text-align: center;
  margin: 28px 0 48px;
}
.more-btn button {
  background: #4f7ee6;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 28px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.2s;
}
.more-btn button:hover {
  background: #3c69d1;
}

/* ---------- Footer ---------- */
footer {
  margin-top: auto;
}
.product{
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 32px;    /* ít hơn để nhìn thoáng */
}
.product__title{
  font-family: 'Khula', sans-serif;
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  color: #000;
  margin-top: 40px;
  margin-bottom: 28px;
  letter-spacing: 0.3px;
}
.product__grid{
  display:grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;          /* khoảng cách đều nhau */
  align-items: stretch;
}
@media (max-width: 1200px){ .product__grid{ grid-template-columns: repeat(3,1fr);} }
@media (max-width: 900px){  .product__grid{ grid-template-columns: repeat(2,1fr);} }
@media (max-width: 520px){  .product__grid{ grid-template-columns: 1fr; } }

</style>
