import type { Product } from '@/types/product';

export const mockProducts: Product[] = [
  {
    id: '44444444-4444-4444-4444-444444444444',
    businessId: '11111111-1111-1111-1111-111111111111',
    name: 'Paracetamol 500mg',
    sku: 'MED-001',
    barcode: '8901234567890',
    categoryId: '22222222-2222-2222-2222-222222222222',
    priceMinor: 5000, // 50 INR
    costPriceMinor: 3000,
    taxRatePercent: 12,
    unit: 'piece',
    lowStockThreshold: 20,
    imageUrl: null,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    businessId: '11111111-1111-1111-1111-111111111111',
    name: 'Amoxicillin 250mg',
    sku: 'MED-002',
    barcode: '8901234567891',
    categoryId: '22222222-2222-2222-2222-222222222222',
    priceMinor: 12000, // 120 INR
    costPriceMinor: 8000,
    taxRatePercent: 12,
    unit: 'piece',
    lowStockThreshold: 15,
    imageUrl: null,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '66666666-6666-6666-6666-666666666666',
    businessId: '11111111-1111-1111-1111-111111111111',
    name: 'Band-Aid Pack',
    sku: 'MED-003',
    barcode: '8901234567892',
    categoryId: '33333333-3333-3333-3333-333333333333',
    priceMinor: 2500, // 25 INR
    costPriceMinor: 1500,
    taxRatePercent: 5,
    unit: 'piece',
    lowStockThreshold: 50,
    imageUrl: null,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];
