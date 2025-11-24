<!-- src/components/admin/DashboardCalendar.vue -->
<template>
  <div class="filter-dropdown">
    <!-- CỘT KHOẢNG THỜI GIAN -->
    <div class="period-column">
      <button
        v-for="opt in options"
        :key="opt.value"
        type="button"
        :class="[
          'period-item',
          { 'period-item--active': modelValue === opt.value },
        ]"
        @click="selectOption(opt.value)"
      >
        {{ opt.label }}
      </button>
    </div>

    <!-- VÙNG LỊCH 2 THÁNG + FOOTER -->
    <div class="calendar-area">
      <div class="calendar-row">
        <!-- THÁNG TRÁI -->
        <div class="calendar-column">
          <div class="cal-header">
            <span class="cal-month">{{ leftMonthLabel }}</span>
          </div>
          <div class="cal-weekdays">
            <span v-for="d in weekdays" :key="'L-h-' + d">{{ d }}</span>
          </div>
          <div class="cal-grid">
            <span
              v-for="(cell, idx) in leftCalendarCells"
              :key="'L-' + idx"
              :class="[
                'cal-cell',
                { 'cal-cell--muted': !cell.inMonth },
                { 'cal-cell--selected': cell.isSelected },
                { 'cal-cell--today': cell.isToday },
              ]"
            >
              {{ cell.day || '' }}
            </span>
          </div>
        </div>

        <!-- THÁNG PHẢI -->
        <div class="calendar-column">
          <div class="cal-header">
            <span class="cal-month">{{ rightMonthLabel }}</span>
          </div>
          <div class="cal-weekdays">
            <span v-for="d in weekdays" :key="'R-h-' + d">{{ d }}</span>
          </div>
          <div class="cal-grid">
            <span
              v-for="(cell, idx) in rightCalendarCells"
              :key="'R-' + idx"
              :class="[
                'cal-cell',
                { 'cal-cell--muted': !cell.inMonth },
                { 'cal-cell--selected': cell.isSelected },
                { 'cal-cell--today': cell.isToday },
              ]"
            >
              {{ cell.day || '' }}
            </span>
          </div>
        </div>
      </div>

      <!-- FOOTER -->
      <div class="filter-footer">
        <button
          type="button"
          class="footer-btn footer-btn--ghost"
          @click="$emit('cancel')"
        >
          Hủy bỏ
        </button>
        <button
          type="button"
          class="footer-btn footer-btn--primary"
          @click="handleApply"
        >
          Áp dụng
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: 'today', // today | week | month | year | all
  },
  options: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue', 'apply', 'cancel'])

/*  DATE CƠ BẢN  */
const today = new Date()
const baseMonth = ref(today.getMonth()) // tháng bên trái
const baseYear = ref(today.getFullYear())

const months = [
  'Tháng 1',
  'Tháng 2',
  'Tháng 3',
  'Tháng 4',
  'Tháng 5',
  'Tháng 6',
  'Tháng 7',
  'Tháng 8',
  'Tháng 9',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12',
]

const weekdays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

/* ===== RANGE ĐƯỢC CHỌN THEO PERIOD ===== */
const selectedRange = computed(() => {
  const period = props.modelValue

  // chuẩn hóa về 00:00 và 23:59 để so sánh ngày, không dính giờ/phút
  const start = new Date(today)
  start.setHours(0, 0, 0, 0)

  const end = new Date(today)
  end.setHours(23, 59, 59, 999)

  if (period === 'today') {
    // chỉ 1 ngày
    return { start, end }
  }

  if (period === 'week') {
    // tuần này: Thứ 2 -> CN
    const jsDay = today.getDay() // 0=CN..6=Th7
    const offset = (jsDay + 6) % 7 // Mon=0..Sun=6
    start.setDate(today.getDate() - offset)
    end.setTime(start.getTime())
    end.setDate(start.getDate() + 6)
    end.setHours(23, 59, 59, 999)
    return { start, end }
  }

  if (period === 'month') {
    // tháng này
    start.setDate(1)
    end.setMonth(today.getMonth() + 1, 0) // ngày cuối tháng
    end.setHours(23, 59, 59, 999)
    return { start, end }
  }

  if (period === 'year') {
    start.setMonth(0, 1)
    end.setMonth(11, 31)
    end.setHours(23, 59, 59, 999)
    return { start, end }
  }

  // 'all' hoặc không xác định -> không tô xám gì
  return null
})

