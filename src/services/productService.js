import { request } from './http';

function normalizeProductSummary(product) {
  if (!product) return null;
  const firstVariant = product.variants?.[0];
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: firstVariant?.price ?? 0,
    imageUrl: firstVariant?.imageUrl || '',
    categoryId: product.categoryId,
    categoryName: product.category?.name || null,
    variants: product.variants || [],
  };
}

function normalizeProductDetail(product) {
  if (!product) return null;
  const variants = product.variants || [];
  const gallery = variants
    .map((v) => v.imageUrl)
    .filter((url) => Boolean(url))
    .reduce((acc, url) => {
      if (!acc.includes(url)) acc.push(url);
      return acc;
    }, []);

  const colors = variants
    .map((v) => v.color)
    .filter((color) => Boolean(color))
    .reduce((acc, value) => {
      if (!acc.includes(value)) acc.push(value);
      return acc;
    }, []);

  const sizes = variants
    .map((v) => v.size)
    .filter((size) => Boolean(size))
    .reduce((acc, value) => {
      if (!acc.includes(value)) acc.push(value);
      return acc;
    }, []);

  const priceList = variants
    .map((v) => v.price)
    .filter((price) => typeof price === 'number');

  const minPrice = priceList.length
    ? Math.min(...priceList)
    : 0;

  return {
    ...product,
    variants,
    gallery,
    colors,
    sizes,
    price: minPrice,
    categoryName: product.category?.name || null,
  };
}

async function getProducts(params) {
  const { data } = await request('/products', { params, auth: false });
  const items = data?.items || [];
  return {
    items: items.map(normalizeProductSummary),
    total: data?.total || items.length,
    page: data?.page || 1,
    limit: data?.limit || items.length,
  };
}

async function getProductById(id) {
  const { data } = await request(`/products/${id}`, { auth: false });
  return normalizeProductDetail(data);
}

export { getProducts, getProductById, normalizeProductSummary };
