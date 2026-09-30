export function formatToIDDate(dateString: string | Date): string {
  return new Date(dateString).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}
