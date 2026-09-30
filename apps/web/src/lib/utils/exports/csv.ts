export function generateCSV(headers: string[], rows: any[][]): string {
  const headerRow = headers.join(",");
  const dataRows = rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","));
  return [headerRow, ...dataRows].join("\n");
}

export function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
