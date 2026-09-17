export const CO2_MULTIPLIER = 2.5;

export function calculateCO2(foodKg: number): number {
  return foodKg * CO2_MULTIPLIER;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatWeight(kg: number): string {
  return `${kg.toFixed(1)} kg`;
}

export function calculateDiscount(original: number, discounted: number): number {
  return Math.round(((original - discounted) / original) * 100);
}
