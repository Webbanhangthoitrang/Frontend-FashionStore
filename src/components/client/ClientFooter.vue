<template>
  <footer class="footer">
    <div class="footer-container">
      <!-- Cột 1 -->
      <div class="footer-column">
        <h3 class="footer-title">Dịch vụ khách hàng</h3>
        <ul class="footer-list">
          <li><a href="#">Fashion Blog</a></li>
          <li><a href="#">Hướng dẫn mua hàng/ đặt hàng</a></li>
          <li><a href="#">Chính sách bảo hành</a></li>
        </ul>
      </div>

      <!-- Cột 2 -->
      <div class="footer-column">
        <h3 class="footer-title">Theo dõi Fashion</h3>
        <ul class="footer-list">
          <li><a href="#">Facebook</a></li>
          <li><a href="#">Instagram</a></li>
          <li><a href="#">Tiktok</a></li>
        </ul>
      </div>

      <!-- Cột 3 -->
      <div class="footer-column">
        <h3 class="footer-title">Liên hệ</h3>
        <ul class="footer-list">
          <li>Email: <a href="mailto:support@fashion.com">support@fashion.com</a></li>
          <li>Hotline: <a href="tel:1900123456">1900 123 456</a></li>
        </ul>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: #4f7ee6; /* màu xanh trong thiết kế */
  color: #fff;
  padding: 40px 0;
  font-family: "Poppins", system-ui, sans-serif;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  gap: 40px;
  padding: 0 40px;
}

.footer-column {
  flex: 1;
}

.footer-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
}

.footer-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-list li {
  margin-bottom: 10px;
  font-size: 15px;
}

.footer-list a {
  color: #ffffff;
  text-decoration: none;
  transition: opacity 0.2s;
}

.footer-list a:hover {
  opacity: 0.8;
}

/* Responsive */
@media (max-width: 768px) {
  .footer-container {
    flex-direction: column;
    gap: 24px;
    text-align: center;
  }
}
</style>
