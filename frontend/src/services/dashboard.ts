import { fetchMockSalesToday, type MockSalesTodayResponse, fetchMockTotalCustomers, type MockTotalCustomersResponse } from "@/mocks/dashboard";

/**
 * Retrieves the "Sales Today" metric.
 * Currently uses mock data. Will be replaced by a real API call when the backend is ready.
 */
export async function getSalesToday(): Promise<MockSalesTodayResponse> {
  return fetchMockSalesToday();
}

/**
 * Retrieves the "Total Customers" metric.
 * Currently uses mock data. Will be replaced by a real API call when the backend is ready.
 */
export async function getTotalCustomers(): Promise<MockTotalCustomersResponse> {
  return fetchMockTotalCustomers();
}
