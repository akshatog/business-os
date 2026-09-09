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
