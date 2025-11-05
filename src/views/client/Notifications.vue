<template>
  <div class="notifications-page">
    <ClientHeader />

    <main class="container">
      <section class="card">
        <h1>Thông báo của bạn</h1>
        <p>Tính năng thông báo đang được hoàn thiện. Vui lòng quay lại sau.</p>
        <router-link class="btn" :to="{ name: 'home' }">Quay về trang chủ</router-link>
      </section>
    </main>

    <ClientFooter />
  </div>
</template>

<script setup>
import ClientHeader from '../../components/client/ClientHeaderLogged.vue';
import ClientFooter from '../../components/client/ClientFooter.vue';
</script>

<style scoped>
.notifications-page {
  min-height: 100vh;
  background: #f9fafb;
}

.container {
  max-width: 960px;
  margin: 24px auto 48px;
  padding: 0 24px;
}

.card {
  background: #fff;
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 10px 40px -20px rgba(15, 23, 42, 0.35);
  display: grid;
  gap: 16px;
}

.card h1 {
  margin: 0;
  font-size: 24px;
  color: #1f2937;
}

.card p {
  margin: 0;
  color: #6b7280;
  font-size: 15px;
}

.btn {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  border-radius: 999px;
  background: #4f46e5;
  color: #fff;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
}
</style>
