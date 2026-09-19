import { mockCustomers } from '@/mocks/customers';
import type { Customer } from '@/types/customer';

/**
 * Searches customers by name, phone, or email.
 * Simulates a backend API call with a slight delay.
 */
export async function searchCustomers(query: string): Promise<Customer[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Simulate API failure randomly for error state testing
  if (query.toLowerCase() === 'error') {
    throw new Error('Simulated network error while searching customers');
  }

  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) {
    return [];
  }

  return mockCustomers.filter((customer) => {
    return (
      customer.name.toLowerCase().includes(normalizedQuery) ||
      (customer.phone && customer.phone.includes(normalizedQuery)) ||
      (customer.email && customer.email.toLowerCase().includes(normalizedQuery))
    );
  });
}
