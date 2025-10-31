import { RegionLevelOptions } from "~/features/visualization/utils/regionLevelOptions";

export const REGION_LEVEL_LABEL = "구분";

export const CITY_OPTIONS = ["제주", "서귀"] as const;

export const REGION_OPTIONS = ["제주", "서귀", "동부", "서부"] as const;

export const CITY_TO_REGION_MAPPING = {
  제주: ["제주", "동부", "서부"],
  서귀: ["서귀", "동부", "서부"],
} as const;

export const EMD_OPTIONS = {
  제주: ["제주", "조천", "애월"],
  서귀: ["서귀", "남원"],
  동부: ["구좌", "성산", "표선"],
  서부: ["안덕", "한림", "한경", "대정"],
} as const;

export const RI_OPTIONS = {
  // --- 제주 ---
  제주: [
    "건입동",
    "도남동",
    "도두일동",
    "도두이동",
    "도련일동",
    "도련이동",
    "봉개동",
    "삼양일동",
    "삼양이동",
    "아라일동",
    "아라이동",
    "오라이동",
    "오라삼동",
    "용담이동",
    "이도이동",
    "이호이동",
    "연동",
    "노형동",
    "외도일동",
    "월평동",
    "오등동",
    "용강동",
    "해안동",
    "회천동",
  ],
  조천: ["함덕리", "신촌리", "와흘리", "선흘리", "대흘리", "북촌리", "와산리", "조천리"],
  애월: [
    "애월리",
    "하귀1리",
    "하귀2리",
    "하가리",
    "상가리",
    "상귀리",
    "신엄리",
    "구엄리",
    "곽지리",
    "금성리",
    "어음리",
    "수산리",
    "유수암리",
    "봉성리",
    "소길리",
    "장전리",
    "낙천리",
  ],

  // --- 서귀 ---
  서귀: ["서귀동", "법환동", "서호동", "동홍동", "호근동", "회수동", "보목동", "토평동", "신효동", "하효동", "상효동"],
  남원: ["남원리", "의귀리", "위미리", "신례리", "하례리", "태흥리", "수망리"],

  // --- 동부 ---
  구좌: [],
  성산: ["성산리", "고성리", "시흥리", "오조리", "온평리", "신산리", "신풍리", "신천리", "신흥리", "수산리", "난산리", "삼달리"],
  표선: ["표선리", "세화리", "가시리"],

  // --- 서부 ---
  안덕: ["화순리", "사계리", "상창리", "감산리", "창천리", "상천리", "동광리", "덕천리"],
  한림: ["한림리", "협재리", "귀덕리", "월령리", "금능리", "명월리", "금악리", "상명리", "한수리"],
  한경: ["고산리", "용수리", "두모리", "낙천리", "청수리", "저지리", "조수리", "금등리"],
  대정: ["하모리", "상모리", "신도리", "구억리", "보성리", "인성리", "일과리", "덕수리", "모슬포리", "무릉리", "영락리"],
} as const;

export const DEFAULT_ALL_OPTION = "전체";

export type AddAllOption<T> = typeof DEFAULT_ALL_OPTION | T;
export type MultiOption<T> = T[];

export type CityOptions = AddAllOption<(typeof CITY_OPTIONS)[number]>;
export type RegionOptions = MultiOption<AddAllOption<(typeof REGION_OPTIONS)[number]>>;
export type EmdOptions = MultiOption<AddAllOption<(typeof EMD_OPTIONS)[keyof typeof EMD_OPTIONS][number]>>;
export type RiOptions = MultiOption<AddAllOption<(typeof RI_OPTIONS)[keyof typeof RI_OPTIONS][number]>>;

export type RegionFilterOptions = {
  구분: RegionLevelOptions;
  행정시?: CityOptions;
  권역?: RegionOptions;
  읍면?: EmdOptions;
  리동?: RiOptions;
};

export const withAllOption = (options: readonly string[]) => [DEFAULT_ALL_OPTION, ...options];
