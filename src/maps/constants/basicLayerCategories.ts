export interface LayerItem {
  name: string; // 레이어 내부 식별자 (ex: "admdst_gis")
  title: string; // 사용자에게 보여질 이름 (ex: "행정지역 레이어")
  layerType: string; // "GEOJSON", "VECTORTILE", "PARQUET", "GEOSERVER" 등
  baseLayer: string; // "vector", "vectorTile" 등
}

export interface LayerSubCat {
  label: string;
  match: (layer: LayerItem) => boolean;
}

export interface LayerCat {
  catLabel: string;
  subCats: LayerSubCat[];
}

export const LAYER_CATEGORIES: LayerCat[] = [
  {
    catLabel: "행정 및 계획지역",
    subCats: [
      { label: "행정지역", match: (l) => l.title === "행정지역 레이어" },
      { label: "관리지역(국토계획)", match: (l) => l.title === "관리지역(국토계획)" },
      { label: "농림지역(국토계획)", match: (l) => l.title === "농림지역(국토계획)" },
      { label: "구역(국토계획)", match: (l) => l.title === "구역(국토계획)" },
      { label: "용도구역(제주국제자유도시)", match: (l) => l.title === "용도구역(제주국제자유도시)" },
    ],
  },
  {
    catLabel: "환경 및 규제지역",
    subCats: [
      { label: "수질관리지역", match: (l) => l.title === "수질관리지역" },
      { label: "수량관리지역", match: (l) => l.title === "수량관리지역" },
      { label: "지하수자원보전(제주국제자유도시)", match: (l) => l.title === "지하수자원보전(제주국제자유도시)" },
      { label: "생태계보전(제주국제자유도시)", match: (l) => l.title === "생태계보전(제주국제자유도시)" },
      { label: "경관보전(제주국제자유도시)", match: (l) => l.title === "경관보전(제주국제자유도시)" },
      { label: "가축사육제한구역", match: (l) => l.title === "가축사육제한구역" },
      { label: "기상(500m 격자)", match: (l) => l.title === "기상(500m격자)" },
    ],
  },
  {
    catLabel: "기반 시설 및 구조물",
    subCats: [
      { label: "도로", match: (l) => l.title === "도로" },
      { label: "하천", match: (l) => l.title === "하천" },
      { label: "소하천", match: (l) => l.title === "소하천" },
      { label: "등고선", match: (l) => l.title === "등고선 레이어" },
      { label: "해안선", match: (l) => l.title === "해안선" },
      { label: "건물통합정보", match: (l) => l.title === "건물통합정보" },
    ],
  },
  {
    catLabel: "농업 및 농촌지역",
    subCats: [
      { label: "농어촌정비", match: (l) => l.title === "농어촌정비" },
      { label: "영농여건불리농지", match: (l) => l.title === "영농여건불리농지" },
      { label: "초지", match: (l) => l.title === "초지" },
      { label: "팜맵", match: (l) => l.title === "팜맵(2024-07)" },
    ],
  },
  {
    catLabel: "기타 공간정보",
    subCats: [{ label: "묘지", match: (l) => l.title === "묘지" }],
  },
];
