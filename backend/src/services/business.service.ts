import { BusinessType } from "@prisma/client";
import prisma from "../db/client.js";

export interface OnboardingInput {
  businessType: string;
  address?: string;
  gstNumber?: string;
  phone?: string;
}

export async function updateOnboarding(
  businessId: string,
  input: OnboardingInput,
): Promise<void> {
  // Validate businessType is a known enum value
  const validTypes = Object.values(BusinessType) as string[];
  if (!validTypes.includes(input.businessType)) {
    throw new Error(`Invalid businessType: ${input.businessType}`);
  }

  await prisma.$transaction(async (tx) => {
    await tx.business.update({
      where: { id: businessId },
      data: {
        businessType: input.businessType as BusinessType,
        address: input.address,
        gstNumber: input.gstNumber,
        phone: input.phone,
        onboardingCompleted: true,
      },
    });
  });
}
