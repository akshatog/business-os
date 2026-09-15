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

export interface MockOutstandingPaymentsResponse {
  outstandingPaise: number | null;
}

export const MOCK_OUTSTANDING_PAYMENTS: MockOutstandingPaymentsResponse = {
  outstandingPaise: 4250000, // ₹42,500.00
};

export async function fetchMockOutstandingPayments(): Promise<MockOutstandingPaymentsResponse> {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_OUTSTANDING_PAYMENTS);
    }, 400);
  });
}

export interface MockRecentSale {
  id: string;
  reference: string;
  customerName: string;
  amountPaise: number;
  status: "completed" | "pending" | "refunded";
  timestamp: string;
}

export interface MockRecentSalesResponse {
  recentSales: MockRecentSale[];
}

export const MOCK_RECENT_SALES: MockRecentSalesResponse = {
  recentSales: [
    {
      id: "sale-001",
      reference: "INV-2023-001",
      customerName: "Rahul Sharma",
      amountPaise: 125000, // ₹1,250.00
      status: "completed",
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    },
    {
      id: "sale-002",
      reference: "INV-2023-002",
      customerName: "Walk-in Customer",
      amountPaise: 45000, // ₹450.00
      status: "completed",
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    },
    {
      id: "sale-003",
      reference: "INV-2023-003",
      customerName: "Priya Patel",
      amountPaise: 340050, // ₹3,400.50
      status: "pending",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    },
    {
      id: "sale-004",
      reference: "INV-2023-004",
      customerName: "Amit Kumar",
      amountPaise: 89000, // ₹890.00
      status: "refunded",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    },
  ],
};

export async function fetchMockRecentSales(): Promise<MockRecentSalesResponse> {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_RECENT_SALES);
    }, 400);
  });
}
