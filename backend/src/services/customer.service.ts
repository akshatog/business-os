import prisma from "../db/client.js";
import { writeAuditLog } from "./audit.service.js";

type CreateCustomerParams = {
  businessId: string;
  userId: string;
  name: string;
  phone?: string;
  email?: string;
};

export async function createCustomer(params: CreateCustomerParams) {
  if (params.phone) {
    const existingPhone = await prisma.customer.findFirst({
      where: { phone: params.phone, businessId: params.businessId },
    });

    if (existingPhone) {
      throw new Error(
        "A customer with this phone number already exists in your business.",
      );
    }
  }

  return prisma.$transaction(async (tx: any) => {
    const customer = await tx.customer.create({
      data: {
        businessId: params.businessId,
        name: params.name,
        phone: params.phone,
        email: params.email,
      },
    });

    await writeAuditLog(
      {
        userId: params.userId,
        action: "create",
        entityType: "customer",
        entityId: customer.id,
        newValue: customer,
      },
      tx,
    );

    return customer;
  });
}

type UpdateCustomerParams = {
  customerId: string;
  businessId: string;
  userId: string;
  name?: string;
  phone?: string;
  email?: string;
};

export async function updateCustomer(params: UpdateCustomerParams) {
  const existingCustomer = await prisma.customer.findFirst({
    where: { id: params.customerId, businessId: params.businessId },
  });

  if (!existingCustomer) {
    throw new Error("Customer not found or access denied.");
  }

  if (params.phone && params.phone !== existingCustomer.phone) {
    const existingPhone = await prisma.customer.findFirst({
      where: { phone: params.phone, businessId: params.businessId },
    });
    if (existingPhone) {
      throw new Error(
        "A customer with this phone number already exists in your business.",
      );
    }
  }

  return prisma.$transaction(async (tx: any) => {
    const updatedCustomer = await tx.customer.update({
      where: { id: params.customerId },
      data: {
        name: params.name,
        phone: params.phone,
        email: params.email,
      },
    });

    await writeAuditLog(
      {
        userId: params.userId,
        action: "update",
        entityType: "customer",
        entityId: updatedCustomer.id,
        oldValue: existingCustomer,
        newValue: updatedCustomer,
      },
      tx,
    );

    return updatedCustomer;
  });
}
