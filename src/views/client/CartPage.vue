<template>
  <div class="cart-page">
    <ClientHeader />

    <main class="container">
      <section v-if="requireLogin" class="state">
        <h2>Vui lòng đăng nhập để xem giỏ hàng</h2>
        <button class="btn" @click="goToLogin">Đăng nhập</button>
      </section>

      <section v-else-if="loading" class="state">
        <p>Đang tải giỏ hàng…</p>
      </section>

      <section v-else-if="forbidden" class="state state--error">
        <h2>{{ forbiddenMessage || 'Tài khoản của bạn không thể truy cập giỏ hàng.' }}</h2>
        <button class="btn" @click="goToLogin">Đăng nhập tài khoản khách hàng</button>
      </section>

      <section v-else-if="loadError" class="state state--error">
        <p>{{ loadError }}</p>
        <button class="btn" @click="loadCart">Thử lại</button>
      </section>

      <section v-else class="layout">
        <div v-if="feedback.message" :class="['notice', `notice--${feedback.type}`]">
          {{ feedback.message }}
        </div>
        <div class="items" v-if="items.length">
          <table class="table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in items" :key="item.id">
                <td class="product">
                  <img :src="item.imageUrl || fallbackImage" alt="Ảnh sản phẩm" />
                  <div class="product__info">
                    <h3>{{ item.productName || 'Sản phẩm' }}</h3>
                    <p v-if="item.color || item.size" class="muted">
                      <span v-if="item.color">Màu: {{ item.color }}</span>
                      <span v-if="item.color && item.size"> · </span>
                      <span v-if="item.size">Size: {{ item.size }}</span>
                    </p>
                    <p v-if="item.sku" class="muted">SKU: {{ item.sku }}</p>
                  </div>
                </td>
                <td>{{ formatCurrencyVND(item.price) }}</td>
                <td>
                  <div class="qty">
                    <button @click="decrease(item)" :disabled="isUpdating(item.id) || item.quantity <= 1">–</button>
                    <input
                      type="number"
                      min="1"
                      :value="item.quantity"
                      @change="onQuantityInput(item, $event.target.value)"
                      :disabled="isUpdating(item.id)"
                    />
                    <button @click="increase(item)" :disabled="isUpdating(item.id)">+</button>
                  </div>
                </td>
                <td>{{ formatCurrencyVND(item.price * item.quantity) }}</td>
                <td class="actions">
                  <button class="link" @click="remove(item)" :disabled="isDeleting(item.id)">
                    Xóa
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="empty">
          <p>Giỏ hàng của bạn đang trống.</p>
          <router-link class="btn" :to="{ name: 'home' }">Tiếp tục mua sắm</router-link>
        </div>

        <aside class="summary" v-if="items.length">
          <h3>Tóm tắt đơn hàng</h3>
          <div class="summary__row">
            <span>Tạm tính</span>
            <span>{{ formatCurrencyVND(subtotal) }}</span>
          </div>
          <div class="summary__row">
            <span>Phí vận chuyển</span>
            <span>Miễn phí</span>
          </div>
          <div class="summary__total">
            <span>Tổng cộng</span>
            <span>{{ formatCurrencyVND(total) }}</span>
          </div>
          <button class="btn btn--primary" @click="checkout" :disabled="!items.length">Thanh toán</button>
        </aside>
      </section>
    </main>

    <ClientFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import ClientHeader from '../../components/client/ClientHeaderLogged.vue';
import ClientFooter from '../../components/client/ClientFooter.vue';
import { getCart, updateItem, removeItem } from '../../services/cartService';
import { formatCurrencyVND } from '../../utils/format';
import { useAuthStore } from '../../stores/auth';

const router = useRouter();
const { isLoggedIn, role } = useAuthStore();
const isCustomerAccount = computed(() => {
  const value = role.value;
  return value === 'user' || value === 'customer' || value === 2;
});

const loading = ref(true);
const loadError = ref('');
const requireLogin = ref(false);
const forbidden = ref(false);
const forbiddenMessage = ref('');
const items = ref([]);
const updatingItemIds = ref(new Set());
const deletingItemIds = ref(new Set());
const feedback = ref({ type: '', message: '' });

