// src/services/cartService.js
import { reactive } from "vue";
import { request } from "./http";

/* ===== STATE ===== */
const cartState = reactive({
  // { id, productId, productVariantId, name, variant, price, quantity, image }
  items: [],
});

/* ===== UTILS ===== */
const toNumberSafe = (v) => {
  const n = Number(String(v ?? 0).replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

/* Map một item từ /cart */
function mapCartItemRaw(it) {
  return {
    id: it.id ?? it.itemId,
    productId: it.productId ?? it.product?.id ?? null,
    productVariantId:
      it.productVariantId ?? it.variantId ?? it.productVariant?.id ?? null,
    name: it.name ?? it.productName ?? it.product?.name ?? "Sản phẩm",
    variant:
      it.variant?.name ??
      [it.variant?.color, it.variant?.size, it.color, it.size, it.optionName]
        .filter(Boolean)
        .join(", "),
    price: toNumberSafe(it.price ?? it.salePrice ?? it.unitPrice ?? 0),
    quantity: Number.parseInt(it.quantity, 10) || 1,
    image: it.imageUrl || it.image || it.product?.imageUrl || "",
  };
}

/* Bổ sung ảnh/thuộc tính từ /products/{id} khi item chưa có ảnh */
async function enrichWithProduct(item) {
  if (item.image || !item.productId) return item;

  try {
    const res = await request(`/products/${item.productId}`, { method: "GET" });
    const product = res?.data?.data || res?.data || {};
    const variants = Array.isArray(product.variants) ? product.variants : [];
    const v =
      variants.find((x) => x.id === item.productVariantId) ||
      variants[0] ||
      {};

    return {
      ...item,
      name: item.name || product.name || "Sản phẩm",
      variant: item.variant || [v.color, v.size].filter(Boolean).join(", "),
      price: item.price > 0 ? item.price : toNumberSafe(v.price ?? product.price),
      image: v.imageUrl || product.imageUrl || product.thumbnail || "",
    };
  } catch {
    return item;
  }
}

/* ===== PUBLIC API ===== */

/** Lấy giỏ hàng hiện tại */
export async function fetchCart() {
  const res = await request("/cart", { method: "GET" });
  const raw =
    Array.isArray(res?.items)
      ? res.items
      : Array.isArray(res?.data?.items)
      ? res.data.items
      : Array.isArray(res)
      ? res
      : [];
  let items = raw.map(mapCartItemRaw);
  items = await Promise.all(items.map(enrichWithProduct));
  cartState.items = items;
  return cartState.items;
}

/** Thêm sản phẩm vào giỏ */
export async function addItem(productVariantId, quantity = 1) {
  const pid = Number(productVariantId);
  const qty = Number.parseInt(quantity, 10);

  if (!Number.isInteger(pid) || pid <= 0)
    throw new Error(`Payload không hợp lệ: productVariantId=${productVariantId}`);
  if (!Number.isInteger(qty) || qty <= 0)
    throw new Error(`Payload không hợp lệ: quantity=${quantity}`);

  await request("/cart", {
    method: "POST",
    data: { productVariantId: pid, quantity: qty }, // ✅ đổi sang data
  });

  await fetchCart();
}

/** Cập nhật số lượng */
export async function updateItem(itemId, quantity) {
  const qty = Math.max(1, Number.parseInt(quantity, 10) || 1);
  await request(`/cart/${itemId}`, {
    method: "PUT",
    data: { quantity: qty }, // ✅ đổi sang data
  });

  const it = cartState.items.find((i) => i.id === itemId);
  if (it) it.quantity = qty;
}

/** Xoá item khỏi giỏ */
export async function removeItem(itemId) {
  await request(`/cart/${itemId}`, { method: "DELETE" });
  cartState.items = cartState.items.filter((i) => i.id !== itemId);
}

/** Tăng số lượng */
export async function increase(itemId) {
  const it = cartState.items.find((i) => i.id === itemId);
  if (!it) return;
  const next = (Number.parseInt(it.quantity, 10) || 1) + 1;
  it.quantity = next;
  await updateItem(itemId, next);
}

/** Giảm số lượng */
export async function decrease(itemId) {
  const it = cartState.items.find((i) => i.id === itemId);
  if (!it) return;
  const next = Math.max(1, (Number.parseInt(it.quantity, 10) || 1) - 1);
  it.quantity = next;
  await updateItem(itemId, next);
}

/** Đặt lại số lượng */
export async function setQty(itemId, qty) {
  const next = Math.max(1, Number.parseInt(qty, 10) || 1);
  const it = cartState.items.find((i) => i.id === itemId);
  if (!it) return;
  it.quantity = next;
  await updateItem(itemId, next);
}

/** Xoá toàn bộ giỏ hàng local */
export function clearLocal() {
  cartState.items = [];
}

/** Hook tiện dụng cho các component */
export function useCart() {
  return {
    cartState,
    fetchCart,
    addItem,
    updateItem,
    removeItem,
    increase,
    decrease,
    setQty,
    clearLocal,
  };
}
