const processedData = (data) => {
  const result = {};

  data.features.forEach((feature) => {
    const name = feature.properties.vrbs_nm;
    const changeData = feature.properties.area_chg?.chg_mttr;

    if (name && Array.isArray(changeData)) {
      result[name] = changeData;
    }
  });

  return result;
};

export default processedData;
