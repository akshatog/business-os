import type { Customer } from '@/types/customer';

export const mockCustomers: Customer[] = [
  {
    id: "c1a2b3c4-d5e6-7f8g-9h0i-j1k2l3m4n5o6",
    businessId: "b1a2b3c4-d5e6-7f8g-9h0i-j1k2l3m4n5o6",
    name: "Rahul Kumar",
    phone: "9876543210",
    email: "rahul@example.com",
    address: "123 MG Road, Bangalore",
    createdAt: new Date().toISOString(),
  },
  {
    id: "c2a2b3c4-d5e6-7f8g-9h0i-j1k2l3m4n5o6",
    businessId: "b1a2b3c4-d5e6-7f8g-9h0i-j1k2l3m4n5o6",
    name: "Priya Sharma",
    phone: "8765432109",
    email: "priya@example.com",
    address: "45 Park Street, Kolkata",
    createdAt: new Date().toISOString(),
  },
  {
    id: "c3a2b3c4-d5e6-7f8g-9h0i-j1k2l3m4n5o6",
    businessId: "b1a2b3c4-d5e6-7f8g-9h0i-j1k2l3m4n5o6",
    name: "Amit Patel",
    phone: "7654321098",
    email: null,
    address: "78 Ring Road, Ahmedabad",
    createdAt: new Date().toISOString(),
  },
  {
    id: "c4a2b3c4-d5e6-7f8g-9h0i-j1k2l3m4n5o6",
    businessId: "b1a2b3c4-d5e6-7f8g-9h0i-j1k2l3m4n5o6",
    name: "Sneha Reddy",
    phone: "6543210987",
    email: "sneha.reddy@example.com",
    address: "88 Jubilee Hills, Hyderabad",
    createdAt: new Date().toISOString(),
  }
];