const fallbackImage = 'https://via.placeholder.com/80x80?text=No+Image';

const subtotal = computed(() => items.value.reduce((sum, item) => sum + item.price * item.quantity, 0));
const total = computed(() => subtotal.value);

function isUpdating(id) {
  return updatingItemIds.value.has(id);
}
function isDeleting(id) {
  return deletingItemIds.value.has(id);
}

function markUpdating(id, active) {
  const set = updatingItemIds.value;
  const next = new Set(set);
  if (active) next.add(id); else next.delete(id);
  updatingItemIds.value = next;
}

function markDeleting(id, active) {
  const set = deletingItemIds.value;
  const next = new Set(set);
  if (active) next.add(id); else next.delete(id);
  deletingItemIds.value = next;
}

function setFeedback(type, message) {
  feedback.value = message ? { type, message } : { type: '', message: '' };
}

function clearFeedback() {
  setFeedback('', '');
}

async function loadCart() {
  if (!isLoggedIn.value) {
    requireLogin.value = true;
    loading.value = false;
    forbidden.value = false;
    forbiddenMessage.value = '';
    items.value = [];
    setFeedback('', '');
    return;
  }

  if (!isCustomerAccount.value) {
    loading.value = false;
    requireLogin.value = false;
    forbidden.value = true;
    forbiddenMessage.value = 'Giỏ hàng chỉ dành cho tài khoản khách hàng. Vui lòng đăng nhập bằng tài khoản khách hàng.';
    items.value = [];
    setFeedback('', '');
    return;
  }

  loading.value = true;
  loadError.value = '';
  forbidden.value = false;
  forbiddenMessage.value = '';
  clearFeedback();
  try {
    const data = await getCart();
    items.value = (data?.items || []).map((item) => ({
      ...item,
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
    }));
  } catch (err) {
    if (err?.status === 403) {
      forbidden.value = true;
      forbiddenMessage.value = 'Giỏ hàng chỉ dành cho tài khoản khách hàng. Vui lòng đăng nhập bằng tài khoản khách hàng.';
      loadError.value = '';
    } else {
      loadError.value = err?.message || 'Không thể tải giỏ hàng.';
    }
  } finally {
    loading.value = false;
    requireLogin.value = false;
  }
}

async function updateQuantity(item, quantity) {
  const newQty = Number(quantity);
  if (!Number.isFinite(newQty) || newQty < 1) return;
  if (newQty === item.quantity) return;

  clearFeedback();
  markUpdating(item.id, true);
  try {
    await updateItem(item.id, newQty);
    item.quantity = newQty;
    setFeedback('success', 'Đã cập nhật số lượng sản phẩm.');
  } catch (err) {
    if (err?.status === 403) {
      forbidden.value = true;
      forbiddenMessage.value = 'Giỏ hàng chỉ dành cho tài khoản khách hàng. Vui lòng đăng nhập bằng tài khoản khách hàng.';
      setFeedback('error', forbiddenMessage.value);
    } else {
      setFeedback('error', err?.message || 'Không thể cập nhật số lượng.');
    }
  } finally {
    markUpdating(item.id, false);
  }
}

function decrease(item) {
  updateQuantity(item, item.quantity - 1);
}
function increase(item) {
  updateQuantity(item, item.quantity + 1);
}
function onQuantityInput(item, value) {
  updateQuantity(item, value);
}

async function remove(item) {
  if (!confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
    return;
  }
  clearFeedback();
  markDeleting(item.id, true);
  try {
    await removeItem(item.id);
    items.value = items.value.filter((cartItem) => cartItem.id !== item.id);
    setFeedback('success', 'Đã xóa sản phẩm khỏi giỏ hàng.');
  } catch (err) {
    if (err?.status === 403) {
      forbidden.value = true;
      forbiddenMessage.value = 'Giỏ hàng chỉ dành cho tài khoản khách hàng. Vui lòng đăng nhập bằng tài khoản khách hàng.';
      setFeedback('error', forbiddenMessage.value);
    } else {
      setFeedback('error', err?.message || 'Không thể xóa sản phẩm.');
    }
  } finally {
    markDeleting(item.id, false);
  }
}

