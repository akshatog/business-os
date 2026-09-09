/**
 * Formats an integer amount of paise into a standard Indian Rupee string representation.
 * Example: 150000 paise -> "₹1,500.00"
 */
export function formatPaiseToRupees(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(rupees);
}
