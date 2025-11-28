import type { ColumnType, ColumnsType } from "antd/es/table";

const downloadCsv = (columns: ColumnsType<any>, data: any[], filename: string) => {
  const header = columns.map((col: any) => col.title).join(",");
  const csvContent =
    header +
    "\n" +
    data
      .map((row) =>
        columns
          .map((col: any) => {
            const column = col as ColumnType<any>;
            const value = row[column.dataIndex as string];
            if (typeof value === "string") {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          })
          .join(","),
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
