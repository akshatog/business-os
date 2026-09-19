import prisma from "../db/client.js";
import { writeAuditLog } from "./audit.service.js";

type CreateSupplierParams = {
  businessId: string;
  userId: string;
  name: string;
  phone?: string;
  email?: string;
  gstNumber?: string;
};

export async function createSupplier(params: CreateSupplierParams) {
  if (params.phone) {
    const existingPhone = await prisma.supplier.findFirst({
      where: { phone: params.phone, businessId: params.businessId },
    });
    
    if (existingPhone) {
      throw new Error("A supplier with this phone number already exists in your business.");
    }
  }

  return prisma.$transaction(async (tx: any) => {
    const supplier = await tx.supplier.create({
      data: {
        businessId: params.businessId,
        name: params.name,
        phone: params.phone,
        email: params.email,
        gstNumber: params.gstNumber,
      },
    });

    await writeAuditLog(
      {
        userId: params.userId,
        action: "create",
        entityType: "supplier",
        entityId: supplier.id,
        newValue: supplier,
      },
      tx
    );

    return supplier;
  });
}

type UpdateSupplierParams = {
  supplierId: string;
  businessId: string;
  userId: string;
  name?: string;
  phone?: string;
  email?: string;
  gstNumber?: string;
};

export async function updateSupplier(params: UpdateSupplierParams) {
  const existingSupplier = await prisma.supplier.findFirst({
    where: { id: params.supplierId, businessId: params.businessId },
  });
  
  if (!existingSupplier) {
    throw new Error("Supplier not found or access denied.");
  }

  if (params.phone && params.phone !== existingSupplier.phone) {
    const existingPhone = await prisma.supplier.findFirst({
      where: { phone: params.phone, businessId: params.businessId },
    });
    if (existingPhone) {
      throw new Error("A supplier with this phone number already exists in your business.");
    }
  }

  return prisma.$transaction(async (tx: any) => {
    const updatedSupplier = await tx.supplier.update({
      where: { id: params.supplierId },
      data: {
        name: params.name,
        phone: params.phone,
        email: params.email,
        gstNumber: params.gstNumber,
      },
    });

    await writeAuditLog(
      {
        userId: params.userId,
        action: "update",
        entityType: "supplier",
        entityId: updatedSupplier.id,
        oldValue: existingSupplier,
        newValue: updatedSupplier,
      },
      tx
    );

    return updatedSupplier;
  });
}
