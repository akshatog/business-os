export interface MockSalesTodayResponse {
  totalSalesPaise: number | null;
}

export const MOCK_SALES_TODAY: MockSalesTodayResponse = {
  totalSalesPaise: 1254300, // ₹12,543.00
};

export async function fetchMockSalesToday(): Promise<MockSalesTodayResponse> {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_SALES_TODAY);
    }, 400);
  });
}

export interface MockTotalCustomersResponse {
  totalCustomers: number | null;
}

export const MOCK_TOTAL_CUSTOMERS: MockTotalCustomersResponse = {
  totalCustomers: 1248,
};

export async function fetchMockTotalCustomers(): Promise<MockTotalCustomersResponse> {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_TOTAL_CUSTOMERS);
    }, 400);
  });
}

export interface MockTotalProductsResponse {
  totalProducts: number | null;
}

export const MOCK_TOTAL_PRODUCTS: MockTotalProductsResponse = {
  totalProducts: 842,
};

export async function fetchMockTotalProducts(): Promise<MockTotalProductsResponse> {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_TOTAL_PRODUCTS);
    }, 400);
  });
}

export interface MockLowStockResponse {
  lowStockCount: number | null;
}

export const MOCK_LOW_STOCK: MockLowStockResponse = {
  lowStockCount: 12,
};

export async function fetchMockLowStock(): Promise<MockLowStockResponse> {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_LOW_STOCK);
    }, 400);
  });
}

export interface MockTotalSuppliersResponse {
  totalSuppliers: number | null;
}

export const MOCK_TOTAL_SUPPLERS: MockTotalSuppliersResponse = {
  totalSuppliers: 45,
};

export async function fetchMockTotalSuppliers(): Promise<MockTotalSuppliersResponse> {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_TOTAL_SUPPLERS);
    }, 400);
  });
}

export interface MockTodaysTransactionsResponse {
  todaysTransactions: number | null;
}

export const MOCK_TODAYS_TRANSACTIONS: MockTodaysTransactionsResponse = {
  todaysTransactions: 284,
};

export async function fetchMockTodaysTransactions(): Promise<MockTodaysTransactionsResponse> {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_TODAYS_TRANSACTIONS);
    }, 400);
  });
}
