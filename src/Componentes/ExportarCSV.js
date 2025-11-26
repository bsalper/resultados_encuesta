export function exportToCSV(filename, rows) {
  const csvContent =
    "data:text/csv;charset=utf-8," +
    [
      Object.keys(rows[0]).join(","),
      ...rows.map((row) => Object.values(row).join(","))
    ].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
}
