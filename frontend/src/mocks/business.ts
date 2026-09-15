import type { Business } from "@/types/business";

let mockBusiness: Business = {
  id: "bus-12345",
  name: "My Awesome Business",
  businessType: null,
  address: null,
  gstNumber: null,
  phone: null,
  email: "owner@example.com",
  onboardingCompleted: false,
  createdAt: new Date().toISOString(),
};

export async function fetchMockBusiness(): Promise<Business> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...mockBusiness });
    }, 400);
  });
}

export async function updateMockBusiness(data: Partial<Business>): Promise<Business> {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockBusiness = { ...mockBusiness, ...data };
      resolve({ ...mockBusiness });
    }, 400);
  });
}
