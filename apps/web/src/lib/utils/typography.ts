export function truncateString(str: string, maxLength: number): string {
  if (!str) return "";
  return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
}

export function capitalizeWords(str: string): string {
  if (!str) return "";
  return str.replace(/\b\w/g, char => char.toUpperCase());
}
