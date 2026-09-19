import prisma from "../db/client.js";
import { writeAuditLog } from "./audit.service.js";

type CreateProductParams = {
  businessId: string;
  userId: string;
  name: string;
  sku?: string;
  barcode?: string;
  price: number; // in paise
  categoryId?: string;
  supplierId?: string;
};

export async function createProduct(params: CreateProductParams) {
  // 1. Cross-tenant relation check for Category
  if (params.categoryId) {
    const category = await prisma.category.findFirst({
      where: {
        id: params.categoryId,
        businessId: params.businessId,
      },
    });
    if (!category) {
      throw new Error(
        "Invalid category: Does not exist or belongs to another business.",
      );
    }
  }

  // 2. Uniqueness check for SKU (scoped to the current business)
  if (params.sku) {
    const existingSku = await prisma.product.findFirst({
      where: {
        sku: params.sku,
        businessId: params.businessId,
      },
    });
    if (existingSku) {
      throw new Error(
        "A product with this SKU already exists in your business.",
      );
    }
  }

  // 3. Create product and audit log in a transaction
  return prisma.$transaction(async (tx: any) => {
    const product = await tx.product.create({
      data: {
        businessId: params.businessId,
        name: params.name,
        sku: params.sku,
        barcode: params.barcode,
        price: params.price,
        categoryId: params.categoryId,
        supplierId: params.supplierId,
      },
    });

    await writeAuditLog(
      {
        userId: params.userId,
        action: "create",
        entityType: "product",
        entityId: product.id,
        newValue: product,
      },
      tx,
    );

    return product;
  });
}

type UpdateProductParams = {
  productId: string;
  businessId: string;
  userId: string;
  name?: string;
  sku?: string;
  barcode?: string;
  price?: number;
  categoryId?: string;
  supplierId?: string;
  isActive?: boolean;
};

export async function updateProduct(params: UpdateProductParams) {
  // 1. Verify existence and ownership
  const existingProduct = await prisma.product.findFirst({
    where: { id: params.productId, businessId: params.businessId },
  });

  if (!existingProduct) {
    throw new Error("Product not found or access denied.");
  }

  // 2. Cross-tenant relation check for Category
  if (params.categoryId) {
    const category = await prisma.category.findFirst({
      where: { id: params.categoryId, businessId: params.businessId },
    });
    if (!category) {
      throw new Error(
        "Invalid category: Does not exist or belongs to another business.",
      );
    }
  }

  // 3. Uniqueness check for SKU (scoped to the current business)
  if (params.sku && params.sku !== existingProduct.sku) {
    const existingSku = await prisma.product.findFirst({
      where: { sku: params.sku, businessId: params.businessId },
    });
    if (existingSku) {
      throw new Error(
        "A product with this SKU already exists in your business.",
      );
    }
  }

  // 4. Update and audit log in a transaction
  return prisma.$transaction(async (tx: any) => {
    const updatedProduct = await tx.product.update({
      where: { id: params.productId },
      data: {
        name: params.name,
        sku: params.sku,
        barcode: params.barcode,
        price: params.price,
        categoryId: params.categoryId,
        supplierId: params.supplierId,
        isActive: params.isActive,
      },
    });

    await writeAuditLog(
      {
        userId: params.userId,
        action: "update",
        entityType: "product",
        entityId: updatedProduct.id,
        oldValue: existingProduct,
        newValue: updatedProduct,
      },
      tx,
    );

    return updatedProduct;
  });
}
