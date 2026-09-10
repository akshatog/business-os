import {
  fetchMockSalesToday, type MockSalesTodayResponse,
  fetchMockTotalCustomers, type MockTotalCustomersResponse,
  fetchMockTotalProducts, type MockTotalProductsResponse,
  fetchMockLowStock, type MockLowStockResponse,
  fetchMockTotalSuppliers, type MockTotalSuppliersResponse,
  fetchMockTodaysTransactions, type MockTodaysTransactionsResponse
} from "@/mocks/dashboard";

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

/**
 * Retrieves the "Total Products" metric.
 * Currently uses mock data. Will be replaced by a real API call when the backend is ready.
 */
export async function getTotalProducts(): Promise<MockTotalProductsResponse> {
  return fetchMockTotalProducts();
}

/**
 * Retrieves the "Low Stock" metric count.
 * Currently uses mock data. Will be replaced by a real API call when the backend is ready.
 */
export async function getLowStockCount(): Promise<MockLowStockResponse> {
  return fetchMockLowStock();
}

/**
 * Retrieves the "Total Suppliers" metric count.
 * Currently uses mock data. Will be replaced by a real API call when the backend is ready.
 */
export async function getTotalSuppliers(): Promise<MockTotalSuppliersResponse> {
  return fetchMockTotalSuppliers();
}

/**
 * Retrieves the "Today's Transactions" metric count.
 * Currently uses mock data. Will be replaced by a real API call when the backend is ready.
 */
export async function getTodaysTransactions(): Promise<MockTodaysTransactionsResponse> {
  return fetchMockTodaysTransactions();
}
