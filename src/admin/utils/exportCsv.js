// Escapes a single CSV cell: wraps in quotes when needed, and neutralizes leading
// =/+/-/@ characters so spreadsheet apps don't interpret the value as a formula
// (CSV/"formula injection" — a known risk when exporting user-submitted text).
function escapeCell(value) {
  let text = value === null || value === undefined ? "" : String(value);
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  if (/[",\n\r]/.test(text)) text = `"${text.replace(/"/g, '""')}"`;
  return text;
}

/** Builds a CSV string (with a UTF-8 BOM so Excel renders accents correctly). */
export function buildCsv(headers, rows) {
  const lines = [headers.map(escapeCell).join(",")];
  for (const row of rows) lines.push(row.map(escapeCell).join(","));
  return `\uFEFF${lines.join("\r\n")}`;
}

/** Triggers a browser download of a CSV file. */
export function downloadCsv(filename, csvContent) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
