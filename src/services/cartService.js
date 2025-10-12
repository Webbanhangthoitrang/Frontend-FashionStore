import { request } from './http';

async function getCart() {
  const { data } = await request('/cart', { method: 'GET' });
  return data || { items: [] };
}

async function addItem({ productVariantId, quantity }) {
  const variantIdNum = Number(productVariantId);
  const qtyNum = Number(quantity) || 1;

  if (!Number.isInteger(qtyNum) || qtyNum <= 0) {
    throw new Error('Số lượng sản phẩm không hợp lệ');
  }

  if (!Number.isInteger(variantIdNum) || variantIdNum <= 0) {
    throw new Error('Thiếu thông tin biến thể sản phẩm');
  }

  await request('/cart', {
    method: 'POST',
    body: { productVariantId: variantIdNum, quantity: qtyNum },
  });
}

async function updateItem(itemId, quantity) {
  await request(`/cart/${itemId}`, {
    method: 'PUT',
    body: { quantity },
  });
}

async function removeItem(itemId) {
  await request(`/cart/${itemId}`, {
    method: 'DELETE',
  });
}

export { getCart, addItem, updateItem, removeItem };
