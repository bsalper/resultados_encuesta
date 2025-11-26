export function exportToCSV(filename, rows) {
  if (!rows || rows.length === 0) {
    // nothing to export
    return;
  }

  function escapeCsv(value) {
    if (value === null || value === undefined) return "";
    const str = String(value);
    if (str.includes(",") || str.includes("\n") || str.includes('"')) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  }

  const header = Object.keys(rows[0]);
  const csvRows = [header.join(',')];
  for (const row of rows) {
    csvRows.push(header.map((h) => escapeCsv(row[h])).join(','));
  }

  const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