function checkout() {
  clearFeedback();
  setFeedback('info', 'Chức năng thanh toán đang được phát triển.');
}

function goToLogin() {
  router.push({ name: 'login', query: { redirect: '/cart' } });
}

onMounted(() => {
  loadCart();
});

watch(isLoggedIn, (loggedIn) => {
  if (loading.value) return;
  if (loggedIn) {
    loadCart();
  } else {
    items.value = [];
    requireLogin.value = true;
    forbidden.value = false;
    forbiddenMessage.value = '';
    clearFeedback();
  }
});

watch(role, () => {
  if (!loading.value && isLoggedIn.value) {
    loadCart();
  }
});
</script>

<style scoped>
.cart-page {
  min-height: 100vh;
  background: #f9fafb;
}

.container {
  max-width: 1200px;
  margin: 24px auto 48px;
  padding: 0 24px;
}

.state {
  background: #fff;
  padding: 48px 32px;
  text-align: center;
  border-radius: 16px;
  box-shadow: 0 10px 40px -20px rgba(15, 23, 42, 0.35);
  color: #1f2937;
  display: grid;
  gap: 16px;
}
.state--error {
  color: #b91c1c;
}

.btn {
  border: none;
  border-radius: 999px;
  padding: 10px 24px;
  font-weight: 700;
  background: #4f46e5;
  color: #fff;
  cursor: pointer;
  transition: transform 0.2s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.btn:hover {
  transform: translateY(-1px);
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.layout {
  display: grid;
  gap: 24px;
  grid-template-columns: 1fr 320px;
  align-items: start;
}

.notice {
  grid-column: 1 / -1;
  padding: 12px 16px;
  border-radius: 14px;
  font-weight: 600;
  font-size: 14px;
}
.notice--success {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}
.notice--error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}
.notice--info {
  background: #e0f2fe;
  color: #0c4a6e;
  border: 1px solid #bae6fd;
}

.items {
  background: #fff;
  border-radius: 16px;
  padding: 16px 20px;
  box-shadow: 0 10px 40px -20px rgba(15, 23, 42, 0.25);
}

.table {
  width: 100%;
  border-collapse: collapse;
}
.table th,
.table td {
  padding: 14px 12px;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
}
.table thead th {
  font-size: 13px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #6b7280;
}
.table tbody tr:last-child td {
  border-bottom: none;
}

.product {
  display: flex;
  gap: 14px;
  align-items: center;
}
.product img {
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: 12px;
  background: #f3f4f6;
}
.product__info h3 {
  margin: 0 0 4px;
  font-size: 16px;
  color: #111827;
}
.product__info .muted {
  margin: 0;
  color: #6b7280;
  font-size: 13px;
}

.qty {
  display: inline-flex;
  align-items: center;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
}
.qty button {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 18px;
  color: #1f2937;
}
.qty button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.qty input {
  width: 48px;
  border: none;
  text-align: center;
  font-size: 15px;
  padding: 0;
  outline: none;
}

.actions {
  text-align: right;
}
.actions .link {
  border: none;
  background: none;
  color: #ef4444;
  cursor: pointer;
  font-weight: 600;
}
.actions .link:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.empty {
  grid-column: 1 / -1;
  background: #fff;
  border-radius: 16px;
  padding: 48px;
  text-align: center;
  box-shadow: 0 10px 40px -20px rgba(15, 23, 42, 0.35);
  display: grid;
  gap: 16px;
}
.empty p {
  margin: 0;
  font-size: 18px;
  color: #4b5563;
}

.summary {
  background: #111827;
  color: #fff;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 10px 40px -10px rgba(15, 23, 42, 0.45);
  position: sticky;
  top: 100px;
}
.summary h3 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 20px;
}
.summary__row,
.summary__total {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 15px;
}
.summary__total {
  font-size: 18px;
  font-weight: 700;
  border-top: 1px solid rgba(255,255,255,0.2);
  padding-top: 12px;
  margin-top: 12px;
}
.btn--primary {
  width: 100%;
  margin-top: 20px;
}

@media (max-width: 992px) {
  .layout {
    grid-template-columns: 1fr;
  }
  .summary {
    position: static;
  }
}
</style>
