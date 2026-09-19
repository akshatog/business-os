import prisma from "../db/client.js";
import { writeAuditLog } from "./audit.service.js";

type CreateCategoryParams = {
  businessId: string;
  userId: string;
  name: string;
};

export async function createCategory(params: CreateCategoryParams) {
  // 1. Uniqueness check for Name
  const existingName = await prisma.productCategory.findFirst({
    where: { name: params.name, businessId: params.businessId },
  });
  
  if (existingName) {
    throw new Error("A category with this name already exists in your business.");
  }

  // 2. Create and audit
  return prisma.$transaction(async (tx: any) => {
    const category = await tx.productCategory.create({
      data: {
        businessId: params.businessId,
        name: params.name,
      },
    });

    await writeAuditLog(
      {
        userId: params.userId,
        action: "create",
        entityType: "category",
        entityId: category.id,
        newValue: category,
      },
      tx
    );

    return category;
  });
}

type UpdateCategoryParams = {
  categoryId: string;
  businessId: string;
  userId: string;
  name?: string;
};

export async function updateCategory(params: UpdateCategoryParams) {
  // 1. Verify existence and ownership
  const existingCategory = await prisma.productCategory.findFirst({
    where: { id: params.categoryId, businessId: params.businessId },
  });
  
  if (!existingCategory) {
    throw new Error("Category not found or access denied.");
  }

  // 2. Uniqueness check for Name
  if (params.name && params.name !== existingCategory.name) {
    const existingName = await prisma.productCategory.findFirst({
      where: { name: params.name, businessId: params.businessId },
    });
    if (existingName) {
      throw new Error("A category with this name already exists in your business.");
    }
  }

  // 3. Update and audit
  return prisma.$transaction(async (tx: any) => {
    const updatedCategory = await tx.productCategory.update({
      where: { id: params.categoryId },
      data: {
        name: params.name,
      },
    });

    await writeAuditLog(
      {
        userId: params.userId,
        action: "update",
        entityType: "category",
        entityId: updatedCategory.id,
        oldValue: existingCategory,
        newValue: updatedCategory,
      },
      tx
    );

    return updatedCategory;
  });
}

type DeleteCategoryParams = {
  categoryId: string;
  businessId: string;
  userId: string;
};

export async function deleteCategory(params: DeleteCategoryParams) {
  // 1. Verify existence and ownership
  const existingCategory = await prisma.productCategory.findFirst({
    where: { id: params.categoryId, businessId: params.businessId },
  });
  
  if (!existingCategory) {
    throw new Error("Category not found or access denied.");
  }

  // 2. Prevent deletion if products are assigned
  const associatedProduct = await prisma.product.findFirst({
    where: { categoryId: params.categoryId },
  });

  if (associatedProduct) {
    throw new Error("Cannot delete category because it is currently assigned to one or more products.");
  }

  // 3. Delete and audit
  return prisma.$transaction(async (tx: any) => {
    const deletedCategory = await tx.productCategory.delete({
      where: { id: params.categoryId },
    });

    await writeAuditLog(
      {
        userId: params.userId,
        action: "delete",
        entityType: "category",
        entityId: deletedCategory.id,
        oldValue: existingCategory,
      },
      tx
    );

    return deletedCategory;
  });
}
