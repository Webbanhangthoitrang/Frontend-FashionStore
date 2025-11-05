<template>
  <!-- Overlay (click để đóng) -->
  <div v-if="overlay" class="noti__overlay" @click="$emit('close')"></div>

  <!-- Popup -->
  <aside class="noti" role="dialog" aria-modal="true" @click.stop>
    <header class="noti__head">
      <h3 class="noti__title">Thông báo</h3>
      <button class="noti__markall" type="button" @click="$emit('markAllRead')">
        Đánh dấu đọc tất cả
      </button>
    </header>

    <ul class="noti__list">
      <li
        v-for="(n, i) in items"
        :key="n.id ?? i"
        class="noti__item"
        :class="{ 'is-unread': !n.read }"
        @click="$emit('select', n)"
      >
        <img :src="n.icon || placeholder" alt="" class="noti__avatar" />
        <div class="noti__body">
          <p class="noti__item-title">
            <span v-if="n.emoji" class="noti__emoji">{{ n.emoji }}</span>
            {{ n.title }}
          </p>
          <p class="noti__desc">{{ n.desc }}</p>
          <p class="noti__time">{{ n.time }}</p>
        </div>

        <!-- chấm xanh chưa đọc -->
        <span v-if="!n.read" class="noti__dot" aria-label="Chưa đọc"></span>
      </li>
    </ul>
  </aside>
</template>

<script setup>
const props = defineProps({
  items: { type: Array, default: () => [] },
  overlay: { type: Boolean, default: true }, // có nền mờ phía sau như hình
})
defineEmits(['close', 'markAllRead', 'select'])

const placeholder =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56">
      <defs>
        <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stop-color="#5b5e66"/>
          <stop offset="1" stop-color="#3b3f46"/>
        </linearGradient>
      </defs>
      <circle cx="28" cy="28" r="28" fill="url(#g)"/>
      <rect x="18" y="18" width="20" height="20" rx="4" fill="#f2c76f" opacity=".9"/>
    </svg>`
  )
</script>

<style scoped>
/* ===== Overlay ===== */
.noti__overlay{
  position: fixed; inset: 0;
  background: rgba(0,0,0,.15);
  backdrop-filter: blur(1px);
  z-index: 98;
}

/* ===== Popup ===== */
.noti{
  position: fixed;
  top: 84px;           /* nằm dưới header */
  right: 24px;
  width: min(480px, 94vw);
  max-height: 72vh;
  background: #fff;
  border-radius: 18px;                    /* bo tròn giống mẫu */
  box-shadow: 0 10px 28px rgba(0,0,0,.18);
  overflow: hidden;                       /* giữ bo góc header */
  z-index: 99;
  display: flex;
  flex-direction: column;
}

/* Header */
.noti__head{
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 18px 12px 18px;
  border-bottom: 1px solid #eef2f7;
}
.noti__title{
  margin: 0;
  font-size: 30px;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  color: #111827;
}
.noti__markall{
  background: none; border: none;
  color: #2563eb; cursor: pointer;
  padding: 6px 8px; border-radius: 8px;
}
.noti__markall:hover{ background: #eff6ff; }

/* List */
.noti__list{
  list-style: none; margin: 0; padding: 8px 6px 10px 6px;
  overflow: auto; flex: 1;
}

/* Item */
.noti__item{
  display: grid;
  grid-template-columns: 56px 1fr 14px;
  align-items: start;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 14px;
  transition: background .2s ease;
}
.noti__item:hover{ background: #f8fafc; }
.noti__item + .noti__item{ margin-top: 2px; }

.noti__avatar{
  width: 56px; height: 56px; border-radius: 50%;
  object-fit: cover; background:#e5e7eb; flex-shrink: 0;
}

.noti__body{ min-width: 0; }
.noti__item-title{
  margin: 2px 0 4px; font-weight: 800; color: #0f172a;
}
.noti__emoji{ margin-right: 6px; }
.noti__desc{
  margin: 0 0 6px; color: #374151; line-height: 1.35;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.noti__time{
  margin: 0; font-size: 13px; color:#6b7280;
}

/* Dot unread */
.noti__dot{
  width: 10px; height: 10px; border-radius: 50%;
  background: #2563eb; margin-top: 6px;
}

/* Scrollbar tinh tế */
.noti__list::-webkit-scrollbar{ width: 8px; }
.noti__list::-webkit-scrollbar-thumb{ background:#e5e7eb; border-radius: 999px; }
.noti__list:hover::-webkit-scrollbar-thumb{ background:#cfd4dc; }
</style>
