import type { Business } from "@/types/business";
import { fetchMockBusiness, updateMockBusiness } from "@/mocks/business";

export async function getBusiness(): Promise<Business> {
  return fetchMockBusiness();
}

export async function updateBusiness(data: Partial<Business>): Promise<Business> {
  return updateMockBusiness(data);
}
