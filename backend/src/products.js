import { PRODUCTS, CATEGORIES } from "../../shared/data/products.js";

export function listProducts() {
  return PRODUCTS;
}

export function getCategories() {
  return CATEGORIES;
}

export function findProductById(id) {
  return PRODUCTS.find((product) => product.id === id) ?? null;
}
