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
