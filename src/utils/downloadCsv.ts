export type CsvColumn = {
  title: string;
  dataIndex: string;
};

const downloadCsv = (columns: CsvColumn[], data: unknown[], filename: string) => {
  const header = columns.map((col) => col.title).join(",");
  const csvContent =
    header +
    "\n" +
    data
      .map((row) =>
        columns
          .map((col) => {
            const column = col;
            const value = row[column.dataIndex];
            if (typeof value === "string") {
              return `"${value.replace(/"/g, '""')}"`;
            } else if (typeof value === "number") {
              return value.toFixed(2);
            }
            return value;
          })
          .join(",")
      )
      .join("\n");

  const blob = new Blob(["\ufeff", csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default downloadCsv;
