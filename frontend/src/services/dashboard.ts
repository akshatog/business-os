import { fetchMockSalesToday, type MockSalesTodayResponse } from "@/mocks/dashboard";

/**
 * Retrieves the "Sales Today" metric.
 * Currently uses mock data. Will be replaced by a real API call when the backend is ready.
 */
export async function getSalesToday(): Promise<MockSalesTodayResponse> {
  return fetchMockSalesToday();
}
