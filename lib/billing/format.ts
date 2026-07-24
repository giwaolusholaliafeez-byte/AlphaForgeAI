export function formatPlanAmount(amountInSmallestUnit: number, currency: string): string {
  const major = amountInSmallestUnit / 100;
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(major);
  } catch {
    return `${currency} ${major.toLocaleString()}`;
  }
}
