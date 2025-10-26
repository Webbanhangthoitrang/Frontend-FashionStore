// src/services/cartService.js
import { reactive } from "vue";
import { request } from "./http";

/** State reactive dùng chung */
const cartState = reactive({
  // Mỗi item kỳ vọng dạng: { id, productVariantId, name, variant, price, quantity, image }
  items: [],
});

/** Chuẩn hoá dữ liệu item từ backend về cấu trúc UI cần */
function mapApiItem(it) {
  // tuỳ payload thực tế của bạn, chỉnh các key dưới đây cho khớp:
  return {
    id: it.id ?? it.itemId, // id của dòng cart
    productVariantId: it.productVariantId ?? it.variantId,
    name: it.name ?? it.productName ?? it.product?.name ?? "Sản phẩm",
    variant:
      it.variant ??
      [it.color, it.size, it.optionName].filter(Boolean).join(", "),
    price:
      Number(String(it.price ?? it.salePrice ?? 0).replace(/[^\d.-]/g, "")) || 0,
    quantity: Number.parseInt(it.quantity, 10) || 1,
    image: it.image ?? it.thumbnail ?? it.product?.thumbnail ?? "",
  };
}

/** Lấy giỏ hàng từ server */
export async function fetchCart() {
  const { data } = await request("/cart", { method: "GET" });
  const items =
    Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
  cartState.items = items.map(mapApiItem);
  return cartState.items;
}

/** Thêm sản phẩm vào giỏ (API yêu cầu productVariantId + quantity) */
export async function addItem(productVariantId, quantity = 1) {
  const pid = Number(productVariantId);
  const qty = Number.parseInt(quantity, 10);

  // Validate chặt chẽ để tránh 400
  if (!Number.isInteger(pid) || pid <= 0) {
    throw new Error(
      `Payload không hợp lệ: productVariantId=${productVariantId}`
    );
  }
  if (!Number.isInteger(qty) || qty <= 0) {
    throw new Error(`Payload không hợp lệ: quantity=${quantity}`);
  }

  await request("/cart", {
    method: "POST",
    body: { productVariantId: pid, quantity: qty },
  });

  // backend đã thay đổi giỏ -> refetch để đồng bộ UI
  await fetchCart();
}

/** Cập nhật số lượng một dòng giỏ */
export async function updateItem(itemId, quantity) {
  const qty = Math.max(1, Number.parseInt(quantity, 10) || 1);

  await request(`/cart/${itemId}`, {
    method: "PUT",
    body: { quantity: qty },
  });

  // cập nhật local ngay để UI mượt
  const it = cartState.items.find((i) => i.id === itemId);
  if (it) it.quantity = qty;
}

/** Xoá một dòng giỏ */
export async function removeItem(itemId) {
  await request(`/cart/${itemId}`, { method: "DELETE" });
  cartState.items = cartState.items.filter((i) => i.id !== itemId);
}

/** Các thao tác tiện lợi cho CartPage (local trước, rồi sync API) */
export async function increase(itemId) {
  const it = cartState.items.find((i) => i.id === itemId);
  if (it) {
    const next = (Number.parseInt(it.quantity, 10) || 1) + 1;
    it.quantity = next;
    await updateItem(itemId, next);
  }
}

export async function decrease(itemId) {
  const it = cartState.items.find((i) => i.id === itemId);
  if (it) {
    const next = Math.max(1, (Number.parseInt(it.quantity, 10) || 1) - 1);
    it.quantity = next;
    await updateItem(itemId, next);
  }
}

export async function setQty(itemId, qty) {
  const next = Math.max(1, Number.parseInt(qty, 10) || 1);
  const it = cartState.items.find((i) => i.id === itemId);
  if (it) {
    it.quantity = next;
    await updateItem(itemId, next);
  }
}

export function clearLocal() {
  cartState.items = [];
}

/** Hook dùng trong component */
export function useCart() {
  return {
    cartState,
    fetchCart,
    addItem, // có thể import { addItem } từ cartService để gọi ở ProductDetail
    updateItem,
    removeItem,
    increase,
    decrease,
    setQty,
    clearLocal,
  };
}
