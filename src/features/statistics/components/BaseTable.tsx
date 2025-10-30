import { useCallback } from "react";
import "~/features/statistics/styles/statisticsTableStyle.css";

interface Props {
  columns: {
    years: string[];
    groupField: string;
    isMulti: boolean;
    measureOptions?: string[];
    hierarchy?: {
      field: string;
      indent: number;
      isGroup?: boolean;
    }[];
    unitMapping?: Record<string, string>;
  };
  data: Record<string, any>[];
}

const BaseTable = ({ columns, data }: Props) => {
  const { years, groupField, isMulti, measureOptions, hierarchy, unitMapping } = columns;

  const getIndentStyle = (fieldValue: string) => {
    if (!hierarchy?.length) return {};

    const hierarchyItem = hierarchy?.find((h) => h.field === fieldValue);
    if (!hierarchyItem) return {};

    const style: React.CSSProperties = {
      paddingLeft: hierarchyItem.indent === 0 ? "0px" : `${hierarchyItem.indent * 20}px`,
    };
    return style;
  };

  // 열 하이라이트를 위한 핸들러
  const handleCellMouseEnter = useCallback((columnIndex: number) => {
    const cells = document.querySelectorAll(`.col-${columnIndex}`);
    cells.forEach((cell) => {
      cell.classList.add("highlight");
    });
  }, []);

  const handleCellMouseLeave = useCallback((columnIndex: number) => {
    const cells = document.querySelectorAll(`.col-${columnIndex}`);
    cells.forEach((cell) => {
      cell.classList.remove("highlight");
    });
  }, []);

  return (
    <div className="statistics-table-container">
      <table className="statistics-table">
        <thead>
          <tr>
            <th className="sticky-column col-0" rowSpan={isMulti ? 2 : 1}>
              구분
            </th>
            {isMulti
              ? measureOptions!.map((measure) => (
                  <th key={measure} colSpan={years.length}>
                    {measure}
                  </th>
                ))
              : years.map((year, index) => (
                  <th key={year} onMouseEnter={() => handleCellMouseEnter(index + 1)} onMouseLeave={() => handleCellMouseLeave(index + 1)}>
                    {year}
                  </th>
                ))}
          </tr>
          {isMulti && (
            <tr>
              {measureOptions!.flatMap((measure) =>
                years.map((year, yearIndex) => (
                  <th
                    key={`${measure}-${year}`}
                    onMouseEnter={() => handleCellMouseEnter(yearIndex + 1)}
                    onMouseLeave={() => handleCellMouseLeave(yearIndex + 1)}
                    className="th-measure"
                  >
                    {year}
                  </th>
                ))
              )}
            </tr>
          )}
        </thead>
        <tbody>
          {data?.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.isGroupHeader ? (
                <td className="group-header-cell" colSpan={isMulti ? measureOptions!.length * years.length + 1 : years.length + 1}>
                  <span className="group-header">{row[groupField]}</span>
                </td>
              ) : (
                <>
                  <td className="sticky-column col-0">
                    <span style={getIndentStyle(row[groupField])}>
                      {row[groupField]} {unitMapping?.[row[groupField]] ? `(${unitMapping[row[groupField]]})` : row["UNIT_NM"] ? `(${row["UNIT_NM"]})` : ""}
                    </span>
                  </td>
                  {isMulti
                    ? measureOptions!.flatMap((measure) =>
                        years.map((year, yearIndex) => {
                          const colIndex = yearIndex + 1;
                          return (
                            <td
                              key={`${row[groupField]}-${measure}-${year}`}
                              className={`data-cell col-${colIndex}`}
                              onMouseEnter={() => handleCellMouseEnter(colIndex)}
                              onMouseLeave={() => handleCellMouseLeave(colIndex)}
                            >
                              {row[`${measure}-${year}`] !== undefined && !isNaN(Number(row[`${measure}-${year}`]))
                                ? Math.floor(Number(row[`${measure}-${year}`])).toLocaleString()
                                : "-"}
                            </td>
                          );
                        })
                      )
                    : years.map((year, yearIndex) => {
                        const colIndex = yearIndex + 1;
                        return (
                          <td
                            key={`${row[groupField]}-${year}`}
                            className={`data-cell col-${colIndex}`}
                            onMouseEnter={() => handleCellMouseEnter(colIndex)}
                            onMouseLeave={() => handleCellMouseLeave(colIndex)}
                          >
                            {row[year] !== undefined && !isNaN(Number(row[year]))
                              ? Math.floor(Number(row[year])).toLocaleString()
                              : "-"}
                          </td>
                        );
                      })}
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BaseTable;
