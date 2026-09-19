import { mockProducts } from "@/mocks/products";
import type { Product } from "@/types/product";

/**
 * Searches products by name, SKU, or barcode.
 * Simulates a backend API call with a slight delay.
 */
export async function searchProducts(query: string): Promise<Product[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  // Simulate API failure randomly for error state testing
  if (query.toLowerCase() === "error") {
    throw new Error("Simulated network error while searching products");
  }

  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) {
    return [];
  }

  return mockProducts.filter((product) => {
    return (
      product.name.toLowerCase().includes(normalizedQuery) ||
      (product.sku && product.sku.toLowerCase().includes(normalizedQuery)) ||
      (product.barcode && product.barcode.includes(normalizedQuery))
    );
  });
}
