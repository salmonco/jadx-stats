export async function downloadExcel(getExcelBlob: (params: any) => Promise<Blob>, params: any, filename = "excel.xlsx") {
  try {
    const blob = await getExcelBlob(params);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (e) {
    alert("엑셀 다운로드에 실패했습니다.");
  }
}
