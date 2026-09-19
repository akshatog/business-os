import type {
  SalesTodayResponse,
  TotalCustomersResponse,
  TotalProductsResponse,
  LowStockResponse,
  TotalSuppliersResponse,
  TodaysTransactionsResponse,
  OutstandingPaymentsResponse,
  RecentSalesResponse,
} from "@/services/dashboard";

export const MOCK_SALES_TODAY: SalesTodayResponse = {
  totalSalesPaise: 1254300, // ₹12,543.00
};

export async function fetchMockSalesToday(): Promise<SalesTodayResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_SALES_TODAY);
    }, 400);
  });
}

export const MOCK_TOTAL_CUSTOMERS: TotalCustomersResponse = {
  totalCustomers: 1248,
};

export async function fetchMockTotalCustomers(): Promise<TotalCustomersResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_TOTAL_CUSTOMERS);
    }, 400);
  });
}

export const MOCK_TOTAL_PRODUCTS: TotalProductsResponse = {
  totalProducts: 842,
};

export async function fetchMockTotalProducts(): Promise<TotalProductsResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_TOTAL_PRODUCTS);
    }, 400);
  });
}

export const MOCK_LOW_STOCK: LowStockResponse = {
  lowStockCount: 12,
};

export async function fetchMockLowStock(): Promise<LowStockResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_LOW_STOCK);
    }, 400);
  });
}

export const MOCK_TOTAL_SUPPLERS: TotalSuppliersResponse = {
  totalSuppliers: 45,
};

export async function fetchMockTotalSuppliers(): Promise<TotalSuppliersResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_TOTAL_SUPPLERS);
    }, 400);
  });
}

export const MOCK_TODAYS_TRANSACTIONS: TodaysTransactionsResponse = {
  todaysTransactions: 284,
};

export async function fetchMockTodaysTransactions(): Promise<TodaysTransactionsResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_TODAYS_TRANSACTIONS);
    }, 400);
  });
}

export const MOCK_OUTSTANDING_PAYMENTS: OutstandingPaymentsResponse = {
  outstandingPaise: 4250000, // ₹42,500.00
};

export async function fetchMockOutstandingPayments(): Promise<OutstandingPaymentsResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_OUTSTANDING_PAYMENTS);
    }, 400);
  });
}

export const MOCK_RECENT_SALES: RecentSalesResponse = {
  recentSales: [
    {
      id: "sale-001",
      invoiceNumber: "INV-2023-001",
      customerName: "Rahul Sharma",
      totalAmountMinor: 125000, // ₹1,250.00
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    },
    {
      id: "sale-002",
      invoiceNumber: "INV-2023-002",
      customerName: "Walk-in Customer",
      totalAmountMinor: 45000, // ₹450.00
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    },
    {
      id: "sale-003",
      invoiceNumber: "INV-2023-003",
      customerName: "Priya Patel",
      totalAmountMinor: 340050, // ₹3,400.50
      status: "voided",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    },
    {
      id: "sale-004",
      invoiceNumber: "INV-2023-004",
      customerName: "Amit Kumar",
      totalAmountMinor: 89000, // ₹890.00
      status: "refunded",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    },
  ],
};

export async function fetchMockRecentSales(): Promise<RecentSalesResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_RECENT_SALES);
    }, 400);
  });
}
