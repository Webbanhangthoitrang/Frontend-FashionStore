<template>
  <div id="app">
    <!-- Router outlet -->
    <router-view />
  </div>
</template>

<script setup>
// Không cần code gì ở đây
</script>

<style>
/* Global reset rất nhẹ */
* { box-sizing: border-box; }
html, body, #app { height: 100%; }
body {
  margin: 0;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue',
               Arial, 'Noto Sans', 'Liberation Sans', sans-serif;
  background: #fff;
  color: #111;
}

/* Bạn có thể đặt thêm CSS global nếu cần */
</style>
