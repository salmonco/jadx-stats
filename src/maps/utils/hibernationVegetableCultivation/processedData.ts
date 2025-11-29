const processedData = (data) => {
  const chartData = {};
  const tableData = {};

  data.features.forEach((feature) => {
    const regionName = feature.properties.vrbs_nm;
    const changeData = feature.properties.area_chg?.chg_mttr;

    if (regionName && Array.isArray(changeData)) {
      // For chart: region -> products
      chartData[regionName] = changeData;

      // For table: crop -> regions
      changeData.forEach((item) => {
        const cropName = item.crop_nm;
        if (!tableData[cropName]) {
          tableData[cropName] = [];
        }

        const areaChange = item.chg_cn / 10_000;
        const currentArea = item.area_std / 10_000;

        tableData[cropName].push({
          region_nm: regionName,
          current_area: currentArea,
          area_change: areaChange,
          change_rate: item.chg_pct,
          direction: item.drctn,
        });
      });
    }
  });

  return { chartData, tableData };
};

export default processedData;
