<template>
  <div id="app">
    <!-- router-view sẽ hiển thị HomeClient.vue -->
    <router-view />
  </div>
</template>

<script setup>
// Không cần import gì ở đây, router sẽ tự hiển thị HomeClient.vue
</script>

<style>
body {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  background-color: #fff;
}
</style>