/* ===== TẠO CALENDAR CELL (42 Ô) ===== */
const makeCalendar = (year, month) => {
  const firstDay = new Date(year, month, 1)
  const startWeekday = (firstDay.getDay() + 6) % 7 // Mon=0..Sun=6
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysPrevMonth = new Date(year, month, 0).getDate()

  const cells = []
  const range = selectedRange.value

  // helper check selected
  const isSelectedDate = (y, m, d) => {
    if (!range) return false
    const date = new Date(y, m, d)
    return date >= range.start && date <= range.end
  }

  // ngày tháng trước
  for (let i = startWeekday - 1; i >= 0; i--) {
    const dayNum = daysPrevMonth - i
    const date = new Date(year, month - 1, dayNum)
    cells.push({
      day: dayNum,
      inMonth: false,
      isToday:
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear(),
      isSelected: isSelectedDate(year, month - 1, dayNum),
    })
  }

  // ngày trong tháng
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d)
    cells.push({
      day: d,
      inMonth: true,
      isToday:
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear(),
      isSelected: isSelectedDate(year, month, d),
    })
  }

  // ngày tháng sau
  while (cells.length < 42) {
    const nextIndex = cells.length - (startWeekday + daysInMonth) + 1
    const date = new Date(year, month + 1, nextIndex)
    cells.push({
      day: nextIndex,
      inMonth: false,
      isToday:
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear(),
      isSelected: isSelectedDate(year, month + 1, nextIndex),
    })
  }

  return cells
}

/* ===== LABEL & CELLS 2 THÁNG ===== */
const leftMonthLabel = computed(
  () => `${months[baseMonth.value]} năm ${baseYear.value}`,
)

const rightMonthLabel = computed(() => {
  const m2 = (baseMonth.value + 1) % 12
  const y2 = baseYear.value + (baseMonth.value === 11 ? 1 : 0)
  return `${months[m2]} năm ${y2}`
})

const leftCalendarCells = computed(() =>
  makeCalendar(baseYear.value, baseMonth.value),
)

const rightCalendarCells = computed(() => {
  const m2 = (baseMonth.value + 1) % 12
  const y2 = baseYear.value + (baseMonth.value === 11 ? 1 : 0)
  return makeCalendar(y2, m2)
})

/* ===== EVENT HANDLERS ===== */
const selectOption = (value) => {
  emit('update:modelValue', value)
}

const handleApply = () => {
  emit('apply')
}
</script>

<style scoped>
.filter-dropdown {
  position: absolute;
  left: 0;
  margin-top: 8px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.18);
  padding: 16px 16px 12px;
  display: flex;
  gap: 16px;
  z-index: 20;
}

/* CỘT KHOẢNG THỜI GIAN */
.period-column {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 120px;
}

.period-item {
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid transparent;
  background: transparent;
  font-size: 14px;
  cursor: pointer;
  text-align: left;
}

.period-item--active {
  background: #f2f1ff;
  color: #4f46e5;
}

/* VÙNG LỊCH + FOOTER */
.calendar-area {
  padding-left: 12px;
  border-left: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.calendar-row {
  display: flex;
  gap: 16px;
}

/* CALENDAR */
.calendar-column {
  min-width: 220px;
}

.cal-header {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 4px;
}

.cal-month {
  font-weight: 600;
  font-size: 14px;
}

.cal-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  font-size: 11px;
  color: #6b7280;
  margin-bottom: 4px;
}

.cal-weekdays span {
  text-align: center;
}

.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: 24px;
  gap: 2px;
  font-size: 12px;
}

.cal-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
}

/* ngày ngoài tháng */
.cal-cell--muted {
  color: #d1d5db;
}

/* range được chọn (tuần / tháng) – nền xám nhạt */
.cal-cell--selected {
  background: #e5e7eb;
}

/* hôm nay – đặt sau để override màu xám */
.cal-cell--today {
  background: #4f46e5;
  color: #ffffff;
}

/* FOOTER BUTTONS */
.filter-footer {
  margin-top: 4px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.footer-btn {
  min-width: 80px;
  padding: 6px 16px;
  border-radius: 10px;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid transparent;
}

.footer-btn--ghost {
  background: #f9fafb;
  border-color: #e5e7eb;
  color: #111827;
}

.footer-btn--primary {
  background: #4f46e5;
  color: #ffffff;
}
</style>
