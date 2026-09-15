import type { Sale } from "@/types/sale";
import {
  fetchMockSalesToday,
  fetchMockTotalCustomers,
  fetchMockTotalProducts,
  fetchMockLowStock,
  fetchMockTotalSuppliers,
  fetchMockTodaysTransactions,
  fetchMockOutstandingPayments,
  fetchMockRecentSales
} from "@/mocks/dashboard";

export interface SalesTodayResponse {
  totalSalesPaise: number | null;
}

export interface TotalCustomersResponse {
  totalCustomers: number | null;
}

export interface TotalProductsResponse {
  totalProducts: number | null;
}

export interface LowStockResponse {
  lowStockCount: number | null;
}

export interface TotalSuppliersResponse {
  totalSuppliers: number | null;
}

export interface TodaysTransactionsResponse {
  todaysTransactions: number | null;
}

export interface OutstandingPaymentsResponse {
  outstandingPaise: number | null;
}

export type DashboardRecentSale = Pick<Sale, "id" | "invoiceNumber" | "totalAmountMinor" | "status" | "createdAt"> & {
  customerName: string;
};

export interface RecentSalesResponse {
  recentSales: DashboardRecentSale[];
}

export async function getSalesToday(): Promise<SalesTodayResponse> {
  return fetchMockSalesToday();
}

export async function getTotalCustomers(): Promise<TotalCustomersResponse> {
  return fetchMockTotalCustomers();
}

export async function getTotalProducts(): Promise<TotalProductsResponse> {
  return fetchMockTotalProducts();
}

export async function getLowStockCount(): Promise<LowStockResponse> {
  return fetchMockLowStock();
}

export async function getTotalSuppliers(): Promise<TotalSuppliersResponse> {
  return fetchMockTotalSuppliers();
}

export async function getTodaysTransactions(): Promise<TodaysTransactionsResponse> {
  return fetchMockTodaysTransactions();
}

export async function getOutstandingPayments(): Promise<OutstandingPaymentsResponse> {
  return fetchMockOutstandingPayments();
}

export async function getRecentSales(): Promise<RecentSalesResponse> {
  return fetchMockRecentSales();
}
